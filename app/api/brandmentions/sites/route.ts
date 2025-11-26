import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const startPeriod = searchParams.get("startPeriod")
    const endPeriod = searchParams.get("endPeriod")

    // Build WHERE conditions for filtering
    const conditions: string[] = []
    const values: any[] = []
    let paramIndex = 1

    // Add project filter if provided
    if (projectId) {
      conditions.push(`m.project_id = $${paramIndex}`)
      values.push(projectId)
      paramIndex++
    }

    // Add date filters if provided
    if (startPeriod) {
      conditions.push(`m.published >= $${paramIndex}`)
      values.push(startPeriod)
      paramIndex++
    }

    if (endPeriod) {
      conditions.push(`m.published <= $${paramIndex}`)
      values.push(endPeriod)
      paramIndex++
    }

    // Only include mentions with URLs
    conditions.push(`m.url IS NOT NULL AND m.url != ''`)

    // Build the query to get mentions from local database
    let sqlQuery = `
      SELECT 
        m.mention_id,
        m.url,
        m.sentiment,
        m.published,
        m.domain_influence,
        m.social_media_interactions,
        m.author->>'name' AS author_name,
        m.author->>'username' AS username,
        m.author->>'profile_pic' AS profile_pic,
        m.author->>'followers' AS followers
      FROM mentions m
    `

    if (conditions.length > 0) {
      sqlQuery += ` WHERE ${conditions.join(' AND ')}`
    }

    sqlQuery += ` ORDER BY m.published DESC`

    console.log('Executing sites query:', sqlQuery)
    console.log('With values:', values)

    const result = await query(sqlQuery, values)
    const mentions = result.rows

    // Process mentions to extract site data
    const siteData = new Map()
    
    mentions.forEach((mention: any) => {
      if (mention.url) {
        try {
          const url = new URL(mention.url)
          const domain = url.hostname.replace('www.', '')
          
          if (!siteData.has(domain)) {
            siteData.set(domain, {
              site: domain,
              mentions: 0,
              visits: 0,
              performance: 0,
              sentiment: { positive: 0, neutral: 0, negative: 0 },
              authors: []
            })
          }
          
          const site = siteData.get(domain)
          if (site) {
            site.mentions += 1
            
            // Add author information if not already present
            const existingAuthor = site.authors.find((author: any) => 
              author.username === mention.username
            )
            
            if (!existingAuthor && mention.author_name) {
              site.authors.push({
                name: mention.author_name,
                username: mention.username,
                profile_pic: mention.profile_pic,
                followers: mention.followers
              })
            }
            
            // Calculate performance based on domain influence and social interactions
            let performanceScore = 5 // Default score
            if (mention.domain_influence) {
              performanceScore = Math.min(10, Math.max(1, mention.domain_influence / 10))
            }
            if (mention.social_media_interactions) {
              const socialScore = Math.min(5, mention.social_media_interactions / 100)
              performanceScore = Math.min(10, performanceScore + socialScore)
            }
            site.performance = Math.max(site.performance, performanceScore)
            
            // Estimate visits based on mentions count and performance
            site.visits = Math.floor(site.mentions * 100000 * (site.performance / 10))
            
            // Count sentiment
            if (mention.sentiment) {
              const sentiment = mention.sentiment.toLowerCase()
              if (sentiment.includes('positive')) site.sentiment.positive += 1
              else if (sentiment.includes('negative')) site.sentiment.negative += 1
              else site.sentiment.neutral += 1
            } else {
              site.sentiment.neutral += 1
            }
          }
        } catch (error) {
          // Skip invalid URLs
          console.warn('Invalid URL in mention:', mention.url)
        }
      }
    })

    // Convert to array and sort by mentions count
    const sites = Array.from(siteData.values())
      .sort((a: any, b: any) => b.mentions - a.mentions)
      .map((site: any) => ({
        ...site,
        performance: `${site.performance.toFixed(0)}/10`,
        visits: site.visits.toLocaleString()
      }))

    return NextResponse.json({
      sites,
      total: sites.length
    })
  } catch (error) {
    console.error("[API] Error fetching sites:", error)
    return NextResponse.json({ error: "Failed to fetch sites" }, { status: 500 })
  }
}