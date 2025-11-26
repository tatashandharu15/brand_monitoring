"use client"
import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { LazyCharts } from '@/components/dashboard/lazy-charts'
import { PostsFeed } from "@/components/dashboard/posts-feed"
import { RightSidebar } from "@/components/dashboard/right-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, Tag, Ban, FileText, Trash2, Twitter, Instagram, Facebook, MessageCircle, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { getPlatformIcon } from "@/components/ui/platform-icons"
import { getAvatarSrc, getInitials } from "@/lib/avatar-utils"

interface Mention {
  mention_id: string
  published: string
  url: string
  tracked_keyword: string
  social_network: string
  text: string
  sentiment: string
  author_name: string
  username: string
  followers: string
  profile_pic?: string
}

interface AnalyticsData {
  day: string
  mentions: number
  reach: number
}

interface SentimentData {
  positive: number
  neutral: number
  negative: number
  total: number
}

interface PlatformData {
  platform: string
  count: number
}

const chartConfig = {
  mentions: { label: "Mentions", color: "#7a6ff0" },
  reach: { label: "Reach", color: "#6dd5ed" },
  positive: { label: "Positive", color: "#22c55e" },
  neutral: { label: "Neutral", color: "#eab308" },
  negative: { label: "Negative", color: "#ef4444" },
}

const getPlatformIconComponent = (platform: string) => {
  return getPlatformIcon(platform, { className: "w-4 h-4" })
}

const formatFollowers = (followers: string) => {
  const num = parseInt(followers)
  if (isNaN(num)) return followers
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d ago`
}

export default function DashboardPage() {
  const [mentions, setMentions] = useState<Mention[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([])
  const [sentiment, setSentiment] = useState<SentimentData | null>(null)
  const [platforms, setPlatforms] = useState<PlatformData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [displayedMentionsCount, setDisplayedMentionsCount] = useState(10)
  const [currentFilters, setCurrentFilters] = useState<any>({})

  // Handler untuk filter data
  const handleFiltersChange = async (filters: any) => {
    console.log('Applying filters:', filters)
    setCurrentFilters(filters)
    setLoading(true)
    
    try {
      // Build query parameters from filters
      const queryParams = new URLSearchParams()
      
      // Project filters
      if (filters.projectId) queryParams.append('project_id', filters.projectId)
      if (filters.keyword) queryParams.append('keyword', filters.keyword)
      if (filters.projectCreatedFrom && filters.projectCreatedFrom instanceof Date) {
        queryParams.append('project_created_from', filters.projectCreatedFrom.toISOString())
      }
      if (filters.projectCreatedTo && filters.projectCreatedTo instanceof Date) {
        queryParams.append('project_created_to', filters.projectCreatedTo.toISOString())
      }
      
      // Mention filters
      if (filters.mentionId) queryParams.append('mention_id', filters.mentionId)
      if (filters.publishedFrom && filters.publishedFrom instanceof Date) {
        queryParams.append('published_from', filters.publishedFrom.toISOString())
      }
      if (filters.publishedTo && filters.publishedTo instanceof Date) {
        queryParams.append('published_to', filters.publishedTo.toISOString())
      }
      if (filters.language) queryParams.append('language', filters.language)
      if (filters.country) queryParams.append('country', filters.country)
      if (filters.sentiment && filters.sentiment.length > 0) {
        filters.sentiment.forEach((s: string) => queryParams.append('sentiment', s))
      }
      if (filters.socialNetwork && filters.socialNetwork.length > 0) {
        filters.socialNetwork.forEach((sn: string) => queryParams.append('social_network', sn))
      }
      if (filters.trackedKeyword) queryParams.append('tracked_keyword', filters.trackedKeyword)
      if (filters.domainInfluenceMin !== undefined) queryParams.append('domain_influence_min', filters.domainInfluenceMin.toString())
      if (filters.domainInfluenceMax !== undefined) queryParams.append('domain_influence_max', filters.domainInfluenceMax.toString())
      if (filters.socialMediaInteractionsMin !== undefined) queryParams.append('social_media_interactions_min', filters.socialMediaInteractionsMin.toString())
      if (filters.socialMediaInteractionsMax !== undefined) queryParams.append('social_media_interactions_max', filters.socialMediaInteractionsMax.toString())
      if (filters.linked !== null && filters.linked !== undefined) queryParams.append('linked', filters.linked.toString())

      // Fetch filtered data
      const mentionsRes = await fetch(`/api/mentions?${queryParams.toString()}`)
      if (mentionsRes.ok) {
        const mentionsData = await mentionsRes.json()
        if (Array.isArray(mentionsData)) {
          setMentions(mentionsData)
        } else if (mentionsData.success && mentionsData.data) {
          setMentions(mentionsData.data)
        }
      }

      // Also update analytics, sentiment, and platforms with filtered data
      const [analyticsRes, sentimentRes, platformsRes] = await Promise.all([
        fetch(`/api/analytics?days=7&${queryParams.toString()}`),
        fetch(`/api/sentiment?days=7&${queryParams.toString()}`),
        fetch(`/api/platforms?${queryParams.toString()}`)
      ])

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        if (Array.isArray(analyticsData)) {
          setAnalytics(analyticsData)
        } else if (analyticsData.success && analyticsData.data) {
          setAnalytics(analyticsData.data)
        }
      }

      if (sentimentRes.ok) {
        const sentimentData = await sentimentRes.json()
        if (sentimentData && typeof sentimentData === 'object' && 'positive' in sentimentData) {
          setSentiment(sentimentData)
        } else if (sentimentData && sentimentData.success && sentimentData.data) {
          setSentiment(sentimentData.data)
        }
      }

      if (platformsRes.ok) {
        const platformsData = await platformsRes.json()
        if (Array.isArray(platformsData)) {
          const transformedPlatforms = platformsData.map(item => ({
            platform: item.social_network || item.platform,
            count: parseInt(item.count) || item.count
          }))
          setPlatforms(transformedPlatforms)
        } else if (platformsData && platformsData.success && platformsData.data) {
          const transformedPlatforms = platformsData.data.map((item: any) => ({
            platform: item.social_network || item.platform,
            count: parseInt(item.count) || item.count
          }))
          setPlatforms(transformedPlatforms)
        }
      }

    } catch (error) {
      console.error('Error applying filters:', error)
      setError('Failed to apply filters. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch mentions first for immediate content
        const mentionsRes = await fetch('/api/mentions')
        if (mentionsRes.ok) {
          const mentionsData = await mentionsRes.json()
          if (Array.isArray(mentionsData)) {
            setMentions(mentionsData)
          } else if (mentionsData.success && mentionsData.data) {
            setMentions(mentionsData.data)
          }
        }

        // Then fetch other data in parallel
        const [analyticsRes, sentimentRes, platformsRes] = await Promise.all([
          fetch('/api/analytics?days=7'),
          fetch('/api/sentiment?days=7'),
          fetch('/api/platforms')
        ])

        if (!analyticsRes.ok || !sentimentRes.ok || !platformsRes.ok) {
          console.warn('Some API endpoints failed, using available data')
        }

        const [analyticsData, sentimentData, platformsData] = await Promise.all([
          analyticsRes.ok ? analyticsRes.json() : null,
          sentimentRes.ok ? sentimentRes.json() : null,
          platformsRes.ok ? platformsRes.json() : null
        ])

        // Handle mentions data (already processed above)
        // Handle analytics data (direct array or wrapped object)
        if (analyticsData && Array.isArray(analyticsData)) {
          setAnalytics(analyticsData)
        } else if (analyticsData && analyticsData.success && analyticsData.data) {
          setAnalytics(analyticsData.data)
        }

        // Handle sentiment data (direct object or wrapped object)
        if (sentimentData && typeof sentimentData === 'object' && 'positive' in sentimentData) {
          setSentiment(sentimentData)
        } else if (sentimentData && sentimentData.success && sentimentData.data) {
          setSentiment(sentimentData.data)
        }

        // Handle platforms data (direct array or wrapped object)
        if (platformsData && Array.isArray(platformsData)) {
          // Transform the data to match expected format
          const transformedPlatforms = platformsData.map(item => ({
            platform: item.social_network || item.platform,
            count: parseInt(item.count) || item.count
          }))
          setPlatforms(transformedPlatforms)
        } else if (platformsData && platformsData.success && platformsData.data) {
          const transformedPlatforms = platformsData.data.map((item: any) => ({
            platform: item.social_network || item.platform,
            count: parseInt(item.count) || item.count
          }))
          setPlatforms(transformedPlatforms)
        }

        // Set loading to false after mentions are loaded (for better UX)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setError('Failed to load some dashboard data. Please try refreshing the page.')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Transform sentiment data for chart
  const sentimentChartData = analytics.map(item => ({
    day: new Date(item.day).toLocaleDateString('en-US', { weekday: 'short' }),
    positive: sentiment ? Math.round((sentiment.positive / sentiment.total) * 100) : 0,
    neutral: sentiment ? Math.round((sentiment.neutral / sentiment.total) * 100) : 0,
    negative: sentiment ? Math.round((sentiment.negative / sentiment.total) * 100) : 0,
  }))

  // Transform analytics data for chart
  const analyticsChartData = analytics.map(item => ({
    day: new Date(item.day).toLocaleDateString('en-US', { weekday: 'short' }),
    mentions: item.mentions,
    reach: item.reach
  }))

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#eef1f4]">
        <Sidebar />
        <div className="ml-0 lg:ml-64">
          <TopNav onFiltersChange={handleFiltersChange} />
          <div className="p-6">
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800">
                {error}. Please check your database connection and try again.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#eef1f4] dark:from-gray-900 dark:to-gray-800">
      <Sidebar />

      <div className="ml-0 lg:ml-64">
        <TopNav onFiltersChange={handleFiltersChange} />

        <div className="flex">
          {/* Main Content */}
          <main className="flex-1 p-6 lg:pr-0">
            {/* Charts Section */}
            <LazyCharts 
              analytics={analytics} 
              sentiment={sentiment} 
              loading={loading}
            />

            {/* Mentions Feed */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-[#111827] dark:text-white mb-4">Recent Mentions</h2>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
                      <div className="flex gap-4">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : mentions.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center">
                  <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No mentions found</p>
                </div>
              ) : (
                 <>
                 {mentions.slice(0, displayedMentionsCount).map((mention, index) => (
                   <motion.div
                     key={mention.mention_id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: index * 0.05 }}
                     className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 hover:bg-white/20 transition-all dark:bg-gray-800/50 dark:border-gray-700/50 dark:hover:bg-gray-800/70"
                   >
                     <div className="flex gap-4">
                       <Avatar className="w-12 h-12">
                         <AvatarImage src={getAvatarSrc(mention.profile_pic, mention.author_name)} alt={mention.author_name} />
                         <AvatarFallback>{getInitials(mention.author_name || 'Unknown User')}</AvatarFallback>
                       </Avatar>

                       <div className="flex-1 min-w-0">
                         <div className="flex items-start justify-between mb-2">
                           <div>
                             <div className="flex items-center gap-2">
                               <span className="font-semibold text-[#111827] dark:text-white">{mention.author_name || 'Unknown User'}</span>
                               <span className="text-[#6b7280] dark:text-gray-400 text-sm">{mention.username || ''}</span>
                               <span className="text-[#6b7280] dark:text-gray-400 text-sm">• {formatFollowers(mention.followers || '0')} followers</span>
                             </div>
                             <div className="flex items-center gap-2 mt-1">
                               <div className="flex items-center gap-1">
                                 {getPlatformIconComponent(mention.social_network)}
                                 <span className="text-xs text-[#6b7280] dark:text-gray-400">{mention.social_network}</span>
                               </div>
                               <span className="text-xs text-[#6b7280] dark:text-gray-400">• {formatTimeAgo(mention.published)}</span>
                             </div>
                           </div>

                           <Badge
                             className={`${
                               mention.sentiment === "positive"
                                 ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                 : mention.sentiment === "negative"
                                   ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                                   : "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800"
                             }`}
                           >
                             {mention.sentiment}
                           </Badge>
                         </div>

                         <p className="text-[#111827] dark:text-gray-200 mb-4">{mention.text}</p>

                         <div className="flex items-center gap-2 flex-wrap">
                           <button 
                             onClick={() => window.open(mention.url, '_blank')}
                             className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 border border-white/30 text-[#6b7280] hover:bg-white/30 transition-all text-sm dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                           >
                             <ExternalLink className="w-4 h-4" />
                             Visit
                           </button>
                           <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 border border-white/30 text-[#6b7280] hover:bg-white/30 transition-all text-sm dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                             <Tag className="w-4 h-4" />
                             Tag
                           </button>
                           <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 border border-white/30 text-red-600 hover:bg-red-50 transition-all text-sm dark:bg-gray-700/50 dark:border-gray-600 dark:hover:bg-red-900/20">
                             <Trash2 className="w-4 h-4" />
                             Delete
                           </button>
                         </div>
                       </div>
                     </div>
                   </motion.div>
                 ))}
                 {displayedMentionsCount < mentions.length && (
                   <div className="text-center mt-6">
                     <button
                       onClick={() => setDisplayedMentionsCount(prev => Math.min(prev + 10, mentions.length))}
                       className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-[#111827] dark:text-white hover:bg-white/20 transition-all font-medium"
                     >
                       Show 10 More Mentions
                     </button>
                   </div>
                 )}
                 </>
               )}
            </motion.div>
          </main>

          {/* Right Sidebar */}
          <RightSidebar platforms={platforms} loading={loading} />
        </div>
      </div>
    </div>
  )
}
