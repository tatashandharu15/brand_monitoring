"use client"

import { Twitter, Facebook, Instagram, Youtube, Linkedin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { getPlatformIcon, getPlatformColor } from "@/components/ui/platform-icons"

interface PlatformData {
  platform?: string
  social_network?: string
  count: number
}

interface RightSidebarProps {
  platforms?: PlatformData[]
  loading?: boolean
}

const defaultPlatforms = [
  { name: "Twitter", icon: Twitter, count: 4521, color: "#1DA1F2" },
  { name: "Facebook", icon: Facebook, count: 3214, color: "#4267B2" },
  { name: "Instagram", icon: Instagram, count: 2847, color: "#E4405F" },
  { name: "TikTok", icon: null, count: 1923, color: "#000000" },
  { name: "YouTube", icon: Youtube, count: 1456, color: "#FF0000" },
  { name: "LinkedIn", icon: Linkedin, count: 987, color: "#0077B5" },
  { name: "Reddit", icon: null, count: 654, color: "#FF4500" },
  { name: "Blogs", icon: null, count: 432, color: "#6b7280" },
  { name: "News", icon: null, count: 321, color: "#6b7280" },
  { name: "Web", icon: null, count: 492, color: "#6b7280" },
]

const getPlatformIconAndColor = (platformName: string) => {
  return {
    icon: getPlatformIcon(platformName, { className: "w-4 h-4" }),
    color: getPlatformColor(platformName)
  }
}

export function RightSidebar({ platforms, loading }: RightSidebarProps) {
  // Create a complete list of all platforms with data from API or 0 count
  const allPlatformNames = ['Twitter', 'Facebook', 'Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'Reddit', 'Blogs', 'News', 'Web']
  
  const displayPlatforms = allPlatformNames.map(platformName => {
    // Find matching platform data from API
    const apiPlatform = platforms?.find(p => {
      const apiPlatformName = (p.platform || p.social_network || '').toLowerCase()
      const targetName = platformName.toLowerCase()
      
      // Handle Twitter/X variations
      if ((targetName === 'twitter' && (apiPlatformName === 'twitter' || apiPlatformName === 'x')) ||
          (targetName === 'x' && (apiPlatformName === 'twitter' || apiPlatformName === 'x'))) {
        return true
      }
      
      return apiPlatformName === targetName
    })
    
    const { icon, color } = getPlatformIconAndColor(platformName)
    
    return {
      name: platformName,
      icon,
      count: apiPlatform ? (typeof apiPlatform.count === 'string' ? parseInt(apiPlatform.count) : apiPlatform.count) : 0,
      color
    }
  })
  return (
    <aside className="hidden xl:block w-80 p-6 space-y-6">
      {/* Platform Breakdown */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-[#111827] mb-4">Mentions by Platform</h3>
        <div className="space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse" />
                    <div className="w-16 h-4 bg-gray-300 rounded animate-pulse" />
                  </div>
                  <div className="w-8 h-4 bg-gray-300 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            displayPlatforms.map((platform) => {
              return (
                <div key={platform.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {platform.icon ? (
                      platform.icon
                    ) : (
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: platform.color }} />
                    )}
                    <span className="text-sm text-[#111827]">{platform.name}</span>
                  </div>
                  <span className="text-sm font-medium text-[#6b7280]">{platform.count}</span>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Performance Slider */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-[#111827] mb-4">Performance</h3>
        <Slider defaultValue={[7]} max={10} step={1} className="mb-2" />
        <div className="flex justify-between text-xs text-[#6b7280]">
          <span>0</span>
          <span>10</span>
        </div>
      </div>

      {/* Sentiment Filters */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-[#111827] mb-4">Sentiment</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-sm text-[#111827]">Positive</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-sm text-[#111827]">Neutral</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-sm text-[#111827]">Negative</span>
          </label>
        </div>
      </div>

      {/* Language Filter */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-[#111827] mb-4">Language</h3>
        <select className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]/50">
          <option>All Languages</option>
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
        </select>
      </div>

      {/* Saved Filters */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-[#111827] mb-4">Saved Filters</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-[#7a6ff0]/20 text-[#7a6ff0] border-[#7a6ff0]/30">
            PDF mentions
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-[#6b7280] border-white/30">
            Untagged
          </Badge>
        </div>
      </div>
    </aside>
  )
}
