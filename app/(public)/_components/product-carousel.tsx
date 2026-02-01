"use client";

import { useRef } from "react";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import type { Product } from "@/lib/api-service";

interface ProductCarouselProps {
  title: React.ReactNode;
  subtitle?: string;
  products: Product[];
  loading?: boolean;
}

export function ProductCarousel({ title, subtitle, products, loading }: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350; // Approximates card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="py-12">
      <div className="container-emobo">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              {title}
            </h3>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll("left")} className="rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll("right")} className="rounded-full">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[280px] md:min-w-[300px] snap-center">
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price.toString()}
                image={product.images[0] || "/no-image.svg"}
                rating={4.5}
                reviews={0}
                specs={[product.brand]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
