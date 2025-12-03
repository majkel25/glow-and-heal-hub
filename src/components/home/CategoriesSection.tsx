import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Skincare",
    description: "Serums, moisturizers & treatments",
    count: "48 products",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop&q=80",
  },
  {
    name: "Medical Devices",
    description: "Professional-grade tools",
    count: "24 products",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=500&fit=crop&q=80",
  },
  {
    name: "Injectables",
    description: "Fillers & neurotoxins supplies",
    count: "16 products",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=500&fit=crop&q=80",
  },
  {
    name: "Professional",
    description: "Clinic & spa essentials",
    count: "32 products",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=500&fit=crop&q=80",
  },
];

export function CategoriesSection() {
  return (
    <section id="categories" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Categories
          </span>
          <h2 className="text-3xl lg:text-4xl font-semibold text-foreground mt-2">
            Shop by Category
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Explore our curated collections of medical-grade aesthetic products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <a
              key={category.name}
              href="#"
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-xs font-medium text-primary-foreground/70 uppercase tracking-wider">
                  {category.count}
                </span>
                <h3 className="text-xl font-semibold text-primary-foreground mt-1">
                  {category.name}
                </h3>
                <p className="text-sm text-primary-foreground/80 mt-1">
                  {category.description}
                </p>
                
                <div className="flex items-center gap-2 mt-4 text-primary-foreground text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
