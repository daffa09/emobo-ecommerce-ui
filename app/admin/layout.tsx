import { DashboardShell } from "@/components/template/layout/dashboard-shell";
import { LayoutDashboard, Package, Users, FileText, CreditCard } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Emobo",
  description: "Manage your store, products, and customers.",
};

const adminNavItems: any[] = [
  { name: "Dashboard", href: "/admin", iconName: "Dashboard" },
  { name: "Manage Catalog", href: "/admin/catalog", iconName: "Catalog" },
  { name: "Customers", href: "/admin/customers", iconName: "Users" },
  { name: "Reports", href: "/admin/reports", iconName: "Reports" },
  { name: "Transactions", href: "/admin/transactions", iconName: "Transactions" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      navItems={adminNavItems}
      roleName="Administrator"
      roleDescription="Management"
    >
      {children}
    </DashboardShell>
  );
}
