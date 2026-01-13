"use client";

import { useSearchParams } from "next/navigation";
import { ProductCard } from "../../_components/product-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";

const allLaptops = [
  {
    id: 1,
    name: "Lenovo ThinkPad X1 Carbon Gen 11",
    brand: "Lenovo",
    price: "19500000",
    image: "/lenovo-thinkpad-laptop.jpg",
    rating: 4.8,
    reviews: 234,
    discount: "25%",
    specs: ["Intel i7", "16GB RAM", "512GB SSD"]
  },
  {
    id: 2,
    name: "ASUS Vivobook Pro 15 OLED",
    brand: "ASUS",
    price: "13500000",
    image: "/asus-vivobook-laptop.jpg",
    rating: 4.6,
    reviews: 189,
    discount: "15%",
    specs: ["AMD Ryzen 7", "8GB RAM", "512GB SSD"]
  },
  {
    id: 3,
    name: "HP Pavilion 15 Touch Screen",
    brand: "HP",
    price: "11250000",
    image: "/hp-pavilion-laptop.jpg",
    rating: 4.5,
    reviews: 156,
    discount: "20%",
    specs: ["Intel i5", "8GB RAM", "256GB SSD"]
  },
  {
    id: 4,
    name: "Acer Swift 3 Thin & Light",
    brand: "Acer",
    price: "9750000",
    image: "/acer-swift-laptop.jpg",
    rating: 4.7,
    reviews: 201,
    discount: "30%",
    specs: ["Intel i5", "8GB RAM", "512GB SSD"]
  },
  {
    id: 5,
    name: "Lenovo ThinkPad X1 Carbon",
    brand: "Lenovo",
    price: "17990000",
    image: "/lenovo-thinkpad-laptop.jpg",
    rating: 4.8,
    reviews: 178,
    specs: ["Intel i7", "16GB RAM", "1TB SSD"]
  },
  {
    id: 6,
    name: "ASUS ROG Strix Gaming",
    brand: "ASUS",
    price: "22500000",
    image: "/asus-vivobook-laptop.jpg",
    rating: 4.9,
    reviews: 312,
    discount: "10%",
    specs: ["Intel i9", "32GB RAM", "1TB SSD"]
  },
  {
    id: 7,
    name: "HP Envy x360 2-in-1",
    brand: "HP",
    price: "13500000",
    image: "/hp-pavilion-laptop.jpg",
    rating: 4.6,
    reviews: 145,
    specs: ["AMD Ryzen 5", "16GB RAM", "512GB SSD"]
  },
  {
    id: 8,
    name: "Acer Predator Helios 300",
    brand: "Acer",
    price: "19500000",
    image: "/acer-swift-laptop.jpg",
    rating: 4.7,
    reviews: 267,
    discount: "15%",
    specs: ["Intel i7", "16GB RAM", "512GB SSD"]
  },
];

export function CatalogGrid() {
  const searchParams = useSearchParams();
  const brandFilter = searchParams.get("brand");

  const filteredLaptops = brandFilter
    ? allLaptops.filter(laptop => laptop.brand.toLowerCase() === brandFilter.toLowerCase())
    : allLaptops;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">
            {brandFilter ? `${brandFilter.toUpperCase()} Laptops` : "All Products"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredLaptops.length}</span> products
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select defaultValue="featured">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredLaptops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {filteredLaptops.map((laptop) => (
            <ProductCard key={laptop.id} {...laptop} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">No laptops found for "{brandFilter}".</p>
        </div>
      )}

      {/* Pagination could go here */}
    </div>
  );
}
