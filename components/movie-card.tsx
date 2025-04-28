"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Play, Plus, Check, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface Movie {
  id: string
  title: string
  description: string
  posterUrl: string
  releaseYear: number
  duration: string
  genres: string[]
}

interface MovieCardProps {
  movie: Movie
  isAuthenticated: boolean
}

export function MovieCard({ movie, isAuthenticated }: MovieCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isInMyList, setIsInMyList] = useState(false)

  useEffect(() => {
    // Check if movie is in my list
    if (isAuthenticated) {
      const myListJSON = localStorage.getItem("popcorntvMyList")
      if (myListJSON) {
        const myList = JSON.parse(myListJSON)
        setIsInMyList(myList.some((item: Movie) => item.id === movie.id))
      }
    }
  }, [movie.id, isAuthenticated])

  const toggleMyList = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      router.push("/auth/signin")
      return
    }

    let myList: Movie[] = []
    const myListJSON = localStorage.getItem("popcorntvMyList")

    if (myListJSON) {
      myList = JSON.parse(myListJSON)
    }

    if (isInMyList) {
      // Remove from my list
      myList = myList.filter((item) => item.id !== movie.id)
      toast({
        title: "Removed from My List",
        description: `"${movie.title}" has been removed from your list.`,
      })
    } else {
      // Add to my list
      myList.push(movie)
      toast({
        title: "Added to My List",
        description: `"${movie.title}" has been added to your list.`,
      })
    }

    localStorage.setItem("popcorntvMyList", JSON.stringify(myList))
    setIsInMyList(!isInMyList)
  }

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isAuthenticated) {
      router.push(`/movie/${movie.id}`)
    } else {
      router.push("/auth/signin")
    }
  }

  return (
    <div className="movie-card relative group">
      <Link href={isAuthenticated ? `/movie/${movie.id}` : "/auth/signin"} className="block">
        <Image
          src={movie.posterUrl || "/placeholder.svg?height=300&width=200"}
          alt={movie.title}
          width={200}
          height={300}
          className="w-full rounded-md object-cover aspect-[2/3]"
        />
        <div className="movie-card-overlay">
          <h3 className="font-medium line-clamp-1">{movie.title}</h3>
          <div className="flex items-center text-xs text-gray-300 mt-1">
            <span>{movie.releaseYear}</span>
            <span className="mx-1">•</span>
            <span>{movie.duration}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <Button 
              size="sm" 
              variant="default" 
              className="w-full bg-white text-black hover:bg-white/90" 
              onClick={handlePlayClick}
            >
              {isAuthenticated ? (
                <>
                  <Play className="h-4 w-4 fill-black mr-1" /> Play
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-1" /> Watch Now
                </>
              )}
            </Button>
            <Button size="sm" variant="outline" className="w-8 h-8 p-0" onClick={toggleMyList}>
              {isAuthenticated && isInMyList ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Link>
    </div>
  )
}

