"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Package,
  ShoppingBag,
  Loader2,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  XCircle,
  Eye,
  ArrowRight,
  User,
  LayoutDashboard
} from "lucide-react";
import { fetchUserOrders, fetchUserProfile, fetchTopSellingProducts, type Order, type Customer, type Product } from "@/lib/api-service";
import { formatIDR, getImageUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProductCard } from "../(public)/_components/product-card";

export default function CustomerDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Customer | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [ordersResponse, profileData, productsData] = await Promise.all([
          fetchUserOrders(),
          fetchUserProfile(),
          fetchTopSellingProducts(4)
        ]);

        setOrders(ordersResponse.orders);
        setProfile(profileData);
        setRecommendedProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalItems = orders.reduce((sum, order) => {
    return sum + (order.items?.reduce((itemSum, item) => itemSum + item.quantity, 0) || 0);
  }, 0);

  const getStatusCount = (status: Order["status"]) => {
    return orders.filter(order => order.status === status).length;
  };

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "PENDING": return <Clock className="h-4 w-4 text-orange-500" />;
      case "PROCESSING": return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "SHIPPED": return <Truck className="h-4 w-4 text-blue-500" />;
      case "COMPLETED": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "CANCELLED": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "COMPLETED": return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "SHIPPED": return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "PROCESSING": return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "PENDING": return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
      case "CANCELLED": return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default: return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Preparing your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Hello, {profile?.name || "Valued Customer"}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Glad to see you back. Here is a summary of your shopping activity.
          </p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none bg-linear-to-br from-primary/10 to-transparent shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Since you joined</p>
          </CardContent>
        </Card>

        <Card className="border-none bg-linear-to-br from-blue-500/10 to-transparent shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Delivery</CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatusCount("SHIPPED")}</div>
            <p className="text-xs text-muted-foreground mt-1">Orders on the way</p>
          </CardContent>
        </Card>

        <Card className="border-none bg-linear-to-br from-yellow-500/10 to-transparent shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awaiting Payment</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatusCount("PENDING")}</div>
            <p className="text-xs text-muted-foreground mt-1">Please complete your payment</p>
          </CardContent>
        </Card>

        <Card className="border-none bg-linear-to-br from-green-500/10 to-transparent shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successfully Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatusCount("COMPLETED")}</div>
            <p className="text-xs text-muted-foreground mt-1">{totalItems} item(s) received</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Transactions Table */}
        <Card className="lg:col-span-2 border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your last five orders at Emobo</CardDescription>
            </div>
            <Link href="/customer/transactions">
              <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary hover:bg-primary/5">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentOrders.length > 0 ? (
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b bg-muted/30">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Order ID</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b transition-colors hover:bg-muted/20 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle font-bold">#{order.id}</td>
                        <td className="p-4 align-middle text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </td>
                        <td className="p-4 align-middle font-semibold">
                          {formatIDR(order.totalAmount + order.shippingCost)}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant="secondary" className={`gap-1 font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle text-right">
                          <Link href={`/customer/transactions/${order.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="font-medium text-muted-foreground">No transactions yet</p>
                <Link href="/catalog" className="mt-2 text-sm text-primary hover:underline">
                  Start shopping now
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links / Profile Summary */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm overflow-hidden bg-slate-900 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg line-clamp-1">{profile?.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{profile?.email}</p>
                  <Badge className="mt-2 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
                    Customer
                  </Badge>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Registered since</span>
                  <span className="font-medium">
                    {profile ? new Date(profile.createdAt).toLocaleDateString("id-ID", { month: "long", year: "numeric" }) : "-"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total Spend</span>
                  <span className="font-medium text-primary">
                    {formatIDR(orders.filter(o => o.status === "COMPLETED").reduce((sum, o) => sum + o.totalAmount, 0))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm border-l-4 border-l-primary/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4 text-primary" />
                Quick Help
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/customer/profile?tab=address" className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors group">
                <span className="text-sm font-medium">Change Shipping Address</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
              <Link href="/customer/transactions" className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors group">
                <span className="text-sm font-medium">Track Active Orders</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Recommendations for You</h2>
          <Link href="/catalog">
            <Button variant="link" className="text-primary font-bold">View All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {recommendedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price.toString()}
              image={getImageUrl(product.images[0])}
              rating={product.rating || 0}
              reviews={product.reviewsCount || 0}
              specs={[product.brand, product.category]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

