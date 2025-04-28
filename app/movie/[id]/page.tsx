"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Play, Plus, ThumbsUp, Share2, ArrowLeft, Check, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MainNav } from "@/components/main-nav"
import { fetchMovieById, fetchMoviesByGenre } from "@/lib/contentful"
import { VideoPlayerModal } from "@/components/video-player-modal"
import { useToast } from "@/components/ui/use-toast"
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

export default function MoviePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [movie, setMovie] = useState<Movie | null>(null)
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [isInMyList, setIsInMyList] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([])
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  // We'll now handle params directly without use()
  const movieId = params.id

  useEffect(() => {
    // Check authentication status but don't redirect
    const authStatus = localStorage.getItem("popcorntvAuth")
    setIsAuthenticated(authStatus === "true")

    // Fetch movie data using params
    const movieData = fetchMovieById(movieId)

    if (movieData) {
      setMovie(movieData)

      // Fetch related movies based on the movie's genres
      if (movieData.genres.length > 0) {
        // Get random genre from the movie's genres
        const randomGenre = movieData.genres[Math.floor(Math.random() * movieData.genres.length)]
        // Fetch movies by that genre
        const genreMovies = fetchMoviesByGenre(randomGenre)
        // Filter out the current movie and limit to 4 related movies
        const filteredMovies = genreMovies
          .filter(m => m.id !== movieData.id)
          .slice(0, 4)
        
        setRelatedMovies(filteredMovies)
      }

      // Check if movie is in my list (only if authenticated)
      if (authStatus === "true") {
        const myListJSON = localStorage.getItem("popcorntvMyList")
        if (myListJSON) {
          const myList = JSON.parse(myListJSON)
          setIsInMyList(myList.some((item: Movie) => item.id === movieData.id))
        }
      }
    } else {
      // Handle case where movie is not found
      toast({
        title: "Movie not found",
        description: "The requested movie could not be found.",
        variant: "destructive",
      })
      router.push("/browse")
    }

    setIsLoading(false)
  }, [movieId, router, toast])

  const toggleMyList = () => {
    if (!movie) return
    
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

  // Function to handle opening the video player modal
  const handlePlayClick = () => {
    if (!isAuthenticated) {
      router.push("/auth/signin")
      return
    }
    
    // Pause the background video by postMessage
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    }
    setShowVideoPlayer(true)
  }
  
  // Function to handle closing the video player modal
  const handleCloseVideoPlayer = () => {
    setShowVideoPlayer(false)
    // Optionally resume playing the background video
    // Uncomment if you want the background video to resume playing
    /*
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    }
    */
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Movie not found</h2>
          <Button onClick={() => router.push("/browse")}>Back to Browse</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <div className="flex items-center">
            <Logo className="mr-8" />
            <MainNav />
          </div>
          {!isAuthenticated && (
            <div className="ml-auto">
              <Link href="/auth/signin">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-20 left-4 z-10 bg-black/50 rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="relative w-full h-[70vh]">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />

          <iframe
            ref={iframeRef}
            className="w-full h-full"
            src={`${movie.videoUrl}?autoplay=1&mute=1&controls=0&loop=1&modestbranding=1&showinfo=0&rel=0&enablejsapi=1`}
            title={movie.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>

          <div className="absolute bottom-0 left-0 right-0 z-20 p-8">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-green-500 font-semibold">98% Match</span>
              <span>{movie.releaseYear}</span>
              <span>{movie.duration}</span>
              <span className="border border-gray-600 px-1 text-xs">HD</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre, index) => (
                <Badge key={index} variant="outline" className="bg-transparent">
                  {genre}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <Button className="bg-white text-black hover:bg-white/90 gap-2" onClick={handlePlayClick}>
                {isAuthenticated ? (
                  <>
                    <Play className="h-5 w-5 fill-black" /> Play
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" /> Watch Now
                  </>
                )}
              </Button>
              <Button variant="outline" size="icon" onClick={toggleMyList}>
                {isAuthenticated && isInMyList ? <Check className="h-5 w-5 text-green-500" /> : <Plus className="h-5 w-5" />}
              </Button>
              <Button variant="outline" size="icon">
                <ThumbsUp className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <p className="text-gray-300 max-w-3xl">{movie.description}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">About {movie.title}</h2>
                <p className="text-gray-300">{movie.description}</p>
                <p className="mt-4 text-gray-400">Director: {movie.director}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Cast</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {movie.cast.map((actor, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={actor.imageUrl} alt={actor.name} />
                        <AvatarFallback>{actor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{actor.name}</p>
                        <p className="text-gray-400 text-sm">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div>
              <section>
                <h2 className="text-2xl font-semibold mb-4">More Like This</h2>
                <div className="grid grid-cols-2 gap-4">
                  {relatedMovies.map((relatedMovie) => (
                    <Link key={relatedMovie.id} href={`/movie/${relatedMovie.id}`}>
                      <div className="group">
                        <Image
                          src={relatedMovie.posterUrl || "/placeholder.svg?height=300&width=200"}
                          alt={relatedMovie.title}
                          width={200}
                          height={300}
                          className="w-full rounded-md object-cover aspect-[2/3] mb-2"
                        />
                        <p className="line-clamp-1 group-hover:text-white/80">{relatedMovie.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {showVideoPlayer && (
        <VideoPlayerModal
          videoUrl={movie.videoUrl}
          title={movie.title}
          onClose={handleCloseVideoPlayer}
        />
      )}
    </div>
  )
}

