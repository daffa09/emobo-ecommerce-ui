import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/lib/api-service";

interface ProductSpecsProps {
  product: Product;
}

export function ProductSpecs({ product }: ProductSpecsProps) {
  return (
    <Tabs defaultValue="specs" className="w-full">
      <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
        <TabsTrigger
          value="specs"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
        >
          Specifications
        </TabsTrigger>
        <TabsTrigger
          value="description"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
        >
          Description
        </TabsTrigger>
        <TabsTrigger
          value="shipping"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
        >
          Shipping & Returns
        </TabsTrigger>
      </TabsList>

      <TabsContent value="specs" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Performance</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Processor</span>
                    <span className="font-medium">Intel Core i7-1355U (Gen 13)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">RAM</span>
                    <span className="font-medium">16GB DDR5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Storage</span>
                    <span className="font-medium">512GB PCIe NVMe SSD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Graphics</span>
                    <span className="font-medium">Intel Iris Xe</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Display & Design</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Screen Size</span>
                    <span className="font-medium">14 inches</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resolution</span>
                    <span className="font-medium">1920 x 1200 FHD+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Panel Type</span>
                    <span className="font-medium">IPS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight</span>
                    <span className="font-medium">2.48 lbs (1.12 kg)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Connectivity</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wi-Fi</span>
                    <span className="font-medium">Wi-Fi 6E</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bluetooth</span>
                    <span className="font-medium">Bluetooth 5.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ports</span>
                    <span className="font-medium">2x Thunderbolt 4, 2x USB-A</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Battery & OS</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Battery</span>
                    <span className="font-medium">57Wh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Battery Life</span>
                    <span className="font-medium">Up to 15 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Operating System</span>
                    <span className="font-medium">Windows 11 Pro</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="description" className="mt-6">
        <Card>
          <CardContent className="p-6 prose prose-sm max-w-none">
            <p className="text-muted-foreground" style={{ whiteSpace: "pre-wrap" }}>
              {product.description || "No description available for this product."}
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="shipping" className="mt-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Shipping Information</h3>
              <p className="text-sm text-muted-foreground">
                Free standard shipping on all orders. Express shipping available at checkout.
                Orders are typically processed within 1-2 business days.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Returns & Exchanges</h3>
              <p className="text-sm text-muted-foreground">
                30-day return policy. Items must be in original condition with all accessories.
                Free return shipping for defective items.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
