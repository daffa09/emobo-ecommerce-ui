"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "../../_components/product-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayoutGrid, LayoutList, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchPublicProducts, type Product } from "@/lib/api-service";

export function CatalogGrid() {
  const searchParams = useSearchParams();
  const brandFilter = searchParams.get("brand");
  const categoryFilter = searchParams.get("category");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "newest">("featured");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const params: any = {};

        if (brandFilter) {
          params.brand = brandFilter;
        }

        // Map sort selection to API format
        if (sortBy === "price-low") params.sortBy = "price_asc";
        else if (sortBy === "price-high") params.sortBy = "price_desc";
        else if (sortBy === "newest") params.sortBy = "newest";

        const data = await fetchPublicProducts(params);
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [brandFilter, categoryFilter, sortBy]);

  // Client-side sorting if needed
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">
            {brandFilter
              ? `${brandFilter.charAt(0).toUpperCase() + brandFilter.slice(1)} Laptops`
              : categoryFilter
                ? `${categoryFilter} Category`
                : "All Products"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{sortedProducts.length}</span> products
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-destructive">{error}</p>
        </div>
      ) : sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price.toString()}
              image={product.images[0] || "/placeholder-laptop.jpg"}
              rating={4.5}
              reviews={0}
              specs={[product.brand]}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">
            No laptops found{brandFilter && ` for "${brandFilter}"`}.
          </p>
        </div>
      )}

      {/* Pagination could go here */}
    </div>
  );
}

