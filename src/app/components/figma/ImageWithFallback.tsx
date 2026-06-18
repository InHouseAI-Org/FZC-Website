'use client';

import React, { useState } from 'react'
import Image from 'next/image'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

interface ImageWithFallbackProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height'> {
  src?: string;
  alt?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt = '', style, className, fill, width, height, priority, sizes, ...rest } = props

  // Transform path: remove "public/" prefix if present, and ensure it starts with /
  // Handle null, undefined, or empty string by using ERROR_IMG_SRC
  let transformedSrc = (src && src.trim()) ? src : ERROR_IMG_SRC

  if (transformedSrc !== ERROR_IMG_SRC) {
    if (transformedSrc.startsWith('public/')) {
      transformedSrc = transformedSrc.replace('public/', '/')
    } else if (!transformedSrc.startsWith('/') && !transformedSrc.startsWith('http') && !transformedSrc.startsWith('data:')) {
      transformedSrc = '/' + transformedSrc
    }
  }

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" data-original-url={transformedSrc} />
      </div>
    </div>
  ) : fill ? (
    <Image
      src={transformedSrc}
      alt={alt}
      fill
      className={className}
      style={style}
      onError={handleError}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      sizes={sizes || '100vw'}
      quality={85}
      {...(rest as any)}
    />
  ) : (
    <Image
      src={transformedSrc}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      style={style}
      onError={handleError}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      sizes={sizes}
      quality={85}
      {...(rest as any)}
    />
  )
}
