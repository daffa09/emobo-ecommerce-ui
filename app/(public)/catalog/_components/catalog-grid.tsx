"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "../../_components/product-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, LayoutGrid, LayoutList, Loader2, Star, Cpu, HardDrive, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchPublicProducts, type Product } from "@/lib/api-service";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CatalogFilters } from "./catalog-filters";

export function CatalogGrid() {
  const searchParams = useSearchParams();

  // URL Params
  const brandParam = searchParams.get("brand");
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");

  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "newest">("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const itemsPerPage = 8;

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const params: any = {
          limit: itemsPerPage,
          offset: (currentPage - 1) * itemsPerPage,
        };

        if (brandParam) params.brand = brandParam;
        if (categoryParam) params.category = categoryParam;
        if (searchParam) params.search = searchParam;
        if (minPriceParam) params.minPrice = Number(minPriceParam);
        if (maxPriceParam) params.maxPrice = Number(maxPriceParam);

        if (sortBy === "price-low") params.sortBy = "price_asc";
        else if (sortBy === "price-high") params.sortBy = "price_desc";
        else if (sortBy === "newest") params.sortBy = "newest";

        const { products: data, total } = await fetchPublicProducts(params);
        setProducts(data);
        setTotalProducts(total);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Gagal memuat produk. Coba lagi nanti bos!");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [brandParam, categoryParam, searchParam, minPriceParam, maxPriceParam, sortBy, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [brandParam, categoryParam, searchParam, minPriceParam, maxPriceParam, sortBy]);

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-8">
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900/40 p-4 sm:p-5 rounded-2xl border border-border/50 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <h2 className="text-xl font-bold dark:text-white">
            {searchParam ? `Results for "${searchParam}"` : "Laptop Catalog"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-bold text-primary">{products.length}</span> of <span className="font-medium text-foreground dark:text-slate-300">{totalProducts}</span> items
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Mobile Filters Trigger */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full h-10 rounded-xl gap-2 border-border/50 hover:bg-primary/5 hover:text-primary transition-all">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] overflow-y-auto pt-10 border-l-border/50 bg-background/95 backdrop-blur-md">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-2xl font-bold">Adjust Filters</SheetTitle>
                </SheetHeader>
                <CatalogFilters />
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground whitespace-nowrap">Sort:</span>
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="flex-1 sm:w-[160px] h-10 rounded-xl bg-background border-border/50">
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

          <div className="hidden sm:block h-8 w-px bg-border/50 mx-1" />

          <div className="col-span-2 flex items-center justify-between sm:justify-start gap-1 pt-2 sm:pt-0 border-t border-border/30 sm:border-none">
            <span className="sm:hidden text-xs font-bold text-muted-foreground/70 uppercase tracking-wider">Layout Mode</span>
            <div className="flex items-center gap-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className={`h-10 w-10 rounded-xl transition-all ${viewMode === "grid" ? "shadow-lg shadow-primary/20 scale-105" : "hover:bg-primary/10"}`}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className={`h-10 w-10 rounded-xl transition-all ${viewMode === "list" ? "shadow-lg shadow-primary/20 scale-105" : "hover:bg-primary/10"}`}
                onClick={() => setViewMode("list")}
              >
                <LayoutList className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-32 space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">Hunting laptops for you...</p>
        </div>
      ) : error ? (
        <div className="text-center py-24 bg-destructive/5 rounded-3xl border border-destructive/20 max-w-2xl mx-auto">
          <p className="text-destructive font-bold text-lg mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl">Retry Load</Button>
        </div>
      ) : products.length > 0 ? (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price.toString()}
                  image={product.images[0] || "/no-image.svg"}
                  rating={4.8}
                  reviews={Math.floor(Math.random() * 50) + 10}
                  specs={[product.brand, product.category]}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white dark:bg-slate-900/50 rounded-3xl border border-border p-5 flex flex-col md:flex-row gap-8 hover:shadow-xl hover:shadow-primary/5 transition-all group overflow-hidden relative">
                  <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative">
                    <img
                      src={product.images[0] || "/no-image.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/no-image.svg";
                      }}
                    />
                    <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur-md">{product.brand}</Badge>
                  </div>

                  <div className="flex-1 flex flex-col pt-2">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link href={`/product/${product.id}`} className="text-2xl font-bold hover:text-primary transition-colors line-clamp-1">{product.name}</Link>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-bold">4.8</span>
                          </div>
                          <span className="text-sm text-muted-foreground whitespace-nowrap">24 Reviews</span>
                          <span className="text-sm font-bold text-primary">{product.category}</span>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-2xl font-black text-primary">{formatPrice(product.price)}</p>
                        <p className="text-xs text-muted-foreground mt-1">Ready Stock ({product.stock})</p>
                      </div>
                    </div>

                    <p className="text-muted-foreground line-clamp-2 my-4 text-sm leading-relaxed max-w-2xl">
                      {product.description || "The ultimate machine for professionals and creators. High performance meeting elegant design."}
                    </p>

                    <div className="mt-auto flex flex-wrap gap-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                        <Cpu className="w-4 h-4 text-primary opacity-50" /> Premium Processor
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                        <HardDrive className="w-4 h-4 text-primary opacity-50" /> High-Speed NVMe Storage
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-3 w-full md:w-48 md:pt-0 pt-6 border-t md:border-t-0 md:border-l border-border/50 md:pl-8">
                    <p className="text-2xl font-black text-primary block sm:hidden mb-2">{formatPrice(product.price)}</p>
                    <Button asChild className="w-full rounded-xl bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20">
                      <Link href={`/product/${product.id}`}>View Details</Link>
                    </Button>
                    <Button variant="outline" className="w-full rounded-xl hover:bg-primary/5 hover:text-primary transition-all">Add to Cart</Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination UI */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 pt-12">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-xl h-11 w-11 hover:border-primary hover:text-primary"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => handlePageChange(page)}
                    className={`h-11 w-11 rounded-xl transition-all font-bold ${currentPage === page
                      ? "shadow-lg shadow-primary/25 scale-110"
                      : "hover:border-primary hover:text-primary"
                      }`}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-xl h-11 w-11 hover:border-primary hover:text-primary"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="py-32 text-center bg-white dark:bg-slate-900/30 rounded-3xl border border-dashed border-border/50">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="w-10 h-10 text-primary opacity-20" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Laptops Found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Try adjusting your filters or search terms to find what you're looking for.
          </p>
          <Button
            className="mt-8 rounded-xl px-8"
            variant="outline"
            onClick={() => window.location.href = '/catalog'}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
