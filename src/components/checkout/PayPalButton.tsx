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
        onError: (err: Error) => void;
        onCancel: () => void;
      }) => { render: (element: HTMLElement) => void };
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
  const [isLoading, setIsLoading] = useState(true);
  const [sdkReady, setSdkReady] = useState(false);

  // Load PayPal SDK
  useEffect(() => {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
    
    if (!clientId) {
      console.error("PayPal Client ID not configured");
      setIsLoading(false);
      return;
    }

    const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
    if (existingScript) {
      setSdkReady(true);
      setIsLoading(false);
      return;
    }

    const script = document.createElement("script");
    // Use sandbox for testing - remove &debug=true for production
    script.src = `https://www.sandbox.paypal.com/sdk/js?client-id=${clientId}&currency=GBP`;
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

    window.paypal.Buttons({
      style: {
        layout: "vertical",
        color: "gold",
        shape: "rect",
        label: "paypal",
      },
      createOrder: async () => {
        try {
          const orderData = {
            amount: totalAmount + shippingCost,
            currency: "GBP",
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
          if (!data?.orderId) throw new Error("No order ID returned");

          return data.orderId;
        } catch (err) {
          console.error("Error creating PayPal order:", err);
          onError(err instanceof Error ? err.message : "Failed to create order");
          throw err;
        }
      },
      onApprove: async (data) => {
        try {
          const { data: captureData, error } = await supabase.functions.invoke(
            "paypal",
            {
              body: { action: "capture", orderId: data.orderID },
            }
          );

          if (error) throw new Error(error.message);
          if (!captureData?.success) throw new Error("Payment capture failed");

          onSuccess(captureData.orderId);
        } catch (err) {
          console.error("Error capturing PayPal order:", err);
          onError(err instanceof Error ? err.message : "Failed to process payment");
        }
      },
      onError: (err) => {
        console.error("PayPal error:", err);
        onError("PayPal encountered an error");
      },
      onCancel: () => {
        console.log("Payment cancelled by user");
      },
    }).render(paypalRef.current);
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
    <div
      ref={paypalRef}
      className={disabled ? "opacity-50 pointer-events-none" : ""}
    />
  );
}
