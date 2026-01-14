import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/contexts/CartContext";
import { Loader2 } from "lucide-react";

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
  const lastOrderIdRef = useRef<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [sdkReady, setSdkReady] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [lastPayPalError, setLastPayPalError] = useState<string | null>(null);

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

    // PayPal-hosted decline screen
    if (lower.includes("international regulations")) {
      return "PayPal declined this transaction due to compliance restrictions. Please try a different card/PayPal account.";
    }

    // Common PayPal error codes
    if (lower.includes("instrument_declined")) {
      return "Your bank declined the payment method. Please try another card or PayPal balance.";
    }

    return raw || "Payment failed. Please try again.";
  };

  const reconcileOrderIfPossible = async (orderId: string): Promise<{ ok: boolean; message?: string }> => {
    const { data: statusData, error: statusError } = await supabase.functions.invoke("paypal", {
      body: { action: "get", orderId },
    });

    if (statusError) {
      return { ok: false, message: statusError.message };
    }

    const status = String(statusData?.status || "");

    // If buyer approved but our UI errored, try to capture so we can complete the flow.
    if (status === "APPROVED" || status === "COMPLETED") {
      const { data: captureData, error: captureError } = await supabase.functions.invoke("paypal", {
        body: { action: "capture", orderId },
      });

      if (captureError) {
        return { ok: false, message: captureError.message };
      }

      if (captureData?.success) {
        onSuccess(captureData.orderId || orderId);
        return { ok: true };
      }

      return { ok: false, message: `Payment capture failed: ${toSafeString(captureData)}` };
    }

    if (status === "DECLINED" || status === "VOIDED") {
      return { ok: false, message: "This transaction was declined by PayPal. Please try a different payment method." };
    }

    return { ok: false };
  };

  // Load PayPal SDK
  useEffect(() => {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
    
    if (!clientId) {
      console.error("PayPal Client ID not configured");
      setIsLoading(false);
      return;
    }

    // PayPal JS SDK is served from paypal.com for both sandbox and live.
    // Sandbox vs live is determined by the client-id you pass.
    const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
    if (existingScript && window.paypal) {
      setSdkReady(true);
      setIsLoading(false);
      return;
    }

    // Remove any existing PayPal scripts (can get stuck if a wrong/partial script is present)
    const oldScripts = document.querySelectorAll(
      'script[src*="paypal.com/sdk/js"], script[src*="sandbox.paypal.com/sdk/js"]'
    );
    oldScripts.forEach((s) => s.remove());

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=GBP&intent=capture&enable-funding=card&buyer-country=GB&locale=en_GB&debug=true`;
    script.async = true;
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
  }, []);

  // Render PayPal buttons
  useEffect(() => {
    if (!sdkReady || !window.paypal || !paypalRef.current || disabled) return;

    // Clear previous buttons
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
          setLastPayPalError(null);

          const orderData = {
            amount: totalAmount + shippingCost,
            currency: "GBP",
            returnUrl: `${window.location.origin}/order-confirmation`,
            cancelUrl: `${window.location.origin}/checkout`,
            items: items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              unit_amount: item.price,
            })),
          };

          const { data, error } = await supabase.functions.invoke("paypal", {
            body: { action: "create", orderData },
          });

          if (error) throw new Error(error.message);
          if (!data?.orderId) {
            const msg = data?.error ? String(data.error) : `No order ID returned: ${toSafeString(data)}`;
            throw new Error(msg);
          }

          lastOrderIdRef.current = data.orderId;
          setLastOrderId(data.orderId);
          return data.orderId;
        } catch (err) {
          const raw = toSafeString(err);
          const userMessage = deriveUserMessage(raw);
          console.error("Error creating PayPal order:", err);
          setLastPayPalError(raw);
          onError(userMessage);
          throw err;
        }
      },
      onApprove: async (data) => {
        try {
          lastOrderIdRef.current = data.orderID;
          setLastOrderId(data.orderID);

          const { data: captureData, error } = await supabase.functions.invoke("paypal", {
            body: { action: "capture", orderId: data.orderID },
          });

          if (error) throw new Error(error.message);
          if (!captureData?.success) {
            const msg = captureData?.error
              ? String(captureData.error)
              : `Payment capture failed: ${toSafeString(captureData)}`;
            throw new Error(msg);
          }

          onSuccess(captureData.orderId);
        } catch (err) {
          const raw = toSafeString(err);
          const userMessage = deriveUserMessage(raw);
          console.error("Error capturing PayPal order:", err);
          setLastPayPalError(raw);
          onError(userMessage);
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

          const message = deriveUserMessage(result.message || raw);
          onError(message);
        })();
      },
      onCancel: () => {
        console.log("Payment cancelled by user");
      },

    Promise.resolve(renderResult).catch((err: unknown) => {
      const message =
        err instanceof Error
          ? err.message
          : `PayPal render error: ${JSON.stringify(err)}`;
      console.error("PayPal render error:", err);
      setLastPayPalError(message);
      onError(message);
    });
  }, [sdkReady, items, totalAmount, shippingCost, onSuccess, onError, disabled]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading PayPal...</span>
      </div>
    );
  }

  if (!import.meta.env.VITE_PAYPAL_CLIENT_ID) {
    return (
      <div className="text-center py-4 text-sm text-muted-foreground">
        PayPal is not configured. Please add VITE_PAYPAL_CLIENT_ID to your environment.
      </div>
    );
  }

  return (
    <div className={disabled ? "opacity-50 pointer-events-none" : ""}>
      <div ref={paypalRef} />

      {showDebug && (lastOrderId || lastPayPalError) && (
        <div className="mt-3 rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          <div className="font-medium text-foreground">PayPal debug</div>
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
