import type React from "react"
import { Package, Truck, CheckCircle2, Clock } from "lucide-react"

export type OrderStatus = "pending" | "processing" | "shipped" | "completed"

interface TimelineItem {
  status: OrderStatus
  label: string
  date?: string
  icon: React.ReactNode
}

interface OrderTimelineProps {
  currentStatus: OrderStatus
  timeline?: TimelineItem[]
}

export function OrderTimeline({ currentStatus, timeline }: OrderTimelineProps) {
  const defaultTimeline: TimelineItem[] = [
    {
      status: "pending",
      label: "Order Placed",
      date: "Today",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      status: "processing",
      label: "Processing",
      date: "1-2 days",
      icon: <Package className="w-5 h-5" />,
    },
    {
      status: "shipped",
      label: "Shipped",
      date: "3-5 days",
      icon: <Truck className="w-5 h-5" />,
    },
    {
      status: "completed",
      label: "Delivered",
      date: "5-7 days",
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
  ]

  const items = timeline || defaultTimeline
  const statusOrder = ["pending", "processing", "shipped", "completed"]
  const currentIndex = statusOrder.indexOf(currentStatus)

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isCompleted = index <= currentIndex
        const isCurrent = index === currentIndex

        return (
          <div key={item.status} className="flex gap-4">
            {/* Timeline Dot and Line */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted ? "bg-primary text-white" : "bg-border text-muted"
                }`}
              >
                {item.icon}
              </div>
              {index < items.length - 1 && <div className={`w-1 h-12 ${isCompleted ? "bg-primary" : "bg-border"}`} />}
            </div>

            {/* Content */}
            <div className={`pb-8 ${isCurrent ? "pt-2" : ""}`}>
              <div className={`font-semibold ${isCompleted ? "text-foreground" : "text-muted"}`}>{item.label}</div>
              {item.date && <div className={`text-sm ${isCompleted ? "text-muted" : "text-border"}`}>{item.date}</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
