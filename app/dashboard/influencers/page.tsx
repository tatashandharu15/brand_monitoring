"use client"

import { PageTemplate } from "@/components/dashboard/page-template"
import { GlassCard } from "@/components/glass-card"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, ChevronDown } from "lucide-react"
import { getPlatformIcon } from "@/components/ui/platform-icons"

interface ProjectData {
  project_id: string
  name: string
}

interface InfluencerData {
  social_network: string
  username: string
  name: string
  profile_pic: string
  reach: number
  followers?: number
  following?: number
  mentions_count: number
  latest_mention: string
}

interface InfluencersResponse {
  status: string
  influencers: InfluencerData[]
}

export default function InfluencersPage() {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [influencers, setInfluencers] = useState<InfluencerData[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingInfluencers, setLoadingInfluencers] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handler untuk perubahan filter dari TopNav
  const handleFiltersChange = (filters: any) => {
    console.log('[Influencers] Filters changed:', filters)
    if (filters.projectId && filters.projectId !== selectedProject) {
      setSelectedProject(filters.projectId)
    }
  }

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true)
        const response = await fetch("/api/brandmentions/projects")

        if (!response.ok) {
          throw new Error("Failed to fetch projects")
        }

        const data = await response.json()
        console.log("[Influencers] Projects response:", data)

        if (data.projects && Array.isArray(data.projects)) {
          setProjects(data.projects)
          // Auto-select first project
          if (data.projects.length > 0) {
            console.log("[Influencers] Auto-selecting project:", data.projects[0].project_id)
            setSelectedProject(data.projects[0].project_id)
          }
        }
      } catch (err) {
        console.error("[Influencers] Error fetching projects:", err)
        setError("Failed to load projects")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  useEffect(() => {
    async function fetchInfluencers() {
      if (!selectedProject) {
        console.log("[Influencers] No selectedProject, skipping fetch")
        return
      }

      try {
        setLoadingInfluencers(true)
        setError(null)
        console.log("[Influencers] Fetching influencers for project:", selectedProject)
        const queryParams = new URLSearchParams({
          projectId: selectedProject,
          page: "1",
          per_page: "1000",
        })

        const response = await fetch(`/api/brandmentions/influencers?${queryParams}`)
        console.log("[Influencers] Response status:", response.status)

        if (!response.ok) {
          throw new Error("Failed to fetch influencers")
        }

        const data: InfluencersResponse = await response.json()
        console.log("[Influencers] API response:", data)

        if (data.status === "success" && data.influencers) {
          setInfluencers(data.influencers)
          setError(null)
          console.log("[Influencers] Successfully loaded", data.influencers.length, "influencers")
        } else {
          setInfluencers([])
          setError("No influencers found")
          console.log("[Influencers] No influencers found in response")
        }
      } catch (err) {
        console.error("[Influencers] Error fetching influencers:", err)
        setError("Failed to load influencers")
        setInfluencers([])
      } finally {
        setLoadingInfluencers(false)
      }
    }

    console.log("[Influencers] useEffect triggered, selectedProject:", selectedProject)
    fetchInfluencers()
  }, [selectedProject])

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K"
    }
    return num.toString()
  }

  const getSocialIcon = (platform: string) => {
    return getPlatformIcon(platform, { className: "w-5 h-5" })
  }

  const getSentimentColor = (mentionsCount: number) => {
    if (mentionsCount >= 20) return "text-red-500"
    if (mentionsCount >= 10) return "text-yellow-500"
    if (mentionsCount >= 5) return "text-green-500"
    return "text-gray-500"
  }

  const getSentimentBg = (mentionsCount: number) => {
    if (mentionsCount >= 20) return "bg-red-100"
    if (mentionsCount >= 10) return "bg-yellow-100"
    if (mentionsCount >= 5) return "bg-green-100"
    return "bg-gray-100"
  }

  return (
    <PageTemplate 
      title="Influencers" 
      description="Discover and track key influencers talking about your brand"
      onFiltersChange={handleFiltersChange}
    >
      <div className="space-y-6">
        {/* Header with Export Button */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#111827] dark:text-white">Influencers</span>
            <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
              <Download className="w-4 h-4 mr-1" />
              Excel Report
            </Button>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Negative</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600">Neutral</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Positive</span>
            </div>
          </div>
        </div>

        {/* Influencers Table */}
        <GlassCard className="overflow-hidden">
          {loading || loadingInfluencers ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-lg font-medium text-gray-700 mb-2">Loading influencers...</p>
              <p className="text-sm text-gray-500">This may take a few moments</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              <p>{error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Profile</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Mentions</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Platform</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 flex items-center gap-1">
                      Followers
                      <ChevronDown className="w-4 h-4 text-purple-600" />
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Performance</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Reach</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Voice Share</th>
                  </tr>
                </thead>
                <tbody>
                  {influencers.map((influencer, index) => (
                    <tr key={`${influencer.username}-${index}`} className="border-b border-gray-100 hover:bg-gray-50/50">
                      {/* Profile */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            {influencer.profile_pic ? (
                              <img
                                src={influencer.profile_pic.trim()}
                                alt={influencer.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = "none"
                                  target.nextElementSibling?.classList.remove("hidden")
                                }}
                              />
                            ) : null}
                            <div className={`w-full h-full bg-gradient-to-br from-purple-400 to-green-500 flex items-center justify-center text-white font-semibold ${influencer.profile_pic ? "hidden" : ""}`}>
                              {influencer.name && typeof influencer.name === 'string' && influencer.name.charAt(0).toUpperCase() || '?'}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{influencer.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">@{influencer.username || 'unknown'}</div>
                          </div>
                        </div>
                      </td>

                      {/* Mentions */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{influencer.mentions_count}</span>
                          <div className={`w-16 h-2 rounded-full ${getSentimentBg(influencer.mentions_count)}`}>
                            <div className={`h-full rounded-full ${getSentimentColor(influencer.mentions_count).replace('text-', 'bg-')} opacity-60`} style={{ width: "60%" }}></div>
                          </div>
                        </div>
                      </td>

                      {/* Platform */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getSocialIcon(influencer.social_network)}</span>
                        </div>
                      </td>

                      {/* Followers */}
                      <td className="py-4 px-6">
                        <span className="font-medium">
                          {influencer.followers ? formatNumber(influencer.followers) : "-"}
                        </span>
                      </td>

                      {/* Performance */}
                      <td className="py-4 px-6">
                        <span className="text-gray-600">10/10</span>
                      </td>

                      {/* Reach */}
                      <td className="py-4 px-6">
                        <span className="font-medium">
                          {formatNumber(influencer.reach)}
                        </span>
                      </td>

                      {/* Voice Share */}
                      <td className="py-4 px-6">
                        <span className="text-gray-600">
                          {((influencer.mentions_count / Math.max(...influencers.map(i => i.mentions_count))) * 5).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {influencers.length === 0 && !loading && !loadingInfluencers && (
                <div className="p-8 text-center text-gray-500">
                  <p>No influencers found for this project.</p>
                </div>
              )}
            </div>
          )}
        </GlassCard>
      </div>
    </PageTemplate>
  )
}
