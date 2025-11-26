"use client"

import { Search, Calendar, Filter, Cloud, Bell, ChevronDown, Plus } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FilterOptions {
  // Project filters
  projectId?: string
  keyword?: string
  projectCreatedFrom?: Date
  projectCreatedTo?: Date
  
  // Mention filters
  mentionId?: string
  publishedFrom?: Date
  publishedTo?: Date
  language?: string
  country?: string
  sentiment?: string[]
  socialNetwork?: string[]
  trackedKeyword?: string
  domainInfluenceMin?: number
  domainInfluenceMax?: number
  socialMediaInteractionsMin?: number
  socialMediaInteractionsMax?: number
  linked?: boolean | null
}

interface TopNavProps {
  onFiltersChange?: (filters: FilterOptions) => void
}

export function TopNav({ onFiltersChange }: TopNavProps) {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/brandmentions/projects')
      if (response.ok) {
        const data = await response.json()
        const projectList = data.projects || []
        setProjects(projectList)
        
        // Set default to first project if no project is selected
        if (projectList.length > 0 && !selectedProject) {
          const firstProject = projectList[0]
          setSelectedProject(firstProject.project_id)
          // Apply the filter immediately
          const filters = { projectId: firstProject.project_id }
          if (onFiltersChange) {
            onFiltersChange(filters)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId)
    const filters = { projectId }
    console.log('Applied filters:', filters)
    if (onFiltersChange) {
      onFiltersChange(filters)
    }
  }

  const handleAddProject = () => {
    router.push('/wizard')
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 p-4 dark:bg-gray-800/50 dark:border-gray-700/50">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] w-4 h-4" />
            <input
              type="text"
              placeholder="Search mentions, keywords, or users..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/20 border border-white/30 rounded-xl text-[#111827] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#7a6ff0] focus:border-transparent dark:bg-gray-700/50 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Date Range Selector */}
        <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white/20 border border-white/30 rounded-xl text-[#111827] hover:bg-white/30 transition-all dark:bg-gray-700/50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline text-sm font-medium">Last 30 Days</span>
        </button>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white/20 border border-white/30 text-[#111827] hover:bg-white/30 transition-all dark:bg-gray-700/50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                title="Filter Project"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {projects.find(p => p.project_id === selectedProject)?.name || "Loading..."}
                </span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {loading ? (
                <DropdownMenuItem disabled>
                  Memuat...
                </DropdownMenuItem>
              ) : projects.length === 0 ? (
                <DropdownMenuItem disabled>
                  Tidak ada project
                </DropdownMenuItem>
              ) : (
                projects.map((project) => (
                  <DropdownMenuItem 
                    key={project.project_id}
                    onClick={() => handleProjectSelect(project.project_id)}
                    className={selectedProject === project.project_id ? "bg-accent" : ""}
                  >
                    {project.name}
                  </DropdownMenuItem>
                ))
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleAddProject}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            className="p-2.5 rounded-xl bg-white/20 border border-white/30 text-[#111827] hover:bg-white/30 transition-all dark:bg-gray-700/50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            title="Cloud Sync"
          >
            <Cloud className="w-5 h-5" />
          </button>
          <button
            className="p-2.5 rounded-xl bg-white/20 border border-white/30 text-[#111827] hover:bg-white/30 transition-all dark:bg-gray-700/50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
