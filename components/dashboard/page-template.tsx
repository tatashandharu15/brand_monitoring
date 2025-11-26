import { Sidebar } from "./sidebar"
import { TopNav } from "./top-nav"
import type { ReactNode } from "react"

interface FilterOptions {
  projectId?: string
  keyword?: string
  projectCreatedFrom?: Date
  projectCreatedTo?: Date
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

interface PageTemplateProps {
  title: string
  description: string
  children?: ReactNode
  onFiltersChange?: (filters: FilterOptions) => void
}

export function PageTemplate({ title, description, children, onFiltersChange }: PageTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-[#f0f4ff] to-[#e8f0ff] dark:from-[#0f0a1f] dark:via-[#1a1333] dark:to-[#0f0a1f]">
      <Sidebar />
      <div className="lg:ml-64">
        <TopNav onFiltersChange={onFiltersChange} />
        <main className="pt-20 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#111827] dark:text-white mb-2">{title}</h1>
              <p className="text-[#6b7280] dark:text-gray-400">{description}</p>
            </div>
            {children || (
              <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#7a6ff0] to-[#6dd5ed] rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#111827] dark:text-white mb-2">Coming Soon</h3>
                  <p className="text-[#6b7280] dark:text-gray-400">
                    This feature is currently under development. Check back soon for updates!
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
