"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"

interface ProjectSetupStepProps {
  data: {
    projectName: string
    brandName: string
  }
  onUpdate: (data: { projectName?: string; brandName?: string }) => void
}

export function ProjectSetupStep({ data, onUpdate }: ProjectSetupStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7B61FF] to-[#6C4BFF] flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Let's get started</h2>
        <p className="text-foreground/70 text-lg">Tell us about your brand monitoring project</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="projectName" className="text-foreground font-medium">
            Project Name
          </Label>
          <Input
            id="projectName"
            placeholder="e.g., Q1 2024 Campaign"
            value={data.projectName}
            onChange={(e) => onUpdate({ projectName: e.target.value })}
            className="glass-input h-12 text-lg"
          />
          <p className="text-sm text-foreground/60">Give your monitoring project a memorable name</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brandName" className="text-foreground font-medium">
            Brand Name
          </Label>
          <Input
            id="brandName"
            placeholder="e.g., Acme Corp"
            value={data.brandName}
            onChange={(e) => onUpdate({ brandName: e.target.value })}
            className="glass-input h-12 text-lg"
          />
          <p className="text-sm text-foreground/60">The brand or company you want to monitor</p>
        </div>
      </div>
    </div>
  )
}
