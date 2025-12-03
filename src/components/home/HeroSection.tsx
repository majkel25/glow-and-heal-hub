import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Truck, Award } from "lucide-react";
import heroImage from "@/assets/hero-aesthetic.jpg";

const highlights = [
  { icon: Shield, text: "Dermatologist Approved" },
  { icon: Truck, text: "Free Shipping £50+" },
  { icon: Award, text: "Medical Grade" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/20 backdrop-blur-sm rounded-full mb-6 animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
              <span className="text-sm font-medium text-primary-foreground">New Collection Available</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-primary-foreground leading-tight mb-6 animate-fade-up delay-100">
              Medical Grade
              <span className="block font-semibold text-primary-foreground/90">Skincare</span>
              <span className="block">Excellence</span>
            </h1>
            
            <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto lg:mx-0 mb-8 animate-fade-up delay-200">
              Discover professional-strength formulations trusted by dermatologists. 
              Transform your skin with clinically proven ingredients.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up delay-300">
              <Button variant="outline" size="xl" className="group bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground">
                Shop Now
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="xl" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground">
                View Catalog
              </Button>
            </div>

            {/* Highlights */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-10 animate-fade-up delay-400">
              {highlights.map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-sm text-primary-foreground/70">
                  <item.icon className="w-4 h-4 text-primary-foreground" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-fade-up delay-200">
            <div className="relative aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden shadow-elevated">
              <img
                src={heroImage}
                alt="Premium aesthetic skincare products arranged elegantly"
                className="w-full h-full object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent" />
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-background rounded-2xl p-4 shadow-elevated animate-fade-up delay-500 hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-blue-light flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">MHRA Registered</p>
                  <p className="text-xs text-muted-foreground">UK Clinical Standards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
