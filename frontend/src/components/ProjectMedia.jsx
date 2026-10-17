import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

function ProjectMedia({ media, title }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const videoRef = useRef(null)
  const frameRef = useRef(null)
  const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const activeMedia = media[activeIndex]
  const aspect = activeMedia?.aspect || '16 / 10'

  const pauseVideo = useCallback((reset = false) => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    if (reset) video.currentTime = 0
    setIsPlaying(false)
  }, [])

  const playVideo = useCallback((manual = false) => {
    const video = videoRef.current
    if (!video || (shouldReduceMotion && !manual)) return
    video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
  }, [shouldReduceMotion])

  useEffect(() => {
    if (!activeMedia || activeMedia.type !== 'video') return undefined
    const frame = frameRef.current
    const video = videoRef.current
    if (!frame || !video) return undefined

    const canHover = window.matchMedia('(hover: hover)').matches
    if (shouldReduceMotion) return undefined

    if (canHover) {
      const play = () => playVideo()
      const pause = () => pauseVideo(true)
      frame.addEventListener('mouseenter', play)
      frame.addEventListener('focusin', play)
      frame.addEventListener('mouseleave', pause)
      frame.addEventListener('focusout', pause)
      return () => {
        frame.removeEventListener('mouseenter', play)
        frame.removeEventListener('focusin', play)
        frame.removeEventListener('mouseleave', pause)
        frame.removeEventListener('focusout', pause)
        pauseVideo(true)
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.6) playVideo()
      else pauseVideo()
    }, { threshold: [0, 0.6] })
    observer.observe(frame)
    return () => {
      observer.disconnect()
      pauseVideo(true)
    }
  }, [activeIndex, activeMedia, pauseVideo, playVideo, shouldReduceMotion])

  useEffect(() => {
    const frame = frameRef.current
    if (!frame || !activeMedia || activeMedia.type !== 'video') return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) pauseVideo()
    })
    observer.observe(frame)
    return () => observer.disconnect()
  }, [activeIndex, activeMedia, pauseVideo])

  const changeMedia = (nextIndex) => {
    pauseVideo(true)
    if (!shouldReduceMotion) setIsFading(true)
    setActiveIndex(nextIndex)
    if (!shouldReduceMotion) window.setTimeout(() => setIsFading(false), 150)
  }

  if (!activeMedia) {
    return (
      <div className="project-media">
        <div className="media-frame media-placeholder" style={{ aspectRatio: '16 / 10' }}>
          <span>{title}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`project-media${isFading ? ' is-fading' : ''}`}>
      <div
        className={`media-frame${activeMedia.aspect === '9 / 16' ? ' media-frame--portrait' : ''}`}
        ref={frameRef}
        style={{ aspectRatio: aspect }}
      >
        {activeMedia.type === 'image' ? (
          <img src={activeMedia.src} alt={activeMedia.alt} loading="lazy" decoding="async" />
        ) : (
          <>
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="metadata"
              poster={activeMedia.poster}
              aria-label={activeMedia.alt}
            >
              <source src={activeMedia.src} />
            </video>
            <button
              className="media-play-button"
              type="button"
              aria-label={isPlaying ? `Pause ${title} video` : `Play ${title} video`}
              onClick={() => (isPlaying ? pauseVideo() : playVideo(true))}
            >
              {isPlaying ? <Pause aria-hidden="true" size={14} /> : <Play aria-hidden="true" size={14} />}
            </button>
          </>
        )}
      </div>
      {media.length > 1 && (
        <div className="media-switcher">
          <span>{activeIndex + 1} / {media.length}</span>
          <button type="button" aria-label={`Previous ${title} media`} onClick={() => changeMedia((activeIndex - 1 + media.length) % media.length)}>
            <ChevronLeft aria-hidden="true" size={14} />
          </button>
          <button type="button" aria-label={`Next ${title} media`} onClick={() => changeMedia((activeIndex + 1) % media.length)}>
            <ChevronRight aria-hidden="true" size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

export default ProjectMedia
