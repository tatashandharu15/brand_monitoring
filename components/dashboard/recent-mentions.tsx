"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const mentions = [
  {
    id: 1,
    user: "Sarah Johnson",
    username: "@sarahj",
    avatar: "/placeholder.svg?height=40&width=40",
    platform: "Twitter",
    sentiment: "positive",
    text: "Just tried the new Acme Corp product and I'm blown away! Best purchase this year.",
    time: "2 hours ago",
  },
  {
    id: 2,
    user: "Mike Chen",
    username: "@mikechen",
    avatar: "/placeholder.svg?height=40&width=40",
    platform: "Instagram",
    sentiment: "neutral",
    text: "Acme Corp's customer service is okay, nothing special but gets the job done.",
    time: "4 hours ago",
  },
  {
    id: 3,
    user: "Emma Davis",
    username: "@emmad",
    avatar: "/placeholder.svg?height=40&width=40",
    platform: "Facebook",
    sentiment: "positive",
    text: "Highly recommend Acme Corp to anyone looking for quality products!",
    time: "6 hours ago",
  },
  {
    id: 4,
    user: "Alex Turner",
    username: "@alexturner",
    avatar: "/placeholder.svg?height=40&width=40",
    platform: "TikTok",
    sentiment: "negative",
    text: "Not impressed with Acme Corp's latest release. Expected better quality.",
    time: "8 hours ago",
  },
]

export function RecentMentions() {
  return (
    <div className="space-y-4">
      {mentions.map((mention) => (
        <div key={mention.id} className="flex gap-4 p-4 rounded-2xl glass-card hover:bg-white/40 transition-all">
          <Avatar className="w-10 h-10">
            <AvatarImage src={mention.avatar || "/placeholder.svg"} alt={mention.user} />
            <AvatarFallback>{mention.user[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-foreground text-sm">{mention.user}</span>
              <span className="text-foreground/50 text-xs">{mention.username}</span>
              <Badge
                variant="secondary"
                className={`text-xs ${
                  mention.sentiment === "positive"
                    ? "bg-green-100 text-green-700"
                    : mention.sentiment === "negative"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {mention.sentiment}
              </Badge>
            </div>
            <p className="text-sm text-foreground/80 mb-2">{mention.text}</p>
            <div className="flex items-center gap-3 text-xs text-foreground/50">
              <span>{mention.platform}</span>
              <span>•</span>
              <span>{mention.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
