"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()

  const navLinks = [
    { href: "/work", label: "work" },
    { href: "/assignments", label: "assignments" },
    { href: "/about", label: "about" },
    { href: "/contact", label: "contact" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-[1200px] mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="text-primary text-sm font-bold uppercase tracking-widest">
          Sondernista
        </Link>
        <nav className="flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs uppercase tracking-widest transition-opacity hover:opacity-60 ${
                pathname === link.href ? "text-primary" : "text-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
