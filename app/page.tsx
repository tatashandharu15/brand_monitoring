import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Floating Glass Orbs Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full glass-card opacity-40 animate-float" />
        <div
          className="absolute top-40 right-20 w-96 h-96 rounded-full glass-card opacity-30 animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full glass-card opacity-35 animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl glass-card flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-semibold text-foreground">BrandPulse</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/wizard"
              className="px-6 py-2.5 rounded-full glass-card text-sm font-medium hover:scale-105 transition-transform"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-float">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-foreground/80">Real-time brand monitoring</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 text-balance leading-tight">
            Discover what the world is saying about{" "}
            <span className="bg-gradient-to-r from-[#7B61FF] to-[#6C4BFF] bg-clip-text text-transparent">
              your brand
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-foreground/70 mb-12 max-w-3xl mx-auto text-pretty leading-relaxed">
            Monitor mentions across social media, news, and the web. Get real-time insights and sentiment analysis to
            stay ahead of the conversation.
          </p>

          {/* CTA Button */}
          <Link
            href="/wizard"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full glass-button text-white text-lg font-semibold group"
          >
            Start Your First Project
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto">
            <div className="glass-card rounded-3xl p-8 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7B61FF] to-[#6C4BFF] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Multi-Platform</h3>
              <p className="text-foreground/70 leading-relaxed">
                Monitor X, Facebook, Instagram, TikTok, YouTube, and more from one dashboard.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-8 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7B61FF] to-[#6C4BFF] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Sentiment Analysis</h3>
              <p className="text-foreground/70 leading-relaxed">
                Understand how people feel about your brand with AI-powered sentiment detection.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-8 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7B61FF] to-[#6C4BFF] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Real-Time Alerts</h3>
              <p className="text-foreground/70 leading-relaxed">
                Get instant notifications when your brand is mentioned across the web.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
