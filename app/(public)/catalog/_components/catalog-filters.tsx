"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";

const brands = ["Lenovo", "ASUS", "HP", "Acer", "Dell", "MSI"];
const processors = ["Intel Core i5", "Intel Core i7", "AMD Ryzen 5", "AMD Ryzen 7"];
const ramOptions = ["8GB", "16GB", "32GB"];
const categories = ["Gaming", "Business", "Ultrabook", "2-in-1"];

export function CatalogFilters() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search laptops..."
                className="pl-9"
              />
            </div>
          </div>

          <Separator />

          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Price Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Min" type="number" />
              <Input placeholder="Max" type="number" />
            </div>
          </div>

          <Separator />

          {/* Category */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Category</Label>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox id={`category-${category}`} />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Brands */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Brands</Label>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox id={`brand-${brand}`} />
                  <Label
                    htmlFor={`brand-${brand}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Processor */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Processor</Label>
            <div className="space-y-2">
              {processors.map((processor) => (
                <div key={processor} className="flex items-center space-x-2">
                  <Checkbox id={`processor-${processor}`} />
                  <Label
                    htmlFor={`processor-${processor}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {processor}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* RAM */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">RAM</Label>
            <div className="space-y-2">
              {ramOptions.map((ram) => (
                <div key={ram} className="flex items-center space-x-2">
                  <Checkbox id={`ram-${ram}`} />
                  <Label
                    htmlFor={`ram-${ram}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {ram}
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
