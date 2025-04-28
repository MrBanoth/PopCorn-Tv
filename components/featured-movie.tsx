import Link from "next/link"
import { Play, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Movie {
  id: string
  title: string
  description: string
  bannerUrl: string
  videoUrl: string
  releaseYear: number
  duration: string
  genres: string[]
}

interface FeaturedMovieProps {
  movie: Movie
}

export function FeaturedMovie({ movie }: FeaturedMovieProps) {
  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />

      <iframe
        className="w-full h-full absolute inset-0"
        src={`${movie.videoUrl}?autoplay=1&mute=1&controls=0&loop=1&modestbranding=1&showinfo=0&rel=0`}
        title={movie.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      <div className="absolute bottom-0 left-0 right-0 z-20 p-8 md:p-16 md:w-1/2">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-green-500 font-semibold">98% Match</span>
          <span>{movie.releaseYear}</span>
          <span>{movie.duration}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {movie.genres.map((genre, index) => (
            <Badge key={index} variant="outline" className="bg-transparent">
              {genre}
            </Badge>
          ))}
        </div>

        <p className="text-gray-300 mb-6 line-clamp-3">{movie.description}</p>

        <div className="flex gap-4">
          <Button asChild className="bg-white text-black hover:bg-white/90 gap-2">
            <Link href={`/movie/${movie.id}`}>
              <Play className="h-5 w-5 fill-black" /> Play
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href={`/movie/${movie.id}`}>
              <Info className="h-5 w-5" /> More Info
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

