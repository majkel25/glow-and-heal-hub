import { Shield, Award, Truck, RotateCcw, HeartHandshake, Microscope } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Authentic Products",
    description: "100% genuine products sourced directly from manufacturers",
  },
  {
    icon: Microscope,
    title: "Clinically Proven",
    description: "Backed by scientific research and clinical trials",
  },
  {
    icon: Award,
    title: "MHRA Registered",
    description: "Medical-grade formulations meeting UK regulatory standards",
  },
  {
    icon: Truck,
    title: "Express Shipping",
    description: "Free shipping on orders over £50 with 2-day delivery",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day hassle-free return policy for your peace of mind",
  },
  {
    icon: HeartHandshake,
    title: "Expert Support",
    description: "Licensed aestheticians available for consultations",
  },
];

export function TrustSection() {
  return (
    <section className="py-20 lg:py-28 bg-slate-blue-light">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="text-3xl lg:text-4xl font-semibold text-foreground mt-2">
            Trusted by Professionals
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            We're committed to providing the highest quality medical aesthetic products 
            with exceptional service
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-background rounded-2xl p-6 lg:p-8 shadow-soft hover:shadow-elevated transition-shadow duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-slate-blue-light flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
