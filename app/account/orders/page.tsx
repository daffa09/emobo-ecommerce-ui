"use client"

import { useEffect, useState } from "react"
import { OrderTimeline } from "@/app/checkout/_components/order-timeline"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Package, Download, Star } from "lucide-react"
import Link from "next/link"
import { API_URL } from "@/lib/auth-service"
import { formatIDR } from "@/lib/utils"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { getCookie } from "@/lib/cookie-utils"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewOrder, setReviewOrder] = useState<any>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [submittingReview, setSubmittingReview] = useState(false)

  const fetchOrders = async () => {
    try {
      const token = getCookie("emobo-token")
      const res = await fetch(`${API_URL}/orders`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) setOrders(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleReviewSubmit = async () => {
    if (!reviewOrder) return
    setSubmittingReview(true)
    try {
      const token = getCookie("emobo-token")
      // Post review for each item in the order (simplification)
      for (const item of reviewOrder.items) {
        await fetch(`${API_URL}/reviews`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            orderId: reviewOrder.id,
            productId: item.productId,
            rating,
            comment
          })
        })
      }
      toast.success("Review berhasil dikirim!")
      setReviewOrder(null)
      setComment("")
      setRating(5)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini? Stok akan dikembalikan otomatis.")) return;

    try {
      const token = getCookie("emobo-token");
      const res = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Pesanan berhasil dibatalkan");
        fetchOrders();
      } else {
        toast.error(data.message || "Gagal membatalkan pesanan");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="container-emobo py-12">Memuat pesanan...</div>

  return (
    <div className="container-emobo py-12">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Pesanan Saya</h1>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="processing">Diproses</TabsTrigger>
            <TabsTrigger value="completed">Selesai</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-muted text-center py-10">Belum ada pesanan.</p>
            ) : (
              orders.map((order) => (
                <Card key={order.id} className="p-6 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-bold text-foreground">ORDER #{order.id}</p>
                      <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize ${order.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : order.status === "PROCESSING"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="border-t border-border pt-4 space-y-2">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div>
                          <p className="font-medium text-foreground">{item.product.name}</p>
                          <p className="text-muted">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">{formatIDR(item.unitPrice)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t border-border pt-4 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted">Total Pembayaran</p>
                      <span className="text-xl font-bold text-primary">{formatIDR(order.totalAmount)}</span>
                    </div>
                    <div className="flex gap-2">
                      {order.status === "COMPLETED" && (
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-primary hover:bg-primary-dark"
                          onClick={() => setReviewOrder(order)}
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Beri Review
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Invoice
                      </Button>
                      {order.status === "PENDING" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          Batalkan
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Review Modal replaced with Sheet for compatibility */}
      <Sheet open={!!reviewOrder} onOpenChange={() => setReviewOrder(null)}>
        <SheetContent side="bottom" className="h-auto max-h-[90vh]">
          <SheetHeader>
            <SheetTitle>Beri Review</SheetTitle>
            <SheetDescription>
              Bagikan pengalaman Anda menggunakan produk ini.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`size-8 cursor-pointer ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  onClick={() => setRating(s)}
                />
              ))}
            </div>
            <Textarea
              placeholder="Tulis ulasan Anda di sini..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
          <SheetFooter className="pb-8">
            <Button variant="outline" onClick={() => setReviewOrder(null)}>Batal</Button>
            <Button onClick={handleReviewSubmit} disabled={submittingReview}>
              {submittingReview ? "Mengirim..." : "Kirim Review"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
