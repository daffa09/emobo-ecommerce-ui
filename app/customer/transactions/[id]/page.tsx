"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Truck, Package, MapPin, CreditCard, ArrowLeft, Loader2 } from "lucide-react";
import { fetchOrderById, type Order } from "@/lib/api-service";
import { formatIDR, cn } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  SHIPPED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  PROCESSING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  PENDING: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
};

const ORDER_STEPS = [
  { status: "PENDING", label: "Order Placed", description: "Waiting for payment" },
  { status: "PROCESSING", label: "Processing", description: "Preparing your order" },
  { status: "SHIPPED", label: "Shipped", description: "On the way to you" },
  { status: "COMPLETED", label: "Delivered", description: "Order received" },
];

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
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) return null;

  const currentStepIndex = ORDER_STEPS.findIndex(step => step.status === order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-400"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Order #{order.id}</h1>
            <p className="text-slate-400 text-sm font-medium">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn("px-4 py-1 text-sm font-bold uppercase tracking-wider rounded-full border", STATUS_COLORS[order.status])}
        >
          {order.status}
        </Badge>
      </div>

      {/* Visual Status Tracker */}
      {!isCancelled && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="pt-10 pb-12 px-6 md:px-12">
            <div className="relative">
              {/* Connection Lines */}
              <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-800 z-0" />
              <div
                className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-1000 z-0"
                style={{ width: `${(currentStepIndex / (ORDER_STEPS.length - 1)) * 100}%` }}
              />

              {/* Steps */}
              <div className="flex justify-between relative z-10">
                {ORDER_STEPS.map((step, idx) => {
                  const isCompleted = idx < currentStepIndex || order.status === "COMPLETED";
                  const isCurrent = idx === currentStepIndex && order.status !== "COMPLETED";

                  return (
                    <div key={step.status} className="flex flex-col items-center text-center max-w-[120px]">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500",
                        isCompleted ? "bg-primary border-primary text-white" :
                          isCurrent ? "bg-slate-900 border-primary text-primary animate-pulse" :
                            "bg-slate-900 border-slate-800 text-slate-600"
                      )}>
                        {isCompleted ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-xs font-bold">{idx + 1}</span>
                        )}
                      </div>
                      <div className="mt-4">
                        <p className={cn("text-xs font-black uppercase tracking-tighter", isCompleted || isCurrent ? "text-white" : "text-slate-600")}>
                          {step.label}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium mt-1 leading-tight hidden md:block">
                          {isCurrent ? step.description : isCompleted ? (idx === 3 ? "Delivered safe" : "Done") : "Next step"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column: Items */}
        <Card className="md:col-span-2 bg-slate-900/30 border-slate-800">
          <CardHeader className="border-b border-slate-800/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-white uppercase tracking-widest">
              <Package className="h-5 w-5 text-primary" />
              Order Items
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-800">
              {order.items?.map((item) => (
                <div key={item.id} className="flex gap-6 p-6 hover:bg-slate-800/20 transition-colors">
                  <div className="h-24 w-24 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                    {item.product?.images[0] && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${item.product.images[0]}`}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-bold text-white text-lg leading-tight truncate">{item.product?.name}</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">SKU: {item.product?.sku}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <p className="text-sm font-black text-primary">{formatIDR(item.price || item.unitPrice)}</p>
                      <span className="h-1 w-1 rounded-full bg-slate-700" />
                      <p className="text-xs text-slate-400 font-bold">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-center">
                    <p className="font-black text-white">{formatIDR((item.price || item.unitPrice) * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-6 bg-slate-900/50 border-t border-slate-800 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-medium">Subtotal</span>
              <span className="text-white font-bold">{formatIDR(order.totalAmount - order.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-medium">Shipping Cost</span>
              <span className="text-white font-bold">{formatIDR(order.shippingCost)}</span>
            </div>
            <Separator className="bg-slate-800" />
            <div className="flex justify-between items-center pt-2">
              <span className="text-white font-black uppercase tracking-tighter">Grand Total</span>
              <span className="text-2xl font-black text-primary">{formatIDR(order.totalAmount)}</span>
            </div>
          </div>
        </Card>

        {/* Right Column: Info */}
        <div className="space-y-6">
          {/* Payment Card */}
          <Card className="bg-slate-900/30 border-slate-800 overflow-hidden">
            <CardHeader className="bg-slate-800/30 py-4 border-b border-slate-700/50">
              <CardTitle className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-widest">
                <CreditCard className="h-4 w-4 text-primary" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-slate-500 uppercase">Status</p>
                <Badge
                  variant="outline"
                  className={order.payment?.status === "PAID" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"}
                >
                  {order.payment?.status || "PENDING"}
                </Badge>
              </div>
              {order.payment?.paymentMethod && (
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-slate-500 uppercase">Method</p>
                  <p className="text-sm font-bold text-white">{order.payment.paymentMethod}</p>
                </div>
              )}
              {order.payment?.paidAt && (
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-slate-500 uppercase">Paid At</p>
                  <p className="text-xs font-medium text-slate-300">
                    {new Date(order.payment.paidAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Card */}
          <Card className="bg-slate-900/30 border-slate-800 overflow-hidden">
            <CardHeader className="bg-slate-800/30 py-4 border-b border-slate-700/50">
              <CardTitle className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-widest">
                <Truck className="h-4 w-4 text-primary" />
                Shipping Info
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-slate-500 uppercase">Service</p>
                <p className="text-sm font-bold text-white">{order.shippingService}</p>
              </div>
              {order.trackingNumber && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Tracking Number</p>
                  <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700 flex items-center justify-between">
                    <p className="text-xs font-mono font-bold text-primary tracking-widest">{order.trackingNumber}</p>
                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-white" onClick={() => {
                      navigator.clipboard.writeText(order.trackingNumber!);
                      toast.success("Copied to clipboard");
                    }}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Address Card */}
          <Card className="bg-slate-900/30 border-slate-800 overflow-hidden">
            <CardHeader className="bg-slate-800/30 py-4 border-b border-slate-700/50">
              <CardTitle className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-widest">
                <MapPin className="h-4 w-4 text-primary" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div>
                <p className="text-sm font-black text-white mb-1">
                  {order.shippingAddress?.fullName || order.shippingAddr?.fullName || '-'}
                </p>
                <p className="text-xs font-bold text-slate-400 mb-2">
                  {order.shippingAddress?.phone || order.shippingAddr?.phone || order.phone}
                </p>
              </div>
              <p className="text-xs font-medium text-slate-300 leading-relaxed">
                {order.shippingAddress?.address || order.shippingAddr?.address || '-'}<br />
                {order.shippingAddress?.city || order.shippingAddr?.city || '-'}, {order.shippingAddress?.province || order.shippingAddr?.province || '-'}<br />
                {order.shippingAddress?.postalCode || order.shippingAddr?.postalCode || '-'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

