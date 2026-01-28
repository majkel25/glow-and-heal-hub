import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Phone, Mail, MapPin, Check, Zap, Heart, Shield } from "lucide-react";
import { sedonaProducts } from "@/data/sedonaProducts";
import { supabase } from "@/integrations/supabase/client";

const SedonaConsultation = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    productInterest: "",
    useCase: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-callback-email", {
        body: formData,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.success) {
        throw new Error(data?.error || "Failed to send callback request");
      }

      toast({
        title: "Callback Request Received",
        description: "Thank you for your interest! Our team will contact you within 24-48 hours. A confirmation email has been sent to you.",
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        productInterest: "",
        useCase: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting callback request:", error);
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: Zap,
      title: "Expert Guidance",
      description: "Our PEMF specialists will help you choose the right device for your needs",
    },
    {
      icon: Heart,
      title: "Personalised Recommendations",
      description: "Get tailored advice based on your specific wellness goals",
    },
    {
      icon: Shield,
      title: "Professional Support",
      description: "Ongoing support and training for optimal results",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
            <Link
              to="/#sedona-wellness"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sedona Wellness
            </Link>
            <div className="max-w-3xl">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Sedona Wellness
              </span>
              <h1 className="text-3xl lg:text-5xl font-semibold text-foreground mt-2">
                Request a Callback
              </h1>
              <p className="text-lg text-muted-foreground mt-4">
                Interested in PEMF therapy? Our specialists are here to help you find the perfect 
                Sedona Wellness device for your home, clinic, or wellness centre.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+44 7700 900000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company / Clinic Name (if applicable)</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your clinic or business name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productInterest">Product Interest *</Label>
                  <select
                    id="productInterest"
                    name="productInterest"
                    value={formData.productInterest}
                    onChange={handleChange}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a product...</option>
                    {sedonaProducts.map((product) => (
                      <option key={product.id} value={product.name}>
                        {product.name} - £{product.price.toLocaleString()}
                      </option>
                    ))}
                    <option value="Not sure - need guidance">Not sure - need guidance</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="useCase">Intended Use *</Label>
                  <select
                    id="useCase"
                    name="useCase"
                    value={formData.useCase}
                    onChange={handleChange}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select intended use...</option>
                    <option value="Personal / Home Use">Personal / Home Use</option>
                    <option value="Professional Clinic">Professional Clinic</option>
                    <option value="Wellness Centre / Spa">Wellness Centre / Spa</option>
                    <option value="Sports / Athletic Recovery">Sports / Athletic Recovery</option>
                    <option value="Medical Practice">Medical Practice</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Additional Information</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your specific needs, health goals, or any questions you have about PEMF therapy..."
                    rows={5}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Request a Callback"}
                </Button>

                <p className="text-xs text-muted-foreground">
                  By submitting this form, you agree to be contacted by MeYounger regarding your enquiry. 
                  Your information will be handled in accordance with our privacy policy.
                </p>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Benefits */}
              <div className="bg-card rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-6">Why Request a Consultation?</h3>
                <div className="space-y-6">
                  {benefits.map((benefit) => (
                    <div key={benefit.title} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <benefit.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{benefit.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-card rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-6">Contact Us Directly</h3>
                <div className="space-y-4">
                  <a
                    href="mailto:hello@meyounger.co.uk"
                    className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail className="w-5 h-5 text-primary" />
                    <span>hello@meyounger.co.uk</span>
                  </a>
                  <a
                    href="tel:+442039082012"
                    className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Phone className="w-5 h-5 text-primary" />
                    <span>+44 203 908 2012</span>
                  </a>
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="w-5 h-5 text-primary shrink-0" />
                    <span>48 Warwick Way, London, SW1V 1RY</span>
                  </div>
                </div>
              </div>

              {/* What to Expect */}
              <div className="bg-card rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">What to Expect</h3>
                <ul className="space-y-3">
                  {[
                    "Response within 24-48 hours",
                    "No-obligation consultation",
                    "Product demonstrations available",
                    "Flexible payment options",
                    "UK delivery and installation",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SedonaConsultation;
