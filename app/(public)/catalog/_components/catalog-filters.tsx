"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const brands = ["Lenovo", "ASUS", "HP", "Acer", "Dell", "MSI"];
const categories = ["Gaming", "Business", "Ultrabook", "2-in-1"];

export function CatalogFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Internal state for inputs
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  // Multi-select states
  const selectedBrands = searchParams.get("brand")?.split(",") || [];
  const selectedCategories = searchParams.get("category")?.split(",") || [];

  // Update URL function
  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Reset page on filter change
    params.delete("offset");

    startTransition(() => {
      router.push(`/catalog?${params.toString()}`);
    });
  };

  const handleCheckboxChange = (type: "brand" | "category", value: string, checked: boolean) => {
    const current = type === "brand" ? selectedBrands : selectedCategories;
    let updated;

    if (checked) {
      updated = [...current, value];
    } else {
      updated = current.filter((v) => v !== value);
    }

    updateFilters({ [type]: updated.join(",") });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search });
  };

  const handlePriceBlur = () => {
    updateFilters({ minPrice, maxPrice });
  };

  const clearAll = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    router.push("/catalog");
  };

  return (
    <div className="space-y-6">
      <Card className="border-border dark:bg-slate-900/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-bold">Filters</CardTitle>
          {(search || minPrice || maxPrice || selectedBrands.length > 0 || selectedCategories.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-primary"
            >
              <X className="mr-1 h-3 w-3" /> Clear
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="space-y-3">
            <Label className="text-sm font-bold opacity-70">Search</Label>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Model, brand..."
                className="pl-9 h-10 rounded-xl bg-background/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
          </div>

          <Separator className="opacity-50" />

          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-sm font-bold opacity-70">Price Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Min"
                type="number"
                className="h-10 rounded-xl bg-background/50"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                onBlur={handlePriceBlur}
              />
              <Input
                placeholder="Max"
                type="number"
                className="h-10 rounded-xl bg-background/50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                onBlur={handlePriceBlur}
              />
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* Category */}
          <div className="space-y-4">
            <Label className="text-sm font-bold opacity-70">Category</Label>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-3 group">
                  <Checkbox
                    id={`category-${category}`}
                    className="rounded-md h-5 w-5 data-[state=checked]:bg-primary"
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) => handleCheckboxChange("category", category, !!checked)}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm font-medium cursor-pointer group-hover:text-primary transition-colors flex-1"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* Brands */}
          <div className="space-y-4">
            <Label className="text-sm font-bold opacity-70">Brands</Label>
            <div className="space-y-3">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-3 group">
                  <Checkbox
                    id={`brand-${brand}`}
                    className="rounded-md h-5 w-5 data-[state=checked]:bg-primary"
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={(checked) => handleCheckboxChange("brand", brand, !!checked)}
                  />
                  <Label
                    htmlFor={`brand-${brand}`}
                    className="text-sm font-medium cursor-pointer group-hover:text-primary transition-colors flex-1"
                  >
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
