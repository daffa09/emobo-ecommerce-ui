"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, ShoppingCart, Heart, Share2, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";
import { formatIDR } from "@/lib/utils";
import type { Product } from "@/lib/api-service";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      sku: product.sku,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/placeholder-laptop.jpg",
    }, quantity);

    toast.success("Added to cart!", {
      description: `${quantity} item(s) added to your cart.`,
    });
  };

  const averageRating = 4.5; // TODO: Calculate from reviews
  const reviewCount = 0; // TODO: Get from reviews

  return (
    <div className="space-y-6">
      {/* Title & Rating */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl lg:text-4xl font-bold">
            {product.name}
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
                className={`h-5 w-5 ${star <= Math.round(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                  }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
        </div>
      </div>

      <Separator />

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-primary">{formatIDR(product.price)}</span>
          <Badge variant="secondary" className="text-xs">SKU: {product.sku}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
            {product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of Stock"}
          </Badge>
          <span className="text-sm text-muted-foreground">Brand: {product.brand}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Tax included. Shipping calculated at checkout.
        </p>
      </div>

      <Separator />

      {/* Description */}
      {product.description && (
        <div className="space-y-2">
          <h3 className="font-semibold">Description:</h3>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>
      )}

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
              disabled={product.stock === 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={product.stock === 0}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            size="lg"
            className="flex-1 h-12 gap-2"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-5 w-5" />
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>
          <Button size="lg" variant="outline" className="h-12">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
