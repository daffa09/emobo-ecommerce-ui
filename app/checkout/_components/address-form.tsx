"use client"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { API_URL } from "@/lib/auth-service"

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
  const [provinces, setProvinces] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [shippingOptions, setShippingOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

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
    fetch(`${API_URL}/shipping/provinces`)
      .then(res => res.json())
      .then(res => setProvinces(res.data))
  }, [])

  useEffect(() => {
    if (provinceId) {
      fetch(`${API_URL}/shipping/cities?provinceId=${provinceId}`)
        .then(res => res.json())
        .then(res => setCities(res.data))
    } else {
      setCities([])
    }
  }, [provinceId])

  useEffect(() => {
    if (cityId && courier) {
      setLoading(true)
      fetch(`${API_URL}/shipping/cost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: cityId,
          weight: 1000, // sample 1kg
          courier: courier
        })
      })
        .then(res => res.json())
        .then(res => {
          if (res.data && res.data[0]) {
            setShippingOptions(res.data[0].costs)
          }
          setLoading(false)
        })
    }
  }, [cityId, courier])

  const [selectedService, setSelectedService] = useState("")
  const [selectedCost, setSelectedCost] = useState(0)

  const handleFormSubmit = (data: AddressFormData) => {
    if (!selectedService) return alert("Pilih layanan pengiriman")
    onSubmit({
      ...data,
      shippingCost: selectedCost,
      shippingService: selectedService
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
          <Select onValueChange={(val) => {
            const opt = shippingOptions.find(o => o.service === val);
            setSelectedService(val);
            setSelectedCost(opt.cost[0].value);
          }} disabled={loading || shippingOptions.length === 0}>
            <SelectTrigger>
              <SelectValue placeholder={loading ? "Memuat..." : "Pilih Layanan"} />
            </SelectTrigger>
            <SelectContent>
              {shippingOptions.map((opt) => (
                <SelectItem key={opt.service} value={opt.service}>
                  {opt.service} ({opt.description}) - Rp {opt.cost[0].value.toLocaleString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary-dark mt-6" disabled={loading}>
        Lanjut ke Pembayaran
      </Button>
    </form>
  )
}
