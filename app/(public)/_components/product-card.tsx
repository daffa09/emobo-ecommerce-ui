"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";
import { formatIDR, getImageUrl } from "@/lib/utils";
import { useState } from "react";
import { getCookie } from "@/lib/cookie-utils";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [imgSrc, setImgSrc] = useState(getImageUrl(image));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is authenticated
    const token = getCookie("emobo-token");
    if (!token) {
      toast.error("Please login first", {
        description: "You need to be logged in to add items to your cart.",
      });
      router.push("/login");
      return;
    }

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
    <Card className="group overflow-hidden hover:shadow-lg transition-all border-border/50">
      <Link href={`/products/${id}`}>
        <div className="relative">
          {discount && (
            <Badge className="absolute top-2 left-2 z-10 bg-red-500 text-[10px] px-1.5 h-5">
              {discount} OFF
            </Badge>
          )}
          <div className="relative aspect-4/3 bg-muted/30 overflow-hidden">
            <Image
              src={imgSrc}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgSrc("/no-image.svg")}
            />
          </div>
        </div>
      </Link>
      <CardContent className="p-3 space-y-2">
        <Link href={`/products/${id}`}>
          <h3 className="text-sm font-bold line-clamp-2 min-h-[40px] leading-tight hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between">
          {rating > 0 && (
            <div className="flex items-center gap-1 text-[11px]">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="font-bold">{rating}</span>
              <span className="text-muted-foreground">({reviews})</span>
            </div>
          )}
          <div className="flex flex-wrap gap-1">
            {specs.slice(0, 2).map((spec, idx) => (
              <Badge key={idx} variant="secondary" className="text-[10px] px-1 h-4 font-medium uppercase tracking-tighter">
                {spec}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-black text-primary">{formatIDR(Number(price))}</span>
          </div>
          <Button 
            size="sm" 
            className="w-full h-8 sm:h-9 rounded-lg text-[11px] sm:text-xs gap-2 font-bold shadow-sm shadow-primary/10" 
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
