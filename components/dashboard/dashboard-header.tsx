"use client"

import Link from "next/link"
import { Sparkles, Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function DashboardHeader() {
  return (
    <header className="border-b border-white/30 dark:border-white/10 bg-white/20 dark:bg-black/20 backdrop-blur-md sticky top-0 z-50">
      <div className="px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7B61FF] to-[#6C4BFF] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">BrandPulse</h1>
              <p className="text-xs text-foreground/60">Acme Corp Campaign</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="glass-card hover:bg-white/40 dark:hover:bg-white/10 rounded-full"
            >
              <Bell className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="glass-card hover:bg-white/40 dark:hover:bg-white/10 rounded-full"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
