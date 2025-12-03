import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, ShoppingBag, Lock, Truck, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const checkoutSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  address: z.string().trim().min(1, "Address is required").max(200),
  city: z.string().trim().min(1, "City is required").max(100),
  postcode: z.string().trim().min(1, "Postcode is required").max(20),
  phone: z.string().trim().min(1, "Phone is required").max(20),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});
  const [form, setForm] = useState<CheckoutForm>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postcode: "",
    phone: "",
  });

  const shippingCost = totalPrice >= 50 ? 0 : 4.99;
  const orderTotal = totalPrice + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CheckoutForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CheckoutForm, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof CheckoutForm] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    clearCart();
    toast({
      title: "Order placed successfully!",
      description: "You will receive a confirmation email shortly.",
    });
    navigate("/order-confirmation");
    setIsProcessing(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-20">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-foreground mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some products before checking out.</p>
            <Link to="/#products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumb */}
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>

          <h1 className="text-3xl font-semibold text-foreground mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Checkout Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Contact</h2>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Shipping */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Shipping Address</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        className={errors.firstName ? "border-destructive" : ""}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        className={errors.lastName ? "border-destructive" : ""}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-destructive mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="123 Main Street"
                      className={errors.address ? "border-destructive" : ""}
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive mt-1">{errors.address}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className={errors.city ? "border-destructive" : ""}
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive mt-1">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="postcode">Postcode</Label>
                      <Input
                        id="postcode"
                        name="postcode"
                        value={form.postcode}
                        onChange={handleChange}
                        className={errors.postcode ? "border-destructive" : ""}
                      />
                      {errors.postcode && (
                        <p className="text-sm text-destructive mt-1">{errors.postcode}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+44 7XXX XXXXXX"
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Payment placeholder */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Payment</h2>
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <CreditCard className="w-5 h-5" />
                      <span className="text-sm">Payment processing will be available soon. Orders are currently for demo purposes.</span>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Place Order • £{orderTotal.toFixed(2)}
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-card rounded-2xl p-6 border border-border sticky top-24">
                <h2 className="text-lg font-semibold text-foreground mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">{item.brand}</p>
                      </div>
                      <span className="font-medium text-foreground">
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">£{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      Shipping
                    </span>
                    <span className="text-foreground">
                      {shippingCost === 0 ? "Free" : `£${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  {shippingCost > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Free shipping on orders over £50
                    </p>
                  )}
                  <div className="flex justify-between text-lg font-semibold pt-3 border-t border-border">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">£{orderTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Lock className="w-4 h-4" />
                      Secure checkout
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      Fast delivery
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
