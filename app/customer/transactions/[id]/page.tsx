"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Package, MapPin, CreditCard, Truck } from "lucide-react";
import { fetchOrderById, type Order } from "@/lib/api-service";
import { formatIDR } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive"> = {
  COMPLETED: "default",
  SHIPPED: "secondary",
  PROCESSING: "secondary",
  PENDING: "secondary",
  CANCELLED: "destructive",
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = parseInt(params.id as string);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await fetchOrderById(orderId);
        setOrder(data);
      } catch (error) {
        console.error("Failed to load order:", error);
        toast.error("Order not found");
        router.push("/customer/transactions");
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order #{order.id}</h1>
          <p className="text-muted-foreground mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items?.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                  {item.product?.images[0] && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${item.product.images[0]}`}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{item.product?.name}</h3>
                  <p className="text-sm text-muted-foreground">SKU: {item.product?.sku}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatIDR(item.price || item.unitPrice)}</p>
                  <p className="text-sm text-muted-foreground">each</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Current Status</p>
                <Badge variant={STATUS_COLORS[order.status]} className="text-sm">
                  {order.status}
                </Badge>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-2">Payment Status</p>
                <Badge variant={order.payment?.status === "PAID" ? "default" : "secondary"}>
                  {order.payment?.status || "PENDING"}
                </Badge>
              </div>

              {order.payment?.paymentMethod && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                  <p className="text-sm font-medium">{order.payment.paymentMethod}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Service</p>
                <p className="text-sm font-medium">{order.shippingService}</p>
              </div>

              {order.trackingNumber && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                  <p className="text-sm font-mono">{order.trackingNumber}</p>
                </div>
              )}

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-1">Shipping Cost</p>
                <p className="text-sm font-medium">{formatIDR(order.shippingCost)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{order.shippingAddress?.fullName || order.shippingAddr?.fullName || '-'}</p>
              <p className="text-sm text-muted-foreground">{order.shippingAddress?.phone || order.shippingAddr?.phone || order.phone}</p>
              <p className="text-sm text-muted-foreground">{order.shippingAddress?.address || order.shippingAddr?.address || '-'}</p>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress?.city || order.shippingAddr?.city || '-'}, {order.shippingAddress?.province || order.shippingAddr?.province || '-'}
              </p>
              <p className="text-sm text-muted-foreground">{order.shippingAddress?.postalCode || order.shippingAddr?.postalCode || '-'}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatIDR(order.totalAmount - order.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>{formatIDR(order.shippingCost)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatIDR(order.totalAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
