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
      weight: product.weight || 1500, // Default 1.5kg if missing
    }, quantity);

    toast.success("Added to cart!", {
      description: `${quantity} item(s) added to your cart.`,
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on Emobo!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
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
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
            {product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of Stock"}
          </Badge>
          <Badge variant="outline" className="text-xs border-primary text-primary">
            {product.condition || "New"}
          </Badge>
          {product.warranty && (
            <Badge variant="outline" className="text-xs">
              {product.warranty}
            </Badge>
          )}
          <span className="text-sm text-muted-foreground ml-2">Brand: {product.brand}</span>
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
          <Button size="lg" variant="outline" className="h-12" onClick={handleShare}>
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        <Button
          variant="secondary"
          size="lg"
          className="w-full h-12 gap-2 text-green-600 border-green-200 bg-green-50 hover:bg-green-100"
          onClick={() => window.open(`https://wa.me/6281234567890?text=Hello, I'm interested in ${product.name} (SKU: ${product.sku})`, '_blank')}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Consult via WhatsApp
        </Button>
      </div>
    </div>
  );
}
