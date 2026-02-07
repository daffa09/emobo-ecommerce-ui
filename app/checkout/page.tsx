"use client"

import { useState, useEffect } from "react"
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
import { fetchUserProfile } from "@/lib/api-service"
import { AlertCircle, UserCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCookie } from "@/lib/cookie-utils"

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const [activeStep, setActiveStep] = useState<"address" | "payment">("address")
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingInfo, setShippingInfo] = useState<{
    cost: number;
    service: string;
    addressData: any;
  } | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [isProfileComplete, setIsProfileComplete] = useState(true)

  useEffect(() => {
    async function checkProfile() {
      try {
        setProfileLoading(true)
        const profile = await fetchUserProfile()
        const isComplete = !!(profile.name && profile.phone && profile.address)
        setIsProfileComplete(isComplete)
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      } finally {
        setProfileLoading(false)
      }
    }
    checkProfile()
  }, [])

  const handleAddressSubmit = (data: any) => {
    const { shippingCost, shippingService, ...addressData } = data
    setShippingInfo({
      cost: shippingCost,
      service: shippingService,
      addressData
    })
    setActiveStep("payment")
  }

  // Auto-trigger payment when entering payment step
  useEffect(() => {
    if (activeStep === "payment" && shippingInfo && !isProcessing) {
      handlePayNow()
    }
  }, [activeStep, shippingInfo, isProcessing])

  const handlePayNow = async () => {
    if (!shippingInfo || isProcessing) return
    setIsProcessing(true)

    try {
      // 1. Create Order
      const token = getCookie("emobo-token")
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

      // 3. Embed Midtrans Snap in container (not popup)
      // @ts-ignore
      window.snap.embed(snapToken, {
        embedId: 'snap-container',
        onSuccess: (result: any) => {
          toast.success("Payment Successful!")
          clearCart()
          window.location.href = "/customer/transactions"
        },
        onPending: (result: any) => {
          toast.info("Waiting for Payment...")
          clearCart()
          window.location.href = "/customer/transactions"
        },
        onError: (result: any) => {
          toast.error("Payment Failed!")
          setIsProcessing(false)
        },
        onClose: () => {
          setIsProcessing(false)
          setActiveStep("address")
        }
      })

    } catch (err: any) {
      toast.error(err.message)
      setIsProcessing(false)
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

        {profileLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground animate-pulse">Checking profile completeness...</p>
          </div>
        ) : !isProfileComplete ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                <UserCircle2 className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-black mb-2 text-white">Profile Incomplete</h2>
              <p className="text-slate-400 mb-8 max-w-md">
                Please complete your profile information (Name, Phone Number, and Address) in settings before proceeding to checkout.
              </p>
              <Link href="/customer/profile">
                <Button className="bg-primary hover:bg-primary/90 text-white font-black px-8 h-12 rounded-xl">
                  Complete Profile Now
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Forms & Payment - Expands when in payment step */}
            <div className={activeStep === "payment" ? "lg:col-span-3 flex justify-center" : "lg:col-span-2"}>
              <div className={`bg-background border border-border rounded-xl w-full transition-all duration-300 ${activeStep === "payment" ? "p-0 overflow-hidden max-w-5xl" : "p-6"}`}>

                {/* Custom Tab Navigation */}
                <div className="flex w-full bg-muted/50 p-1 rounded-lg mb-8">
                  <button
                    onClick={() => setActiveStep("address")}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeStep === "address"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                      }`}
                  >
                    Shipping Address
                  </button>
                  <button
                    disabled={!shippingInfo}
                    onClick={() => setActiveStep("payment")}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeStep === "payment"
                      ? "bg-background text-foreground shadow-sm"
                      : !shippingInfo
                        ? "opacity-40 cursor-not-allowed bg-muted/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                      }`}
                  >
                    Payment
                  </button>
                </div>

                {/* Step 1: Address Form - Persisted by using 'hidden' instead of unmounting */}
                <div className={activeStep === "address" ? "space-y-6 pt-2" : "hidden"}>
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                    <AddressForm
                      onSubmit={handleAddressSubmit}
                      totalWeight={items.reduce((total, item) => total + ((item.weight || 1500) * item.quantity), 0)}
                    />
                  </div>
                </div>

                {/* Step 2: Payment - Persisted visibility toggle */}
                <div className={activeStep === "payment" ? "w-full" : "hidden"}>
                  <div className="flex flex-col items-center w-full bg-white dark:bg-white min-h-[900px]">
                    <div
                      id="snap-container"
                      className="w-full min-h-[700px] md:min-h-[900px] border-0 overflow-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary - Hidden in payment step to give space */}
            {activeStep !== "payment" && (
              <div className="lg:col-span-1">
                <OrderSummary items={items} shippingCost={shippingInfo?.cost || 0} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
