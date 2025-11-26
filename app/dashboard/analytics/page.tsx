"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { GlassCard } from "@/components/glass-card"
import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"

interface ProjectData {
  id: string
  name: string
  mentions_count?: number
}

interface MentionData {
  id: string
  title: string
  url: string
  source: string
  sentiment?: string
  date: string
  reach?: number
  interactions?: number
}

export default function AnalyticsPage() {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [mentions, setMentions] = useState<MentionData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true)
        const response = await fetch("/api/brandmentions/projects")

        if (!response.ok) {
          throw new Error("Failed to fetch projects")
        }

        const data = await response.json()
        console.log("[v0] Projects response:", data)

        if (data.projects && Array.isArray(data.projects)) {
          setProjects(data.projects)
          // Auto-select first project
          if (data.projects.length > 0) {
            setSelectedProject(data.projects[0].id)
          }
        }
      } catch (err) {
        console.error("[v0] Error fetching projects:", err)
        setError("Failed to load projects. Using mock data.")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  useEffect(() => {
    async function fetchMentions() {
      if (!selectedProject) return

      try {
        setLoading(true)
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 30)

        const queryParams = new URLSearchParams({
          projectId: selectedProject,
          startPeriod: startDate.toISOString().split("T")[0],
          endPeriod: endDate.toISOString().split("T")[0],
          perPage: "250",
        })

        const response = await fetch(`/api/brandmentions/mentions?${queryParams}`)

        if (!response.ok) {
          throw new Error("Failed to fetch mentions")
        }

        const data = await response.json()
        console.log("[v0] Mentions response:", data)

        if (data.mentions && Array.isArray(data.mentions)) {
          setMentions(data.mentions)
        }
      } catch (err) {
        console.error("[v0] Error fetching mentions:", err)
        setError("Failed to load mentions. Using mock data.")
      } finally {
        setLoading(false)
      }
    }

    fetchMentions()
  }, [selectedProject])

  const processedData = mentions.length > 0 ? transformMentionsToChartData(mentions) : getMockData()

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-900">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <TopNav />

        <main className="flex-1 overflow-y-auto pt-20 px-8 pb-8">
          {projects.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Project</label>
              <select
                value={selectedProject || ""}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 text-gray-900 dark:text-white"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-600 dark:text-gray-400">Loading analytics data...</div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200">{error}</p>
            </div>
          )}

          {!loading && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics Report</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {projects.find((p) => p.id === selectedProject)?.name || "Ntt data"}
                  </span>
                  <span>Sep 21, 2025 - Oct 21, 2025</span>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 mb-8">
                <GlassCard className="p-6">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {processedData.totalMentions.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">mentions</div>
                </GlassCard>
                <GlassCard className="p-6">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {formatNumber(processedData.totalReach)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">reach</div>
                </GlassCard>
                <GlassCard className="p-6">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {formatNumber(processedData.totalInteractions)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">interactions</div>
                </GlassCard>
                <GlassCard className="p-6">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {processedData.negativeMentions.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">negative mentions</div>
                  <div className="text-2xl font-bold text-red-500 mt-2">{processedData.negativePercentage}%</div>
                </GlassCard>
                <GlassCard className="p-6">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {processedData.positiveMentions.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">positive mentions</div>
                  <div className="text-2xl font-bold text-green-500 mt-2">{processedData.positivePercentage}%</div>
                </GlassCard>
              </div>

              <GlassCard className="p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Volume of Mentions & Reach</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={processedData.volumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis yAxisId="left" stroke="#6b7280" />
                    <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="mentions"
                      stroke="#7B61FF"
                      strokeWidth={2}
                      name="Mentions"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="reach"
                      stroke="#A78BFA"
                      strokeWidth={2}
                      name="Reach"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </GlassCard>

              <GlassCard className="p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Sentiment Over Time</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={processedData.sentimentOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="negative"
                      stackId="1"
                      stroke="#EF4444"
                      fill="#EF4444"
                      name="Negative"
                    />
                    <Area
                      type="monotone"
                      dataKey="neutral"
                      stackId="1"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      name="Neutral"
                    />
                    <Area
                      type="monotone"
                      dataKey="positive"
                      stackId="1"
                      stroke="#10B981"
                      fill="#10B981"
                      name="Positive"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </GlassCard>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Sentiment By Media Type</h2>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={processedData.sentimentByMedia} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" stroke="#6b7280" />
                      <YAxis dataKey="platform" type="category" stroke="#6b7280" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="negative" stackId="a" fill="#EF4444" name="Negative" />
                      <Bar dataKey="neutral" stackId="a" fill="#F59E0B" name="Neutral" />
                      <Bar dataKey="positive" stackId="a" fill="#10B981" name="Positive" />
                    </BarChart>
                  </ResponsiveContainer>
                </GlassCard>

                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Sentiment By Language</h2>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={processedData.sentimentByLanguage} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" stroke="#6b7280" />
                      <YAxis dataKey="language" type="category" stroke="#6b7280" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="negative" stackId="a" fill="#EF4444" name="Negative" />
                      <Bar dataKey="neutral" stackId="a" fill="#F59E0B" name="Neutral" />
                      <Bar dataKey="positive" stackId="a" fill="#10B981" name="Positive" />
                    </BarChart>
                  </ResponsiveContainer>
                </GlassCard>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Top Influencers by Voice Share
                  </h2>
                  <div className="space-y-4">
                    {processedData.topInfluencers.map((influencer) => (
                      <div
                        key={`${influencer.handle}-${influencer.voiceShare}`}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white">{influencer.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{influencer.handle}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-900 dark:text-white">{influencer.voiceShare}%</span>
                          <div
                            className={`w-3 h-3 rounded-full ${
                              influencer.sentiment === "positive"
                                ? "bg-green-500"
                                : influencer.sentiment === "negative"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                    <button className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline">
                      View all influencers
                    </button>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Top Sites by Visits</h2>
                  <div className="space-y-4">
                    {processedData.topSites.map((site) => (
                      <div key={site.name} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white">{site.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{site.visits} visits</div>
                        </div>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            site.sentiment === "positive"
                              ? "bg-green-500"
                              : site.sentiment === "negative"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }`}
                        />
                      </div>
                    ))}
                    <button className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline">
                      View all sites
                    </button>
                  </div>
                </GlassCard>
              </div>

              <GlassCard className="p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Influencers by Media Type</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={processedData.influencersByMedia}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="platform" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#7B61FF" />
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Demographics Over Time</h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={processedData.demographicsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="male" stroke="#7B61FF" strokeWidth={2} name="Male" />
                      <Line type="monotone" dataKey="female" stroke="#A78BFA" strokeWidth={2} name="Female" />
                    </LineChart>
                  </ResponsiveContainer>
                </GlassCard>

                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Website Traffic Demographics
                  </h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={processedData.genderData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name} ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {processedData.genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </GlassCard>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Top Countries</h2>
                  <div className="space-y-3">
                    {processedData.topCountries.map((country) => (
                      <div key={country.country} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600 dark:text-gray-400">
                            {processedData.topCountries.indexOf(country) + 1}.
                          </span>
                          <span className="text-gray-900 dark:text-white">{country.country}</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">{country.mentions}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Websites by Visits</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={processedData.websitesByVisits}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="range" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#7B61FF" />
                    </BarChart>
                  </ResponsiveContainer>
                </GlassCard>
              </div>

              <GlassCard className="p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Trending Hashtags</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  {processedData.trendingHashtags.map((item) => (
                    <div key={item.hashtag} className="flex items-center justify-between">
                      <span className="text-purple-600 dark:text-purple-400 font-medium">{item.hashtag}</span>
                      <span className="text-gray-600 dark:text-gray-400">{item.uses.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Mentions by Media Type</h2>
                  <div className="space-y-3">
                    {processedData.mediaTypeStats.map((item) => (
                      <div key={item.source} className="flex items-center justify-between">
                        <span className="text-gray-900 dark:text-white">{item.source}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600 dark:text-gray-400">{item.percentage}%</span>
                          <span className="text-gray-900 dark:text-white font-semibold">
                            {item.mentions.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Top Languages</h2>
                  <div className="space-y-3">
                    {processedData.languageStats.map((item) => (
                      <div key={item.language} className="flex items-center justify-between">
                        <span className="text-gray-900 dark:text-white">{item.language}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600 dark:text-gray-400">{item.percentage}%</span>
                          <span className="text-gray-900 dark:text-white font-semibold">
                            {item.mentions.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>

              <GlassCard className="p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Social Media Interactions</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={processedData.interactionsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Line type="monotone" dataKey="interactions" stroke="#7B61FF" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Trending Conversations</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  {processedData.trendingConversations.map((item) => (
                    <div key={item.context} className="flex items-center justify-between">
                      <span className="text-gray-900 dark:text-white truncate flex-1">{item.context}</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-4">{item.uses.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function transformMentionsToChartData(mentions: MentionData[]) {
  // Group mentions by date
  const mentionsByDate: Record<
    string,
    { mentions: number; reach: number; interactions: number; sentiment: Record<string, number> }
  > = {}

  const totalMentions = mentions.length
  let totalReach = 0
  let totalInteractions = 0
  let positiveMentions = 0
  let negativeMentions = 0
  let neutralMentions = 0

  mentions.forEach((mention) => {
    const date = new Date(mention.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })

    if (!mentionsByDate[date]) {
      mentionsByDate[date] = {
        mentions: 0,
        reach: 0,
        interactions: 0,
        sentiment: { positive: 0, negative: 0, neutral: 0 },
      }
    }

    mentionsByDate[date].mentions++
    mentionsByDate[date].reach += mention.reach || 0
    mentionsByDate[date].interactions += mention.interactions || 0

    totalReach += mention.reach || 0
    totalInteractions += mention.interactions || 0

    const sentiment = mention.sentiment?.toLowerCase() || "neutral"
    if (sentiment.includes("positive")) {
      positiveMentions++
      mentionsByDate[date].sentiment.positive++
    } else if (sentiment.includes("negative")) {
      negativeMentions++
      mentionsByDate[date].sentiment.negative++
    } else {
      neutralMentions++
      mentionsByDate[date].sentiment.neutral++
    }
  })

  const volumeData = Object.entries(mentionsByDate).map(([date, data]) => ({
    date,
    mentions: data.mentions,
    reach: data.reach,
  }))

  const sentimentOverTime = Object.entries(mentionsByDate).map(([date, data]) => ({
    date,
    negative: data.sentiment.negative,
    neutral: data.sentiment.neutral,
    positive: data.sentiment.positive,
  }))

  const sentimentByMedia: { platform: string; negative: number; neutral: number; positive: number }[] = []
  const sentimentByLanguage: { language: string; negative: number; neutral: number; positive: number }[] = []
  const influencersByMedia: { platform: string; count: number }[] = []
  const demographicsData: { date: string; male: number; female: number }[] = []
  const genderData: { name: string; value: number; color: string }[] = [
    { name: "Male", value: 63.6, color: "#7B61FF" },
    { name: "Female", value: 36.4, color: "#A78BFA" },
  ]
  const websitesByVisits: { range: string; count: number }[] = []
  const interactionsData: { date: string; interactions: number }[] = []
  const topInfluencers: { name: string; handle: string; voiceShare: number; sentiment: string }[] = []
  const topSites: { name: string; visits: string; sentiment: string }[] = []
  const topCountries: { country: string; mentions: number }[] = []
  const trendingHashtags: { hashtag: string; uses: number }[] = []
  const mediaTypeStats: { source: string; percentage: number; mentions: number }[] = []
  const languageStats: { language: string; percentage: number; mentions: number }[] = []
  const trendingConversations: { context: string; uses: number }[] = []

  // Mock data for charts
  const mockVolumeData = [
    { date: "22 Sep", mentions: 400, reach: 120000000 },
    { date: "24 Sep", mentions: 800, reach: 250000000 },
    { date: "26 Sep", mentions: 1200, reach: 380000000 },
    { date: "28 Sep", mentions: 900, reach: 290000000 },
    { date: "30 Sep", mentions: 1500, reach: 450000000 },
    { date: "02 Oct", mentions: 2200, reach: 620000000 },
    { date: "04 Oct", mentions: 1800, reach: 520000000 },
    { date: "06 Oct", mentions: 2500, reach: 700000000 },
    { date: "08 Oct", mentions: 2100, reach: 580000000 },
    { date: "10 Oct", mentions: 2800, reach: 750000000 },
    { date: "12 Oct", mentions: 2400, reach: 650000000 },
    { date: "14 Oct", mentions: 3200, reach: 820000000 },
    { date: "16 Oct", mentions: 2900, reach: 740000000 },
    { date: "18 Oct", mentions: 3500, reach: 850000000 },
    { date: "20 Oct", mentions: 3100, reach: 780000000 },
  ]

  const mockSentimentOverTime = [
    { date: "22 Sep", negative: 200, neutral: 150, positive: 450 },
    { date: "24 Sep", negative: 300, neutral: 250, positive: 650 },
    { date: "26 Sep", negative: 400, neutral: 350, positive: 850 },
    { date: "28 Sep", negative: 350, neutral: 280, positive: 720 },
    { date: "30 Sep", negative: 500, neutral: 400, positive: 1100 },
    { date: "02 Oct", negative: 700, neutral: 550, positive: 1550 },
    { date: "04 Oct", negative: 600, neutral: 480, positive: 1320 },
    { date: "06 Oct", negative: 800, neutral: 650, positive: 1850 },
    { date: "08 Oct", negative: 700, neutral: 560, positive: 1540 },
    { date: "10 Oct", negative: 900, neutral: 720, positive: 2080 },
    { date: "12 Oct", negative: 800, neutral: 640, positive: 1760 },
    { date: "14 Oct", negative: 1000, neutral: 800, positive: 2400 },
    { date: "16 Oct", negative: 950, neutral: 760, positive: 2190 },
    { date: "18 Oct", negative: 1100, neutral: 880, positive: 2520 },
    { date: "20 Oct", negative: 1000, neutral: 820, positive: 2280 },
  ]

  const mockSentimentByMedia = [
    { platform: "X(Twitter)", negative: 15, neutral: 25, positive: 60 },
    { platform: "Facebook", negative: 20, neutral: 30, positive: 50 },
    { platform: "Instagram", negative: 10, neutral: 20, positive: 70 },
    { platform: "TikTok", negative: 25, neutral: 35, positive: 40 },
    { platform: "Linkedin", negative: 5, neutral: 15, positive: 80 },
    { platform: "YouTube", negative: 18, neutral: 28, positive: 54 },
    { platform: "Forums", negative: 30, neutral: 40, positive: 30 },
    { platform: "News", negative: 22, neutral: 38, positive: 40 },
    { platform: "Blogs", negative: 12, neutral: 23, positive: 65 },
    { platform: "Site", negative: 8, neutral: 17, positive: 75 },
    { platform: "Reddit", negative: 28, neutral: 42, positive: 30 },
    { platform: "Bluesky", negative: 14, neutral: 26, positive: 60 },
  ]

  const mockSentimentByLanguage = [
    { language: "Indonesian", negative: 20, neutral: 30, positive: 50 },
    { language: "English", negative: 15, neutral: 25, positive: 60 },
    { language: "Japanese", negative: 10, neutral: 20, positive: 70 },
    { language: "Spanish", negative: 25, neutral: 35, positive: 40 },
    { language: "Malay", negative: 18, neutral: 28, positive: 54 },
    { language: "Italian", negative: 12, neutral: 22, positive: 66 },
    { language: "Portuguese", negative: 22, neutral: 33, positive: 45 },
    { language: "German", negative: 8, neutral: 17, positive: 75 },
    { language: "Chinese", negative: 14, neutral: 26, positive: 60 },
    { language: "Vietnamese", negative: 16, neutral: 29, positive: 55 },
    { language: "Others", negative: 19, neutral: 31, positive: 50 },
  ]

  const mockInfluencersByMedia = [
    { platform: "X(Twitter)", count: 2500 },
    { platform: "Facebook", count: 1800 },
    { platform: "Instagram", count: 2200 },
    { platform: "TikTok", count: 1500 },
    { platform: "Linkedin", count: 1200 },
    { platform: "YouTube", count: 900 },
    { platform: "Reddit", count: 600 },
    { platform: "Bluesky", count: 400 },
  ]

  const mockDemographicsData = [
    { date: "21 Sep", male: 60, female: 40 },
    { date: "26 Sep", male: 62, female: 38 },
    { date: "01 Oct", male: 64, female: 36 },
    { date: "06 Oct", male: 63, female: 37 },
    { date: "11 Oct", male: 65, female: 35 },
    { date: "16 Oct", male: 64, female: 36 },
    { date: "21 Oct", male: 63, female: 37 },
  ]

  const mockTopInfluencers = [
    { name: "KOMPASTV", handle: "@kompastv", voiceShare: 17.1, sentiment: "positive" },
    { name: "Tribunnews", handle: "@tribunnews", voiceShare: 35.54, sentiment: "positive" },
    { name: "Viral Bhayani", handle: "@viralbhayani", voiceShare: 15.07, sentiment: "neutral" },
    { name: "Kompas.com", handle: "@KOMPAScom", voiceShare: 23.8, sentiment: "positive" },
    { name: "BMKG", handle: "@infoBMKG 10.2M follow", voiceShare: 53.72, sentiment: "positive" },
    { name: "WION", handle: "@wion", voiceShare: 13.68, sentiment: "neutral" },
    { name: "Kompas.com", handle: "@kompascom 8.8M follo", voiceShare: 13.21, sentiment: "positive" },
    { name: "Grok", handle: "@grok 6.4M followers", voiceShare: 272.33, sentiment: "positive" },
    { name: "Zee Business", handle: "@zeebusiness", voiceShare: 12.25, sentiment: "neutral" },
  ]

  const mockTopSites = [
    { name: "google.com", visits: "179,610,000,000", sentiment: "positive" },
    { name: "yahoo.com", visits: "43,332,000,000", sentiment: "neutral" },
    { name: "yahoo.co.jp", visits: "121,881,000,000", sentiment: "positive" },
    { name: "microsoft.com", visits: "11,010,000,000", sentiment: "positive" },
    { name: "indeed.com", visits: "1,551,928,000", sentiment: "neutral" },
    { name: "apple.com", visits: "1,450,490,000", sentiment: "positive" },
    { name: "tradingview.com", visits: "1,199,500,000", sentiment: "neutral" },
    { name: "indiatimes.com", visits: "190,508,000", sentiment: "positive" },
    { name: "tumblr.com", visits: "179,353,000", sentiment: "neutral" },
  ]

  const mockTopCountries = [
    { country: "Indonesia", mentions: 498 },
    { country: "India", mentions: 390 },
    { country: "U.S.A.", mentions: 346 },
    { country: "Japan", mentions: 295 },
    { country: "Spain", mentions: 222 },
    { country: "United Kingdom", mentions: 138 },
    { country: "Germany", mentions: 109 },
    { country: "Italy", mentions: 100 },
    { country: "Brazil", mentions: 75 },
    { country: "Others", mentions: 790 },
  ]

  const mockTrendingHashtags = [
    { hashtag: "#ntt", uses: 4055 },
    { hashtag: "#kementerianhukum", uses: 3614 },
    { hashtag: "#setahunberdampak", uses: 3517 },
    { hashtag: "#kanwilkemenkumntt", uses: 3514 },
    { hashtag: "#silvestersililaba", uses: 3511 },
    { hashtag: "#transformasihukum", uses: 1795 },
    { hashtag: "#kupang", uses: 517 },
    { hashtag: "#indonesia", uses: 443 },
    { hashtag: "#fyp", uses: 387 },
    { hashtag: "#flores", uses: 372 },
    { hashtag: "#jakarta", uses: 367 },
    { hashtag: "#kalimantan", uses: 360 },
    { hashtag: "#surabaya", uses: 342 },
    { hashtag: "#sulawesi", uses: 328 },
  ]

  const mockMediaTypeStats = [
    { source: "X(Twitter)", percentage: 38.76, mentions: 7085 },
    { source: "Instagram", percentage: 27.46, mentions: 5020 },
    { source: "Bluesky", percentage: 11.96, mentions: 2186 },
    { source: "Linkedin", percentage: 6.36, mentions: 1163 },
    { source: "YouTube", percentage: 5.15, mentions: 941 },
    { source: "Others", percentage: 10.32, mentions: 1886 },
  ]

  const mockLanguageStats = [
    { language: "Indonesian", percentage: 39.58, mentions: 7192 },
    { language: "English", percentage: 23.35, mentions: 4244 },
    { language: "Japanese", percentage: 22.63, mentions: 4112 },
    { language: "Spanish", percentage: 4.9, mentions: 890 },
    { language: "Others", percentage: 9.54, mentions: 1734 },
  ]

  const mockTrendingConversations = [
    { context: "kanwil kemenkum", uses: 1791 },
    { context: "kanwilkemenkumntt setahunb", uses: 1676 },
    { context: "layananhukummakinmudah ka", uses: 1676 },
    { context: "silvestersililaba kanwil", uses: 1673 },
    { context: "setahunberdampak silvestersi", uses: 1671 },
    { context: "kementerianhukum layananhu", uses: 1566 },
    { context: "ntt data", uses: 839 },
    { context: "kemenkum ntt", uses: 496 },
    { context: "nusa tenggara", uses: 383 },
    { context: "tenggara timur", uses: 347 },
  ]

  return {
    totalMentions,
    totalReach,
    totalInteractions,
    positiveMentions,
    negativeMentions,
    neutralMentions,
    positivePercentage: Math.round((positiveMentions / totalMentions) * 100),
    negativePercentage: Math.round((negativeMentions / totalMentions) * 100),
    volumeData,
    sentimentOverTime,
    sentimentByMedia,
    sentimentByLanguage,
    influencersByMedia,
    demographicsData,
    genderData,
    websitesByVisits,
    interactionsData,
    topInfluencers,
    topSites,
    topCountries,
    trendingHashtags,
    mediaTypeStats,
    languageStats,
    trendingConversations,
  }
}

function formatNumber(num: number): string {
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

function getMockData() {
  return {
    totalMentions: 18300,
    totalReach: 854900000,
    totalInteractions: 11800000,
    positiveMentions: 11500,
    negativeMentions: 4400,
    neutralMentions: 2400,
    positivePercentage: 72,
    negativePercentage: 28,
    volumeData: [
      { date: "22 Sep", mentions: 400, reach: 120000000 },
      { date: "24 Sep", mentions: 800, reach: 250000000 },
      { date: "26 Sep", mentions: 1200, reach: 380000000 },
      { date: "28 Sep", mentions: 900, reach: 290000000 },
      { date: "30 Sep", mentions: 1500, reach: 450000000 },
      { date: "02 Oct", mentions: 2200, reach: 620000000 },
      { date: "04 Oct", mentions: 1800, reach: 520000000 },
      { date: "06 Oct", mentions: 2500, reach: 700000000 },
      { date: "08 Oct", mentions: 2100, reach: 580000000 },
      { date: "10 Oct", mentions: 2800, reach: 750000000 },
      { date: "12 Oct", mentions: 2400, reach: 650000000 },
      { date: "14 Oct", mentions: 3200, reach: 820000000 },
      { date: "16 Oct", mentions: 2900, reach: 740000000 },
      { date: "18 Oct", mentions: 3500, reach: 850000000 },
      { date: "20 Oct", mentions: 3100, reach: 780000000 },
    ],
    sentimentOverTime: [
      { date: "22 Sep", negative: 200, neutral: 150, positive: 450 },
      { date: "24 Sep", negative: 300, neutral: 250, positive: 650 },
      { date: "26 Sep", negative: 400, neutral: 350, positive: 850 },
    ],
    sentimentByMedia: [],
    sentimentByLanguage: [],
    influencersByMedia: [],
    demographicsData: [],
    genderData: [],
    websitesByVisits: [],
    interactionsData: [],
    topInfluencers: [],
    topSites: [],
    topCountries: [],
    trendingHashtags: [],
    mediaTypeStats: [],
    languageStats: [],
    trendingConversations: [],
  }
}
