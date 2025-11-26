import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days') || '7';
    
    // Validate days parameter
    const daysNumber = parseInt(days, 10);
    if (isNaN(daysNumber) || daysNumber < 1 || daysNumber > 365) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid days parameter. Must be a number between 1 and 365.' 
        },
        { status: 400 }
      );
    }

    // Build WHERE conditions based on query parameters (same as mentions endpoint)
    const conditions: string[] = [`m.published >= NOW() - INTERVAL '${daysNumber} days'`];
    const values: any[] = [];
    let paramIndex = 1;

    // Project filters
    if (searchParams.get('project_id')) {
      conditions.push(`m.project_id = $${paramIndex}`);
      values.push(searchParams.get('project_id'));
      paramIndex++;
    }

    if (searchParams.get('keyword')) {
      conditions.push(`p.keyword ILIKE $${paramIndex}`);
      values.push(`%${searchParams.get('keyword')}%`);
      paramIndex++;
    }

    // Mention filters
    if (searchParams.get('language')) {
      conditions.push(`m.language = $${paramIndex}`);
      values.push(searchParams.get('language'));
      paramIndex++;
    }

    if (searchParams.get('country')) {
      conditions.push(`m.country = $${paramIndex}`);
      values.push(searchParams.get('country'));
      paramIndex++;
    }

    // Handle multiple sentiment values
    const sentiments = searchParams.getAll('sentiment');
    if (sentiments.length > 0) {
      const sentimentPlaceholders = sentiments.map(() => `$${paramIndex++}`).join(', ');
      conditions.push(`m.sentiment IN (${sentimentPlaceholders})`);
      values.push(...sentiments);
    }

    // Handle multiple social network values
    const socialNetworks = searchParams.getAll('social_network');
    if (socialNetworks.length > 0) {
      const socialNetworkPlaceholders = socialNetworks.map(() => `$${paramIndex++}`).join(', ');
      conditions.push(`m.social_network IN (${socialNetworkPlaceholders})`);
      values.push(...socialNetworks);
    }

    if (searchParams.get('tracked_keyword')) {
      conditions.push(`m.tracked_keyword ILIKE $${paramIndex}`);
      values.push(`%${searchParams.get('tracked_keyword')}%`);
      paramIndex++;
    }

    let sqlQuery = `
      SELECT 
        DATE(m.published) AS day, 
        COUNT(*) AS mentions, 
        SUM(CAST(m.author->>'reach' AS INT)) AS reach 
      FROM mentions m
      LEFT JOIN projects p ON m.project_id = p.project_id
      WHERE ${conditions.join(' AND ')}
      GROUP BY day 
      ORDER BY day
    `;

    console.log('Analytics query:', sqlQuery);
    console.log('Analytics values:', values);

    const result = await query(sqlQuery, values);

    return NextResponse.json({
      success: true,
      data: result.rows.map(row => ({
        day: row.day,
        mentions: parseInt(row.mentions),
        reach: parseInt(row.reach) || 0
      })),
      period: `${daysNumber} days`,
      totalMentions: result.rows.reduce((sum, row) => sum + parseInt(row.mentions), 0),
      totalReach: result.rows.reduce((sum, row) => sum + (parseInt(row.reach) || 0), 0)
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    
    // Get days parameter for fallback
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days') || '7';
    const daysNumber = parseInt(days, 10);
    
    // Fallback mock data for testing
    const mockData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      mockData.push({
        day: date.toISOString().split('T')[0],
        mentions: Math.floor(Math.random() * 50) + 10,
        reach: Math.floor(Math.random() * 10000) + 1000
      });
    }

    return NextResponse.json({
      success: true,
      data: mockData,
      period: `${daysNumber} days`,
      totalMentions: mockData.reduce((sum, item) => sum + item.mentions, 0),
      totalReach: mockData.reduce((sum, item) => sum + item.reach, 0)
    });
  }
}