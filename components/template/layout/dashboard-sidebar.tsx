"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LucideIcon, LogOut, ChevronRight, LayoutDashboard, Package, Users, FileText, CreditCard, User, History, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchUserProfile } from "@/lib/api-service";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export type IconType = "Dashboard" | "Catalog" | "Users" | "Reports" | "Transactions" | "Profile" | "History";

export const IconMap: Record<IconType, LucideIcon> = {
  Dashboard: LayoutDashboard,
  Catalog: Package,
  Users: Users,
  Reports: FileText,
  Transactions: CreditCard,
  Profile: User,
  History: History,
};

export interface NavItem {
  name: string;
  href: string;
  iconName: IconType;
}

interface DashboardSidebarProps {
  items: NavItem[];
  roleName?: string;
  roleDescription?: string;
}

export function DashboardSidebar({ items, roleName: initialRoleName, roleDescription: initialRoleDescription }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProfile() {
      try {
        const data = await fetchUserProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile in sidebar:", error);
      } finally {
        setLoading(false);
      }
    }
    getProfile();
  }, []);

  const displayName = profile?.name || initialRoleName || "";
  const displayEmail = profile?.email || "";
  const displayImage = profile?.image || (displayName ? `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random` : "");

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-800 bg-black text-slate-400">
      <SidebarHeader className={cn("p-6 flex flex-col", isCollapsed ? "px-0 items-center justify-center h-20" : "items-start")}>
        <Link href="/" className={cn("flex items-center gap-3", isCollapsed && "justify-center w-full")}>
          <Image
            src="/ic_logo_navbar.svg"
            alt="EMOBO"
            width={isCollapsed ? 28 : 120}
            height={40}
            className={cn(
              "brightness-0 invert transition-all duration-300",
              isCollapsed ? "h-7 w-auto" : "h-10 w-auto"
            )}
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className={cn("px-3", isCollapsed && "px-0")}>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const Icon = IconMap[item.iconName] || LayoutDashboard;
                const isActive = (item.href === "/admin" || item.href === "/customer")
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-12 rounded-lg transition-smooth group",
                        isCollapsed ? "px-0 justify-center w-full" : "px-4",
                        isActive
                          ? "bg-slate-800 text-white shadow-lg border border-slate-700 hover:bg-slate-700"
                          : "hover:bg-slate-800/50 text-slate-400 hover:text-white"
                      )}
                    >
                      <Link href={item.href} className={cn(isCollapsed && "justify-center w-full")}>
                        <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-500 group-hover:text-white")} />
                        {!isCollapsed && <span className="font-medium">{item.name}</span>}
                        {!isCollapsed && isActive && <ChevronRight className="ml-auto w-4 h-4 text-white/50" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={cn("p-4", isCollapsed && "px-2 py-4")}>
        <div className={cn(
          "text-[10px] text-slate-600 font-medium text-center",
          isCollapsed && "hidden"
        )}>
          © 2024 EMOBO
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
