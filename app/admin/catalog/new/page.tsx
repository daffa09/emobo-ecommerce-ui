"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { createProduct } from "@/lib/api-service";
import { getCookie } from "@/lib/cookie-utils";

const BRANDS = ["ASUS", "Lenovo", "Apple", "HP", "Dell", "Acer", "MSI", "Razer"];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    brand: "",
    price: "",
    stock: "",
    description: "",
    condition: "NEW",
    warranty: "",
    weight: "2000",
    specs: "{}",
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 5 images
    if (imageFiles.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    // Validate file types
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith("image/");
      if (!isValid) {
        toast.error(`${file.name} is not a valid image`);
      }
      return isValid;
    });

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setImageFiles(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append("images", file);
    });

    const token = getCookie("emobo-token");
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to upload images");
    }

    const data = await response.json();
    return data.images.map((img: any) => img.url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (imageFiles.length === 0) {
      toast.error("Please add at least one product image");
      return;
    }

    try {
      setLoading(true);

      // Upload images first
      setUploadingImages(true);
      const imageUrls = await uploadImages(imageFiles);
      setUploadingImages(false);

      // Create product
      let specifications = {};
      try {
        specifications = JSON.parse(formData.specs);
      } catch (e) {
        toast.error("Invalid JSON in specifications");
        setLoading(false);
        setUploadingImages(false);
        return;
      }

      await createProduct({
        sku: formData.sku,
        name: formData.name,
        brand: formData.brand,
        category: "Laptop", // Default category
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description,
        images: imageUrls,
        specifications: specifications,
        condition: formData.condition,
        warranty: formData.warranty,
        weight: parseInt(formData.weight) || 1500,
      });

      toast.success("Product created successfully!");
      router.push("/admin/catalog");
    } catch (error: any) {
      console.error("Failed to create product:", error);
      toast.error(error.message || "Failed to create product");
      setUploadingImages(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Add New Product</h1>
        <p className="text-muted-foreground mt-2">Create a new product listing</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardHeader>
            <CardTitle className="text-white">Product Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-zinc-700 group">
                  <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}

              {imageFiles.length < 5 && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-zinc-700 hover:border-primary cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Upload up to 5 images. Images will be converted to WebP format.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardHeader>
            <CardTitle className="text-white">Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku" className="text-zinc-300">SKU</Label>
                <Input
                  id="sku"
                  required
                  placeholder="e.g., ASUS-ROG-2024"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="bg-zinc-800/50 border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand" className="text-zinc-300">Brand</Label>
                <Select
                  value={formData.brand}
                  onValueChange={(value) => setFormData({ ...formData, brand: value })}
                  required
                >
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANDS.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">Product Name</Label>
              <Input
                id="name"
                required
                placeholder="e.g., ASUS ROG Strix G16"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-zinc-800/50 border-zinc-700"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condition" className="text-zinc-300">Condition</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => setFormData({ ...formData, condition: value })}
                >
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="USED">Used</SelectItem>
                    <SelectItem value="REFURBISHED">Refurbished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="warranty" className="text-zinc-300">Warranty</Label>
                <Input
                  id="warranty"
                  placeholder="e.g., 1 Year Official"
                  value={formData.warranty}
                  onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                  className="bg-zinc-800/50 border-zinc-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-zinc-300">Weight (grams)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  placeholder="2000"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="bg-zinc-800/50 border-zinc-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-zinc-300">Price (IDR)</Label>
                <Input
                  id="price"
                  type="number"
                  required
                  min="0"
                  step="1000"
                  placeholder="15000000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="bg-zinc-800/50 border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="text-zinc-300">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  required
                  min="0"
                  placeholder="50"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="bg-zinc-800/50 border-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-300">Description</Label>
              <Textarea
                id="description"
                required
                rows={4}
                placeholder="Product description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-zinc-800/50 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specs" className="text-zinc-300">Specifications (JSON Format)</Label>
              <Textarea
                id="specs"
                rows={6}
                placeholder='{"Performance": {"Processor": "i7-1355U", "RAM": "16GB"}, "Display": {"Size": "14 inch"}}'
                value={formData.specs}
                onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                className="bg-zinc-800/50 border-zinc-700 font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">Enter specifications as valid JSON.</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || uploadingImages || imageFiles.length === 0}
            className="gap-2"
          >
            {uploadingImages ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading Images...
              </>
            ) : loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Product...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Create Product
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
