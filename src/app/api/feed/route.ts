import { NextResponse } from 'next/server'
import { personalInfo, projects, experiences } from '@/data/portfolio'

export async function GET() {
  const baseUrl = 'https://arthurjean.com'
  const currentDate = new Date().toISOString()

  const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${personalInfo.name} - Portfolio</title>
    <description>${personalInfo.bio}</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>fr-FR</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <pubDate>${currentDate}</pubDate>
    <ttl>1440</ttl>
    <image>
      <url>${baseUrl}/images/avatar.png</url>
      <title>${personalInfo.name} - Portfolio</title>
      <link>${baseUrl}</link>
    </image>
    
    <item>
      <title>Portfolio de ${personalInfo.name} - Développeur Full Stack</title>
      <description>${personalInfo.bio}</description>
      <link>${baseUrl}</link>
      <guid isPermaLink="true">${baseUrl}</guid>
      <pubDate>${currentDate}</pubDate>
      <content:encoded><![CDATA[
        <h2>Portfolio de ${personalInfo.name}</h2>
        <p>${personalInfo.bio}</p>
        <h3>Projets récents :</h3>
        <ul>
          ${projects.map(project => `
            <li>
              <strong>${project.title}</strong>: ${project.description}
              ${project.urls && project.urls.length > 0 ? `<br><a href="${project.urls[0]}" target="_blank">Voir le projet</a>` : ''}
            </li>
          `).join('')}
        </ul>
        <h3>Expérience professionnelle :</h3>
        <ul>
          ${experiences.map(exp => `
            <li>
              <strong>${exp.position}</strong> chez ${exp.company} (${exp.duration})
              <br>${exp.description}
            </li>
          `).join('')}
        </ul>
        <p><a href="${baseUrl}/contact">Me contacter</a></p>
      ]]></content:encoded>
    </item>
    
    ${projects.filter(p => p.urls && p.urls.length > 0).map(project => `
    <item>
      <title>Projet: ${project.title}</title>
      <description>${project.description}</description>
      <link>${project.urls![0]}</link>
      <guid isPermaLink="true">${project.urls![0]}</guid>
      <pubDate>${currentDate}</pubDate>
      <content:encoded><![CDATA[
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <p><strong>Technologies utilisées :</strong> ${project.technologies.join(', ')}</p>
        ${project.urls && project.urls.length > 0 ? `<p><a href="${project.urls[0]}" target="_blank">Voir le projet en ligne</a></p>` : ''}
      ]]></content:encoded>
    </item>
    `).join('')}
  </channel>
</rss>`

  return new NextResponse(rssContent, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
    }
  })
}