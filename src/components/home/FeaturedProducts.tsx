import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const products = [
  {
    name: "Hyaluronic Acid Serum 2%",
    brand: "SkinMedica",
    price: 89.99,
    originalPrice: 110.00,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&q=80",
    badge: "Bestseller",
  },
  {
    name: "Retinol 0.5% Night Cream",
    brand: "Obagi",
    price: 125.00,
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Vitamin C Brightening Complex",
    brand: "SkinCeuticals",
    price: 166.00,
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop&q=80",
    badge: "New",
  },
  {
    name: "Peptide Firming Moisturizer",
    brand: "Revision",
    price: 145.00,
    originalPrice: 175.00,
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Niacinamide 10% + Zinc",
    brand: "ZO Skin Health",
    price: 78.00,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Glycolic Acid Peel 30%",
    brand: "PCA Skin",
    price: 95.00,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&q=80",
    badge: "Pro",
  },
  {
    name: "LED Light Therapy Device",
    brand: "Dr. Dennis Gross",
    price: 435.00,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Microneedling Pen System",
    brand: "SkinPen",
    price: 299.00,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop&q=80",
    badge: "Professional",
  },
];

export function FeaturedProducts() {
  return (
    <section id="products" className="py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Featured
            </span>
            <h2 className="text-3xl lg:text-4xl font-semibold text-foreground mt-2">
              Best Sellers
            </h2>
            <p className="text-muted-foreground mt-2">
              Our most-loved products by skincare professionals
            </p>
          </div>
          <Button variant="outline" className="group shrink-0">
            View All Products
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product, index) => (
            <div
              key={product.name}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
