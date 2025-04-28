"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Search, Bell, User, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchContentfulData } from "@/lib/contentful"
import { MovieCard } from "@/components/movie-card"
import { MainNav } from "@/components/main-nav"
import { HeroCarousel } from "@/components/hero-carousel"
import { Logo } from "@/components/logo"

interface Movie {
  id: string
  title: string
  description: string
  posterUrl: string
  bannerUrl: string
  videoUrl: string
  releaseYear: number
  duration: string
  genres: string[]
  cast: { name: string; character: string; imageUrl: string }[]
  director: string
}

interface Category {
  id: string
  name: string
  movies: Movie[]
}

export default function BrowsePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    // Check authentication status but don't redirect
    const authStatus = localStorage.getItem("popcorntvAuth")
    setIsAuthenticated(authStatus === "true")

    // Fetch data from Contentful (mocked for now)
    const data = fetchContentfulData()
    setCategories(data.categories)

    // Set featured movie
    if (data.categories.length > 0 && data.categories[0].movies.length > 0) {
      setFeaturedMovie(data.categories[0].movies[0])
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) {
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    // Search across all categories
    const movieResults = categories.flatMap((category) =>
      category.movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    )
    
    // Remove duplicates using Map with movie IDs as keys
    const uniqueMoviesMap = new Map<string, Movie>();
    movieResults.forEach((movie) => {
      uniqueMoviesMap.set(movie.id, movie);
    });
    
    setFilteredMovies(Array.from(uniqueMoviesMap.values()));
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

          <div className="ml-auto flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Search titles..."
                className="w-[200px] bg-gray-900/50 border-gray-700 focus:border-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Link href="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/auth/signin">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="pt-16">
        {!isSearching ? (
          <>
            {categories.length > 0 && (
              <HeroCarousel movies={categories.flatMap((category) => category.movies).slice(0, 5)} />
            )}

            <div className="container mx-auto px-4 py-8 space-y-8">
              {categories.map((category) => (
                <section key={category.id} className="space-y-4">
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {category.movies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} isAuthenticated={isAuthenticated} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        ) : (
          <div className="container mx-auto px-4 py-24">
            <h2 className="text-2xl font-semibold mb-6">Search Results for "{searchQuery}"</h2>

            {filteredMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} isAuthenticated={isAuthenticated} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No results found. Try a different search term.</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

