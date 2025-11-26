"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle2 } from "lucide-react"

const analysisSteps = [
  { id: 1, label: "Connecting to platforms", duration: 2000 },
  { id: 2, label: "Scanning social media", duration: 2500 },
  { id: 3, label: "Analyzing sentiment", duration: 2000 },
  { id: 4, label: "Generating insights", duration: 1500 },
]

export default function AnalyzingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 1
      })
    }, 80)

    // Step progression
    let stepTimeout: NodeJS.Timeout
    const progressSteps = () => {
      if (currentStep < analysisSteps.length) {
        stepTimeout = setTimeout(() => {
          setCurrentStep((prev) => prev + 1)
          if (currentStep + 1 < analysisSteps.length) {
            progressSteps()
          }
        }, analysisSteps[currentStep].duration)
      }
    }

    progressSteps()

    // Navigate to dashboard after completion
    const navigationTimeout = setTimeout(() => {
      router.push("/dashboard")
    }, 8500)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(stepTimeout)
      clearTimeout(navigationTimeout)
    }
  }, [currentStep, router])

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden flex items-center justify-center">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full glass-card opacity-30 animate-float" />
        <div
          className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full glass-card opacity-35 animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 px-6 max-w-2xl w-full">
        <div className="glass-card rounded-3xl p-12 text-center">
          {/* Animated Logo/Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#7B61FF] to-[#6C4BFF] flex items-center justify-center animate-pulse">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              </div>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#7B61FF] to-[#6C4BFF] blur-xl opacity-50 animate-pulse" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-bold text-foreground mb-4">Analyzing your brand</h1>
          <p className="text-lg text-foreground/70 mb-12">
            We're scanning the web for mentions and gathering insights...
          </p>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="h-3 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#7B61FF] to-[#6C4BFF] transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-foreground/60 mt-2">{progress}% complete</p>
          </div>

          {/* Analysis Steps */}
          <div className="space-y-4">
            {analysisSteps.map((step, index) => {
              const isComplete = index < currentStep
              const isCurrent = index === currentStep
              const isPending = index > currentStep

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                    isCurrent ? "glass-card" : "opacity-50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isComplete
                        ? "bg-gradient-to-br from-[#7B61FF] to-[#6C4BFF]"
                        : isCurrent
                          ? "glass-card border-2 border-[#7B61FF]"
                          : "glass-card"
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-[#7B61FF] animate-spin" />
                    ) : (
                      <span className="text-sm text-foreground/50">{step.id}</span>
                    )}
                  </div>
                  <span
                    className={`text-left font-medium ${
                      isComplete || isCurrent ? "text-foreground" : "text-foreground/50"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Fun Fact */}
          <div className="mt-12 glass-card rounded-2xl p-4 bg-purple-50/50">
            <p className="text-sm text-foreground/70">
              <span className="font-semibold">Did you know?</span> Over 500 million tweets are sent every day. We're
              scanning them all for you!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
