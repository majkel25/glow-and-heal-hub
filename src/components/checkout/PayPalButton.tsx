import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/contexts/CartContext";
import { Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: {
        style?: { layout?: string; color?: string; shape?: string; label?: string };
        createOrder: () => Promise<string>;
        onApprove: (data: { orderID: string }) => Promise<void>;
        onError: (err: unknown) => void;
        onCancel: () => void;
      }) => { render: (element: HTMLElement) => Promise<void> | void };
      CardFields: (config: {
        createOrder: () => Promise<string>;
        onApprove: (data: { orderID: string }) => Promise<void>;
        onError: (err: unknown) => void;
        style?: Record<string, unknown>;
      }) => {
        isEligible: () => boolean;
        NameField: (opts?: { placeholder?: string }) => { render: (el: string | HTMLElement) => Promise<void> };
        NumberField: (opts?: { placeholder?: string }) => { render: (el: string | HTMLElement) => Promise<void> };
        ExpiryField: (opts?: { placeholder?: string }) => { render: (el: string | HTMLElement) => Promise<void> };
        CVVField: (opts?: { placeholder?: string }) => { render: (el: string | HTMLElement) => Promise<void> };
        submit: () => Promise<void>;
      };
    };
  }
}

interface PayPalButtonProps {
  items: CartItem[];
  totalAmount: number;
  shippingCost: number;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export function PayPalButton({
  items,
  totalAmount,
  shippingCost,
  onSuccess,
  onError,
  disabled = false,
}: PayPalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const cardFieldsInstanceRef = useRef<ReturnType<NonNullable<Window["paypal"]>["CardFields"]> | null>(null);
  const lastOrderIdRef = useRef<string | null>(null);
  
  // Card field container refs
  const cardNameRef = useRef<HTMLDivElement>(null);
  const cardNumberRef = useRef<HTMLDivElement>(null);
  const cardExpiryRef = useRef<HTMLDivElement>(null);
  const cardCvvRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [sdkReady, setSdkReady] = useState(false);
  const [paypalClientId, setPayPalClientId] = useState<string | null>(null);
  const [paypalClientToken, setPayPalClientToken] = useState<string | null>(null);
  const [paypalEnv, setPayPalEnv] = useState<string | null>(null);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [lastPayPalError, setLastPayPalError] = useState<string | null>(null);

  // Card fields state
  const [cardFieldsEligible, setCardFieldsEligible] = useState(false);
  const [cardFieldsReady, setCardFieldsReady] = useState(false);
  const [isCardProcessing, setIsCardProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card">("paypal");

  const showDebug = import.meta.env.DEV;

  const toSafeString = (value: unknown): string => {
    if (typeof value === "string") return value;
    if (value instanceof Error) return value.message;
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  };

  const deriveUserMessage = (raw: string): string => {
    const lower = raw.toLowerCase();

    if (lower.includes("international regulations")) {
      return "PayPal declined this transaction due to compliance restrictions. Please try a different card/PayPal account.";
    }

    if (lower.includes("instrument_declined")) {
      return "Your bank declined the payment method. Please try another card or PayPal balance.";
    }

    if (lower.includes("card_fields") && lower.includes("not eligible")) {
      return "Card payments are not available for your account. Please use PayPal.";
    }

    return raw || "Payment failed. Please try again.";
  };

  const buildOrderData = useCallback(() => ({
    amount: totalAmount + shippingCost,
    currency: "GBP",
    returnUrl: `${window.location.origin}/order-confirmation`,
    cancelUrl: `${window.location.origin}/checkout`,
    items: items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unit_amount: item.price,
    })),
  }), [items, totalAmount, shippingCost]);

  const createOrder = useCallback(async (): Promise<string> => {
    setLastPayPalError(null);

    const { data, error } = await supabase.functions.invoke("paypal", {
      body: { action: "create", orderData: buildOrderData() },
    });

    if (error) throw new Error(error.message);
    if (!data?.orderId) {
      const msg = data?.error ? String(data.error) : `No order ID returned: ${toSafeString(data)}`;
      throw new Error(msg);
    }

    lastOrderIdRef.current = data.orderId;
    setLastOrderId(data.orderId);
    return data.orderId;
  }, [buildOrderData]);

  const captureOrder = useCallback(async (orderId: string) => {
    const { data: captureData, error } = await supabase.functions.invoke("paypal", {
      body: { action: "capture", orderId },
    });

    if (error) throw new Error(error.message);
    if (!captureData?.success) {
      const msg = captureData?.error
        ? String(captureData.error)
        : `Payment capture failed: ${toSafeString(captureData)}`;
      throw new Error(msg);
    }

    return captureData.orderId;
  }, []);

  const reconcileOrderIfPossible = useCallback(async (orderId: string): Promise<{ ok: boolean; message?: string }> => {
    const { data: statusData, error: statusError } = await supabase.functions.invoke("paypal", {
      body: { action: "get", orderId },
    });

    if (statusError) {
      return { ok: false, message: statusError.message };
    }

    const status = String(statusData?.status || "");

    if (status === "APPROVED" || status === "COMPLETED") {
      try {
        const capturedId = await captureOrder(orderId);
        onSuccess(capturedId || orderId);
        return { ok: true };
      } catch (err) {
        return { ok: false, message: toSafeString(err) };
      }
    }

    if (status === "DECLINED" || status === "VOIDED") {
      return { ok: false, message: "This transaction was declined by PayPal. Please try a different payment method." };
    }

    return { ok: false };
  }, [captureOrder, onSuccess]);

  // Load PayPal config
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.functions.invoke("paypal", {
          body: { action: "config" },
        });

        if (error) throw new Error(error.message);

        const clientId = typeof data?.clientId === "string" ? data.clientId : null;
        const env = typeof data?.env === "string" ? data.env : null;
        const clientToken = typeof data?.clientToken === "string" ? data.clientToken : null;

        if (!clientId) {
          const fallback = import.meta.env.VITE_PAYPAL_CLIENT_ID as string | undefined;
          if (mounted) setPayPalClientId(fallback || null);
        } else {
          if (mounted) setPayPalClientId(clientId);
        }

        if (mounted) setPayPalClientToken(clientToken);
        if (mounted) setPayPalEnv(env);
      } catch (err) {
        console.error("Failed to load PayPal config:", err);
        const fallback = import.meta.env.VITE_PAYPAL_CLIENT_ID as string | undefined;
        if (mounted) setPayPalClientId(fallback || null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Load PayPal SDK with card-fields component
  useEffect(() => {
    if (!paypalClientId) {
      setIsLoading(false);
      return;
    }

    const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]') as HTMLScriptElement | null;
    const existingSrc = existingScript?.src || "";
    const hasSameClientId = existingSrc.includes(`client-id=${encodeURIComponent(paypalClientId)}`);
    const hasCardFields = existingSrc.includes("card-fields");
    const hasSameClientToken = paypalClientToken
      ? existingScript?.getAttribute("data-client-token") === paypalClientToken
      : true;

    if (existingScript && window.paypal && hasSameClientId && hasCardFields && hasSameClientToken) {
      setSdkReady(true);
      setIsLoading(false);
      return;
    }

    const oldScripts = document.querySelectorAll(
      'script[src*="paypal.com/sdk/js"], script[src*="sandbox.paypal.com/sdk/js"]'
    );
    oldScripts.forEach((s) => s.remove());

    setSdkReady(false);
    setIsLoading(true);

    const params = new URLSearchParams({
      "client-id": paypalClientId,
      currency: "GBP",
      intent: "capture",
      components: "buttons,card-fields",
      locale: "en_GB",
    });

    if (import.meta.env.DEV) params.set("debug", "true");

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?${params.toString()}`;
    script.async = true;

    if (paypalClientToken) {
      script.setAttribute("data-client-token", paypalClientToken);
    }

    script.onload = () => {
      setSdkReady(true);
      setIsLoading(false);
    };
    script.onerror = () => {
      console.error("Failed to load PayPal SDK");
      setIsLoading(false);
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup handled by browser
    };
  }, [paypalClientId, paypalClientToken]);

  // Render PayPal buttons - re-render when payment method changes to paypal
  useEffect(() => {
    if (!sdkReady || !window.paypal || !paypalRef.current || disabled || paymentMethod !== "paypal") return;

    // Clear and re-render
    paypalRef.current.innerHTML = "";

    const renderResult = window.paypal.Buttons({
      style: {
        layout: "vertical",
        color: "gold",
        shape: "rect",
        label: "paypal",
      },
      createOrder: async () => {
        try {
          return await createOrder();
        } catch (err) {
          const raw = toSafeString(err);
          console.error("Error creating PayPal order:", err);
          setLastPayPalError(raw);
          onError(deriveUserMessage(raw));
          throw err;
        }
      },
      onApprove: async (data) => {
        try {
          lastOrderIdRef.current = data.orderID;
          setLastOrderId(data.orderID);
          const capturedId = await captureOrder(data.orderID);
          onSuccess(capturedId);
        } catch (err) {
          const raw = toSafeString(err);
          console.error("Error capturing PayPal order:", err);
          setLastPayPalError(raw);
          onError(deriveUserMessage(raw));
        }
      },
      onError: (err) => {
        const raw = toSafeString(err);
        console.error("PayPal error:", err);
        setLastPayPalError(raw);

        const orderId = lastOrderIdRef.current;
        if (!orderId) {
          onError(deriveUserMessage(raw));
          return;
        }

        (async () => {
          const result = await reconcileOrderIfPossible(orderId);
          if (result.ok) return;
          onError(deriveUserMessage(result.message || raw));
        })();
      },
      onCancel: () => {
        console.log("Payment cancelled by user");
      },
    });

    Promise.resolve(renderResult.render(paypalRef.current!)).catch((err: unknown) => {
      const message =
        err instanceof Error
          ? err.message
          : `PayPal render error: ${JSON.stringify(err)}`;
      console.error("PayPal render error:", err);
      setLastPayPalError(message);
      onError(message);
    });
  }, [sdkReady, paymentMethod, createOrder, captureOrder, onSuccess, onError, disabled, reconcileOrderIfPossible]);

  // Card Fields: create instance + check eligibility
  useEffect(() => {
    if (!sdkReady || !window.paypal?.CardFields || disabled || paymentMethod !== "card") {
      setCardFieldsEligible(false);
      setCardFieldsReady(false);
      cardFieldsInstanceRef.current = null;
      return;
    }

    setCardFieldsReady(false);

    const cardFields = window.paypal.CardFields({
      createOrder: async () => {
        try {
          return await createOrder();
        } catch (err) {
          const raw = toSafeString(err);
          console.error("Error creating order for card payment:", err);
          setLastPayPalError(raw);
          onError(deriveUserMessage(raw));
          throw err;
        }
      },
      onApprove: async (data) => {
        try {
          lastOrderIdRef.current = data.orderID;
          setLastOrderId(data.orderID);
          const capturedId = await captureOrder(data.orderID);
          onSuccess(capturedId);
        } catch (err) {
          const raw = toSafeString(err);
          console.error("Error capturing card payment:", err);
          setLastPayPalError(raw);
          onError(deriveUserMessage(raw));
        } finally {
          setIsCardProcessing(false);
        }
      },
      onError: (err) => {
        const raw = toSafeString(err);
        console.error("Card payment error:", err);
        setLastPayPalError(raw);
        setIsCardProcessing(false);
        onError(deriveUserMessage(raw));
      },
      style: {
        input: {
          "font-size": "14px",
          "font-family": "inherit",
          color: "hsl(var(--foreground))",
        },
        ".invalid": {
          color: "hsl(var(--destructive))",
        },
      },
    });

    // IMPORTANT: `isEligible()` can return false if the merchant isn't enabled *or* if the SDK
    // isn't fully authorized for Advanced Card Payments in this environment.
    const eligible = Boolean(cardFields.isEligible());
    setCardFieldsEligible(eligible);

    if (!eligible) {
      cardFieldsInstanceRef.current = null;
      return;
    }

    cardFieldsInstanceRef.current = cardFields;

    return () => {
      cardFieldsInstanceRef.current = null;
    };
  }, [sdkReady, paymentMethod, createOrder, captureOrder, onSuccess, onError, disabled]);

  // Card Fields: render inputs once eligible + DOM containers exist
  useEffect(() => {
    if (!cardFieldsEligible || paymentMethod !== "card" || disabled) {
      setCardFieldsReady(false);
      return;
    }

    const cardFields = cardFieldsInstanceRef.current;
    if (!cardFields) {
      setCardFieldsReady(false);
      return;
    }

    const raf = requestAnimationFrame(() => {
      if (!cardNameRef.current || !cardNumberRef.current || !cardExpiryRef.current || !cardCvvRef.current) {
        console.error("Card field containers not found in DOM");
        setCardFieldsReady(false);
        return;
      }

      // Clear previous card fields content
      cardNameRef.current.innerHTML = "";
      cardNumberRef.current.innerHTML = "";
      cardExpiryRef.current.innerHTML = "";
      cardCvvRef.current.innerHTML = "";

      Promise.all([
        cardFields.NameField({ placeholder: "Name on card" }).render(cardNameRef.current),
        cardFields.NumberField({ placeholder: "Card number" }).render(cardNumberRef.current),
        cardFields.ExpiryField({ placeholder: "MM/YY" }).render(cardExpiryRef.current),
        cardFields.CVVField({ placeholder: "CVV" }).render(cardCvvRef.current),
      ])
        .then(() => setCardFieldsReady(true))
        .catch((err) => {
          console.error("Error rendering card fields:", err);
          setCardFieldsReady(false);
        });
    });

    return () => cancelAnimationFrame(raf);
  }, [cardFieldsEligible, paymentMethod, disabled]);

  const handleCardSubmit = async () => {
    if (!cardFieldsInstanceRef.current) return;

    setIsCardProcessing(true);
    setLastPayPalError(null);

    try {
      await cardFieldsInstanceRef.current.submit();
    } catch (err) {
      const raw = toSafeString(err);
      console.error("Card submit error:", err);
      setLastPayPalError(raw);
      setIsCardProcessing(false);
      onError(deriveUserMessage(raw));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading payment options...</span>
      </div>
    );
  }

  if (!paypalClientId) {
    return (
      <div className="text-center py-4 text-sm text-muted-foreground">
        Payment is not configured. Please add PayPal credentials in your backend settings.
      </div>
    );
  }

  return (
    <div className={disabled ? "opacity-50 pointer-events-none" : ""}>
      {/* Payment method tabs */}
      <div className="flex gap-2 mb-4">
        <Button
          type="button"
          variant={paymentMethod === "paypal" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setPaymentMethod("paypal")}
        >
          <img 
            src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" 
            alt="PayPal" 
            className="h-5 mr-2"
          />
          PayPal
        </Button>
        <Button
          type="button"
          variant={paymentMethod === "card" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setPaymentMethod("card")}
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Card
        </Button>
      </div>

      {/* PayPal button */}
      {paymentMethod === "paypal" && (
        <div ref={paypalRef} className="min-h-[150px]" />
      )}

      {/* Card fields */}
      {paymentMethod === "card" && (
        <div className="space-y-4">
          {!cardFieldsEligible && sdkReady && window.paypal?.CardFields && (
            <div className="text-sm text-foreground bg-muted/50 border border-border rounded-lg p-3">
              Card payments require PayPal to enable "Advanced Credit and Debit Card Payments" for your account.
              Please use PayPal instead or contact PayPal support.
            </div>
          )}

          {cardFieldsEligible && (
            <>
              <div className="space-y-2">
                <Label>Name on Card</Label>
                <div 
                  ref={cardNameRef}
                  className="min-h-[40px] border border-input rounded-md px-3 py-2 bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label>Card Number</Label>
                <div 
                  ref={cardNumberRef}
                  className="min-h-[40px] border border-input rounded-md px-3 py-2 bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expiry</Label>
                  <div 
                    ref={cardExpiryRef}
                    className="min-h-[40px] border border-input rounded-md px-3 py-2 bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label>CVV</Label>
                  <div 
                    ref={cardCvvRef}
                    className="min-h-[40px] border border-input rounded-md px-3 py-2 bg-background"
                  />
                </div>
              </div>

              <Button
                type="button"
                className="w-full"
                onClick={handleCardSubmit}
                disabled={!cardFieldsReady || isCardProcessing}
              >
                {isCardProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay £{(totalAmount + shippingCost).toFixed(2)}
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      )}

      {showDebug && (lastOrderId || lastPayPalError || paypalEnv) && (
        <div className="mt-3 rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          <div className="font-medium text-foreground">PayPal debug</div>
          {paypalEnv && (
            <div className="mt-1">
              env: <code>{paypalEnv}</code>
            </div>
          )}
          {cardFieldsEligible !== undefined && paymentMethod === "card" && (
            <div className="mt-1">
              card fields eligible: <code>{String(cardFieldsEligible)}</code>
            </div>
          )}
          {lastOrderId && (
            <div className="mt-1">
              last orderId: <code className="break-all">{lastOrderId}</code>
            </div>
          )}
          {lastPayPalError && (
            <div className="mt-1">
              last error: <code className="break-all">{lastPayPalError}</code>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
