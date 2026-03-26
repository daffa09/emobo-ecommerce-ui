import { Package, Truck } from "lucide-react"
import { formatIDR } from "@/lib/utils"

interface OrderItem {
  id: string | number
  name: string
  price: number
  quantity: number
}

interface OrderSummaryProps {
  items: OrderItem[]
  shippingCost?: number
}

export function OrderSummary({ items, shippingCost = 0 }: OrderSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  // Get rates from env or use defaults
  const ppnRate = process.env.NEXT_PUBLIC_PPN_RATE ? parseInt(process.env.NEXT_PUBLIC_PPN_RATE) : 11
  const appFeeAmount = process.env.NEXT_PUBLIC_APP_FEE ? parseInt(process.env.NEXT_PUBLIC_APP_FEE) : 1000

  const tax = Math.round(subtotal * (ppnRate / 100))
  const total = subtotal + shippingCost + tax + appFeeAmount

  return (
    <div className="bg-surface rounded-xl p-6 space-y-6">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <Package className="w-5 h-5 text-primary" />
        Order Summary
      </h3>

      {/* Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div>
              <p className="font-medium text-foreground">{item.name}</p>
              <p className="text-sm text-foreground">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold text-foreground">{formatIDR(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-foreground">Subtotal</span>
          <span className="text-foreground">{formatIDR(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm items-center gap-2">
          <span className="flex items-center gap-1 text-foreground">
            <Truck className="w-4 h-4" /> Shipping
          </span>
          <span className="text-foreground">{shippingCost > 0 ? formatIDR(shippingCost) : "-"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground">Tax (PPN {ppnRate}%)</span>
          <span className="text-foreground">{formatIDR(tax)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground">App Fee</span>
          <span className="text-foreground">{formatIDR(appFeeAmount)}</span>
        </div>
      </div>

      <div className="border-t border-border pt-4 flex justify-between items-center">
        <span className="font-semibold text-lg">Total</span>
        <span className="text-2xl font-bold text-primary">{formatIDR(total)}</span>
      </div>
    </div>
  )
}

