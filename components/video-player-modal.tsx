"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoPlayerModalProps {
  videoUrl: string
  title: string
  onClose: () => void
  isOpen?: boolean
}

export function VideoPlayerModal({ videoUrl, title, onClose, isOpen = true }: VideoPlayerModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside)

    // Prevent scrolling on body
    document.body.style.overflow = "hidden"

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [onClose])

  // Extract YouTube video ID if full URL is provided
  const getYouTubeId = (url: string) => {
    if (url.includes("youtube.com/embed/")) {
      return url.split("/").pop()
    }

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : url
  }

  if (!isOpen) return null

  const videoId = getYouTubeId(videoUrl)
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0`

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <div ref={modalRef} className="relative w-full h-full max-w-7xl max-h-[90vh]">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 rounded-full"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>

        <iframe
          className="w-full h-full"
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  )
}

