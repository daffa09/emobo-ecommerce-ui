import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminTransactionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>List of transactions will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
