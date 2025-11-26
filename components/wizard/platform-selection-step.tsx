"use client"

import { Check } from "lucide-react"
import { getPlatformIcon, getPlatformColor } from "@/components/ui/platform-icons"

interface PlatformSelectionStepProps {
  data: {
    platforms: string[]
  }
  onUpdate: (data: { platforms: string[] }) => void
}

const platforms = [
  { id: "twitter", name: "X (Twitter)", color: "from-black to-gray-800" },
  { id: "facebook", name: "Facebook", color: "from-blue-600 to-blue-700" },
  { id: "instagram", name: "Instagram", color: "from-pink-500 to-purple-600" },
  { id: "tiktok", name: "TikTok", color: "from-black to-teal-500" },
  { id: "youtube", name: "YouTube", color: "from-red-600 to-red-700" },
  { id: "linkedin", name: "LinkedIn", color: "from-blue-700 to-blue-800" },
  { id: "reddit", name: "Reddit", color: "from-orange-500 to-orange-600" },
  { id: "news", name: "News Sites", color: "from-gray-700 to-gray-800" },
]

export function PlatformSelectionStep({ data, onUpdate }: PlatformSelectionStepProps) {
  const togglePlatform = (platformId: string) => {
    const newPlatforms = data.platforms.includes(platformId)
      ? data.platforms.filter((p) => p !== platformId)
      : [...data.platforms, platformId]
    onUpdate({ platforms: newPlatforms })
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Choose your platforms</h2>
        <p className="text-foreground/70 text-lg">Select where you want to monitor your brand mentions</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {platforms.map((platform) => {
          const isSelected = data.platforms.includes(platform.id)
          return (
            <button
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              className={`relative glass-card rounded-2xl p-6 hover:scale-105 transition-all ${
                isSelected ? "ring-2 ring-[#7B61FF]" : ""
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-br from-[#7B61FF] to-[#6C4BFF] flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-white text-xl font-bold mb-3 mx-auto`}
              >
                <div className="text-white">
                  {getPlatformIcon(platform.id, { className: "w-6 h-6" })}
                </div>
              </div>
              <p className="text-sm font-medium text-foreground text-center">{platform.name}</p>
            </button>
          )
        })}
      </div>

      <div className="glass-card rounded-2xl p-4 bg-blue-50/50">
        <p className="text-sm text-foreground/70 text-center">
          <span className="font-semibold">{data.platforms.length}</span> platform
          {data.platforms.length !== 1 ? "s" : ""} selected
        </p>
      </div>
    </div>
  )
}
