"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MobileTouchHandler } from "./mobile-touch-handler"
import { cn } from "@/lib/utils"

interface MobileOptimizedCardProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  onTap?: () => void
  onLongPress?: () => void
  interactive?: boolean
}

export function MobileOptimizedCard({
  title,
  description,
  children,
  className,
  onTap,
  onLongPress,
  interactive = false,
}: MobileOptimizedCardProps) {
  const CardWrapper = interactive ? MobileTouchHandler : "div"
  const cardProps = interactive ? { onTap, onLongPress } : {}

  return (
    <CardWrapper {...cardProps}>
      <Card
        className={cn(
          "mobile-card-enhanced mobile-transition",
          interactive && "cursor-pointer hover:shadow-lg",
          className,
        )}
      >
        {(title || description) && (
          <CardHeader className="pb-3">
            {title && <CardTitle className="text-lg mobile-text-balance">{title}</CardTitle>}
            {description && <CardDescription className="text-sm">{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent className={cn("mobile-spacing", !(title || description) && "pt-6")}>{children}</CardContent>
      </Card>
    </CardWrapper>
  )
}
