import { ProductImages } from "./_components/product-images";
import { ProductInfo } from "./_components/product-info";
import { ProductSpecs } from "./_components/product-specs";
import { ProductReviews } from "./_components/product-reviews";
import { FeaturedProductsSection } from "../../_components/featured-products-section";

export default function ProductDetailPage() {
  return (
    <div className="flex flex-col bg-background min-h-screen">
      {/* Product Details */}
      <div className="container-emobo py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductImages />
          <ProductInfo />
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <ProductSpecs />
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <ProductReviews />
        </div>
      </div>

      {/* Related Products */}
      <div className="bg-muted/30">
        <FeaturedProductsSection />
      </div>
    </div>
  );
}
