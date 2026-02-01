"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import type { Product } from "@/lib/api-service";

interface ProductImagesProps {
  product: Product;
}

export function ProductImages({ product }: ProductImagesProps) {
  const [images, setImages] = useState(product.images.length > 0 ? product.images : ["/no-image.svg"]);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleImageError = (index: number) => {
    const newImages = [...images];
    newImages[index] = "/no-image.svg";
    setImages(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Card className="overflow-hidden">
        <div className="relative aspect-square bg-muted/50">
          <Image
            src={images[selectedImage]}
            alt="Product Image"
            fill
            className="object-cover"
            priority
            onError={() => handleImageError(selectedImage)}
          />
        </div>
      </Card>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
              ? "border-primary ring-2 ring-primary/20"
              : "border-transparent hover:border-primary/50"
              }`}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
              onError={() => handleImageError(index)}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
