import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CartButton } from "./cart-button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-emobo flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/ic_logo_navbar.svg"
              alt="EMOBO Logo"
              width={120}
              height={40}
              className="h-8 lg:h-10 w-auto"
            />
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/" className="transition-smooth hover:text-primary">Home</Link>
            <Link href="/catalog" className="transition-smooth hover:text-primary">Catalog</Link>
            <Link href="/contact" className="transition-smooth hover:text-primary">Contact Us</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <CartButton />
          <div className="h-6 w-px bg-border hidden sm:block" />
          <Link href="/login">
            <Button variant="outline" className="rounded-full px-6 font-medium transition-smooth hover:bg-primary hover:text-white">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
