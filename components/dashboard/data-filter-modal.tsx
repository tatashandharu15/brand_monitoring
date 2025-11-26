"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, X } from "lucide-react"

interface FilterOptions {
  // Project filters
  projectId?: string
}

interface DataFilterModalProps {
  children: React.ReactNode
  onApplyFilters: (filters: FilterOptions) => void
  currentFilters?: FilterOptions
}

interface Project {
  project_id: string
  name: string
}

export function DataFilterModal({ children, onApplyFilters, currentFilters = {} }: DataFilterModalProps) {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>(currentFilters)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [defaultProjectSet, setDefaultProjectSet] = useState(false)

  // Fetch projects when component mounts to set default
  useEffect(() => {
    fetchProjects()
  }, [])

  // Fetch projects when modal opens
  useEffect(() => {
    if (open) {
      fetchProjects()
    }
  }, [open])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/brandmentions/projects')
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      
      const data = await response.json()
      
      if (data.projects && Array.isArray(data.projects)) {
        setProjects(data.projects)
        
        // Set default project to last available project if no current filter is set
        if (data.projects.length > 0 && !filters.projectId && !defaultProjectSet) {
          const lastProject = data.projects[data.projects.length - 1]
          setFilters(prev => ({ ...prev, projectId: lastProject.project_id }))
          setDefaultProjectSet(true)
        }
      } else {
        setProjects([])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleApplyFilters = () => {
    onApplyFilters(filters)
    setOpen(false)
  }

  const handleClearFilters = () => {
    setFilters({})
  }

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== '' && 
    (Array.isArray(value) ? value.length > 0 : true)
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Data
            {hasActiveFilters && (
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Filter Aktif
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Project Filters */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Filter Project</h3>
            
            <div className="space-y-2">
              <Label htmlFor="projectId">Project</Label>
              <Select 
                value={filters.projectId || 'all'} 
                onValueChange={(value) => updateFilter('projectId', value === 'all' ? undefined : value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loading ? "Memuat projects..." : "Pilih Project"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Project</SelectItem>
                  {projects.length === 0 && !loading ? (
                    <SelectItem value="no-projects" disabled>
                      Tidak ada project
                    </SelectItem>
                  ) : (
                    projects.map((project) => (
                      <SelectItem key={project.project_id} value={project.project_id}>
                        {project.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Hapus Filter
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleApplyFilters}>
                Terapkan Filter
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}