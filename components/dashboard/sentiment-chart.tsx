"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { sentiment: "Positive", count: 6800, fill: "rgb(34, 197, 94)" },
  { sentiment: "Neutral", count: 4200, fill: "rgb(234, 179, 8)" },
  { sentiment: "Negative", count: 1847, fill: "rgb(239, 68, 68)" },
]

const chartConfig = {
  count: {
    label: "Count",
  },
}

export function SentimentChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
        <XAxis dataKey="sentiment" stroke="rgba(0,0,0,0.5)" fontSize={12} />
        <YAxis stroke="rgba(0,0,0,0.5)" fontSize={12} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
