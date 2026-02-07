"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconMap, NavItem } from "./dashboard-sidebar";
import { LayoutDashboard, User } from "lucide-react";

interface MobileBottomNavProps {
  items: NavItem[];
  user: any;
  profileLink: string;
}

export function MobileBottomNav({ items, user, profileLink }: MobileBottomNavProps) {
  const pathname = usePathname();

  // Filter out any existing profile item from dynamic items to avoid duplication
  // and slice to max 4 to allow space for the explicit Profile button
  const filteredItems = items
    .filter(item => item.href !== profileLink && !item.name.toLowerCase().includes("profile"))
    .slice(0, 4);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/80 backdrop-blur-xl border-t border-slate-800 px-2 py-3 pb-safe">
      <nav className="flex items-center justify-around h-12">
        {filteredItems.map((item) => {
          const Icon = IconMap[item.iconName] || LayoutDashboard;
          const isActive = (item.href === "/admin" || item.href === "/customer")
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center relative p-2 rounded-xl transition-all duration-300",
                isActive
                  ? "text-primary scale-110"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              <Icon className={cn("h-6 w-6 transition-all", isActive ? "stroke-[2.5px]" : "stroke-2")} />
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]" />
              )}
            </Link>
          );
        })}

        {/* Explicit Profile Button at the end */}
        {user && (
          <Link
            href={profileLink}
            className={cn(
              "flex flex-col items-center justify-center relative p-2 rounded-xl transition-all duration-300",
              pathname.startsWith(profileLink)
                ? "text-primary scale-110"
                : "text-slate-500 hover:text-slate-300"
            )}
          >
            <User className={cn("h-6 w-6 transition-all", pathname.startsWith(profileLink) ? "stroke-[2.5px]" : "stroke-2")} />
            {pathname.startsWith(profileLink) && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]" />
            )}
          </Link>
        )}
      </nav>
    </div>
  );
}
