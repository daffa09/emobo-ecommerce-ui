"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { OrderSummary } from "@/app/checkout/_components/order-summary"
import { AddressForm } from "@/app/checkout/_components/address-form"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { API_URL } from "@/lib/auth-service"
import { toast } from "sonner"

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const [activeStep, setActiveStep] = useState<"address" | "payment">("address")
  const [shippingInfo, setShippingInfo] = useState<{
    cost: number;
    service: string;
    addressData: any;
  } | null>(null)

  const handleAddressSubmit = (data: any) => {
    const { shippingCost, shippingService, ...addressData } = data
    setShippingInfo({
      cost: shippingCost,
      service: shippingService,
      addressData
    })
    setActiveStep("payment")
  }

  const handlePayNow = async () => {
    if (!shippingInfo) return

    try {
      // 1. Create Order
      const token = localStorage.getItem("emobo-token")
      const orderRes = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
          shippingAddr: shippingInfo.addressData,
          phone: shippingInfo.addressData.phone,
          shippingCost: shippingInfo.cost,
          shippingService: shippingInfo.service
        })
      })

      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.message)

      const orderId = orderData.data.id

      // 2. Create Payment & Get Snap Token
      const payRes = await fetch(`${API_URL}/payments/${orderId}/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      const payData = await payRes.json()
      if (!payRes.ok) throw new Error(payData.message)

      const snapToken = payData.data.snapToken

      // 3. Open Midtrans Snap
      // @ts-ignore
      window.snap.pay(snapToken, {
        onSuccess: (result: any) => {
          toast.success("Pembayaran Berhasil!")
          clearCart()
          window.location.href = "/account/orders"
        },
        onPending: (result: any) => {
          toast.info("Menunggu Pembayaran...")
          clearCart()
          window.location.href = "/account/orders"
        },
        onError: (result: any) => {
          toast.error("Pembayaran Gagal!")
        },
        onClose: () => {
          toast.warning("Anda menutup jendela pembayaran")
        }
      })

    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="container-emobo py-4 border-b border-border">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/cart">Cart</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Checkout</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Main Content */}
      <div className="container-emobo py-12">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Forms */}
          <div className="lg:col-span-2">
            <div className="bg-background border border-border rounded-xl p-6">
              <Tabs
                value={activeStep}
                onValueChange={(v) => setActiveStep(v as "address" | "payment")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="address">Alamat Pengiriman</TabsTrigger>
                  <TabsTrigger value="payment" disabled={activeStep === "address"}>
                    Pembayaran
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="address" className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Informasi Pengiriman</h2>
                    <AddressForm onSubmit={handleAddressSubmit} />
                  </div>
                </TabsContent>

                <TabsContent value="payment" className="space-y-6">
                  <div className="text-center py-8">
                    <h2 className="text-2xl font-semibold mb-4">Siap untuk Membayar?</h2>
                    <p className="text-muted mb-8 max-w-md mx-auto">
                      Pesanan Anda akan segera diproses setelah pembayaran dikonfirmasi melalui Midtrans.
                    </p>
                    <button
                      onClick={handlePayNow}
                      className="bg-primary text-white px-8 py-3 rounded-lg font-bold text-lg hover:scale-105 transition-transform"
                    >
                      Bayar Sekarang
                    </button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <OrderSummary items={items} shippingCost={shippingInfo?.cost || 0} />
          </div>
        </div>
      </div>
    </div>
  )
}
