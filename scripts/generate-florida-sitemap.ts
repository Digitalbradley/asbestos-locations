import { db } from '../server/db';
import { facilities, cities } from '../shared/schema';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';

async function generateCompleteFloridaSitemap() {
  console.log('🗺️ Generating complete Florida sitemap...');
  
  // Get all Florida cities
  const floridaCities = await db
    .select({
      slug: cities.slug,
      name: cities.name
    })
    .from(cities)
    .where(eq(cities.stateId, 3))
    .orderBy(cities.slug);

  // Get all Florida facilities
  const facilityUrls = await db
    .select({
      facilitySlug: facilities.slug,
      citySlug: cities.slug,
      facilityName: facilities.name
    })
    .from(facilities)
    .innerJoin(cities, eq(facilities.cityId, cities.id))
    .where(eq(cities.stateId, 3))
    .orderBy(cities.slug, facilities.slug);

  let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Florida State Page -->
  <url>
    <loc>https://asbestosexposuresites.com/florida</loc>
    <lastmod>2025-01-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Florida Cities (${floridaCities.length} cities) -->`;

  // Add city URLs
  for (const city of floridaCities) {
    sitemapContent += `
  <url>
    <loc>https://asbestosexposuresites.com/florida/${city.slug}</loc>
    <lastmod>2025-01-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  sitemapContent += `
  
  <!-- Florida Facilities (${facilityUrls.length} facilities) -->`;

  // Add facility URLs
  for (const facility of facilityUrls) {
    sitemapContent += `
  <url>
    <loc>https://asbestosexposuresites.com/florida/${facility.citySlug}/${facility.facilitySlug}-asbestos-exposure</loc>
    <lastmod>2025-01-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }

  sitemapContent += `
</urlset>`;

  // Write the complete sitemap
  fs.writeFileSync('./client/public/sitemap-florida.xml', sitemapContent);
  
  console.log(`✅ Generated complete Florida sitemap:`);
  console.log(`   - 1 state page`);
  console.log(`   - ${floridaCities.length} city pages`);
  console.log(`   - ${facilityUrls.length} facility pages`);
  console.log(`   - Total: ${1 + floridaCities.length + facilityUrls.length} URLs`);
}

async function main() {
  try {
    await generateCompleteFloridaSitemap();
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

main();