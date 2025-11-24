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
import { AddressForm, type AddressFormData } from "@/app/checkout/_components/address-form"
import { QRPayment } from "@/app/checkout/_components/qr-payment"
import Link from "next/link"

const cartItems = [
  {
    id: "asus-vivobook-14",
    name: "ASUS VivoBook 14",
    price: 799,
    quantity: 1,
  },
]

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState<"address" | "payment">("address")
  const [paymentStatus, setPaymentStatus] = useState<"waiting" | "paid">("waiting")

  const handleAddressSubmit = (data: AddressFormData) => {
    console.log("Address data:", data)
    setActiveStep("payment")
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
                  <TabsTrigger value="address">Shipping Address</TabsTrigger>
                  <TabsTrigger value="payment" disabled={activeStep === "address"}>
                    Payment
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="address" className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                    <AddressForm onSubmit={handleAddressSubmit} />
                  </div>
                </TabsContent>

                <TabsContent value="payment" className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                    <p className="text-muted mb-6">Pay securely using QRIS. Scan the QR code with your payment app.</p>
                    <QRPayment
                      amount={819}
                      status={paymentStatus}
                      onConfirm={() => (window.location.href = "/account/orders")}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <OrderSummary items={cartItems} />
          </div>
        </div>
      </div>
    </div>
  )
}
