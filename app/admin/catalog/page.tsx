"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Edit, Trash2, Plus, LayoutGrid, LayoutList, PackageCheck, PackageX } from "lucide-react";
import { fetchAdminProducts, deleteProduct, type Product } from "@/lib/api-service";
import { formatIDR, cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobile, setIsMobile] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 12;

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Force grid view on mobile
  useEffect(() => {
    if (isMobile) {
      setViewMode("grid");
    }
  }, [isMobile]);

  const getImageUrl = (url?: string) => {
    if (!url) return "/no-image.svg";
    if (url.startsWith("http")) return url;
    return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}${url}`;
  };

  useEffect(() => {
    loadProducts(1, false);
  }, []);

  // Trigger load more on mobile infinite scroll
  useEffect(() => {
    if (inView && hasMore && isMobile && !loading && !loadingMore) {
      loadProducts(page + 1, true);
    }
  }, [inView, hasMore, isMobile, loading, loadingMore, page]);

  // Handle Search with debounce or direct reset
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadProducts(1, false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  async function loadProducts(targetPage: number, append: boolean = false) {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const offset = (targetPage - 1) * LIMIT;
      const response = await fetchAdminProducts({
        search: searchQuery,
        limit: LIMIT,
        offset: offset,
      });

      if (append) {
        setProducts((prev) => [...prev, ...response.products]);
      } else {
        setProducts(response.products);
      }

      setTotalProducts(response.total);
      setPage(targetPage);
      setHasMore(offset + response.products.length < response.total);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  async function handleDelete(product: Product) {
    setProductToDelete(product);
  }

  async function confirmDelete() {
    if (!productToDelete) return;

    try {
      setDeleting(productToDelete.id);
      await deleteProduct(productToDelete.id);
      toast.success("Product deleted successfully");
      loadProducts(page, false);
    } catch (error: any) {
      console.error("Failed to delete product:", error);
      toast.error(error.message || "Failed to delete product");
    } finally {
      setDeleting(null);
      setProductToDelete(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">Manage Products</h1>
        <Link href="/admin/catalog/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-zinc-900/50 p-4 sm:p-5 rounded-2xl border border-zinc-800/50 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">
            {searchQuery ? `Results for "${searchQuery}"` : "Our Products"}
          </h2>
          <p className="text-sm text-zinc-400">
            Total <span className="font-bold text-primary">{totalProducts}</span> items
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by SKU, Name, or Brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-zinc-800/50 border-zinc-700 h-10 rounded-xl"
            />
          </div>

          <div className="hidden sm:block h-8 w-px bg-zinc-800 mx-1" />

          {/* Layout Toggle - Hidden on Mobile */}
          <div className="hidden sm:flex items-center gap-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className={`h-10 w-10 rounded-xl transition-all ${viewMode === "grid" ? "shadow-lg shadow-primary/20 scale-105" : "hover:bg-primary/10 text-zinc-400"}`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className={`h-10 w-10 rounded-xl transition-all ${viewMode === "list" ? "shadow-lg shadow-primary/20 scale-105" : "hover:bg-primary/10 text-zinc-400"}`}
              onClick={() => setViewMode("list")}
            >
              <LayoutList className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-32 space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-zinc-400 font-medium animate-pulse">Loading products data...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800/50">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-primary opacity-20" />
          </div>
          <p className="text-zinc-400">
            {searchQuery ? "No products found matching your search." : "No products yet."}
          </p>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
              {products.map((product) => (
                <Card key={product.id} className="group overflow-hidden bg-zinc-900/50 border-zinc-800 hover:shadow-xl hover:border-zinc-700 transition-all flex flex-col">
                  <div className="relative aspect-16/11 bg-zinc-800/50 overflow-hidden">
                    <img
                      src={getImageUrl(product.images?.[0])}
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/no-image.svg";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-zinc-900/90 backdrop-blur-md text-white border-zinc-700">
                      {product.brand}
                    </Badge>
                  </div>
                  <CardContent className="p-3 sm:p-4 flex flex-col flex-1 space-y-2.5">
                    <div className="flex items-start justify-between gap-1.5">
                      <h3 className="font-semibold text-white line-clamp-2 min-h-[36px] leading-tight text-xs sm:text-sm">
                        {product.name}
                      </h3>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                      <Badge variant="outline" className="text-[9px] sm:text-[10px] bg-zinc-800/50 border-zinc-700 text-zinc-300 font-mono">
                         {product.sku}
                      </Badge>
                      <Badge 
                        className="text-[9px] sm:text-[10px]"
                        variant={
                            product.stock > 10
                              ? "default"
                              : product.stock > 0
                                ? "secondary"
                                : "destructive"
                          }
                      >
                         {product.stock > 0 ? `${product.stock} Stock` : "Empty"}
                      </Badge>
                    </div>

                    <div className="mt-auto pt-1 sm:pt-2">
                      <span className="text-sm sm:text-base font-bold text-primary block mb-1.5 sm:mb-2">{formatIDR(product.price)}</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        <Link href={`/admin/catalog/${product.id}`} className="w-full">
                          <Button variant="outline" size="sm" className="w-full h-7 sm:h-8 rounded-lg border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-100 text-[10px] sm:text-xs">
                            <Edit className="h-3 w-3 mr-1 sm:mr-1.5" />
                             Edit
                          </Button>
                        </Link>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="w-full h-7 sm:h-8 rounded-lg text-[10px] sm:text-xs"
                          onClick={() => handleDelete(product)}
                          disabled={deleting === product.id}
                        >
                          {deleting === product.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3 mr-1 sm:mr-1.5" />
                          )}
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="bg-zinc-900/50 rounded-3xl border border-zinc-800 p-5 flex flex-col md:flex-row gap-6 hover:shadow-xl hover:border-zinc-700 transition-all group overflow-hidden">
                  <div className="w-full md:w-48 h-40 rounded-2xl overflow-hidden bg-zinc-800/50 shrink-0 relative">
                    <img
                      src={getImageUrl(product.images?.[0])}
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/no-image.svg";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 left-3 bg-zinc-900/90 backdrop-blur-md text-white border-zinc-700">
                      {product.brand}
                    </Badge>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                           <Badge variant="outline" className="bg-zinc-800 border-zinc-700 text-zinc-300 font-mono">
                             ID: {product.id}
                           </Badge>
                           <Badge variant="outline" className="bg-zinc-800 border-zinc-700 text-zinc-300 font-mono">
                             SKU: {product.sku}
                           </Badge>
                           <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 pointer-events-none">
                             {product.category}
                           </Badge>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-2xl font-black text-primary">{formatIDR(product.price)}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          {product.stock > 0 ? (
                            <>
                              <PackageCheck className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-green-500 font-medium">{product.stock} in stock</span>
                            </>
                          ) : (
                            <>
                              <PackageX className="w-4 h-4 text-red-500" />
                              <span className="text-sm text-red-500 font-medium">Out of stock</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-800/50">
                       <p className="text-2xl font-black text-primary block sm:hidden mb-2">{formatIDR(product.price)}</p>
                       <Link href={`/admin/catalog/${product.id}`}>
                         <Button variant="outline" className="w-full sm:w-auto rounded-xl border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-100 transition-all">
                           <Edit className="h-4 w-4 mr-2" />
                           Edit Details
                         </Button>
                       </Link>
                       <Button 
                         variant="destructive" 
                         className="w-full sm:w-auto rounded-xl"
                         onClick={() => handleDelete(product)}
                         disabled={deleting === product.id}
                       >
                         {deleting === product.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                          )}
                         Delete Product
                       </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Desktop Pagination */}
          {!isMobile && totalProducts > LIMIT && (
            <div className="flex items-center justify-center gap-2 py-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadProducts(page - 1)}
                disabled={page === 1 || loading}
                className="bg-zinc-900 border-zinc-800 text-white"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.ceil(totalProducts / LIMIT) }, (_, i) => i + 1).map((p) => {
                  // Show limited page numbers if too many
                  const totalPages = Math.ceil(totalProducts / LIMIT);
                  if (
                    p === 1 ||
                    p === totalPages ||
                    (p >= page - 1 && p <= page + 1)
                  ) {
                    return (
                      <Button
                        key={p}
                        variant={p === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => loadProducts(p)}
                        disabled={loading}
                        className={cn(
                          "w-9 h-9 p-0",
                          p === page ? "bg-primary text-black" : "bg-zinc-900 border-zinc-800 text-white"
                        )}
                      >
                        {p}
                      </Button>
                    );
                  } else if (p === page - 2 || p === page + 2) {
                    return <span key={p} className="text-zinc-600 px-1">...</span>;
                  }
                  return null;
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadProducts(page + 1)}
                disabled={!hasMore || loading}
                className="bg-zinc-900 border-zinc-800 text-white"
              >
                Next
              </Button>
            </div>
          )}

          {/* Mobile Loading Sentinel */}
          {isMobile && (
            <div ref={ref} className="py-10 flex justify-center">
              {loadingMore && (
                <div className="flex items-center gap-3 text-zinc-500">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-sm font-bold">LOADING MORE...</span>
                </div>
              )}
              {!hasMore && products.length > 0 && (
                <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">End of Catalog</p>
              )}
            </div>
          )}
        </>
      )}

      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Products with transaction history or stock will be archived (soft delete). Products without transactions and empty stock will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white border-none"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
