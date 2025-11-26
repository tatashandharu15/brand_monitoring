"use client"

import { useState, useEffect } from "react"
import { PageTemplate } from "@/components/dashboard/page-template"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { ExternalLink, Download, Globe, TrendingUp, Eye, MessageSquare, BarChart3 } from "lucide-react"

interface Site {
  site: string
  mentions: number
  visits: string
  performance: string
  sentiment: {
    positive: number
    neutral: number
    negative: number
  }
}

interface Project {
  project_id: string
  name: string
  keyword: string
}

export default function SitesPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingSites, setLoadingSites] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")

  // Fetch sites for a specific project
  const fetchSites = async (projectId: string) => {
    try {
      setLoadingSites(true)
      setError(null)
      console.log('Fetching sites for project:', projectId)
      
      const response = await fetch(`/api/brandmentions/sites?projectId=${projectId}&per_page=100`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch sites: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Sites response:', data)
      
      if (data.sites && Array.isArray(data.sites)) {
        setSites(data.sites)
        console.log(`Loaded ${data.sites.length} sites`)
      } else {
        console.log('No sites found in response')
        setSites([])
      }
    } catch (error) {
      console.error('Error fetching sites:', error)
      setError('Failed to load sites data')
      setSites([])
    } finally {
      setLoadingSites(false)
    }
  }

  // Handle filter changes from TopNav (project selection)
  const handleFiltersChange = async (filters: { projectId?: string }) => {
    if (filters.projectId && filters.projectId !== selectedProjectId) {
      setSelectedProjectId(filters.projectId)
      await fetchSites(filters.projectId)
    }
  }

  // Fetch projects on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/brandmentions/projects')
        if (!response.ok) throw new Error('Failed to fetch projects')
        
        const data = await response.json()
        console.log('Projects data:', data)
        
        if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects)
          // Don't auto-fetch sites here - let TopNav handle the initial project selection
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
        setError('Failed to load projects')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getSentimentColor = (sentiment: Site['sentiment']) => {
    const total = sentiment.positive + sentiment.neutral + sentiment.negative
    if (total === 0) return 'bg-gray-500'
    
    const positiveRatio = sentiment.positive / total
    const negativeRatio = sentiment.negative / total
    
    if (positiveRatio > 0.6) return 'bg-green-500'
    if (negativeRatio > 0.6) return 'bg-red-500'
    return 'bg-yellow-500'
  }

  const getSentimentText = (sentiment: Site['sentiment']) => {
    const total = sentiment.positive + sentiment.neutral + sentiment.negative
    if (total === 0) return 'No data'
    
    const positiveRatio = sentiment.positive / total
    const negativeRatio = sentiment.negative / total
    
    if (positiveRatio > 0.6) return 'Positive'
    if (negativeRatio > 0.6) return 'Negative'
    return 'Neutral'
  }

  return (
    <PageTemplate 
      title="Sites" 
      description="Monitor mentions across websites and blogs"
      onFiltersChange={handleFiltersChange}
    >
      <div className="space-y-6">
        {/* Header with Excel Report Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#111827] dark:text-white">Sites Overview</h2>
            <p className="text-[#6b7280] dark:text-gray-400">
              Monitor mentions across websites and blogs
              {selectedProjectId && projects.length > 0 && (
                <span className="ml-2 text-sm">
                  • Project: <span className="font-medium text-blue-600 dark:text-blue-400">
                    {projects.find(p => p.project_id === selectedProjectId)?.name || 'Unknown'}
                  </span>
                </span>
              )}
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Excel Report
          </Button>
        </div>

        {/* Sites Table */}
        <Card>
          <CardContent className="pt-6">
            {loading || loadingSites ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Spinner className="h-12 w-12" />
                <div className="text-center">
                  <p className="text-lg font-medium">Loading sites...</p>
                  <p className="text-sm text-muted-foreground">This may take a few moments</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
              </div>
            ) : sites.length === 0 && !loading && !loadingSites ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Sites Found</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedProjectId 
                    ? `No sites found for the selected project. Try selecting a different project from the top navigation.`
                    : 'Please select a project from the top navigation to view sites data.'
                  }
                </p>
                {!selectedProjectId && (
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    💡 Use the project selector in the top navigation bar to get started
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-100">
                      <TableHead className="font-semibold text-gray-700 py-4">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-blue-600" />
                          Site
                        </div>
                      </TableHead>
                      <TableHead className="text-center font-semibold text-gray-700 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <MessageSquare className="h-4 w-4 text-green-600" />
                          Mentions
                        </div>
                      </TableHead>
                      <TableHead className="text-center font-semibold text-gray-700 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Eye className="h-4 w-4 text-purple-600" />
                          Visits
                        </div>
                      </TableHead>
                      <TableHead className="text-center font-semibold text-gray-700 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <BarChart3 className="h-4 w-4 text-orange-600" />
                          Performance
                        </div>
                      </TableHead>
                      <TableHead className="text-center font-semibold text-gray-700 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <TrendingUp className="h-4 w-4 text-red-600" />
                          Sentiment
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sites.map((site, index) => (
                      <TableRow 
                        key={index} 
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border-b border-gray-100 group"
                      >
                        <TableCell className="py-4">
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
                               <span className="text-sm font-bold text-white">
                                 {site.site ? site.site.charAt(0).toUpperCase() : '?'}
                               </span>
                             </div>
                             <div className="flex-1">
                               <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                                 {site.site || 'Unknown'}
                               </div>
                               {site.site && (
                                 <a 
                                   href={`https://${site.site}`} 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 mt-1 transition-colors duration-200"
                                 >
                                   <Globe className="h-3 w-3" />
                                   Visit site <ExternalLink className="h-3 w-3" />
                                 </a>
                               )}
                             </div>
                           </div>
                         </TableCell>
                         <TableCell className="text-center py-4">
                           <Badge 
                             variant="secondary" 
                             className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200 font-medium px-3 py-1"
                           >
                             <MessageSquare className="h-3 w-3 mr-1" />
                             {site.mentions}
                           </Badge>
                         </TableCell>
                         <TableCell className="text-center py-4">
                           <div className="flex items-center justify-center gap-1">
                             <Eye className="h-4 w-4 text-purple-600" />
                             <span className="font-semibold text-gray-900">{site.visits}</span>
                           </div>
                         </TableCell>
                         <TableCell className="text-center py-4">
                           <Badge 
                             variant="outline" 
                             className="border-orange-200 text-orange-800 hover:bg-orange-50 transition-colors duration-200 font-medium px-3 py-1"
                           >
                             <BarChart3 className="h-3 w-3 mr-1" />
                             {site.performance}
                           </Badge>
                         </TableCell>
                        <TableCell className="text-center py-4">
                            <Badge 
                              className={`text-white font-medium px-3 py-1 transition-all duration-200 hover:shadow-md ${getSentimentColor(site.sentiment)}`}
                            >
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {getSentimentText(site.sentiment)}
                            </Badge>
                          </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  )
}
