"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface CombinedChartsProps {
  analytics?: any[]
  sentiment?: any
}

export default function CombinedCharts({ analytics, sentiment }: CombinedChartsProps) {
  // Use provided data or fallback to mock data
  const mentionsData = analytics && analytics.length > 0 ? analytics.map((item, index) => {
    // Format date properly - if it's a full date, extract day name, otherwise use as is
    let dateLabel;
    if (item.day && item.day.includes('-')) {
      // It's a full date like "2024-01-15", convert to day name
      const date = new Date(item.day);
      dateLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      // Use provided date or fallback
      dateLabel = item.date || item.day || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index] || `Day ${index + 1}`;
    }
    
    return {
      date: dateLabel,
      mentions: item.mentions || item.count || 0,
      reach: item.reach || item.mentions * 37 || 0 // Estimate reach if not provided
    };
  }) : [
    { date: "Mon", mentions: 1200, reach: 45000 },
    { date: "Tue", mentions: 1800, reach: 68000 },
    { date: "Wed", mentions: 2400, reach: 92000 },
    { date: "Thu", mentions: 1900, reach: 71000 },
    { date: "Fri", mentions: 2800, reach: 105000 },
    { date: "Sat", mentions: 2200, reach: 83000 },
    { date: "Sun", mentions: 1600, reach: 60000 },
  ]

  const sentimentData = sentiment ? [
    { date: "Mon", positive: sentiment.positive || 65, neutral: sentiment.neutral || 25, negative: sentiment.negative || 10 },
    { date: "Tue", positive: sentiment.positive || 70, neutral: sentiment.neutral || 20, negative: sentiment.negative || 10 },
    { date: "Wed", positive: sentiment.positive || 68, neutral: sentiment.neutral || 22, negative: sentiment.negative || 10 },
    { date: "Thu", positive: sentiment.positive || 72, neutral: sentiment.neutral || 18, negative: sentiment.negative || 10 },
    { date: "Fri", positive: sentiment.positive || 75, neutral: sentiment.neutral || 15, negative: sentiment.negative || 10 },
    { date: "Sat", positive: sentiment.positive || 71, neutral: sentiment.neutral || 19, negative: sentiment.negative || 10 },
    { date: "Sun", positive: sentiment.positive || 69, neutral: sentiment.neutral || 21, negative: sentiment.negative || 10 },
  ] : [
    { date: "Mon", positive: 65, neutral: 25, negative: 10 },
    { date: "Tue", positive: 70, neutral: 20, negative: 10 },
    { date: "Wed", positive: 68, neutral: 22, negative: 10 },
    { date: "Thu", positive: 72, neutral: 18, negative: 10 },
    { date: "Fri", positive: 75, neutral: 15, negative: 10 },
    { date: "Sat", positive: 71, neutral: 19, negative: 10 },
    { date: "Sun", positive: 69, neutral: 21, negative: 10 },
  ]

  const chartConfig = {
    mentions: { label: "Mentions", color: "#7a6ff0" },
    reach: { label: "Reach", color: "#6dd5ed" },
    positive: { label: "Positive", color: "#22c55e" },
    neutral: { label: "Neutral", color: "#eab308" },
    negative: { label: "Negative", color: "#ef4444" },
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mentions & Reach Chart */}
        <div>
          <h3 className="text-lg font-semibold text-[#111827] mb-4">Mentions & Reach</h3>
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <LineChart data={mentionsData}>
              <defs>
                <linearGradient id="mentionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7a6ff0" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7a6ff0" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="reachGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6dd5ed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6dd5ed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="mentions"
                stroke="#7a6ff0"
                strokeWidth={3}
                dot={{ fill: "#7a6ff0", r: 4 }}
              />
              <Line type="monotone" dataKey="reach" stroke="#6dd5ed" strokeWidth={3} dot={{ fill: "#6dd5ed", r: 4 }} />
            </LineChart>
          </ChartContainer>
        </div>

        {/* Sentiment Chart */}
        <div>
          <h3 className="text-lg font-semibold text-[#111827] mb-4">Sentiment Distribution</h3>
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <AreaChart data={sentimentData}>
              <defs>
                <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="positive" stroke="#22c55e" strokeWidth={2} fill="url(#positiveGradient)" />
              <Area type="monotone" dataKey="neutral" stroke="#eab308" strokeWidth={2} fill="transparent" />
              <Area type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} fill="transparent" />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  )
}
