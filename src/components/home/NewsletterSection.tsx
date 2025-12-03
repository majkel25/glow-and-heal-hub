import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setEmail("");
    toast({
      title: "Welcome to Aesthetica!",
      description: "You've successfully subscribed to our newsletter.",
    });
  };

  return (
    <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-slate-blue-light/50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-blue-light rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Exclusive Offers</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-semibold text-foreground">
            Join Our Newsletter
          </h2>
          <p className="text-muted-foreground mt-4 mb-8">
            Get 15% off your first order plus exclusive access to new arrivals, 
            expert skincare tips, and members-only promotions.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 px-4 bg-background border-border rounded-xl flex-1"
              required
            />
            <Button 
              type="submit" 
              variant="hero" 
              size="lg" 
              disabled={isLoading}
              className="h-12 shrink-0"
            >
              {isLoading ? (
                "Subscribing..."
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </div>
    </section>
  );
}
