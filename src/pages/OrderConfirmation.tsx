import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";

type CaptureState =
  | { status: "idle" }
  | { status: "capturing"; orderId: string }
  | { status: "success"; orderId: string }
  | { status: "error"; orderId: string; message: string };

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  const orderIdFromUrl = useMemo(() => {
    // PayPal redirects typically include `token` (order id) and `PayerID`.
    return searchParams.get("token") || searchParams.get("orderId") || null;
  }, [searchParams]);

  const alreadyCaptured = searchParams.get("captured") === "1";

  const [capture, setCapture] = useState<CaptureState>(() => {
    if (orderIdFromUrl && !alreadyCaptured) {
      return { status: "capturing", orderId: orderIdFromUrl };
    }
    if (orderIdFromUrl) {
      return { status: "success", orderId: orderIdFromUrl };
    }
    return { status: "idle" };
  });

  useEffect(() => {
    if (!orderIdFromUrl || alreadyCaptured) return;

    let cancelled = false;

    (async () => {
      setCapture({ status: "capturing", orderId: orderIdFromUrl });

      const { data, error } = await supabase.functions.invoke("paypal", {
        body: { action: "capture", orderId: orderIdFromUrl },
      });

      if (cancelled) return;

      if (error) {
        const message = error.message || "Payment capture failed.";
        setCapture({ status: "error", orderId: orderIdFromUrl, message });
        toast({ title: "Payment not finalized", description: message, variant: "destructive" });
        return;
      }

      if (!data?.success) {
        const message = `Payment capture failed: ${JSON.stringify(data)}`;
        setCapture({ status: "error", orderId: orderIdFromUrl, message });
        toast({ title: "Payment not finalized", description: message, variant: "destructive" });
        return;
      }

      clearCart();
      setCapture({ status: "success", orderId: data.orderId || orderIdFromUrl });
    })();

    return () => {
      cancelled = true;
    };
  }, [alreadyCaptured, clearCart, orderIdFromUrl]);

  const displayOrderId =
    capture.status === "success" || capture.status === "error" || capture.status === "capturing"
      ? capture.orderId
      : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 text-center py-20 max-w-lg">
          {capture.status === "capturing" ? (
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
          )}

          <h1 className="text-3xl font-semibold text-foreground mb-4">
            {capture.status === "capturing" ? "Finalizing your payment…" : "Thank you for your order!"}
          </h1>

          <p className="text-muted-foreground mb-8">
            {capture.status === "capturing"
              ? "Please wait a moment while we confirm your payment."
              : capture.status === "error"
                ? "We couldn't finalize the payment automatically. If you were charged, contact support with the order ID below."
                : "We've received your order and will send you a confirmation email shortly."}
          </p>

          {displayOrderId && (
            <div className="bg-card rounded-xl p-6 border border-border mb-8">
              <p className="text-sm text-muted-foreground mb-2">Order ID</p>
              <p className="text-sm font-mono font-semibold text-foreground break-all">
                {displayOrderId}
              </p>
              {capture.status === "error" && (
                <p className="mt-3 text-xs text-destructive break-words">{capture.message}</p>
              )}
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            {capture.status === "error" && (
              <Link to="/checkout">
                <Button variant="outline">Back to checkout</Button>
              </Link>
            )}
            <Link to="/">
              <Button size="lg" className="group">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
