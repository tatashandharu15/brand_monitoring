import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project_id } = body;

    if (!project_id) {
      return NextResponse.json(
        { success: false, error: 'project_id is required' },
        { status: 400 }
      );
    }

    console.log('[API] Fetching mentions for project:', project_id);

    // Call FastAPI backend
    const fastApiUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
    const response = await fetch(`${fastApiUrl}/projects/get_mentions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ project_id }),
    });

    if (!response.ok) {
      console.error('[API] FastAPI response not ok:', response.status, response.statusText);
      return NextResponse.json(
        { success: false, error: `FastAPI error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[API] FastAPI response:', data);

    return NextResponse.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('[API] Error fetching mentions:', error);
    
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { success: false, error: 'Cannot connect to FastAPI backend. Please ensure it is running on http://localhost:8000' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
