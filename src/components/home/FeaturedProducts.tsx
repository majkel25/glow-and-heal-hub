import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const products = [
  {
    name: "CALM",
    brand: "F+NCTION",
    price: 143.00,
    image: "https://fnction.co/cdn/shop/files/New_Web_Images_EH-02.png?v=1752285638&width=800",
    badge: "Bestseller",
    description: "Rest & Recovery Drink with Marine Collagen - 780g Salted Chocolate",
  },
  {
    name: "CALM Starter Pack",
    brand: "F+NCTION",
    price: 176.00,
    image: "https://fnction.co/cdn/shop/files/Fnction_Web_flow_DEV_EH-03_45f2cbde-1cec-41d0-a0c3-91f90448737d.jpg?v=1752683233&width=800",
    badge: "Value Pack",
    description: "Complete starter bundle with CALM and accessories",
  },
  {
    name: "FOCUS (4PK)",
    brand: "F+NCTION",
    price: 20.00,
    image: "https://fnction.co/cdn/shop/files/Fnction_RTD_DEV_EHxTR-06.png?v=1753116501&width=800",
    badge: "Coming Soon",
    description: "Ready-to-drink focus formula - 4 pack",
  },
];

export function FeaturedProducts() {
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
          {products.map((product, index) => (
            <div
              key={product.name}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
