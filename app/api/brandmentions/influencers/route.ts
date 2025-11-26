import { NextResponse } from "next/server"
import { BrandMentionsAPI } from "@/lib/brandmentions-api"

export async function GET(request: Request) {
  try {
    const apiKey = process.env.BRANDMENTIONS_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const page = searchParams.get("page")
    const perPage = searchParams.get("per_page")
    const startPeriod = searchParams.get("startPeriod")
    const endPeriod = searchParams.get("endPeriod")

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const api = new BrandMentionsAPI({ apiKey })
    const response = await api.getProjectInfluencers(projectId, {
      page: page ? parseInt(page) : 1,
      perPage: perPage ? parseInt(perPage) : 100,
      startPeriod: startPeriod || undefined,
      endPeriod: endPeriod || undefined,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("[API] Error fetching influencers:", error)
    return NextResponse.json({ error: "Failed to fetch influencers" }, { status: 500 })
  }
}
