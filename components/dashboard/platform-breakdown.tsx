"use client"

import { getPlatformColor } from "@/components/ui/platform-icons"

const platforms = [
  { name: "X (Twitter)", mentions: 4200, color: getPlatformColor("twitter"), percentage: 33 },
  { name: "Instagram", mentions: 3100, color: getPlatformColor("instagram"), percentage: 24 },
  { name: "Facebook", mentions: 2800, color: getPlatformColor("facebook"), percentage: 22 },
  { name: "TikTok", mentions: 1500, color: getPlatformColor("tiktok"), percentage: 12 },
  { name: "YouTube", mentions: 1247, color: getPlatformColor("youtube"), percentage: 9 },
]

export function PlatformBreakdown() {
  return (
    <div className="space-y-4">
      {platforms.map((platform) => (
        <div key={platform.name} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">{platform.name}</span>
            <span className="text-foreground/60">{platform.mentions.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ backgroundColor: platform.color, width: `${platform.percentage}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}
