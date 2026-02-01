import Link from "next/link"

export function AuthFooter() {
  return (
    <footer className="bg-background border-t border-border mt-auto transition-colors duration-500">
      <div className="container-emobo py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
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
