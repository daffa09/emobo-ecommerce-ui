import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
      <Tabs defaultValue="financial" className="w-full">
        <TabsList>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="inbound">Inbound Goods</TabsTrigger>
          <TabsTrigger value="outbound">Outbound Goods</TabsTrigger>
        </TabsList>
        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Financial data visualization...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inbound">
          <Card>
            <CardHeader>
              <CardTitle>Inbound Goods</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Inbound goods data...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="outbound">
          <Card>
            <CardHeader>
              <CardTitle>Outbound Goods</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Outbound goods data...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
