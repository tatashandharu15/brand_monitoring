"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Tag, Ban, FileText, Trash2 } from "lucide-react"

const posts = [
  {
    id: 1,
    user: "Sarah Johnson",
    username: "@sarahj",
    avatar: "/placeholder.svg?height=40&width=40",
    platform: "Twitter",
    followers: "12.5K",
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
    followers: "8.2K",
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
    followers: "15.8K",
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
    followers: "24.1K",
    sentiment: "negative",
    text: "Not impressed with Acme Corp's latest release. Expected better quality.",
    time: "8 hours ago",
  },
]

export function PostsFeed() {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 hover:bg-white/20 transition-all"
        >
          <div className="flex gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={post.avatar || "/placeholder.svg"} alt={post.user} />
              <AvatarFallback>{post.user[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#111827]">{post.user}</span>
                    <span className="text-[#6b7280] text-sm">{post.username}</span>
                    <span className="text-[#6b7280] text-sm">• {post.followers} followers</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[#6b7280]">{post.platform}</span>
                    <span className="text-xs text-[#6b7280]">• {post.time}</span>
                  </div>
                </div>

                <Badge
                  className={`${
                    post.sentiment === "positive"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : post.sentiment === "negative"
                        ? "bg-red-100 text-red-700 border-red-200"
                        : "bg-yellow-100 text-yellow-700 border-yellow-200"
                  }`}
                >
                  {post.sentiment}
                </Badge>
              </div>

              <p className="text-[#111827] mb-4">{post.text}</p>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 border border-white/30 text-[#6b7280] hover:bg-white/30 transition-all text-sm">
                  <ExternalLink className="w-4 h-4" />
                  Visit
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 border border-white/30 text-[#6b7280] hover:bg-white/30 transition-all text-sm">
                  <Tag className="w-4 h-4" />
                  Tag
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 border border-white/30 text-[#6b7280] hover:bg-white/30 transition-all text-sm">
                  <Ban className="w-4 h-4" />
                  Block
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 border border-white/30 text-[#6b7280] hover:bg-white/30 transition-all text-sm">
                  <FileText className="w-4 h-4" />
                  Add to PDF
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 border border-white/30 text-red-600 hover:bg-red-50 transition-all text-sm">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
