import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build WHERE conditions based on query parameters
    const conditions: string[] = [];
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

    if (searchParams.get('project_created_from')) {
      conditions.push(`p.created_at >= $${paramIndex}`);
      values.push(searchParams.get('project_created_from'));
      paramIndex++;
    }

    if (searchParams.get('project_created_to')) {
      conditions.push(`p.created_at <= $${paramIndex}`);
      values.push(searchParams.get('project_created_to'));
      paramIndex++;
    }

    // Mention filters
    if (searchParams.get('mention_id')) {
      conditions.push(`m.mention_id = $${paramIndex}`);
      values.push(searchParams.get('mention_id'));
      paramIndex++;
    }

    if (searchParams.get('published_from')) {
      conditions.push(`m.published >= $${paramIndex}`);
      values.push(searchParams.get('published_from'));
      paramIndex++;
    }

    if (searchParams.get('published_to')) {
      conditions.push(`m.published <= $${paramIndex}`);
      values.push(searchParams.get('published_to'));
      paramIndex++;
    }

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

    if (searchParams.get('domain_influence_min')) {
      conditions.push(`m.domain_influence >= $${paramIndex}`);
      values.push(parseFloat(searchParams.get('domain_influence_min')!));
      paramIndex++;
    }

    if (searchParams.get('domain_influence_max')) {
      conditions.push(`m.domain_influence <= $${paramIndex}`);
      values.push(parseFloat(searchParams.get('domain_influence_max')!));
      paramIndex++;
    }

    if (searchParams.get('social_media_interactions_min')) {
      conditions.push(`m.social_media_interactions >= $${paramIndex}`);
      values.push(parseInt(searchParams.get('social_media_interactions_min')!));
      paramIndex++;
    }

    if (searchParams.get('social_media_interactions_max')) {
      conditions.push(`m.social_media_interactions <= $${paramIndex}`);
      values.push(parseInt(searchParams.get('social_media_interactions_max')!));
      paramIndex++;
    }

    if (searchParams.get('linked') !== null) {
      conditions.push(`m.linked = $${paramIndex}`);
      values.push(searchParams.get('linked') === 'true');
      paramIndex++;
    }

    // Build the query
    let sqlQuery = `
      SELECT 
        m.mention_id, 
        m.published, 
        m.url, 
        m.tracked_keyword, 
        m.social_network, 
        m.text, 
        m.sentiment, 
        m.author->>'name' AS author_name, 
        m.author->>'username' AS username, 
        m.author->>'followers' AS followers,
        m.author->>'profile_pic' AS profile_pic,
        m.domain_influence,
        m.social_media_interactions,
        m.linked,
        p.keyword as project_keyword
      FROM mentions m
      LEFT JOIN projects p ON m.project_id = p.project_id
    `;

    if (conditions.length > 0) {
      sqlQuery += ` WHERE ${conditions.join(' AND ')}`;
    }

    sqlQuery += ` ORDER BY m.published DESC LIMIT 50`;

    console.log('Executing query:', sqlQuery);
    console.log('With values:', values);

    const result = await query(sqlQuery, values);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching mentions:', error);
    
    // Fallback mock data for testing
    const mockData = [
      {
        mention_id: 1,
        published: new Date().toISOString(),
        url: 'https://twitter.com/user1/status/123',
        tracked_keyword: 'brand',
        social_network: 'twitter',
        text: 'Great experience with this brand! Highly recommend.',
        sentiment: 'positive',
        author_name: 'John Doe',
        username: 'johndoe',
        followers: '1500'
      },
      {
        mention_id: 2,
        published: new Date(Date.now() - 3600000).toISOString(),
        url: 'https://instagram.com/p/abc123',
        tracked_keyword: 'product',
        social_network: 'instagram',
        text: 'The product quality could be better.',
        sentiment: 'negative',
        author_name: 'Jane Smith',
        username: 'janesmith',
        followers: '2300'
      },
      {
        mention_id: 3,
        published: new Date(Date.now() - 7200000).toISOString(),
        url: 'https://facebook.com/post/xyz789',
        tracked_keyword: 'service',
        social_network: 'facebook',
        text: 'Average service, nothing special.',
        sentiment: 'neutral',
        author_name: 'Mike Johnson',
        username: 'mikej',
        followers: '890'
      }
    ];
    
    return NextResponse.json(mockData);
  }
}