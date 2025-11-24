import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-white mt-16">
      <div className="container-emobo py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-bold text-xl">Emobo</span>
            </div>
            <p className="text-gray-300 text-sm">
              Your trusted destination for premium laptops and quality computing solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/catalog" className="hover:text-white transition-smooth">
                  All Laptops
                </Link>
              </li>
              <li>
                <Link href="/catalog?brand=asus" className="hover:text-white transition-smooth">
                  ASUS
                </Link>
              </li>
              <li>
                <Link href="/catalog?brand=lenovo" className="hover:text-white transition-smooth">
                  Lenovo
                </Link>
              </li>
              <li>
                <Link href="/deals" className="hover:text-white transition-smooth">
                  Special Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/about" className="hover:text-white transition-smooth">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-smooth">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-smooth">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-smooth">
                  Returns & Warranty
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4 mb-4">
              <a href="#" className="hover:text-primary transition-smooth">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition-smooth">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition-smooth">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="mailto:support@emobo.com" className="hover:text-primary transition-smooth">
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-gray-300">support@emobo.com</p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-400">© 2025 Emobo. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-smooth">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-smooth">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
