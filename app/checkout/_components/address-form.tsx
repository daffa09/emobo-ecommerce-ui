"use client"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { fetchProvinces, fetchCities, calculateShippingCost, fetchUserProfile, type ShippingProvince, type ShippingCity, type ShippingCost } from "@/lib/api-service"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { getCookie } from "@/lib/cookie-utils"
import { cn } from "@/lib/utils"

export interface AddressFormData {
  fullName: string
  phone: string
  address: string
  provinceId: string
  cityId: string
  courier: string
  postalCode: string
}

interface AddressFormProps {
  onSubmit: (data: AddressFormData & { shippingCost: number; shippingService: string }) => void;
  totalWeight: number;
}

export function AddressForm({ onSubmit, totalWeight }: AddressFormProps) {
  const [provinces, setProvinces] = useState<ShippingProvince[]>([])
  const [cities, setCities] = useState<ShippingCity[]>([])
  const [shippingOptions, setShippingOptions] = useState<ShippingCost[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingCost, setLoadingCost] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<AddressFormData>({
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      provinceId: "",
      cityId: "",
      courier: "jne",
      postalCode: "",
    },
  })

  const provinceId = watch("provinceId")
  const cityId = watch("cityId")
  const courier = watch("courier")

  // Load user profile and pre-fill form
  useEffect(() => {
    async function loadUserProfile() {
      const token = getCookie("emobo-token")
      if (!token) {
        setLoadingProfile(false)
        return
      }

      try {
        setLoadingProfile(true)
        const profile = await fetchUserProfile()
        if (profile.name) setValue("fullName", profile.name)
        if (profile.phone) setValue("phone", profile.phone)
        if (profile.address) setValue("address", profile.address)
      } catch (error) {
        console.error("Failed to fetch user profile:", error)
        // Don't show error - user can fill manually
      } finally {
        setLoadingProfile(false)
      }
    }
    loadUserProfile()
  }, [setValue])

  useEffect(() => {
    async function loadProvinces() {
      try {
        setLoading(true)
        const data = await fetchProvinces()
        setProvinces(data)
      } catch (error) {
        console.error("Failed to fetch provinces:", error)
        toast.error("Failed to load provinces")
      } finally {
        setLoading(false)
      }
    }
    loadProvinces()
  }, [])


  useEffect(() => {
    async function loadCities() {
      if (!provinceId) {
        setCities([])
        return
      }

      try {
        setLoading(true)
        const data = await fetchCities(provinceId)
        setCities(data)
      } catch (error) {
        console.error("Failed to fetch cities:", error)
        toast.error("Failed to load cities")
      } finally {
        setLoading(false)
      }
    }
    loadCities()
  }, [provinceId])

  useEffect(() => {
    async function loadShippingCost() {
      if (!cityId || !courier) {
        setShippingOptions([])
        return
      }

      try {
        setLoadingCost(true)
        const data = await calculateShippingCost({
          origin: "501", // Jakarta - should be configurable
          destination: cityId,
          weight: totalWeight,
          courier: courier
        })
        setShippingOptions(data)
      } catch (error) {
        console.error("Failed to calculate shipping cost:", error)
        toast.error("Failed to calculate shipping cost")
        setShippingOptions([])
      } finally {
        setLoadingCost(false)
      }
    }
    loadShippingCost()
  }, [cityId, courier])

  const [selectedService, setSelectedService] = useState("")
  const [selectedCost, setSelectedCost] = useState(0)

  const handleFormSubmit = (data: AddressFormData) => {
    if (!selectedService || selectedCost === 0) {
      toast.error("Please select a shipping service first")
      return
    }
    onSubmit({
      ...data,
      shippingCost: selectedCost,
      shippingService: `${courier.toUpperCase()} - ${selectedService}`
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Full Name <span className="text-red-500">*</span></label>
          <Input
            placeholder="Enter your name"
            {...register("fullName", { required: "Full name is required" })}
            readOnly
            className={cn(
              "bg-muted/50 cursor-not-allowed",
              errors.fullName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
            )}
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Phone Number <span className="text-red-500">*</span></label>
          <Input
            placeholder="0812..."
            {...register("phone", { required: "Phone number is required" })}
            readOnly
            className={cn(
              "bg-muted/50 cursor-not-allowed",
              errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
            )}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground block mb-2">Full Address <span className="text-red-500">*</span></label>
        <Input
          placeholder="Street Name, Building No..."
          {...register("address", { required: "Address is required" })}
          readOnly
          className={cn(
            "bg-muted/50 cursor-not-allowed",
            errors.address ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
          )}
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Province</label>
          <Select onValueChange={(val) => setValue("provinceId", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Province" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((p) => (
                <SelectItem key={p.province_id} value={p.province_id}>
                  {p.province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">City/Regency</label>
          <Select onValueChange={(val) => setValue("cityId", val)} disabled={!provinceId}>
            <SelectTrigger>
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c.city_id} value={c.city_id}>
                  {c.type} {c.city_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Courier</label>
          <Select onValueChange={(val) => setValue("courier", val)} defaultValue="jne">
            <SelectTrigger>
              <SelectValue placeholder="Select Courier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jne">JNE</SelectItem>
              <SelectItem value="pos">POS Indonesia</SelectItem>
              <SelectItem value="tiki">TIKI</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Shipping Service</label>
          <Select
            onValueChange={(val) => {
              const opt = shippingOptions.find(o => o.service === val);
              if (opt) {
                setSelectedService(val);
                setSelectedCost(opt.cost[0].value);
              }
            }}
            disabled={loadingCost || shippingOptions.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder={loadingCost ? "Loading shipping costs..." : shippingOptions.length === 0 ? "Select city & courier first" : "Select Service"} />
            </SelectTrigger>
            <SelectContent>
              {shippingOptions.map((opt) => (
                <SelectItem key={opt.service} value={opt.service}>
                  {opt.service} ({opt.description}) - Rp {opt.cost[0].value.toLocaleString('id-ID')}
                  {opt.cost[0].etd && ` - ${opt.cost[0].etd} days`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loadingCost && (
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Calculating shipping cost...
            </div>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary-dark mt-6"
        disabled={loading || loadingCost || !selectedService}
      >
        {loadingCost ? "Calculating..." : "Proceed to Payment"}
      </Button>
    </form>

  )
}
