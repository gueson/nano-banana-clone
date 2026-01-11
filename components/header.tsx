"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AuthButton } from "@/components/auth-button"

export function Header() {
  const pathname = usePathname()
  const onHome = pathname === "/"

  const sectionHref = (hash: string) => (onHome ? hash : `/${hash}`)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🍌</span>
          <span className="text-xl font-bold">Nano Banana</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href={sectionHref("#editor")}
            className="text-sm font-medium hover:text-accent transition-colors"
          >
            Editor
          </Link>
          <Link
            href={sectionHref("#features")}
            className="text-sm font-medium hover:text-accent transition-colors"
          >
            Features
          </Link>
          <Link
            href={sectionHref("#showcase")}
            className="text-sm font-medium hover:text-accent transition-colors"
          >
            Showcase
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-accent transition-colors">
            Pricing
          </Link>
          <Link
            href={sectionHref("#faq")}
            className="text-sm font-medium hover:text-accent transition-colors"
          >
            FAQ
          </Link>
        </nav>

        <AuthButton />
      </div>
    </header>
  )
}
