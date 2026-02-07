"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard } from "./product-card";
import { Sparkles, Loader2 } from "lucide-react";
import { fetchTopSellingProducts, type Product } from "@/lib/api-service";

interface FeaturedProductsSectionProps {
  title?: React.ReactNode;
  subtitle?: string;
  showButton?: boolean;
  sortBy?: "top_selling" | "newest";
}

export function FeaturedProductsSection({
  title,
  subtitle,
  showButton = true,
  sortBy = "top_selling"
}: FeaturedProductsSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        let data: Product[] = [];

        if (sortBy === "newest") {
          const api = await import("@/lib/api-service");
          const response = await api.fetchPublicProducts({ limit: 4, sortBy: "newest" });
          data = response.products;
        } else {
          data = await fetchTopSellingProducts(4);
        }

        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [sortBy]);

  return (
    <section className="py-32">
      <div className="container-emobo">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3 h-3" /> Featured Collection
          </div>
          <h2 className="text-4xl font-bold tracking-tight">
            {title || (
              <>
                Curated <span className="text-primary italic">High-Performance</span> Selection
              </>
            )}
          </h2>
          <p className="text-muted-foreground text-lg">
            {subtitle || "Discover our handpicked premium laptops that blend power with sophisticated design."}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, i) => (
              <div key={product.id} className="animate-in fade-in slide-in-from-bottom duration-700" style={{ animationDelay: `${i * 100}ms` }}>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price.toString()}
                  image={product.images[0] || "/no-image.svg"}
                  rating={0}
                  reviews={0}
                  specs={[product.brand]}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
