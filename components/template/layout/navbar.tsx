import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CartButton } from "./cart-button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" px-8 flex h-14 lg:h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/ic_logo_navbar.svg"
            alt="EMOBO Logo"
            width={120}
            height={40}
            className="h-8 lg:h-10 w-auto"
          />
        </Link>
        <nav className="hidden md:flex gap-4 lg:gap-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <Link href="/catalog" className="transition-colors hover:text-primary">Catalog</Link>
          <Link href="/contact" className="transition-colors hover:text-primary">Contact Us</Link>
        </nav>
        <div className="flex items-center gap-2 lg:gap-4">
          <CartButton />
          <Link href="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
