'use client';

import { useEffect, useRef, useState } from 'react';

interface LazyVideoProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  className?: string;
  onEnded?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  onLoadedMetadata?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
}

export function LazyVideo({
  src,
  poster,
  autoPlay = false,
  loop = false,
  muted = true,
  playsInline = true,
  className = '',
  onEnded,
  onLoadedMetadata,
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoaded) {
            setIsInView(true);
            setHasLoaded(true);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before video enters viewport
        threshold: 0.1,
      }
    );

    observer.observe(video);

    return () => {
      if (video) {
        observer.unobserve(video);
      }
    };
  }, [hasLoaded]);

  // Auto-play when video is loaded and in view
  useEffect(() => {
    if (isInView && autoPlay && videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log('Video autoplay prevented:', err);
      });
    }
  }, [isInView, autoPlay]);

  return (
    <video
      ref={videoRef}
      poster={poster}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      className={className}
      onEnded={onEnded}
      onLoadedMetadata={onLoadedMetadata}
      preload="none"
    >
      {isInView && <source src={src} type="video/webm" />}
    </video>
  );
}
