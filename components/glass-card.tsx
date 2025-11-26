import type React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div className={cn("glass-card rounded-3xl", hover && "hover:scale-105 transition-transform", className)}>
      {children}
    </div>
  )
}
