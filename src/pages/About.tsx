import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Award, Users, Heart, Shield, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const values = [
  {
    icon: Heart,
    title: "Passion for Wellness",
    description: "We believe everyone deserves access to cutting-edge wellness technology that can transform their lives.",
  },
  {
    icon: Shield,
    title: "Quality & Trust",
    description: "As official UK distributors, we guarantee authentic products backed by manufacturer warranties.",
  },
  {
    icon: Users,
    title: "Customer First",
    description: "Our dedicated team provides personalized consultations and ongoing support for every customer.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We partner only with industry-leading brands that meet our rigorous standards for efficacy and safety.",
  },
];

const About = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
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

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Message Sent",
      description: "Thank you for getting in touch! Our team will respond within 24-48 hours.",
    });

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                About Us
              </span>
              <h1 className="text-4xl lg:text-5xl font-semibold text-foreground mt-2">
                MeYounger
              </h1>
              <p className="text-xl text-muted-foreground mt-6 leading-relaxed">
                Official UK distributors of premium wellness and aesthetic products. 
                We bring innovative health technology to homes and clinics across the United Kingdom.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-semibold text-foreground mb-6">Our Story</h2>
              <div className="prose prose-lg text-muted-foreground space-y-4">
                <p>
                  MeYounger was founded with a simple mission: to make advanced wellness technology 
                  accessible to everyone in the UK. We recognized that many groundbreaking health 
                  and beauty innovations were difficult to obtain or came with uncertainty about 
                  authenticity and support.
                </p>
                <p>
                  As official UK distributors for leading brands like F+NCTION supplements and 
                  Sedona Wellness PEMF therapy devices, we bridge the gap between cutting-edge 
                  wellness technology and the people who can benefit from it most.
                </p>
                <p>
                  Based in London, our team combines deep expertise in wellness technology with 
                  a genuine passion for helping people feel and look their best. We're not just 
                  selling products – we're building lasting relationships with customers who 
                  trust us to guide their wellness journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 lg:py-20 bg-card">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-foreground">Our Values</h2>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                Everything we do is guided by our commitment to quality, trust, and customer success.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="text-center animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-semibold text-foreground mb-6">What We Offer</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h3 className="text-xl font-semibold text-foreground mb-3">F+NCTION Supplements</h3>
                  <p className="text-muted-foreground mb-4">
                    Premium skincare and wellness supplements designed to support your body from the inside out. 
                    Science-backed formulations for radiant skin, energy, and vitality.
                  </p>
                  <Link to="/#products">
                    <Button variant="outline">Shop Supplements</Button>
                  </Link>
                </div>
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h3 className="text-xl font-semibold text-foreground mb-3">Sedona Wellness PEMF</h3>
                  <p className="text-muted-foreground mb-4">
                    Professional and home PEMF therapy devices for pain relief, better sleep, and cellular regeneration. 
                    NASA-researched technology now available in the UK.
                  </p>
                  <Link to="/#sedona-wellness">
                    <Button variant="outline">Explore Devices</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact" className="py-16 lg:py-20 bg-card">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-foreground">Get in Touch</h2>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                Have questions about our products or need personalized advice? 
                Fill out the form below and our team will get back to you.
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-12">
                {/* Form */}
                <div className="lg:col-span-2">
                  <form onSubmit={handleSubmit} className="space-y-6 bg-background rounded-2xl p-6 lg:p-8">
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
                      <Label htmlFor="subject">Subject *</Label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select a subject...</option>
                        <option value="Product Enquiry">Product Enquiry</option>
                        <option value="Order Support">Order Support</option>
                        <option value="PEMF Consultation">PEMF Consultation</option>
                        <option value="Partnership Opportunity">Partnership Opportunity</option>
                        <option value="General Question">General Question</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="How can we help you?"
                        rows={5}
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>

                    <p className="text-xs text-muted-foreground">
                      By submitting this form, you agree to be contacted by MeYounger regarding your enquiry. 
                      Your information will be handled in accordance with our privacy policy.
                    </p>
                  </form>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Contact Info */}
                  <div className="bg-background rounded-2xl p-6">
                    <h3 className="font-semibold text-foreground mb-6">Contact Us Directly</h3>
                    <div className="space-y-4">
                      <a
                        href="tel:+442039082012"
                        className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Phone className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium text-foreground">+44 203 908 2012</p>
                        </div>
                      </a>
                      <a
                        href="mailto:hello@meyounger.co.uk"
                        className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium text-foreground">hello@meyounger.co.uk</p>
                        </div>
                      </a>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Address</p>
                          <p className="font-medium text-foreground">48 Warwick Way, London, SW1V 1RY</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* What to Expect */}
                  <div className="bg-background rounded-2xl p-6">
                    <h3 className="font-semibold text-foreground mb-4">What to Expect</h3>
                    <ul className="space-y-3">
                      {[
                        "Response within 24-48 hours",
                        "Friendly, knowledgeable support",
                        "No-obligation consultations",
                        "Expert product guidance",
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;