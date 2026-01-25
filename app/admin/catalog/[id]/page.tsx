"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, X, Image as ImageIcon, Save } from "lucide-react";
import { toast } from "sonner";
import { fetchProductById, updateProduct, type Product } from "@/lib/api-service";

const BRANDS = ["ASUS", "Lenovo", "Apple", "HP", "Dell", "Acer", "MSI", "Razer"];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    brand: "",
    price: "",
    stock: "",
    description: "",
  });

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await fetchProductById(productId);
        setProduct(data);
        setFormData({
          sku: data.sku,
          name: data.name,
          brand: data.brand,
          price: data.price.toString(),
          stock: data.stock.toString(),
          description: data.description || "",
        });
        setExistingImages(data.images);
      } catch (error) {
        console.error("Failed to load product:", error);
        toast.error("Failed to load product");
        router.push("/admin/catalog");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId, router]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const totalImages = existingImages.length + imageFiles.length + files.length;
    if (totalImages > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith("image/");
      if (!isValid) {
        toast.error(`${file.name} is not a valid image`);
      }
      return isValid;
    });

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setImageFiles(prev => [...prev, ...validFiles]);
  };

  const removeNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    const formData = new FormData();
    files.forEach(file => {
      formData.append("images", file);
    });

    const token = localStorage.getItem("token");
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

    const totalImages = existingImages.length + imageFiles.length;
    if (totalImages === 0) {
      toast.error("Please add at least one product image");
      return;
    }

    try {
      setSaving(true);

      // Upload new images if any
      let newImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        setUploadingImages(true);
        newImageUrls = await uploadImages(imageFiles);
        setUploadingImages(false);
      }

      // Combine existing and new images
      const allImages = [...existingImages, ...newImageUrls];

      // Update product
      await updateProduct(productId, {
        sku: formData.sku,
        name: formData.name,
        brand: formData.brand,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description,
        images: allImages,
      });

      toast.success("Product updated successfully!");
      router.push("/admin/catalog");
    } catch (error: any) {
      console.error("Failed to update product:", error);
      toast.error(error.message || "Failed to update product");
      setUploadingImages(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Edit Product</h1>
        <p className="text-muted-foreground mt-2">Update product information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardHeader>
            <CardTitle className="text-white">Product Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* Existing images */}
              {existingImages.map((image, index) => (
                <div key={`existing-${index}`} className="relative aspect-square rounded-lg overflow-hidden border-2 border-zinc-700 group">
                  <img src={`${process.env.NEXT_PUBLIC_API_URL}${image}`} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}

              {/* New image previews */}
              {imagePreviews.map((preview, index) => (
                <div key={`new-${index}`} className="relative aspect-square rounded-lg overflow-hidden border-2 border-primary group">
                  <img src={preview} alt={`New ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-primary px-2 py-1 rounded text-xs font-bold">NEW</div>
                </div>
              ))}

              {(existingImages.length + imageFiles.length) < 5 && (
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
              Upload up to 5 images total. New images will be converted to WebP format.
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
                    <SelectValue />
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-zinc-800/50 border-zinc-700"
              />
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
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-zinc-800/50 border-zinc-700"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving || uploadingImages}
            className="gap-2"
          >
            {uploadingImages ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading Images...
              </>
            ) : saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
