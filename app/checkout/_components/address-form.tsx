"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"

export interface AddressFormData {
  fullName: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void
}

export function AddressForm({ onSubmit }: AddressFormProps) {
  const form = useForm<AddressFormData>({
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "United States",
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Full Name</label>
          <Input placeholder="John Doe" {...form.register("fullName", { required: true })} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Phone Number</label>
          <Input placeholder="+1 (555) 000-0000" {...form.register("phone", { required: true })} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground block mb-2">Address</label>
        <Input placeholder="123 Main Street" {...form.register("address", { required: true })} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">City</label>
          <Input placeholder="New York" {...form.register("city", { required: true })} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Postal Code</label>
          <Input placeholder="10001" {...form.register("postalCode", { required: true })} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Country</label>
          <Input placeholder="United States" {...form.register("country", { required: true })} />
        </div>
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
        Continue to Payment
      </Button>
    </form>
  )
}
