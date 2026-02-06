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
              {Object.entries(product.specifications || {}).map(([category, specs]: [string, any], index: number) => (
                <div key={index} className="space-y-4">
                  <h3 className="font-semibold text-lg capitalize">{category.replace(/([A-Z])/g, " $1").trim()}</h3>
                  <div className="space-y-3 text-sm">
                    {Object.entries(specs).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                        <span className="font-medium text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {(!product.specifications || Object.keys(product.specifications).length === 0) && (
                <div className="col-span-2 text-center text-muted-foreground py-8">
                  No specifications available for this product.
                </div>
              )}
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
