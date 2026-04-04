"use client";

import { DashboardShell } from "@/components/template/layout/dashboard-shell";
import { usePathname } from "next/navigation";

const adminNavItems: any[] = [
  { name: "Dashboard", href: "/admin", iconName: "Dashboard" },
  { name: "Manage Products", href: "/admin/catalog", iconName: "Catalog" },
  { name: "Purchase Order", href: "/admin/purchase-order", iconName: "PurchaseOrder" },
  { name: "Manage Customers", href: "/admin/customers", iconName: "Customers" },
  { name: "Sales Reports", href: "/admin/reports", iconName: "Reports" },
  { name: "Manage Orders", href: "/admin/transactions", iconName: "Transactions" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPrintPage = pathname === "/admin/reports/print";

  if (isPrintPage) {
    return <div className="bg-white min-h-screen text-black">{children}</div>;
  }

  return (
    <DashboardShell navItems={adminNavItems}>
      {children}
    </DashboardShell>
  );
}
