import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { getProductBySlug, sedonaProducts } from "@/data/sedonaProducts";
import { ArrowLeft, Check, Mail, Phone, Zap, Shield, Package } from "lucide-react";
import { useState } from "react";

const SedonaProduct = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-semibold text-foreground mb-4">Product Not Found</h1>
            <Link to="/#sedona-wellness">
              <Button>Back to Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedProducts = sedonaProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 lg:px-8 mb-8">
          <Link
            to="/#sedona-wellness"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sedona Wellness
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
                  {product.category}
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

              <div className="border-t border-b border-border py-6">
                <span className="text-3xl font-bold text-foreground">
                  £{product.price.toLocaleString()}
                </span>
                <p className="text-sm text-muted-foreground mt-1">
                  Contact us for availability
                </p>
              </div>

              {/* Specifications */}
              {Object.keys(product.specs).length > 0 && (
                <div className="bg-card rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Technical Specifications
                  </h3>
                  <dl className="grid gap-3 text-sm">
                    {product.specs.frequency && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Frequency Range</dt>
                        <dd className="font-medium text-foreground">{product.specs.frequency}</dd>
                      </div>
                    )}
                    {product.specs.intensity && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Intensity</dt>
                        <dd className="font-medium text-foreground">{product.specs.intensity}</dd>
                      </div>
                    )}
                    {product.specs.programs && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Programs</dt>
                        <dd className="font-medium text-foreground">{product.specs.programs}</dd>
                      </div>
                    )}
                    {product.specs.waveforms && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Waveforms</dt>
                        <dd className="font-medium text-foreground text-right">
                          {product.specs.waveforms.join(", ")}
                        </dd>
                      </div>
                    )}
                    {product.specs.dimensions && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Dimensions</dt>
                        <dd className="font-medium text-foreground text-right max-w-[200px]">
                          {product.specs.dimensions}
                        </dd>
                      </div>
                    )}
                    {product.specs.warranty && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Warranty</dt>
                        <dd className="font-medium text-foreground">{product.specs.warranty}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/sedona/consultation" className="flex-1">
                  <Button size="lg" className="w-full group">
                    <Mail className="w-4 h-4 mr-2" />
                    Request Consultation
                  </Button>
                </Link>
                <Link to="/sedona/consultation" className="flex-1">
                  <Button size="lg" variant="outline" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Request Callback
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">Official UK Distributor</p>
                </div>
                <div className="text-center">
                  <Package className="w-6 h-6 mx-auto text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">Free UK Delivery</p>
                </div>
                <div className="text-center">
                  <Check className="w-6 h-6 mx-auto text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">Warranty Included</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">Key Features</h2>
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
              <h2 className="text-2xl font-semibold text-foreground mb-6">What's Included</h2>
              <ul className="space-y-3">
                {product.includes.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-semibold text-foreground mb-8">Related Products</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedProducts.map((related) => (
                  <Link
                    key={related.id}
                    to={`/sedona/${related.id}`}
                    className="group"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-card mb-4">
                      <img
                        src={related.image}
                        alt={related.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {related.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      £{related.price.toLocaleString()}
                    </p>
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

export default SedonaProduct;
