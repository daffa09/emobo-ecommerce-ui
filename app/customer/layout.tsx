import { DashboardShell } from "@/components/template/layout/dashboard-shell";
import { LayoutDashboard, User, History } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Dashboard | Emobo",
  description: "View your orders and manage your profile.",
};

const customerNavItems: any[] = [
  { name: "Dashboard", href: "/customer", iconName: "Dashboard" },
  { name: "My Profile", href: "/customer/profile", iconName: "Profile" },
  { name: "Order History", href: "/customer/transactions", iconName: "History" },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      navItems={customerNavItems}
      roleName="John Doe"
      roleDescription="Customer"
    >
      {children}
    </DashboardShell>
  );
}
