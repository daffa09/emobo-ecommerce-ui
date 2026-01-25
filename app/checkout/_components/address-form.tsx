"use client"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { fetchProvinces, fetchCities, calculateShippingCost, type ShippingProvince, type ShippingCity, type ShippingCost } from "@/lib/api-service"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

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
  onSubmit: (data: AddressFormData & { shippingCost: number; shippingService: string }) => void
}

export function AddressForm({ onSubmit }: AddressFormProps) {
  const [provinces, setProvinces] = useState<ShippingProvince[]>([])
  const [cities, setCities] = useState<ShippingCity[]>([])
  const [shippingOptions, setShippingOptions] = useState<ShippingCost[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingCost, setLoadingCost] = useState(false)

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
          weight: 1000, // 1kg default - should calculate from cart
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
      toast.error("Pilih layanan pengiriman terlebih dahulu")
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
          <label className="text-sm font-medium text-foreground block mb-2">Nama Lengkap</label>
          <Input placeholder="John Doe" {...register("fullName", { required: true })} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Nomor Telepon</label>
          <Input placeholder="0812..." {...register("phone", { required: true })} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground block mb-2">Alamat Lengkap</label>
        <Input placeholder="Jl. Raya No. 1..." {...register("address", { required: true })} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Provinsi</label>
          <Select onValueChange={(val) => setValue("provinceId", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Provinsi" />
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
          <label className="text-sm font-medium text-foreground block mb-2">Kota/Kabupaten</label>
          <Select onValueChange={(val) => setValue("cityId", val)} disabled={!provinceId}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Kota" />
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
          <label className="text-sm font-medium text-foreground block mb-2">Kurir</label>
          <Select onValueChange={(val) => setValue("courier", val)} defaultValue="jne">
            <SelectTrigger>
              <SelectValue placeholder="Pilih Kurir" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jne">JNE</SelectItem>
              <SelectItem value="pos">POS Indonesia</SelectItem>
              <SelectItem value="tiki">TIKI</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Layanan Pengiriman</label>
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
              <SelectValue placeholder={loadingCost ? "Memuat biaya pengiriman..." : shippingOptions.length === 0 ? "Pilih kota & kurir dulu" : "Pilih Layanan"} />
            </SelectTrigger>
            <SelectContent>
              {shippingOptions.map((opt) => (
                <SelectItem key={opt.service} value={opt.service}>
                  {opt.service} ({opt.description}) - Rp {opt.cost[0].value.toLocaleString('id-ID')}
                  {opt.cost[0].etd && ` - ${opt.cost[0].etd} hari`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loadingCost && (
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Menghitung biaya pengiriman...
            </div>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary-dark mt-6"
        disabled={loading || loadingCost || !selectedService}
      >
        {loadingCost ? "Menghitung biaya..." : "Lanjut ke Pembayaran"}
      </Button>
    </form>
  )
}
