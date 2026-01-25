"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, Eye, Package } from "lucide-react";
import { fetchAllOrders, updateOrderStatus, type Order } from "@/lib/api-service";
import { formatIDR } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_OPTIONS = ["PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"];
const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive"> = {
  COMPLETED: "default",
  SHIPPED: "secondary",
  PROCESSING: "secondary",
  PENDING: "secondary",
  CANCELLED: "destructive",
};

export default function AdminTransactionsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [updatingOrder, setUpdatingOrder] = useState<number | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(o => o.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.id.toString().includes(query) ||
          (o.user?.name && o.user.name.toLowerCase().includes(query)) ||
          (o.user?.email && o.user.email.toLowerCase().includes(query))
      );
    }

    setFilteredOrders(filtered);
  }, [searchQuery, statusFilter, orders]);

  async function loadOrders() {
    try {
      setLoading(true);
      const data = await fetchAllOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId: number, newStatus: string) {
    try {
      setUpdatingOrder(orderId);
      await updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated");
      loadOrders();
    } catch (error: any) {
      console.error("Failed to update order status:", error);
      toast.error(error.message || "Failed to update order status");
    } finally {
      setUpdatingOrder(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">Orders Management</h1>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-white">All Orders ({filteredOrders.length})</CardTitle>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-zinc-800/50 border-zinc-700"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 bg-zinc-800/50 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    {STATUS_OPTIONS.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "ALL" ? "No orders found" : "No orders yet"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-zinc-800 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                    <TableHead className="text-zinc-400">Order ID</TableHead>
                    <TableHead className="text-zinc-400">Customer</TableHead>
                    <TableHead className="text-zinc-400">Total</TableHead>
                    <TableHead className="text-zinc-400">Shipping</TableHead>
                    <TableHead className="text-zinc-400">Date</TableHead>
                    <TableHead className="text-zinc-400">Status</TableHead>
                    <TableHead className="text-zinc-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="border-zinc-800 hover:bg-zinc-800/30">
                      <TableCell className="font-mono text-sm text-zinc-300">
                        #{order.id}
                      </TableCell>
                      <TableCell className="text-white">
                        <div className="flex flex-col">
                          <span className="font-medium">{order.user?.name || 'N/A'}</span>
                          <span className="text-sm text-muted-foreground">{order.user?.email || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-white">
                        {formatIDR(order.totalAmount)}
                      </TableCell>
                      <TableCell className="text-zinc-300">
                        <div className="flex flex-col">
                          <span className="text-sm">{order.shippingService}</span>
                          {(order.trackingNumber || order.trackingNo) && (
                            <span className="text-xs text-muted-foreground">
                              Resi: {order.trackingNumber || order.trackingNo}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-300 text-sm">
                        {new Date(order.createdAt).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value)}
                          disabled={updatingOrder === order.id}
                        >
                          <SelectTrigger className="w-36 bg-zinc-800/50 border-zinc-700">
                            <SelectValue>
                              {updatingOrder === order.id ? (
                                <span className="flex items-center gap-2">
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  Updating...
                                </span>
                              ) : (
                                <Badge variant={STATUS_COLORS[order.status] || "secondary"}>
                                  {order.status}
                                </Badge>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map(status => (
                              <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={() => window.open(`/customer/transactions/${order.id}`, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
