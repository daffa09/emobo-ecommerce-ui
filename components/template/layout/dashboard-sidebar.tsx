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
    <Sidebar collapsible="icon" className="border-r border-slate-200 bg-white text-slate-600">
      <SidebarHeader className={cn("p-6", isCollapsed && "px-0 py-8 items-center flex flex-col justify-center")}>
        <Link href="/" className={cn("flex items-center gap-3", isCollapsed && "gap-0")}>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0 outline outline-4 outline-primary/10">
            <Image src="/ic_logo_navbar.svg" alt="EMOBO" width={24} height={24} className="brightness-0 invert scale-110" />
          </div>
          {!isCollapsed && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-300">
              <h2 className="text-slate-900 text-xl font-black tracking-tight leading-none">Emobo</h2>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">{roleDescription}</p>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className={cn("px-3", isCollapsed && "px-0")}>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const Icon = IconMap[item.iconName] || LayoutDashboard;
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-12 rounded-xl transition-smooth group",
                        isCollapsed ? "px-0 justify-center w-full" : "px-4",
                        isActive
                          ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90"
                          : "hover:bg-slate-50 text-slate-600 hover:text-primary"
                      )}
                    >
                      <Link href={item.href} className={cn(isCollapsed && "justify-center w-full")}>
                        <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-500 group-hover:text-primary")} />
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
        <div className={cn("bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4 shadow-sm", isCollapsed && "p-0 bg-transparent border-0 shadow-none mt-auto flex justify-center w-full")}>
          <div className={cn("flex items-center gap-3", isCollapsed && "gap-0 justify-center w-full")}>
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
              <img src="https://i.pravatar.cc/100?img=12" alt={roleName} className="w-full h-full object-cover" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                <p className="text-sm font-bold text-slate-900 truncate">{roleName}</p>
                <p className="text-[10px] text-slate-500 truncate">{roleDescription.toLowerCase()}@emobo.local</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <Link href="/logout" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 transition-smooth group/logout pt-2 border-t border-slate-200/50">
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Logout Account</span>
            </Link>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
