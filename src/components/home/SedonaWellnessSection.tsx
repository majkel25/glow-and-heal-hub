import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Moon, Sparkles, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { sedonaProducts } from "@/data/sedonaProducts";

const benefits = [
  {
    icon: Zap,
    title: "Cellular Regeneration",
    description: "PEMF therapy stimulates cellular repair and regeneration at the molecular level",
  },
  {
    icon: Heart,
    title: "Pain Relief",
    description: "Clinically proven to reduce chronic pain, inflammation, and promote healing",
  },
  {
    icon: Moon,
    title: "Better Sleep",
    description: "Helps regulate circadian rhythms for deeper, more restorative sleep",
  },
  {
    icon: Sparkles,
    title: "Enhanced Recovery",
    description: "Accelerates recovery from injuries, surgery, and intense physical activity",
  },
];

export function SedonaWellnessSection() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  return (
    <section id="sedona-wellness" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Official UK Distributor
          </span>
          <h2 className="text-3xl lg:text-5xl font-semibold text-foreground mt-2">
            Sedona Wellness
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            Advanced PEMF (Pulsed Electromagnetic Field) therapy devices for professional 
            and home use. Scientifically proven technology for pain relief, better sleep, 
            and cellular regeneration.
          </p>
        </div>

        {/* What is PEMF Section */}
        <div className="bg-card rounded-3xl p-8 lg:p-12 mb-16">
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
            What is PEMF Therapy?
          </h3>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10">
            Pulsed Electromagnetic Field therapy uses electromagnetic waves to stimulate 
            and encourage your body's natural recovery process. NASA-researched technology 
            that's now available for clinical and home wellness use.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="text-center animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-2">{benefit.title}</h4>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sedonaProducts.map((product, index) => (
            <Link
              key={product.id}
              to={`/sedona/${product.id}`}
              className="group animate-fade-up"
              style={{ animationDelay: `${index * 75}ms` }}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-card mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    {product.badge}
                  </span>
                )}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent transition-opacity duration-300 flex items-end p-4",
                    hoveredProduct === product.id ? "opacity-100" : "opacity-0"
                  )}
                >
                  <p className="text-primary-foreground text-sm line-clamp-3">
                    {product.description}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  {product.category}
                </p>
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2 min-h-[40px]">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-semibold text-foreground text-lg">
                    £{product.price.toLocaleString()}
                  </span>
                  <Button variant="outline" size="sm" className="group/btn">
                    View Details
                    <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Interested in Sedona Wellness products? Contact us for pricing, demonstrations, and professional consultations.
          </p>
          <Link to="/sedona/consultation">
            <Button variant="default" size="lg" className="group">
              Request a Consultation
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
