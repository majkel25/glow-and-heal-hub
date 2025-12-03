import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

const OrderConfirmation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 text-center py-20 max-w-lg">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold text-foreground mb-4">
            Thank you for your order!
          </h1>
          <p className="text-muted-foreground mb-8">
            We've received your order and will send you a confirmation email shortly. 
            Your wellness journey starts here!
          </p>
          <div className="bg-card rounded-xl p-6 border border-border mb-8">
            <p className="text-sm text-muted-foreground mb-2">Order Number</p>
            <p className="text-lg font-mono font-semibold text-foreground">
              #MY-{Math.random().toString(36).substring(2, 8).toUpperCase()}
            </p>
          </div>
          <Link to="/">
            <Button size="lg" className="group">
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
