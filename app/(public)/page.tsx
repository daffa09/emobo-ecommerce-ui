import { HeroSection } from "./_components/hero-section";
import { CategoriesSection } from "./_components/categories-section";
import { FeaturedProductsSection } from "./_components/featured-products-section";
import { BrandsSection } from "./_components/brands-section";
import { FeaturesSection } from "./_components/features-section";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <BrandsSection />
      <FeaturesSection />
    </div>
  );
}
