import { Suspense, lazy } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const CombinedCharts = lazy(() => import('./combined-charts'))

interface LazyChartsProps {
  analytics: any[]
  sentiment: any
  loading: boolean
}

export function LazyCharts({ analytics, sentiment, loading }: LazyChartsProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={
      <div className="space-y-6">
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      </div>
    }>
      <CombinedCharts analytics={analytics} sentiment={sentiment} />
    </Suspense>
  )
}