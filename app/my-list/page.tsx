"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { MovieCard } from "@/components/movie-card"
import { Logo } from "@/components/logo"

interface Movie {
  id: string
  title: string
  description: string
  posterUrl: string
  releaseYear: number
  duration: string
  genres: string[]
}

export default function MyListPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [myList, setMyList] = useState<Movie[]>([])

  useEffect(() => {
    // Check authentication
    const authStatus = localStorage.getItem("popcorntvAuth")

    if (!authStatus || authStatus !== "true") {
      router.push("/auth/signin")
      return
    }

    setIsAuthenticated(true)

    // Get my list from local storage
    const myListJSON = localStorage.getItem("popcorntvMyList")

    if (myListJSON) {
      setMyList(JSON.parse(myListJSON))
    }
  }, [router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <div className="flex items-center">
            <Link href="/browse">
              <Logo className="mr-8" />
            </Link>
            <MainNav />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8">My List</h1>

        {myList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {myList.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl mb-4">Your list is empty</h2>
            <p className="text-gray-400 mb-6">Add movies and TV shows to your list to watch them later.</p>
            <Link href="/browse">
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded">Browse Content</button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

