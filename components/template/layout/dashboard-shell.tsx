"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar, NavItem } from "./dashboard-sidebar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  roleName: string;
  roleDescription: string;
}

export function DashboardShell({ children, navItems, roleName, roleDescription }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-black text-slate-200 font-sans">
        <DashboardSidebar items={navItems} roleName={roleName} roleDescription={roleDescription} />
        <main className="flex-1 overflow-y-auto relative bg-black">
          <header className="sticky top-0 z-30 flex h-20 items-center bg-black/80 backdrop-blur-md border-b border-slate-800 px-8">
            {/* Left: Sidebar Toggle & Title */}
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-9 w-9 text-slate-400 hover:text-white transition-all hover:bg-slate-800 rounded-lg" />
              <div className="h-6 w-px bg-slate-800 mx-2" />
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-tighter leading-tight">System Access</p>
                <h1 className="text-sm font-black text-white tracking-tight leading-none">Dashboard</h1>
              </div>
            </div>

            {/* Right: Date & Status */}
            <div className="ml-auto flex items-center gap-6">
              <div className="hidden lg:flex flex-col items-end">
                <p className="text-xs font-black text-slate-100 leading-none">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
                <p className="text-[10px] font-bold text-emerald-500 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Status: Operational
                </p>
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <button className="relative w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-all group">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-slate-800" />
                  </button>
                </SheetTrigger>
                <SheetContent className="bg-black border-slate-800 text-slate-200">
                  <SheetHeader className="mb-8">
                    <SheetTitle className="text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                      System Notifications
                    </SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 pt-4">
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-smooth">
                      <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">System Update</p>
                      <p className="text-sm font-medium text-white mb-2">New platform release v2.4.0 is now live.</p>
                      <p className="text-[10px] text-slate-500 font-medium">10 minutes ago</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-smooth opacity-60">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Inventory Alert</p>
                      <p className="text-sm font-medium text-slate-400 mb-2">Low stock detected for MacBook Air M1.</p>
                      <p className="text-[10px] text-slate-500 font-medium">2 hours ago</p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
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
