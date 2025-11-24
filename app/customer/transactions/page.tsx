import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomerTransactionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p>List of your transactions will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
