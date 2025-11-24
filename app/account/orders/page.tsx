"use client"

import { OrderTimeline } from "@/app/checkout/_components/order-timeline"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Package, Download } from "lucide-react"
import Link from "next/link"

const orders = [
  {
    id: "#ORD-2025-001",
    date: "Today",
    status: "pending" as const,
    items: [
      {
        name: "ASUS VivoBook 14",
        price: 799,
        quantity: 1,
      },
    ],
    total: 819,
  },
  {
    id: "#ORD-2024-156",
    date: "2 weeks ago",
    status: "shipped" as const,
    items: [
      {
        name: "Lenovo ThinkPad X1 Carbon",
        price: 1299,
        quantity: 1,
      },
    ],
    total: 1319,
  },
  {
    id: "#ORD-2024-145",
    date: "1 month ago",
    status: "completed" as const,
    items: [
      {
        name: "HP Pavilion 15",
        price: 599,
        quantity: 1,
      },
    ],
    total: 619,
  },
]

export default function OrdersPage() {
  return (
    <div className="container-emobo py-12">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted">{order.id}</p>
                    <p className="text-sm text-muted">{order.date}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${order.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "shipped"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Timeline */}
                <div className="bg-surface rounded-lg p-4">
                  <OrderTimeline currentStatus={order.status} />
                </div>

                {/* Items */}
                <div className="border-t border-border pt-4 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.name} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-muted">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">${item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-border pt-4 flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary">${order.total.toLocaleString()}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/account/orders/${order.id}`}>
                      <Package className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Invoice
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Other tabs would filter the orders */}
          <TabsContent value="pending">{/* Filtered orders would appear here */}</TabsContent>
          <TabsContent value="shipped">{/* Filtered orders would appear here */}</TabsContent>
          <TabsContent value="completed">{/* Filtered orders would appear here */}</TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
