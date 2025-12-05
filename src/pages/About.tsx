import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Award, Users, Heart, Shield } from "lucide-react";

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

        {/* Contact Section */}
        <section className="py-16 lg:py-20 bg-card">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-semibold text-foreground mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                Have questions about our products or need personalized advice? 
                Our team is here to help.
              </p>
              <div className="space-y-4 text-left max-w-md mx-auto">
                <a 
                  href="tel:+442039082012" 
                  className="flex items-center gap-3 p-4 rounded-xl bg-background hover:bg-primary/5 transition-colors"
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
                  className="flex items-center gap-3 p-4 rounded-xl bg-background hover:bg-primary/5 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">hello@meyounger.co.uk</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-background">
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;