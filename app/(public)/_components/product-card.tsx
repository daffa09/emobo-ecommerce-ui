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
  isNew?: boolean;
}

export function ProductCard({ id, name, price, image, rating, reviews, discount, specs, sku, weight, isNew }: ProductCardProps) {
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
    <Card className="group h-full flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-border/40 hover:-translate-y-1.5 bg-card/50 backdrop-blur-sm">
      <Link href={`/products/${id}`} className="block relative">
        {/* Discount Badge */}
        {discount && (
          <Badge className="absolute top-3 left-3 z-20 bg-red-500 hover:bg-red-600 border-0 text-[10px] font-black px-2 h-5 shadow-lg shadow-red-500/30 uppercase tracking-tighter">
            {discount} OFF
          </Badge>
        )}
        
        {/* SKU/Brand Mini Tag - Top Right */}
        <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <Badge variant="outline" className="bg-black/40 backdrop-blur-md text-white border-0 text-[9px] px-1.5 h-4 font-mono">
             #{id}
           </Badge>
        </div>

        <div className="relative aspect-4/3 bg-slate-900/40 overflow-hidden shrink-0">
          <Image
            src={imgSrc}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={() => setImgSrc("/no-image.svg")}
          />
          {/* subtle overlay on hover */}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </Link>

      <CardContent className="p-4 flex-1 flex flex-col space-y-3">
        {/* Brand & Category row above Title */}
        <div className="flex flex-wrap gap-1.5 items-center">
          {specs.slice(0, 2).map((spec, idx) => (
            <Badge 
              key={idx} 
              variant="outline" 
              className="text-[9px] px-2 h-4.5 border-primary/20 bg-primary/5 text-primary-foreground/70 font-black uppercase tracking-widest"
            >
              {spec}
            </Badge>
          ))}
        </div>

        <Link href={`/products/${id}`} className="flex-1">
          <h3 className="text-sm font-black line-clamp-2 leading-snug text-white hover:text-primary transition-colors decoration-primary/30 group-hover:underline underline-offset-4">
            {name}
          </h3>
        </Link>
        
        {/* Rating & Metadata Row */}
        <div className="flex items-center gap-3 py-1 border-y border-border/10">
          {rating > 0 ? (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-black text-white">{rating.toFixed(1)}</span>
              <span className="text-[10px] text-slate-500 font-bold">({reviews})</span>
            </div>
          ) : (
            <div className="h-3" /> // Maintain height even without rating
          )}
          {rating > 0 && <div className="h-3 w-px bg-border/20" />}
          {isNew && (
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">New Arrival</div>
          )}
        </div>

        <div className="pt-1 flex flex-col gap-3 mt-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-primary tracking-tighter">
              {formatIDR(Number(price))}
            </span>
          </div>
          
          <Button 
            size="sm" 
            className="w-full h-10 rounded-xl bg-primary hover:bg-primary-dark text-white font-black text-xs gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Bag
          </Button>
        </div>
      </CardContent>
    </Card>

  );
}
