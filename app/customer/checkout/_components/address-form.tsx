"use client"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useForm } from "react-hook-form"
import { fetchProvinces, fetchCities, calculateShippingCost, fetchUserProfile, type ShippingProvince, type ShippingCity, type ShippingCost } from "@/lib/api-service"
import { toast } from "sonner"
import { Loader2, Check, ChevronsUpDown } from "lucide-react"
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
  onSubmit: (data: AddressFormData & { shippingCost: number; shippingService: string; shippingEtd: string }) => void;
  totalWeight: number;
}

export function AddressForm({ onSubmit, totalWeight }: AddressFormProps) {
  const [provinces, setProvinces] = useState<ShippingProvince[]>([])
  const [cities, setCities] = useState<ShippingCity[]>([])
  const [shippingOptions, setShippingOptions] = useState<ShippingCost[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingCost, setLoadingCost] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [openProvince, setOpenProvince] = useState(false)
  const [openCity, setOpenCity] = useState(false)

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
        if (profile.provinceId) setValue("provinceId", profile.provinceId)
        if (profile.cityId) {
          // Note: cityId requires cities to be loaded, but it should happen automatically
          // because provinceId change triggers the cities fetch, and cityId will match
          // once cities are loaded, as long as it's set in the form state.
          setValue("cityId", profile.cityId)
        }
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
  const [selectedEtd, setSelectedEtd] = useState("")

  const handleFormSubmit = (data: AddressFormData) => {
    if (!selectedService || selectedCost === 0) {
      toast.error("Please select a shipping service first")
      return
    }
    onSubmit({
      ...data,
      shippingCost: selectedCost,
      shippingService: `${courier.toUpperCase()} - ${selectedService}`,
      shippingEtd: selectedEtd,
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
          <Popover open={openProvince} onOpenChange={setOpenProvince}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openProvince}
                className={cn(
                  "w-full justify-between h-auto min-h-10 text-left font-normal bg-muted/20 border-zinc-800 hover:bg-muted/50 transition-colors",
                  !provinceId && "text-muted-foreground"
                )}
              >
                {provinceId
                  ? provinces.find((p) => p.province_id === provinceId)?.province
                  : "Select Province"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 border-zinc-800 bg-zinc-950">
              <Command className="bg-transparent">
                <CommandInput placeholder="Search province..." className="h-9 focus:ring-0 border-none" />
                <CommandList className="max-h-[200px] overflow-y-auto">
                  <CommandEmpty>No province found.</CommandEmpty>
                  <CommandGroup>
                    {provinces.map((p) => (
                      <CommandItem
                        key={p.province_id}
                        value={p.province}
                        onSelect={() => {
                          setValue("provinceId", p.province_id)
                          setValue("cityId", "") // reset city
                          setOpenProvince(false)
                        }}
                        className="cursor-pointer hover:bg-zinc-800/50 aria-selected:bg-zinc-800"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 text-primary",
                            p.province_id === provinceId ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {p.province}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">City/Regency</label>
          <Popover open={openCity} onOpenChange={setOpenCity}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCity}
                disabled={!provinceId}
                className={cn(
                  "w-full justify-between h-auto min-h-10 text-left font-normal bg-muted/20 border-zinc-800 hover:bg-muted/50 transition-colors disabled:opacity-50",
                  !cityId && "text-muted-foreground"
                )}
              >
                {cityId
                  ? cities.find((c) => c.city_id === cityId)
                    ? `${cities.find((c) => c.city_id === cityId)?.type} ${cities.find((c) => c.city_id === cityId)?.city_name}`
                    : "Select City"
                  : "Select City"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 border-zinc-800 bg-zinc-950">
              <Command className="bg-transparent">
                <CommandInput placeholder="Search city..." className="h-9 focus:ring-0 border-none" />
                <CommandList className="max-h-[200px] overflow-y-auto">
                  <CommandEmpty>No city found.</CommandEmpty>
                  <CommandGroup>
                    {cities.map((c) => (
                      <CommandItem
                        key={c.city_id}
                        value={`${c.type} ${c.city_name}`}
                        onSelect={() => {
                          setValue("cityId", c.city_id)
                          setOpenCity(false)
                        }}
                        className="cursor-pointer hover:bg-zinc-800/50 aria-selected:bg-zinc-800"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 text-primary",
                            c.city_id === cityId ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {c.type} {c.city_name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
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
                setSelectedEtd(opt.cost[0].etd || "");
              }
            }}
            disabled={loadingCost || shippingOptions.length === 0}
          >
            <SelectTrigger className="w-full overflow-hidden">
              <SelectValue
                placeholder={loadingCost ? "Loading shipping costs..." : shippingOptions.length === 0 ? "Select city & courier first" : "Select Service"}
                className="truncate"
              />
            </SelectTrigger>
            <SelectContent
              className="w-(--radix-select-trigger-width) max-w-[calc(100vw-2rem)]"
              position="popper"
              side="bottom"
              sideOffset={4}
            >
              {shippingOptions.map((opt) => (
                <SelectItem key={opt.service} value={opt.service} className="whitespace-normal">
                  <span className="font-medium">{opt.service}</span>
                  {" "}({opt.description}){" "}
                  <span className="text-primary font-semibold">Rp {opt.cost[0].value.toLocaleString('en-US')}</span>
                  {opt.cost[0].etd && (
                    <span className="text-muted-foreground text-xs"> · {opt.cost[0].etd} days</span>
                  )}
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
