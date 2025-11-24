"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, ShoppingCart, Heart, Share2, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";

export function ProductInfo() {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    // This is mock data - in real app, you'd get this from props or API
    addItem({
      id: 1,
      sku: "LENOVO-X1-CARBON-11",
      name: "Lenovo ThinkPad X1 Carbon Gen 11",
      price: 1299,
      image: "/placeholder.svg",
    }, quantity);

    toast.success("Added to cart!", {
      description: `${quantity} item(s) added to your cart.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Title & Rating */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl lg:text-4xl font-bold">
            Lenovo ThinkPad X1 Carbon Gen 11
          </h1>
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-5 w-5 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <span className="text-sm font-medium">4.8</span>
          <span className="text-sm text-muted-foreground">(234 reviews)</span>
        </div>
      </div>

      <Separator />

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-primary">$1,299</span>
          <span className="text-2xl text-muted-foreground line-through">$1,732</span>
          <Badge className="bg-red-500">25% OFF</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Tax included. Shipping calculated at checkout.
        </p>
      </div>

      <Separator />

      {/* Quick Specs */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Processor:</span>
            <span className="font-medium">Intel Core i7-1355U</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">RAM:</span>
            <span className="font-medium">16GB DDR5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Storage:</span>
            <span className="font-medium">512GB SSD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Display:</span>
            <span className="font-medium">14" FHD IPS</span>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Quantity & Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="font-medium">Quantity:</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button size="lg" className="flex-1 h-12 gap-2" onClick={handleAddToCart}>
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </Button>
          <Button size="lg" variant="outline" className="h-12">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Separator />

      {/* Features */}
      <div className="space-y-2">
        <h3 className="font-semibold">Key Features:</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Carbon fiber and aluminum construction</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Up to 15 hours battery life</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Thunderbolt 4 ports</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Lightweight at 2.48 lbs</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
