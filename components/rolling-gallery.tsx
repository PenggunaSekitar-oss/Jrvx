"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useAnimation, useTransform } from "framer-motion"

const IMGS = [
  "/placeholder.svg?height=200&width=300&text=AI+Art",
  "/placeholder.svg?height=200&width=300&text=Digital+Art",
  "/placeholder.svg?height=200&width=300&text=3D+Render",
  "/placeholder.svg?height=200&width=300&text=Photo+Real",
  "/placeholder.svg?height=200&width=300&text=Anime+Style",
  "/placeholder.svg?height=200&width=300&text=Cyberpunk",
  "/placeholder.svg?height=200&width=300&text=Fantasy",
  "/placeholder.svg?height=200&width=300&text=Portrait",
  "/placeholder.svg?height=200&width=300&text=Landscape",
  "/placeholder.svg?height=200&width=300&text=Abstract",
]

interface RollingGalleryProps {
  autoplay?: boolean
  pauseOnHover?: boolean
  images?: string[]
  isDarkMode?: boolean
}

const RollingGallery = ({
  autoplay = true,
  pauseOnHover = true,
  images = [],
  isDarkMode = false,
}: RollingGalleryProps) => {
  images = images.length > 0 ? images : IMGS

  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateScreenSize() // Set initial value
    window.addEventListener("resize", updateScreenSize)
    return () => window.removeEventListener("resize", updateScreenSize)
  }, [])

  // Mobile-first responsive 3D geometry
  const getResponsiveValues = () => {
    const width = screenSize.width

    if (width < 360) {
      // Very small mobile
      return {
        cylinderWidth: 320,
        imageWidth: 80,
        imageHeight: 50,
        padding: "8%",
      }
    } else if (width < 480) {
      // Extra small mobile
      return {
        cylinderWidth: 400,
        imageWidth: 100,
        imageHeight: 60,
        padding: "8%",
      }
    } else if (width < 640) {
      // Small mobile
      return {
        cylinderWidth: 500,
        imageWidth: 120,
        imageHeight: 70,
        padding: "8%",
      }
    } else if (width < 768) {
      // Large mobile / small tablet
      return {
        cylinderWidth: 700,
        imageWidth: 150,
        imageHeight: 85,
        padding: "6%",
      }
    } else if (width < 1024) {
      // Tablet
      return {
        cylinderWidth: 1000,
        imageWidth: 180,
        imageHeight: 100,
        padding: "6%",
      }
    } else {
      // Desktop
      return {
        cylinderWidth: 1400,
        imageWidth: 240,
        imageHeight: 130,
        padding: "5%",
      }
    }
  }

  const responsive = getResponsiveValues()
  const faceCount = images.length
  const faceWidth = (responsive.cylinderWidth / faceCount) * 1.5
  const radius = responsive.cylinderWidth / (2 * Math.PI)

  // Framer Motion
  const dragFactor = 0.05
  const rotation = useMotionValue(0)
  const controls = useAnimation()

  // Convert rotation -> 3D transform
  const transform = useTransform(rotation, (val) => `rotate3d(0,1,0,${val}deg)`)

  const startInfiniteSpin = (startAngle: number) => {
    controls.start({
      rotateY: [startAngle, startAngle - 360],
      transition: {
        duration: 25, // Slower for better mobile experience
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
      },
    })
  }

  useEffect(() => {
    if (autoplay && screenSize.width > 0) {
      const currentAngle = rotation.get()
      startInfiniteSpin(currentAngle)
    } else {
      controls.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, screenSize.width])

  const handleUpdate = (latest: any) => {
    if (typeof latest.rotateY === "number") {
      rotation.set(latest.rotateY)
    }
  }

  const handleDrag = (_: any, info: any) => {
    controls.stop()
    rotation.set(rotation.get() + info.offset.x * dragFactor)
  }

  const handleDragEnd = (_: any, info: any) => {
    const finalAngle = rotation.get() + info.velocity.x * dragFactor
    rotation.set(finalAngle)

    if (autoplay) {
      startInfiniteSpin(finalAngle)
    }
  }

  const handleMouseEnter = () => {
    if (autoplay && pauseOnHover && screenSize.width >= 768) {
      controls.stop()
    }
  }

  const handleMouseLeave = () => {
    if (autoplay && pauseOnHover && screenSize.width >= 768) {
      const currentAngle = rotation.get()
      startInfiniteSpin(currentAngle)
    }
  }

  const gradientColor = isDarkMode ? "#000000" : "#ffffff"

  // Don't render until we have screen size
  if (screenSize.width === 0) {
    return (
      <div className="h-[300px] sm:h-[400px] lg:h-[500px] w-full flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading gallery...</div>
      </div>
    )
  }

  return (
    <div className="relative h-[200px] xs:h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden">
      {/* Gradient overlays - responsive */}
      <div
        className="absolute top-0 left-0 h-full w-[24px] sm:w-[32px] lg:w-[48px] z-10"
        style={{
          background: `linear-gradient(to left, rgba(0,0,0,0) 0%, ${gradientColor} 100%)`,
        }}
      />
      <div
        className="absolute top-0 right-0 h-full w-[24px] sm:w-[32px] lg:w-[48px] z-10"
        style={{
          background: `linear-gradient(to right, rgba(0,0,0,0) 0%, ${gradientColor} 100%)`,
        }}
      />

      <div className="flex h-full items-center justify-center overflow-hidden [perspective:400px] sm:[perspective:600px] lg:[perspective:800px] [transform-style:preserve-3d] max-w-full">
        <motion.div
          drag="x"
          dragElastic={0}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          animate={controls}
          onUpdate={handleUpdate}
          style={{
            transform: transform,
            rotateY: rotation,
            width: Math.min(responsive.cylinderWidth, screenSize.width * 0.9), // Constrain to 90% of screen width
            transformStyle: "preserve-3d",
          }}
          className="flex min-h-[120px] sm:min-h-[160px] lg:min-h-[200px] cursor-grab items-center justify-center [transform-style:preserve-3d] active:cursor-grabbing touch-pan-x"
        >
          {images.map((url, i) => (
            <div
              key={i}
              className="group absolute flex h-fit items-center justify-center [backface-visibility:hidden]"
              style={{
                width: `${faceWidth}px`,
                transform: `rotateY(${(360 / faceCount) * i}deg) translateZ(${radius}px)`,
                padding: responsive.padding,
              }}
            >
              <img
                src={url || "/placeholder.svg"}
                alt={`JARVX Gallery ${i + 1}`}
                style={{
                  width: `${responsive.imageWidth}px`,
                  height: `${responsive.imageHeight}px`,
                }}
                className={`pointer-events-none rounded-[8px] sm:rounded-[12px] lg:rounded-[15px] border-[2px] sm:border-[3px] object-cover
                           transition-transform duration-300 ease-out group-hover:scale-105
                           ${isDarkMode ? "border-gray-700" : "border-white"}`}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default RollingGallery
