"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { date: "Mon", mentions: 1200 },
  { date: "Tue", mentions: 1800 },
  { date: "Wed", mentions: 2400 },
  { date: "Thu", mentions: 1900 },
  { date: "Fri", mentions: 2800 },
  { date: "Sat", mentions: 2200 },
  { date: "Sun", mentions: 1600 },
]

const chartConfig = {
  mentions: {
    label: "Mentions",
    color: "hsl(var(--chart-1))",
  },
}

export function MentionsChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorMentions" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgb(123, 97, 255)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="rgb(123, 97, 255)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
        <XAxis dataKey="date" stroke="rgba(0,0,0,0.5)" fontSize={12} />
        <YAxis stroke="rgba(0,0,0,0.5)" fontSize={12} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="mentions"
          stroke="rgb(123, 97, 255)"
          strokeWidth={2}
          fill="url(#colorMentions)"
        />
      </AreaChart>
    </ChartContainer>
  )
}
