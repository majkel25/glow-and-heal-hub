import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, ShoppingBag } from "lucide-react";
import { fnctionProducts } from "@/data/fnctionProducts";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function FeaturedProducts() {
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <section id="products" className="py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Official Distributor
            </span>
            <h2 className="text-3xl lg:text-4xl font-semibold text-foreground mt-2">
              F+NCTION Products
            </h2>
            <p className="text-muted-foreground mt-2">
              Premium rest, recovery & focus supplements with marine collagen
            </p>
          </div>
          <Button variant="outline" className="group shrink-0">
            View All Products
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {fnctionProducts.map((product, index) => (
            <Link
              key={product.id}
              to={`/fnction/${product.id}`}
              className="group animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Image container */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-background mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    {product.badge}
                  </span>
                )}
                
                {/* Wishlist button */}
                <button
                  onClick={(e) => toggleLike(product.id, e)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-background"
                >
                  <Heart
                    className={cn(
                      "w-4 h-4 transition-colors",
                      likedProducts.includes(product.id) ? "fill-destructive text-destructive" : "text-foreground"
                    )}
                  />
                </button>
                
                {/* Quick add button */}
                <div
                  className={cn(
                    "absolute bottom-3 left-3 right-3 transition-all duration-300",
                    hoveredProduct === product.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  )}
                >
                  <Button className="w-full" variant="default" size="sm">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>

              {/* Info */}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  {product.brand}
                </p>
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-semibold text-foreground">
                    £{product.price.toFixed(2)}
                  </span>
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={cn(
                          "w-3 h-3",
                          i < 5 ? "text-accent fill-accent" : "text-border fill-border"
                        )}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">(4.9)</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
