"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar, NavItem } from "./dashboard-sidebar";

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  roleName: string;
  roleDescription: string;
}

export function DashboardShell({ children, navItems, roleName, roleDescription }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-slate-50/50 text-slate-900">
        <DashboardSidebar items={navItems} roleName={roleName} roleDescription={roleDescription} />
        <main className="flex-1 overflow-y-auto relative">
          <header className="sticky top-0 z-30 flex h-20 items-center bg-white border-b border-slate-200 px-8">
            {/* Left: Sidebar Toggle & Title */}
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-9 w-9 text-slate-600 hover:text-primary transition-all hover:bg-slate-50" />
              <div className="h-6 w-px bg-slate-200 mx-2" />
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-tighter leading-tight">System Access</p>
                <h1 className="text-sm font-black text-slate-900 tracking-tight leading-none">Dashboard</h1>
              </div>
            </div>

            {/* Middle: Search bar */}
            <div className="hidden md:flex ml-12 flex-1 max-w-md items-center h-10 bg-slate-50 px-4 rounded-xl border border-slate-200/60 shadow-inner group focus-within:bg-white focus-within:border-primary/30 transition-all">
              <svg className="w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Quick search catalog..." className="ml-3 bg-transparent border-0 outline-none text-sm font-medium text-slate-600 w-full placeholder:text-slate-400" />
            </div>

            {/* Right: Date & Status */}
            <div className="ml-auto flex items-center gap-6">
              <div className="hidden lg:flex flex-col items-end">
                <p className="text-xs font-black text-slate-900 leading-none">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
                <p className="text-[10px] font-bold text-emerald-500 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Status: Operational
                </p>
              </div>

              <button className="relative w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 transition-all group">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
            </div>
          </header>

          <div className="px-8 pb-12 pt-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
