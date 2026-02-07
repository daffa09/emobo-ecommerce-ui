"use client";

import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartItemCard } from "./_components/cart-item-card";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { fetchUserProfile } from "@/lib/api-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeItem } = useCart();
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  const handleCheckoutClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setChecking(true);
      const profile = await fetchUserProfile();
      if (!profile.name || !profile.phone || !profile.address) {
        toast.error("Profile Incomplete", {
          description: "Please complete your Name, Phone, and Address in settings before checkout.",
          action: {
            label: "Update Profile",
            onClick: () => router.push("/customer/profile")
          }
        });
        return;
      }
      router.push("/checkout");
    } catch (error) {
      // If not logged in or other error, let middleware handle or redirect to login
      router.push("/checkout");
    } finally {
      setChecking(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container-emobo py-10">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <ShoppingCart className="h-24 w-24 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Looks like you haven't added any items to your cart yet.
                </p>
                <Link href="/catalog">
                  <Button size="lg">Browse Products</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container-emobo py-10">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckoutClick}
                  disabled={checking}
                >
                  {checking ? "Checking..." : "Proceed to Checkout"}
                </Button>

                <Link href="/catalog" className="block">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
