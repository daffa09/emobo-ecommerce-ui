"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { ProductImages } from "./_components/product-images";
import { ProductInfo } from "./_components/product-info";
import { ProductSpecs } from "./_components/product-specs";
import { ProductReviews } from "./_components/product-reviews";
import { ProductCarousel } from "../../_components/product-carousel";
import { fetchProductById, fetchProductReviews, fetchPublicProducts, type Product, type Review } from "@/lib/api-service";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [otherBrandProducts, setOtherBrandProducts] = useState<Product[]>([]);
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

        // Fetch related products based on the loaded product
        if (productData) {
          const [similarRes, otherRes] = await Promise.all([
            fetchPublicProducts({ brand: productData.brand, limit: 12 }), // Fetch slightly more to account for filtering current product
            fetchPublicProducts({ limit: 20 }) // Fetch more to filter out current brand
          ]);

          // Filter similiar products: same brand, exclude current product
          const filteredSimilar = similarRes.products
            .filter(p => p.id !== productData.id)
            .slice(0, 10);

          setSimilarProducts(filteredSimilar);

          // Filter other brand products: different brand
          const filteredOther = otherRes.products
            .filter(p => p.brand !== productData.brand)
            .slice(0, 10);

          setOtherBrandProducts(filteredOther);
        }

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
        <div className="space-y-4 py-8">
          {similarProducts.length > 0 && (
            <ProductCarousel
              title={
                <span className="flex items-center gap-2">
                  More from {product.brand}
                </span>
              }
              products={similarProducts}
            />
          )}

          {otherBrandProducts.length > 0 && (
            <ProductCarousel
              title={
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  You Might Also Like
                </span>
              }
              subtitle="Recommended laptops from other top brands"
              products={otherBrandProducts}
            />
          )}
        </div>
      </div>
    </div>
  );
}
