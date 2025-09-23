"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface MobileTouchHandlerProps {
  children: React.ReactNode
  onTap?: () => void
  onLongPress?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  className?: string
  disabled?: boolean
}

export function MobileTouchHandler({
  children,
  onTap,
  onLongPress,
  onSwipeLeft,
  onSwipeRight,
  className = "",
  disabled = false,
}: MobileTouchHandlerProps) {
  const touchRef = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const element = touchRef.current
    if (!element || disabled) return

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      }

      // Start long press timer
      if (onLongPress) {
        longPressTimerRef.current = setTimeout(() => {
          onLongPress()
          // Add haptic feedback if available
          if ("vibrate" in navigator) {
            navigator.vibrate(50)
          }
        }, 500)
      }

      // Add visual feedback
      element.style.transform = "scale(0.98)"
      element.style.opacity = "0.8"
    }

    const handleTouchMove = (e: TouchEvent) => {
      // Cancel long press if finger moves too much
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
      }

      // Reset visual feedback
      element.style.transform = ""
      element.style.opacity = ""
    }

    const handleTouchEnd = (e: TouchEvent) => {
      // Clear long press timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
      }

      // Reset visual feedback
      element.style.transform = ""
      element.style.opacity = ""

      if (!touchStartRef.current) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartRef.current.x
      const deltaY = touch.clientY - touchStartRef.current.y
      const deltaTime = Date.now() - touchStartRef.current.time

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const isSwipe = distance > 50 && deltaTime < 300

      if (isSwipe) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight()
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft()
          }
        }
      } else if (distance < 10 && deltaTime < 500 && onTap) {
        // Tap
        onTap()
        // Add haptic feedback if available
        if ("vibrate" in navigator) {
          navigator.vibrate(10)
        }
      }

      touchStartRef.current = null
    }

    element.addEventListener("touchstart", handleTouchStart, { passive: true })
    element.addEventListener("touchmove", handleTouchMove, { passive: true })
    element.addEventListener("touchend", handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener("touchstart", handleTouchStart)
      element.removeEventListener("touchmove", handleTouchMove)
      element.removeEventListener("touchend", handleTouchEnd)

      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
      }
    }
  }, [onTap, onLongPress, onSwipeLeft, onSwipeRight, disabled])

  return (
    <div
      ref={touchRef}
      className={`mobile-touch-handler transition-all duration-200 ${className}`}
      style={{ touchAction: "manipulation" }}
    >
      {children}
    </div>
  )
}
