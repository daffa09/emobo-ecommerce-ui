import { DashboardShell } from "@/components/template/layout/dashboard-shell";
import { LayoutDashboard, User, History } from "lucide-react";
import { WhatsAppCTA } from "@/components/template/layout/whatsapp-cta";
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
    >
      {children}
      <WhatsAppCTA />
    </DashboardShell>
  );
}
