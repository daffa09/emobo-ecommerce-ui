"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LucideIcon, LogOut, ChevronRight, LayoutDashboard, Package, Users, FileText, CreditCard, User, History } from "lucide-react";
import { cn } from "@/lib/utils";
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

const IconMap: Record<IconType, LucideIcon> = {
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
  roleName: string;
  roleDescription: string;
}

export function DashboardSidebar({ items, roleName, roleDescription }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

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
                // Fix: Dashboard (root) should only be active on exact match or very specific sub-paths if any
                // If the path is just the base admin path, it should match carefully.
                const isActive = item.href === "/admin"
                  ? pathname === "/admin"
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

      <SidebarFooter className={cn("p-4", isCollapsed && "px-0 py-8")}>
        <Link
          href="/admin/profile"
          className={cn(
            "bg-white/5 p-4 rounded-lg border border-slate-800 space-y-4 transition-smooth hover:bg-white/10 hover:border-slate-700",
            isCollapsed && "p-0 bg-transparent border-0 shadow-none mt-auto flex justify-center w-full"
          )}
        >
          <div className={cn("flex items-center gap-3", isCollapsed && "gap-0 justify-center w-full")}>
            <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
              <img src="https://i.pravatar.cc/100?img=12" alt={roleName} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                <p className="text-sm font-bold text-white truncate">{roleName}</p>
                <p className="text-[10px] text-slate-500 truncate">{roleDescription.toLowerCase()}@emobo.com</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 pt-2 border-t border-slate-800/50">
              <span className="text-[10px] uppercase tracking-widest text-primary/60">Click to edit profile</span>
            </div>
          )}
        </Link>
        <div className={cn("px-4 pb-4", isCollapsed && "px-0 flex justify-center")}>
          <Link href="/logout" className={cn(
            "flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-red-500 transition-smooth group/logout pt-4",
            isCollapsed && "justify-center"
          )}>
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform shrink-0" />
            {!isCollapsed && <span>Logout Account</span>}
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
