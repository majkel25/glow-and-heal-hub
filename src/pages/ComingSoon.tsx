import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Package, Bell, Loader2, CheckCircle } from "lucide-react";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(255),
});

type RegisterForm = z.infer<typeof registerSchema>;

const ComingSoon = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterForm, string>>>({});
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterForm, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof RegisterForm] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("send-interest-email", {
        body: {
          name: form.name,
          email: form.email,
        },
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Interest registered!",
        description: "We'll notify you when our medical products are available.",
      });
    } catch (error) {
      console.error("Failed to register interest:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center py-16">
            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
              <Package className="w-10 h-10 text-primary" />
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
              We're Stocking Our Shelves
            </h1>
            
            <p className="text-lg text-muted-foreground mb-12 max-w-lg mx-auto">
              Our medical-grade skincare range is coming soon. Please bear with us while we prepare 
              an exceptional selection of professional products for you.
            </p>

            {/* Registration Form */}
            {!isSubmitted ? (
              <div className="bg-card rounded-2xl p-8 border border-border max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Bell className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Get Notified
                  </h2>
                </div>
                
                <p className="text-sm text-muted-foreground mb-6">
                  Register your interest and we'll email you as soon as our products are available.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-left">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="text-left">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Registering...
                      </>
                    ) : (
                      "Register Interest"
                    )}
                  </Button>
                </form>
              </div>
            ) : (
              <div className="bg-card rounded-2xl p-8 border border-border max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  You're on the list!
                </h2>
                <p className="text-sm text-muted-foreground">
                  We've sent a confirmation to your email. We'll notify you as soon as our medical 
                  skincare range is available.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ComingSoon;
