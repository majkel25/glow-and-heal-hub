import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/contexts/CartContext";
import { Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Official Apple Pay logo mark SVG
const ApplePayLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 165.521 105.965" xmlns="http://www.w3.org/2000/svg">
    <path d="M150.698 0H14.823c-.566 0-1.133 0-1.698.003-.477.004-.953.009-1.43.022-1.039.028-2.087.09-3.113.274a10.51 10.51 0 0 0-2.958.975 9.932 9.932 0 0 0-4.35 4.35 10.463 10.463 0 0 0-.975 2.96C.113 9.611.052 10.658.024 11.696a70.22 70.22 0 0 0-.022 1.43C0 13.69 0 14.256 0 14.823v76.318c0 .567 0 1.132.002 1.699.003.476.009.953.022 1.43.028 1.036.09 2.084.275 3.11a10.46 10.46 0 0 0 .974 2.96 9.897 9.897 0 0 0 1.83 2.52 9.874 9.874 0 0 0 2.52 1.83c.947.483 1.917.79 2.96.977 1.025.183 2.073.245 3.112.273.477.011.953.017 1.43.02.565.004 1.132.004 1.698.004h135.875c.565 0 1.132 0 1.697-.004.476-.002.952-.009 1.431-.02 1.037-.028 2.085-.09 3.113-.273a10.478 10.478 0 0 0 2.958-.977 9.955 9.955 0 0 0 4.35-4.35c.483-.947.789-1.917.974-2.96.186-1.026.246-2.074.274-3.11.013-.477.02-.954.022-1.43.004-.567.004-1.132.004-1.699V14.824c0-.567 0-1.133-.004-1.699a63.067 63.067 0 0 0-.022-1.429c-.028-1.038-.088-2.085-.274-3.112a10.4 10.4 0 0 0-.974-2.96 9.94 9.94 0 0 0-4.35-4.35A10.52 10.52 0 0 0 156.939.3c-1.028-.185-2.076-.246-3.113-.274a71.417 71.417 0 0 0-1.431-.022C151.83 0 151.263 0 150.698 0z" fill="currentColor"/>
    <path d="M150.698 3.532l1.672.003c.452.003.905.008 1.36.02.793.022 1.719.065 2.583.22.75.135 1.38.34 1.984.648a6.392 6.392 0 0 1 2.804 2.807c.306.6.51 1.226.645 1.983.154.854.197 1.783.218 2.58.013.45.019.9.02 1.36.005.557.005 1.113.005 1.671v76.318c0 .558 0 1.114-.004 1.682-.002.45-.008.9-.02 1.35-.022.796-.065 1.725-.221 2.589a6.855 6.855 0 0 1-.645 1.975 6.397 6.397 0 0 1-2.808 2.807c-.6.306-1.228.511-1.971.645-.881.157-1.847.2-2.574.22-.457.01-.912.017-1.379.019-.555.004-1.113.004-1.669.004H14.801c-.01 0-.019 0-.027-.001-.555 0-1.11 0-1.67-.003a47.54 47.54 0 0 1-1.347-.02c-.807-.021-1.752-.064-2.593-.22a6.831 6.831 0 0 1-1.973-.645 6.385 6.385 0 0 1-2.804-2.807 6.833 6.833 0 0 1-.646-1.985c-.156-.863-.199-1.788-.22-2.578a49.166 49.166 0 0 1-.02-1.355l-.003-1.327V14.474l.002-1.325a47.486 47.486 0 0 1 .021-1.378c.022-.792.064-1.717.22-2.589.135-.749.339-1.376.646-1.979a6.388 6.388 0 0 1 2.8-2.81 6.874 6.874 0 0 1 1.987-.645c.863-.156 1.79-.197 2.585-.22.468-.012.937-.017 1.394-.02l1.639-.003z" fill="#fff"/>
    <path d="M43.508 35.77c1.404-1.755 2.356-4.112 2.105-6.52-2.054.102-4.56 1.355-6.012 3.112-1.303 1.504-2.456 3.959-2.156 6.266 2.306.2 4.61-1.152 6.063-2.858M45.587 39.079c-3.35-.2-6.196 1.9-7.795 1.9-1.6 0-4.049-1.8-6.698-1.751-3.447.05-6.645 2-8.395 5.1-3.598 6.2-.95 15.4 2.549 20.45 1.699 2.5 3.747 5.25 6.445 5.151 2.55-.1 3.549-1.65 6.647-1.65 3.097 0 3.997 1.65 6.696 1.6 2.798-.05 4.548-2.5 6.247-5 1.95-2.85 2.747-5.6 2.797-5.75-.05-.05-5.396-2.101-5.446-8.251-.05-5.15 4.198-7.6 4.398-7.751-2.399-3.548-6.147-3.948-7.447-4.048M65.47 32.31v44.27h6.836V60.84h9.463c8.63 0 14.707-5.926 14.707-14.288 0-8.363-5.974-14.24-14.5-14.24H65.47zm6.836 5.77h7.88c5.926 0 9.308 3.176 9.308 8.52 0 5.343-3.382 8.547-9.332 8.547h-7.856V38.08zM113.34 77.095c4.288 0 8.266-2.173 10.078-5.617h.137v5.28h6.32V51.73c0-6.345-5.074-10.427-12.885-10.427-7.347 0-12.754 4.131-12.96 9.8h6.149c.516-2.69 3.022-4.456 6.576-4.456 4.25 0 6.64 1.98 6.64 5.617v2.465l-8.68.516c-8.075.48-12.439 3.794-12.439 9.538 0 5.823 4.496 9.672 11.064 9.672zm1.828-5.31c-3.69 0-6.037-1.77-6.037-4.483 0-2.793 2.27-4.407 6.595-4.664l7.728-.48v2.52c0 4.145-3.485 7.106-8.286 7.106zM138.98 88.413c6.673 0 9.799-2.55 12.535-10.28l12.02-33.327h-7.063l-8.05 25.907h-.138l-8.047-25.907h-7.27l11.58 32.078-.626 1.956c-1.05 3.382-2.756 4.69-5.793 4.69-.54 0-1.59-.053-2.01-.103v5.24c.401.104 2.1.157 2.862.157z" fill="currentColor"/>
  </svg>
);

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
      Applepay: () => {
        config: () => Promise<{
          isEligible: boolean;
          countryCode: string;
          currencyCode: string;
          merchantCapabilities: string[];
          supportedNetworks: string[];
        }>;
        validateMerchant: (opts: { validationUrl: string; displayName: string }) => Promise<{ merchantSession: unknown }>;
        confirmOrder: (opts: { orderId: string; token: unknown; billingContact?: unknown }) => Promise<{ approveApplePayPayment: () => Promise<void> }>;
      };
    };
    ApplePaySession?: {
      new (version: number, paymentRequest: ApplePayPaymentRequest): ApplePaySessionInstance;
      STATUS_SUCCESS: number;
      STATUS_FAILURE: number;
      canMakePayments: () => boolean;
      supportsVersion: (version: number) => boolean;
    };
  }

  interface ApplePayPaymentRequest {
    countryCode: string;
    currencyCode: string;
    merchantCapabilities: string[];
    supportedNetworks: string[];
    total: { label: string; amount: string; type: string };
    requiredBillingContactFields?: string[];
    requiredShippingContactFields?: string[];
  }

  interface ApplePayContact {
    givenName?: string;
    familyName?: string;
    emailAddress?: string;
    phoneNumber?: string;
    addressLines?: string[];
    locality?: string;
    postalCode?: string;
    countryCode?: string;
  }

  interface ApplePaySessionInstance {
    begin: () => void;
    abort: () => void;
    completeMerchantValidation: (merchantSession: unknown) => void;
    completePayment: (status: number) => void;
    onvalidatemerchant: ((event: { validationURL: string }) => void) | null;
    onpaymentauthorized: ((event: { payment: { token: unknown; billingContact?: ApplePayContact; shippingContact?: ApplePayContact } }) => void) | null;
    oncancel: (() => void) | null;
  }
}

export interface ApplePayContactDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
}

interface PayPalButtonProps {
  items: CartItem[];
  totalAmount: number;
  shippingCost: number;
  onSuccess: (orderId: string, applePayContact?: ApplePayContactDetails) => void;
  onError: (error: string) => void;
  disabled?: boolean;
  onApplePayContactReceived?: (contact: ApplePayContactDetails) => void;
  /** When true, Apple Pay is always available for express checkout even if disabled=true */
  allowApplePayExpress?: boolean;
  /** When true, only show Apple Pay button (for express checkout section) */
  expressCheckoutOnly?: boolean;
}

export function PayPalButton({
  items,
  totalAmount,
  shippingCost,
  onSuccess,
  onError,
  disabled = false,
  onApplePayContactReceived,
  allowApplePayExpress = true,
  expressCheckoutOnly = false,
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
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card" | "applepay">("paypal");

  // Apple Pay state
  const [applePayEligible, setApplePayEligible] = useState(false);
  const [applePayConfig, setApplePayConfig] = useState<{
    countryCode: string;
    currencyCode: string;
    merchantCapabilities: string[];
    supportedNetworks: string[];
  } | null>(null);
  const [isApplePayProcessing, setIsApplePayProcessing] = useState(false);

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
      components: "buttons,card-fields,applepay",
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

  // Check Apple Pay eligibility
  useEffect(() => {
    if (!sdkReady || !window.paypal?.Applepay) {
      setApplePayEligible(false);
      return;
    }

    // Check if browser supports Apple Pay
    if (!window.ApplePaySession || !window.ApplePaySession.canMakePayments()) {
      console.log("Apple Pay not supported in this browser");
      setApplePayEligible(false);
      return;
    }

    (async () => {
      try {
        const applepay = window.paypal!.Applepay();
        const config = await applepay.config();
        
        if (config.isEligible) {
          setApplePayEligible(true);
          setApplePayConfig({
            countryCode: config.countryCode,
            currencyCode: config.currencyCode,
            merchantCapabilities: config.merchantCapabilities,
            supportedNetworks: config.supportedNetworks,
          });
          console.log("Apple Pay is eligible", config);
        } else {
          setApplePayEligible(false);
          console.log("Apple Pay not eligible for this merchant");
        }
      } catch (err) {
        console.error("Error checking Apple Pay eligibility:", err);
        setApplePayEligible(false);
      }
    })();
  }, [sdkReady]);

  // Default to Apple Pay on initial eligibility check (only once)
  const hasSetInitialMethod = useRef(false);
  useEffect(() => {
    if (applePayEligible && !hasSetInitialMethod.current) {
      setPaymentMethod("applepay");
      hasSetInitialMethod.current = true;
    }

    // Fall back to PayPal if Apple Pay becomes ineligible while selected
    if (!applePayEligible && paymentMethod === "applepay") {
      setPaymentMethod("paypal");
    }
  }, [applePayEligible, paymentMethod]);

  const handleApplePayClick = async () => {
    if (!window.paypal?.Applepay || !window.ApplePaySession || !applePayConfig) return;

    setIsApplePayProcessing(true);
    setLastPayPalError(null);

    try {
      const applepay = window.paypal.Applepay();
      const orderAmount = (totalAmount + shippingCost).toFixed(2);

      const paymentRequest: ApplePayPaymentRequest = {
        countryCode: applePayConfig.countryCode || "GB",
        currencyCode: "GBP",
        merchantCapabilities: applePayConfig.merchantCapabilities,
        supportedNetworks: applePayConfig.supportedNetworks,
        requiredBillingContactFields: ["name", "postalAddress", "email", "phone"],
        requiredShippingContactFields: ["name", "postalAddress", "email", "phone"],
        total: {
          label: "MeYounger",
          amount: orderAmount,
          type: "final",
        },
      };

      const session = new window.ApplePaySession(4, paymentRequest);

      session.onvalidatemerchant = async (event) => {
        try {
          const { merchantSession } = await applepay.validateMerchant({
            validationUrl: event.validationURL,
            displayName: "MeYounger",
          });
          session.completeMerchantValidation(merchantSession);
        } catch (err) {
          console.error("Merchant validation failed:", err);
          session.abort();
          setIsApplePayProcessing(false);
          onError("Apple Pay merchant validation failed. Please try another payment method.");
        }
      };

      session.onpaymentauthorized = async (event) => {
        try {
          // Extract contact details from Apple Pay
          const shippingContact = event.payment.shippingContact;
          const billingContact = event.payment.billingContact;
          
          // Use shipping contact if available, fall back to billing contact
          const contact = shippingContact || billingContact;
          
          const applePayContactDetails: ApplePayContactDetails = {
            firstName: contact?.givenName || "",
            lastName: contact?.familyName || "",
            email: contact?.emailAddress || "",
            phone: contact?.phoneNumber || "",
            address: contact?.addressLines?.join(", ") || "",
            city: contact?.locality || "",
            postcode: contact?.postalCode || "",
          };

          console.log("Apple Pay contact details:", applePayContactDetails);

          // Notify parent about contact details for express checkout
          if (onApplePayContactReceived) {
            onApplePayContactReceived(applePayContactDetails);
          }

          // Create PayPal order first
          const orderId = await createOrder();
          lastOrderIdRef.current = orderId;
          setLastOrderId(orderId);

          // Confirm the order with Apple Pay token
          const confirmResult = await applepay.confirmOrder({
            orderId,
            token: event.payment.token,
            billingContact: event.payment.billingContact,
          });

          await confirmResult.approveApplePayPayment();
          session.completePayment(window.ApplePaySession!.STATUS_SUCCESS);

          // Capture the order
          const capturedId = await captureOrder(orderId);
          onSuccess(capturedId, applePayContactDetails);
        } catch (err) {
          console.error("Apple Pay authorization failed:", err);
          session.completePayment(window.ApplePaySession!.STATUS_FAILURE);
          setLastPayPalError(toSafeString(err));
          onError("Apple Pay payment failed. Please try another payment method.");
        } finally {
          setIsApplePayProcessing(false);
        }
      };

      session.oncancel = () => {
        console.log("Apple Pay cancelled by user");
        setIsApplePayProcessing(false);
      };

      session.begin();
    } catch (err) {
      console.error("Apple Pay error:", err);
      setLastPayPalError(toSafeString(err));
      setIsApplePayProcessing(false);
      onError("Apple Pay is not available. Please try another payment method.");
    }
  };

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

  // Apple Pay is always enabled for express checkout
  const isApplePayDisabled = disabled && !allowApplePayExpress;
  const isOtherMethodsDisabled = disabled;

  // Express checkout only mode - just show Apple Pay
  if (expressCheckoutOnly) {
    return (
      <div>
        {applePayEligible ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Skip the form - Apple Pay will collect your details
            </p>
            <Button
              type="button"
              className="w-full bg-black hover:bg-black/90 text-white h-12"
              onClick={handleApplePayClick}
              disabled={isApplePayProcessing}
            >
              {isApplePayProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <ApplePayLogo className="w-12 h-5 mr-2" />
                  Pay with Apple Pay
                </>
              )}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            Apple Pay express checkout is only available on Safari (Mac/iOS).
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Payment method tabs */}
      <div className="grid w-3/4 mx-auto gap-2 mb-6">
        <Button
          type="button"
          variant={paymentMethod === "card" ? "default" : "outline"}
          className="w-full"
          onClick={() => setPaymentMethod("card")}
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Card
        </Button>

        <Button
          type="button"
          variant={paymentMethod === "paypal" ? "default" : "outline"}
          className="w-full"
          onClick={() => setPaymentMethod("paypal")}
        >
          <img
            src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
            alt="PayPal"
            className="h-5 mr-2"
          />
          PayPal
        </Button>
      </div>

      {/* PayPal button */}
      {paymentMethod === "paypal" && (
        <div ref={paypalRef} className="w-full min-h-[150px]" />
      )}

      {/* Card fields */}

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
          {paymentMethod === "card" && (
            <div className="mt-1">
              card fields eligible: <code>{String(cardFieldsEligible)}</code>
            </div>
          )}
          {paymentMethod === "applepay" && (
            <div className="mt-1">
              apple pay eligible: <code>{String(applePayEligible)}</code>
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
