import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectName, keywords, platforms, languages, countries } = body

    // Validate required fields
    if (!projectName || projectName.trim() === "") {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 })
    }

    if (!keywords || keywords.length === 0) {
      return NextResponse.json({ error: "At least one keyword is required" }, { status: 400 })
    }

    if (keywords.length > 5) {
      return NextResponse.json({ error: "Maximum 5 keywords allowed" }, { status: 400 })
    }

    if (!platforms || platforms.length === 0) {
      return NextResponse.json({ error: "At least one platform must be selected" }, { status: 400 })
    }

    // Prepare data for FastAPI backend
    const projectData = {
      project_name: projectName.trim(),
      keywords: keywords.filter((k: string) => k.trim() !== "").slice(0, 5),
      platforms: platforms,
      languages: languages || ["en"],
      countries: countries || ["US"]
    }

    console.log("[NextJS] Sending project data to FastAPI:", JSON.stringify(projectData, null, 2))

    // Call FastAPI backend
    const fastApiUrl = process.env.FASTAPI_URL || "http://localhost:8000"
    const response = await fetch(`${fastApiUrl}/projects/full_setup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[NextJS] FastAPI error:", response.status, errorText)
      throw new Error(`FastAPI error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("[NextJS] FastAPI response:", JSON.stringify(data, null, 2))

    return NextResponse.json({
      success: true,
      message: "Project created successfully",
      data: data
    })
  } catch (error) {
    console.error("[NextJS] Error creating project:", error)
    
    // Return more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("fetch")) {
        return NextResponse.json({ 
          error: "Unable to connect to backend server. Please ensure FastAPI is running on http://localhost:8000" 
        }, { status: 503 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
