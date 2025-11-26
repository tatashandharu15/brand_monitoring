"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  MessageSquare,
  BarChart3,
  Users,
  Globe,
  Settings,
  Sparkles,
  GitCompare,
  FileText,
  Bell,
  UsersRound,
} from "lucide-react"

const navItems = [
  { icon: MessageSquare, label: "Mentions", href: "/dashboard" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Users, label: "Influencers", href: "/dashboard/influencers" },
  { icon: Globe, label: "Sites", href: "/dashboard/sites" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: Sparkles, label: "AI Assistant", href: "/dashboard/ai-assistant" },
  { icon: GitCompare, label: "Comparison", href: "/dashboard/comparison" },
  { icon: FileText, label: "Reports", href: "/dashboard/reports" },
  { icon: Bell, label: "Alerts", href: "/dashboard/alerts" },
  { icon: UsersRound, label: "Team Members", href: "/dashboard/team" },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white/10 backdrop-blur-xl border-r border-white/20 z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#7a6ff0] to-[#6dd5ed] bg-clip-text text-transparent">
            BrandMonitor
          </h1>
        </div>

        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#7a6ff0] to-[#6dd5ed] text-white shadow-lg shadow-purple-500/30"
                    : "text-[#6b7280] hover:bg-white/20 hover:text-[#111827]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30" />
      )}
    </>
  )
}
