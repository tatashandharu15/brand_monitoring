"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface KeywordConfigStepProps {
  data: {
    keywords: string[]
    brandName: string
  }
  onUpdate: (data: { keywords: string[] }) => void
}

export function KeywordConfigStep({ data, onUpdate }: KeywordConfigStepProps) {
  const [inputValue, setInputValue] = useState("")

  const addKeyword = () => {
    const trimmed = inputValue.trim()
    if (trimmed && !data.keywords.includes(trimmed)) {
      onUpdate({ keywords: [...data.keywords, trimmed] })
      setInputValue("")
    }
  }

  const removeKeyword = (keyword: string) => {
    onUpdate({ keywords: data.keywords.filter((k) => k !== keyword) })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addKeyword()
    }
  }

  const suggestedKeywords = [
    data.brandName,
    `@${data.brandName.toLowerCase().replace(/\s+/g, "")}`,
    `#${data.brandName.toLowerCase().replace(/\s+/g, "")}`,
    `${data.brandName} review`,
    `${data.brandName} product`,
  ].filter((k) => k && !data.keywords.includes(k))

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Add keywords to track</h2>
        <p className="text-foreground/70 text-lg">Define what mentions you want to monitor</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="keyword" className="text-foreground font-medium">
            Add Keyword or Hashtag
          </Label>
          <div className="flex gap-2">
            <Input
              id="keyword"
              placeholder="e.g., #brandname, @handle, product name"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="glass-input h-12 text-lg flex-1"
            />
            <Button onClick={addKeyword} disabled={!inputValue.trim()} className="glass-button h-12 px-6 rounded-full">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Current Keywords */}
        {data.keywords.length > 0 && (
          <div className="glass-card rounded-2xl p-4">
            <p className="text-sm font-medium text-foreground/70 mb-3">Tracking Keywords:</p>
            <div className="flex flex-wrap gap-2">
              {data.keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="glass-card px-3 py-2 text-sm font-medium hover:bg-white/40"
                >
                  {keyword}
                  <button onClick={() => removeKeyword(keyword)} className="ml-2 hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Keywords */}
        {suggestedKeywords.length > 0 && (
          <div>
            <p className="text-sm font-medium text-foreground/70 mb-3">Suggested keywords:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedKeywords.slice(0, 5).map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => {
                    onUpdate({ keywords: [...data.keywords, keyword] })
                  }}
                  className="glass-card px-4 py-2 rounded-full text-sm font-medium hover:bg-white/40 transition-all hover:scale-105"
                >
                  <Plus className="w-3 h-3 inline mr-1" />
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-4 bg-purple-50/50">
        <p className="text-sm text-foreground/70">
          💡 <span className="font-semibold">Tip:</span> Include variations like hashtags, handles, and common
          misspellings for better coverage
        </p>
      </div>
    </div>
  )
}
