"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CartButton } from "./cart-button";
import { Menu, User, LayoutDashboard, Settings, LogOut } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { logoutUser } from "@/lib/auth-service";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCookie } from "@/lib/cookie-utils";

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = getCookie("emobo-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/catalog", label: "Catalog" },
    { href: "/contact", label: "Contact Us" },
  ];

  const getDashboardLink = () => {
    if (!user) return "/login";
    return user.role === "ADMIN" ? "/admin" : "/customer";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container-emobo flex h-16 items-center justify-between">
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-8">
                <SheetHeader className="text-left mb-8">
                  <SheetTitle>
                    <Image
                      src="/ic_logo_navbar.svg"
                      alt="EMOBO Logo"
                      width={100}
                      height={32}
                      className="h-8 w-auto brightness-0 invert"
                    />
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-xl font-bold transition-smooth hover:text-primary tracking-tight"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="h-px bg-border/50 my-4" />
                  {user ? (
                    <div className="space-y-4">
                      <Link href={getDashboardLink()}>
                        <Button className="w-full h-12 rounded-lg font-bold shadow-lg shadow-primary/20 bg-primary mb-3">
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full h-12 rounded-lg font-bold text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Link href="/login">
                      <Button className="w-full h-12 rounded-lg font-bold shadow-lg shadow-primary/20">
                        Login Account
                      </Button>
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/ic_logo_navbar.svg"
              alt="EMOBO Logo"
              width={120}
              height={40}
              className="h-7 lg:h-10 w-auto brightness-0 invert"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition-smooth hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          {user && <CartButton />}
          <div className="h-6 w-px bg-border hidden sm:block" />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarImage src={user.image} alt={user.name || "User"} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {(user.name || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none text-white">{user.name}</p>
                    <p className="text-xs leading-none text-slate-400">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={getDashboardLink()}>
                  <DropdownMenuItem className="cursor-pointer font-bold gap-2">
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                    Dashboard
                  </DropdownMenuItem>
                </Link>
                <Link href={user.role === "ADMIN" ? "/admin/profile" : "/customer/profile"}>
                  <DropdownMenuItem className="cursor-pointer font-bold gap-2">
                    <Settings className="h-4 w-4 text-slate-400" />
                    Profile Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer font-bold text-destructive focus:text-destructive focus:bg-destructive/10 gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="hidden sm:block">
              <Button variant="outline" className="rounded-lg px-6 font-medium transition-smooth hover:bg-primary hover:text-white">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
