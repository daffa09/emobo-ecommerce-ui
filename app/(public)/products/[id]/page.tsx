"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ProductImages } from "./_components/product-images";
import { ProductInfo } from "./_components/product-info";
import { ProductSpecs } from "./_components/product-specs";
import { ProductReviews } from "./_components/product-reviews";
import { FeaturedProductsSection } from "../../_components/featured-products-section";
import { fetchProductById, fetchProductReviews, type Product, type Review } from "@/lib/api-service";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const [productData, reviewsData] = await Promise.all([
          fetchProductById(productId),
          fetchProductReviews(productId).catch(() => []), // Reviews might not exist
        ]);
        setProduct(productData);
        setReviews(reviewsData);
      } catch (err: any) {
        console.error("Failed to fetch product:", err);
        setError(err.message || "Product not found");
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">{error || "The product you're looking for doesn't exist."}</p>
        <a href="/catalog" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90">
          Browse All Products
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background min-h-screen">
      {/* Product Details */}
      <div className="container-emobo py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductImages product={product} />
          <ProductInfo product={product} />
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <ProductSpecs product={product} />
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <ProductReviews productId={productId} reviews={reviews} />
        </div>
      </div>

      {/* Related Products */}
      <div className="bg-muted/30">
        <FeaturedProductsSection />
      </div>
    </div>
  );
}
