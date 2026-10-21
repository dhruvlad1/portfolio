import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

function ProjectMedia({ media, title }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const [failedMedia, setFailedMedia] = useState(() => new Set())
  const [detectedAspects, setDetectedAspects] = useState({})
  const videoRef = useRef(null)
  const frameRef = useRef(null)
  const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const activeMedia = media[activeIndex]
  const activeMediaFailed = activeMedia ? failedMedia.has(activeMedia.src) : false
  const availableIndices = media.reduce((indices, item, index) => {
    if (!failedMedia.has(item.src)) indices.push(index)
    return indices
  }, [])
  const firstAspect = media[0]?.aspect || detectedAspects[media[0]?.src] || '16 / 10'
  const aspect = activeMedia?.aspect || detectedAspects[activeMedia?.src] || firstAspect
  const aspectParts = aspect.split('/').map(Number)
  const isPortrait = aspectParts.length === 2 && aspectParts[0] / aspectParts[1] < 1

  const handleMediaLoad = (item, width, height) => {
    if (item.aspect || !width || !height) return
    setDetectedAspects((current) => (
      current[item.src] ? current : { ...current, [item.src]: `${width} / ${height}` }
    ))
  }

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

  const markMediaFailed = useCallback((src) => {
    setFailedMedia((current) => {
      if (current.has(src)) return current
      const next = new Set(current)
      next.add(src)
      return next
    })
    setIsPlaying(false)

    const nextIndex = media.findIndex((item, index) => index !== activeIndex && !failedMedia.has(item.src) && item.src !== src)
    if (nextIndex !== -1) setActiveIndex(nextIndex)
  }, [activeIndex, failedMedia, media])

  useEffect(() => {
    if (!activeMedia || activeMedia.type !== 'video' || activeMediaFailed) return undefined
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
  }, [activeIndex, activeMedia, activeMediaFailed, pauseVideo, playVideo, shouldReduceMotion])

  useEffect(() => {
    const frame = frameRef.current
    if (!frame || !activeMedia || activeMedia.type !== 'video' || activeMediaFailed) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) pauseVideo()
    })
    observer.observe(frame)
    return () => observer.disconnect()
  }, [activeIndex, activeMedia, activeMediaFailed, pauseVideo])

  const changeMedia = (nextIndex) => {
    pauseVideo(true)
    if (!shouldReduceMotion) setIsFading(true)
    setActiveIndex(nextIndex)
    if (!shouldReduceMotion) window.setTimeout(() => setIsFading(false), 150)
  }

  if (!activeMedia || activeMediaFailed) {
    return (
      <div className={`project-media${isFading ? ' is-fading' : ''}`}>
        <div className="media-frame media-placeholder" style={{ aspectRatio: firstAspect }}>
          <span>{title}</span>
        </div>
        {availableIndices.length > 1 && (
          <div className="media-switcher">
            <span>{availableIndices.indexOf(activeIndex) + 1} / {availableIndices.length}</span>
            <button type="button" aria-label={`Previous ${title} media`} onClick={() => changeMedia(availableIndices[(availableIndices.indexOf(activeIndex) - 1 + availableIndices.length) % availableIndices.length])}>
              <ChevronLeft aria-hidden="true" size={14} />
            </button>
            <button type="button" aria-label={`Next ${title} media`} onClick={() => changeMedia(availableIndices[(availableIndices.indexOf(activeIndex) + 1) % availableIndices.length])}>
              <ChevronRight aria-hidden="true" size={14} />
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`project-media${isFading ? ' is-fading' : ''}`}>
      <div
        className={`media-frame${isPortrait ? ' media-frame--portrait' : ''}`}
        ref={frameRef}
        style={{ aspectRatio: aspect }}
      >
        {activeMedia.type === 'image' ? (
          <img src={activeMedia.src} alt={activeMedia.alt} loading="lazy" decoding="async" onLoad={(event) => handleMediaLoad(activeMedia, event.currentTarget.naturalWidth, event.currentTarget.naturalHeight)} onError={() => markMediaFailed(activeMedia.src)} />
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
              onLoadedMetadata={(event) => handleMediaLoad(activeMedia, event.currentTarget.videoWidth, event.currentTarget.videoHeight)}
              onError={() => markMediaFailed(activeMedia.src)}
            >
              <source src={activeMedia.src} onError={() => markMediaFailed(activeMedia.src)} />
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
      {availableIndices.length > 1 && (
        <div className="media-switcher">
          <span>{availableIndices.indexOf(activeIndex) + 1} / {availableIndices.length}</span>
          <button type="button" aria-label={`Previous ${title} media`} onClick={() => changeMedia(availableIndices[(availableIndices.indexOf(activeIndex) - 1 + availableIndices.length) % availableIndices.length])}>
            <ChevronLeft aria-hidden="true" size={14} />
          </button>
          <button type="button" aria-label={`Next ${title} media`} onClick={() => changeMedia(availableIndices[(availableIndices.indexOf(activeIndex) + 1) % availableIndices.length])}>
            <ChevronRight aria-hidden="true" size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

export default ProjectMedia
