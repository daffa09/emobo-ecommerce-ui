"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar, NavItem } from "./dashboard-sidebar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth-service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut } from "lucide-react";
import { getCookie } from "@/lib/cookie-utils";
import { MobileBottomNav } from "./mobile-bottom-nav";

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  roleName?: string;
  roleDescription?: string;
  hideHeaderProfile?: boolean;
}

export function DashboardShell({ children, navItems, roleName, roleDescription, hideHeaderProfile }: DashboardShellProps) {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedUser = getCookie("emobo-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchUserNotifications = async () => {
    try {
      const { fetchNotifications } = await import("@/lib/api-service");
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserNotifications();
      // Poll every 30 seconds
      const interval = setInterval(fetchUserNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAsRead = async (id: number) => {
    try {
      const { markNotificationAsRead } = await import("@/lib/api-service");
      await markNotificationAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const getProfileLink = () => {
    if (!user) return "/login";
    return user.role === "ADMIN" ? "/admin/profile" : "/customer/profile";
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ORDER":
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        );
      case "MESSAGE":
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        );
      case "CUSTOMER":
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-black text-slate-200 font-sans">
        <DashboardSidebar items={navItems} roleName={roleName} roleDescription={roleDescription} />
        <main className="flex-1 overflow-y-auto relative bg-black">
          <header className="sticky top-0 z-30 flex h-20 items-center bg-black/80 backdrop-blur-md border-b border-slate-800 px-8">
            {/* Left: Sidebar Toggle & Title */}
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hidden md:flex h-9 w-9 text-slate-400 hover:text-white transition-all hover:bg-slate-800 rounded-lg" />
              <div className="hidden md:block h-6 w-px bg-slate-800 mx-2" />
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-tighter leading-tight">System Access</p>
                <h1 className="text-sm font-black text-white tracking-tight leading-none">Dashboard</h1>
              </div>
            </div>

            {/* Right: Date, Notification & Profile */}
            <div className="ml-auto flex items-center gap-4">
              <div className="hidden lg:flex flex-col items-end">
                <p className="text-xs font-black text-slate-100 leading-none">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
                <p className="text-[10px] font-bold text-emerald-500 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Status: Operational
                </p>
              </div>

              {/* Notification Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <button className="relative w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-all group">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-black border-2 border-black">
                        {unreadCount}
                      </div>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent className="bg-black border-slate-800 text-slate-200 w-full sm:max-w-[400px] flex flex-col p-0">
                  <div className="p-8 border-b border-slate-800">
                    <SheetHeader>
                      <SheetTitle className="text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-lg font-black tracking-tight leading-none">System Notifications</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Real-time alerts</span>
                        </div>
                      </SheetTitle>
                    </SheetHeader>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 py-8 space-y-4">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                          className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${notif.isRead
                            ? "bg-slate-900/30 border-slate-800/50 opacity-60 hover:opacity-100"
                            : "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-primary/30 shadow-lg shadow-black/20"
                            }`}
                        >
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              {getNotificationIcon(notif.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className={`text-[10px] font-black uppercase tracking-widest ${notif.type === "ORDER" ? "text-emerald-500" :
                                  notif.type === "MESSAGE" ? "text-blue-500" :
                                    notif.type === "CUSTOMER" ? "text-amber-500" :
                                      "text-primary"
                                  }`}>
                                  {notif.type || "System Alert"}
                                </p>
                                <p className="text-[10px] text-slate-500 font-bold">
                                  {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              <p className={`text-sm font-bold mb-1 leading-snug transition-colors ${notif.isRead ? "text-slate-400" : "text-white"}`}>
                                {notif.title}
                              </p>
                              <p className={`text-xs font-medium leading-relaxed ${notif.isRead ? "text-slate-500" : "text-slate-400"}`}>
                                {notif.message}
                              </p>
                            </div>
                          </div>
                          {!notif.isRead && (
                            <div className="absolute top-5 right-5 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                        </div>
                        <p className="text-slate-400 font-bold">No notifications yet</p>
                        <p className="text-xs text-slate-600 mt-1">We'll alert you when something happens.</p>
                      </div>
                    )}
                  </div>

                  <div className="p-6 border-t border-slate-800 bg-slate-900/20">
                    <button
                      onClick={() => setNotifications(notifications.map(n => ({ ...n, isRead: true })))}
                      className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-slate-700 hover:text-white"
                    >
                      Mark all as read
                    </button>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Profile Dropdown */}
              {user && !hideHeaderProfile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative hidden md:flex w-10 h-10 rounded-full overflow-hidden border-2 border-slate-700 hover:border-primary/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <Avatar className="w-full h-full">
                        <AvatarImage src={user.image} alt={user.name || "User"} />
                        <AvatarFallback className="bg-primary/20 text-primary font-bold text-sm">
                          {(user.name || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-2 bg-slate-900 border-slate-800" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none text-white">{user.name}</p>
                        <p className="text-xs leading-none text-slate-400">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <DropdownMenuItem
                      className="cursor-pointer font-bold gap-2 text-slate-300 hover:text-white focus:text-white focus:bg-slate-800"
                      onClick={() => router.push(getProfileLink())}
                    >
                      <Settings className="h-4 w-4 text-slate-400" />
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <DropdownMenuItem
                      className="cursor-pointer font-bold text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10 gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </header>

          <div className="px-8 pb-12 pt-8 mb-20 md:mb-0">
            {children}
          </div>
          <MobileBottomNav items={navItems} user={user} profileLink={getProfileLink()} />
        </main>
      </div>
    </SidebarProvider>
  );
}
