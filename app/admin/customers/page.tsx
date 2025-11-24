import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <p>List of customers will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
