import { NextResponse } from "next/server"
import { BrandMentionsAPI } from "@/lib/brandmentions-api"

export async function GET() {
  try {
    const apiKey = process.env.BRANDMENTIONS_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const api = new BrandMentionsAPI({ apiKey })
    const response = await api.listProjects()

    return NextResponse.json(response)
  } catch (error) {
    console.error("[API] Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}
