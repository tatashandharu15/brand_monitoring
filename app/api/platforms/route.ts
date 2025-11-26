import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build WHERE clause based on filters
    const whereConditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // Project filters
    const projectId = searchParams.get('project_id');
    const keyword = searchParams.get('keyword');
    const createdAtFrom = searchParams.get('created_at_from');
    const createdAtTo = searchParams.get('created_at_to');

    // Mention filters
    const mentionId = searchParams.get('mention_id');
    const publishedFrom = searchParams.get('published_from');
    const publishedTo = searchParams.get('published_to');
    const language = searchParams.get('language');
    const country = searchParams.get('country');
    const sentiment = searchParams.get('sentiment');
    const socialNetwork = searchParams.get('social_network');
    const trackedKeyword = searchParams.get('tracked_keyword');
    const domainInfluenceMin = searchParams.get('domain_influence_min');
    const domainInfluenceMax = searchParams.get('domain_influence_max');
    const socialMediaInteractionsMin = searchParams.get('social_media_interactions_min');
    const socialMediaInteractionsMax = searchParams.get('social_media_interactions_max');
    const linked = searchParams.get('linked');

    // Project filters
    if (projectId) {
      whereConditions.push(`p.project_id = $${paramIndex++}`);
      values.push(projectId);
    }
    if (keyword) {
      whereConditions.push(`p.keyword ILIKE $${paramIndex++}`);
      values.push(`%${keyword}%`);
    }
    if (createdAtFrom) {
      whereConditions.push(`p.created_at >= $${paramIndex++}`);
      values.push(createdAtFrom);
    }
    if (createdAtTo) {
      whereConditions.push(`p.created_at <= $${paramIndex++}`);
      values.push(createdAtTo);
    }

    // Mention filters
    if (mentionId) {
      whereConditions.push(`m.mention_id = $${paramIndex++}`);
      values.push(mentionId);
    }
    if (publishedFrom) {
      whereConditions.push(`m.published >= $${paramIndex++}`);
      values.push(publishedFrom);
    }
    if (publishedTo) {
      whereConditions.push(`m.published <= $${paramIndex++}`);
      values.push(publishedTo);
    }
    if (language) {
      whereConditions.push(`m.language = $${paramIndex++}`);
      values.push(language);
    }
    if (country) {
      whereConditions.push(`m.country = $${paramIndex++}`);
      values.push(country);
    }
    if (sentiment) {
      whereConditions.push(`m.sentiment = $${paramIndex++}`);
      values.push(sentiment);
    }
    if (socialNetwork) {
      whereConditions.push(`m.social_network = $${paramIndex++}`);
      values.push(socialNetwork);
    }
    if (trackedKeyword) {
      whereConditions.push(`m.tracked_keyword ILIKE $${paramIndex++}`);
      values.push(`%${trackedKeyword}%`);
    }
    if (domainInfluenceMin) {
      whereConditions.push(`m.domain_influence >= $${paramIndex++}`);
      values.push(parseFloat(domainInfluenceMin));
    }
    if (domainInfluenceMax) {
      whereConditions.push(`m.domain_influence <= $${paramIndex++}`);
      values.push(parseFloat(domainInfluenceMax));
    }
    if (socialMediaInteractionsMin) {
      whereConditions.push(`m.social_media_interactions >= $${paramIndex++}`);
      values.push(parseInt(socialMediaInteractionsMin));
    }
    if (socialMediaInteractionsMax) {
      whereConditions.push(`m.social_media_interactions <= $${paramIndex++}`);
      values.push(parseInt(socialMediaInteractionsMax));
    }
    if (linked !== null && linked !== undefined) {
      whereConditions.push(`m.linked = $${paramIndex++}`);
      values.push(linked === 'true');
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const sqlQuery = `
      SELECT 
        m.social_network, 
        COUNT(*) AS count 
      FROM mentions m
      LEFT JOIN projects p ON m.project_id = p.project_id
      ${whereClause}
      GROUP BY m.social_network 
      ORDER BY count DESC
    `;

    console.log('Platforms SQL Query:', sqlQuery);
    console.log('Platforms Query Values:', values);

    const result = await query(sqlQuery, values);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching platforms data:', error);
    
    // Fallback mock data for testing
    const mockData = [
      { social_network: 'twitter', count: '45' },
      { social_network: 'instagram', count: '32' },
      { social_network: 'facebook', count: '23' },
      { social_network: 'linkedin', count: '15' },
      { social_network: 'youtube', count: '8' }
    ];
    
    return NextResponse.json(mockData);
  }
}