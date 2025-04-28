import Link from "next/link"

interface LogoProps {
  className?: string
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <Link href="/browse" className={className}>
      <span className="font-bold text-2xl tracking-tight">
        <span className="text-white">Popcorn</span>
        <span className="text-red-600">TV</span>
      </span>
    </Link>
  )
} 