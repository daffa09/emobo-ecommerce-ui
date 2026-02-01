import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-16 transition-colors duration-500">
      <div className="container-emobo py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/ic_logo_navbar.svg"
                alt="EMOBO Logo"
                width={120}
                height={40}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs font-medium">
              Your trusted destination for premium laptops and quality computing solutions curated for professional excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase tracking-widest text-xs">Shop Catalog</h4>
            <ul className="space-y-4 text-sm font-semibold text-muted-foreground">
              <li>
                <Link href="/catalog" className="hover:text-primary transition-colors">
                  All Laptops
                </Link>
              </li>
              <li>
                <Link href="/catalog?brand=asus" className="hover:text-primary transition-colors">
                  ASUS Collection
                </Link>
              </li>
              <li>
                <Link href="/catalog?brand=lenovo" className="hover:text-primary transition-colors">
                  Lenovo ThinkPad
                </Link>
              </li>

            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase tracking-widest text-xs">Support & Info</h4>
            <ul className="space-y-4 text-sm font-semibold text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-primary transition-colors">
                  Returns & Warranty
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase tracking-widest text-xs">Stay Connected</h4>
            <div className="flex gap-4 mb-6">
              {[
                { icon: <Facebook className="w-5 h-5" />, href: "#" },
                { icon: <Twitter className="w-5 h-5" />, href: "#" },
                { icon: <Instagram className="w-5 h-5" />, href: "#" },
                { icon: <Mail className="w-5 h-5" />, href: "mailto:support@emobo.com" }
              ].map((social, i) => (
                <a key={i} href={social.href} className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300">
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="text-sm font-bold text-foreground">admin@daffathan-labs.my.id</p>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Mon - Fri: 9:00 AM - 6:00 PM</p>
          </div>
        </div>

        <div className="border-t border-border pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest leading-loose">
            © 2026 Emobo Corporation. <br className="md:hidden" /> All rights reserved.
          </p>
          <div className="flex gap-8 text-xs font-black uppercase tracking-widest">
            <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
