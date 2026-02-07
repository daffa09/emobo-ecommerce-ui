"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";
import { formatIDR } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  rating: number;
  reviews: number;
  discount?: string;
  specs: string[];
  sku?: string;
  weight?: number;
}

export function ProductCard({ id, name, price, image, rating, reviews, discount, specs, sku, weight }: ProductCardProps) {
  const { addItem } = useCart();

  const [imgSrc, setImgSrc] = useState(image || "/no-image.svg");

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Parse price string (e.g., "Rp 1.500.000" to 1500000)
    const numericPrice = parseInt(price.replace(/\D/g, ""));

    addItem({
      id,
      sku: sku || `SKU-${id}`,
      name,
      price: numericPrice,
      image: imgSrc,
      weight: weight || 1500,
    });

    toast.success("Added to cart!", {
      description: `${name} has been added to your cart.`,
    });
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all">
      <Link href={`/products/${id}`}>
        <div className="relative">
          {discount && (
            <Badge className="absolute top-3 right-3 z-10 bg-red-500">
              {discount} OFF
            </Badge>
          )}
          <div className="relative aspect-square bg-muted/50 overflow-hidden">
            <Image
              src={imgSrc}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              onError={() => setImgSrc("/no-image.svg")}
            />
          </div>
        </div>
      </Link>
      <CardContent className="p-4 space-y-3">
        <Link href={`/products/${id}`}>
          <h3 className="font-semibold line-clamp-2 min-h-[48px] hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        {rating > 0 && (
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}</span>
            <span className="text-muted-foreground">({reviews})</span>
          </div>
        )}
        <div className="flex flex-wrap gap-1">
          {specs.map((spec, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {spec}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2 gap-2">
          <span className="text-md font-bold text-primary">{formatIDR(Number(price))}</span>
          <Button size="sm" className="rounded-sm" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
