import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CartButton } from "./cart-button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/catalog", label: "Catalog" },
    { href: "/contact", label: "Contact Us" },
  ];

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
                  <Link href="/login">
                    <Button className="w-full h-12 rounded-lg font-bold shadow-lg shadow-primary/20">
                      Login Account
                    </Button>
                  </Link>
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
          <CartButton />
          <div className="h-6 w-px bg-border hidden sm:block" />
          <Link href="/login" className="hidden sm:block">
            <Button variant="outline" className="rounded-lg px-6 font-medium transition-smooth hover:bg-primary hover:text-white">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
