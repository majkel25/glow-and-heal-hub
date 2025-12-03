import { useState } from "react";
import { ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  rating?: number;
}

export function ProductCard({
  name,
  brand,
  price,
  originalPrice,
  image,
  badge,
  rating = 4.8,
}: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-card mb-4">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badge */}
        {badge && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
            {badge}
          </span>
        )}
        
        {/* Wishlist button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-background"
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              isLiked ? "fill-destructive text-destructive" : "text-foreground"
            )}
          />
        </button>
        
        {/* Quick add button */}
        <div
          className={cn(
            "absolute bottom-3 left-3 right-3 transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}
        >
          <Button className="w-full" variant="default" size="sm">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Info */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {brand}
        </p>
        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {name}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-semibold text-foreground">
            ${price.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < Math.floor(rating) ? "text-accent fill-accent" : "text-border fill-border"
                )}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({rating})</span>
        </div>
      </div>
    </div>
  );
}
