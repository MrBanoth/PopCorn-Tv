"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  const navItems = [
    { label: "Home", href: "/browse" },
    { label: "TV Shows", href: "/browse?category=tv" },
    { label: "Movies", href: "/browse?category=movies" },
    { label: "New & Popular", href: "/browse?category=new" },
    { label: "My List", href: "/my-list" },
  ]

  return (
    <nav className="hidden md:flex items-center gap-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm transition-colors hover:text-white",
            pathname === item.href ? "text-white font-medium" : "text-gray-300",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

