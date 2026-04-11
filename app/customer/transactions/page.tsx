"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, Eye, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchUserOrders, type Order } from "@/lib/api-service";
import { formatIDR } from "@/lib/utils";

const LIMIT = 10;

export default function CustomerTransactionsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (search !== debouncedSearch) {
        setDebouncedSearch(search);
        setPage(1);
        setOrders([]);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [search, debouncedSearch]);

  // Load orders
  const loadOrders = useCallback(async () => {
    try {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      const data = await fetchUserOrders({
        search: debouncedSearch,
        limit: LIMIT,
        offset: (page - 1) * LIMIT
      });
      
      if (page === 1) {
        setOrders(data.orders);
      } else {
        setOrders(prev => {
          // avoid duplicates just in case
          const newOrders = data.orders.filter(o => !prev.find(p => p.id === o.id));
          return [...prev, ...newOrders];
        });
      }
      setTotal(data.total);
      setHasMore(data.orders.length === LIMIT && data.total > page * LIMIT);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Infinite Scroll logic
  useEffect(() => {
    if (!isMobile) return;
    
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          setPage(p => p + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, isMobile]);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "COMPLETED": return "bg-green-500";
      case "SHIPPED": return "bg-blue-500";
      case "PROCESSING": return "bg-yellow-500";
      case "CANCELLED": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getOrderTitle = (order: Order) => {
    if (!order.items || order.items.length === 0) return `Order #${order.id}`;
    const firstItem = order.items[0].product?.name || "Product";
    
    if (order.items.length === 1) {
      return firstItem;
    } else if (order.items.length === 2) {
      const secondItem = order.items[1].product?.name || "Product";
      return `${firstItem} & ${secondItem}`;
    } else {
      return `${firstItem} and ${order.items.length - 1} others`;
    }
  };

  const getCardHref = (order: Order) => {
    return `/customer/transactions/${order.id}`;
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">My Transactions</h1>
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by product name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading && page === 1 ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-24 w-24 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No orders found</h2>
            <p className="text-muted-foreground mb-6">
              {debouncedSearch ? "We couldn't find any orders matching your search." : "You haven't placed any orders yet. Start shopping to see your transactions here."}
            </p>
            {!debouncedSearch && (
              <Link href="/catalog">
                <Button size="lg">Browse Products</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={getCardHref(order)} className="block group">
              <Card className="transition-all hover:border-primary/50 hover:shadow-md cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="pr-4">
                      <CardTitle className="text-lg line-clamp-1 wrap-break-word leading-tight group-hover:text-primary transition-colors">
                        {getOrderTitle(order)}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">Order #{order.id}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-xl font-bold">
                        {formatIDR(order.totalAmount + order.shippingCost)}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end justify-end space-y-1">
                      {order.shippingService && (
                        <p className="text-xs text-muted-foreground">
                          {order.shippingService.toUpperCase()}
                        </p>
                      )}
                      
                      <div className="flex items-center text-primary text-sm font-medium mt-2 gap-1 group-hover:underline">
                        View Details <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Infinite Scroll Target (Mobile Only) */}
          {isMobile && hasMore && (
            <div ref={observerTarget} className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {/* Pagination (Desktop Only) */}
          {!isMobile && total > LIMIT && (
            <div className="flex items-center justify-center space-x-2 pt-6 pb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1 || loadingMore}
              >
                Previous
              </Button>
              <div className="text-sm font-medium text-muted-foreground px-4">
                Page {page} of {Math.ceil(total / LIMIT)}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={!hasMore || loadingMore}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
