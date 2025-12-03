import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { getFnctionProductBySlug, fnctionProducts } from "@/data/fnctionProducts";
import { ArrowLeft, Check, ShoppingBag, Leaf, Shield, Truck } from "lucide-react";
import { useState } from "react";

const FnctionProduct = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getFnctionProductBySlug(slug || "");
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-semibold text-foreground mb-4">Product Not Found</h1>
            <Link to="/#products">
              <Button>Back to Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedProducts = fnctionProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 lg:px-8 mb-8">
          <Link
            to="/#products"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to F+NCTION Products
          </Link>
        </div>

        {/* Product Section */}
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-card">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent hover:border-border"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                  {product.brand} • {product.category}
                </span>
                <h1 className="text-3xl lg:text-4xl font-semibold text-foreground mt-2">
                  {product.name}
                </h1>
                {product.badge && (
                  <span className="inline-block mt-3 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.fullDescription}
              </p>

              {/* Product Details */}
              <div className="flex flex-wrap gap-4 text-sm">
                {product.flavor && (
                  <div className="bg-card rounded-lg px-4 py-2">
                    <span className="text-muted-foreground">Flavour: </span>
                    <span className="font-medium text-foreground">{product.flavor}</span>
                  </div>
                )}
                {product.packSize && (
                  <div className="bg-card rounded-lg px-4 py-2">
                    <span className="text-muted-foreground">Pack Size: </span>
                    <span className="font-medium text-foreground">{product.packSize}</span>
                  </div>
                )}
              </div>

              {/* Nutritional Claims */}
              {product.nutritionalClaims && (
                <div className="flex flex-wrap gap-2">
                  {product.nutritionalClaims.map((claim) => (
                    <span
                      key={claim}
                      className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full"
                    >
                      {claim}
                    </span>
                  ))}
                </div>
              )}

              <div className="border-t border-b border-border py-6">
                <span className="text-3xl font-bold text-foreground">
                  £{product.price.toFixed(2)}
                </span>
                <p className="text-sm text-muted-foreground mt-1">
                  30 day money-back guarantee
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1 group" disabled={product.badge === "Coming Soon"}>
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  {product.badge === "Coming Soon" ? "Coming Soon" : "Add to Cart"}
                </Button>
                <Button size="lg" variant="outline" className="flex-1">
                  Buy Now
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">30 Day Guarantee</p>
                </div>
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">Free UK Shipping 2+</p>
                </div>
                <div className="text-center">
                  <Leaf className="w-6 h-6 mx-auto text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">Natural Ingredients</p>
                </div>
              </div>
            </div>
          </div>

          {/* What's Included (for Starter Pack) */}
          {product.includes && (
            <div className="mt-16">
              <h2 className="text-2xl font-semibold text-foreground mb-6">What's Inside</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.includes.map((item, index) => (
                  <div key={index} className="bg-card rounded-xl p-4 flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features & Ingredients Section */}
          <div className="mt-16 grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">Key Benefits</h2>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">Key Ingredients</h2>
              <div className="bg-card rounded-xl p-6">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {product.ingredients.slice(0, 10).map((ingredient, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-muted-foreground">{ingredient.name}</span>
                      <span className="font-medium text-foreground">{ingredient.amount}</span>
                    </div>
                  ))}
                </div>
                {product.ingredients.length > 10 && (
                  <p className="text-xs text-muted-foreground mt-4">
                    + {product.ingredients.length - 10} more ingredients
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Nutritional Information */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Nutritional Information</h2>
            <div className="bg-card rounded-xl p-6 max-w-md">
              <p className="text-sm text-muted-foreground mb-4">
                Per {product.nutritionalInfo.servingSize} serving
              </p>
              <dl className="grid gap-2 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <dt className="text-muted-foreground">Energy</dt>
                  <dd className="font-medium text-foreground">{product.nutritionalInfo.energy}</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <dt className="text-muted-foreground">Fat</dt>
                  <dd className="font-medium text-foreground">{product.nutritionalInfo.fat}</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-border pl-4">
                  <dt className="text-muted-foreground">of which saturates</dt>
                  <dd className="font-medium text-foreground">{product.nutritionalInfo.saturates}</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <dt className="text-muted-foreground">Carbohydrates</dt>
                  <dd className="font-medium text-foreground">{product.nutritionalInfo.carbohydrates}</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-border pl-4">
                  <dt className="text-muted-foreground">of which sugars</dt>
                  <dd className="font-medium text-foreground">{product.nutritionalInfo.sugars}</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <dt className="text-muted-foreground">Fibre</dt>
                  <dd className="font-medium text-foreground">{product.nutritionalInfo.fiber}</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <dt className="text-muted-foreground">Protein</dt>
                  <dd className="font-medium text-foreground">{product.nutritionalInfo.protein}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-muted-foreground">Salt</dt>
                  <dd className="font-medium text-foreground">{product.nutritionalInfo.salt}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-semibold text-foreground mb-8">You May Also Like</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedProducts.map((related) => (
                  <Link
                    key={related.id}
                    to={`/fnction/${related.id}`}
                    className="group flex gap-6 bg-card rounded-xl p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="w-32 h-32 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={related.image}
                        alt={related.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        {related.brand}
                      </span>
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors mt-1">
                        {related.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {related.description}
                      </p>
                      <span className="font-semibold text-foreground mt-2">
                        £{related.price.toFixed(2)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FnctionProduct;
