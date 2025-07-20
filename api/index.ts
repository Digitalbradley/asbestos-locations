import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq, like, and, desc, asc, sql, ne, or, ilike } from 'drizzle-orm';
import * as schema from '../shared/schema.js';

// Configure WebSocket for serverless environments
if (typeof window === 'undefined') {
  try {
    import('ws').then(ws => {
      neonConfig.webSocketConstructor = ws.default;
    }).catch(() => {
      console.log('WebSocket not available in this environment');
    });
  } catch (error) {
    console.log('WebSocket not available in this environment');
  }
}

// Direct database connection
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
const db = drizzle({ client: pool, schema });

// Helper function for facility queries with standard joins
async function buildFacilityQuery(whereClause?: any, limit?: number) {
  return await db.select({
    id: schema.facilities.id,
    name: schema.facilities.name,
    slug: schema.facilities.slug,
    address: schema.facilities.address,
    companyName: schema.facilities.companyName,
    description: schema.facilities.description,
    metaTitle: schema.facilities.metaTitle,
    metaDescription: schema.facilities.metaDescription,
    seoKeyword: schema.facilities.seoKeyword,
    operationalYears: schema.facilities.operationalYears,
    facilityType: schema.facilities.facilityType,
    city: {
      id: schema.cities.id,
      name: schema.cities.name,
      slug: schema.cities.slug
    },
    state: {
      id: schema.states.id,
      name: schema.states.name,
      slug: schema.states.slug
    },
    category: {
      id: schema.categories.id,
      name: schema.categories.name,
      slug: schema.categories.slug
    }
  })
  .from(schema.facilities)
  .leftJoin(schema.cities, eq(schema.facilities.cityId, schema.cities.id))
  .leftJoin(schema.states, eq(schema.cities.stateId, schema.states.id))
  .leftJoin(schema.categories, eq(schema.facilities.categoryId, schema.categories.id))
  .where(whereClause)
  .orderBy(asc(schema.facilities.name))
  .limit(limit || 10000);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🔍 API INDEX CALLED:', req.url); // ADD THIS LINE

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const path = req.url;
    console.log('API Request:', req.method, path);



    // Handle all non-API page requests with SSR
    // Skip: API routes, static assets, and other file requests
    const isApiRoute = path?.startsWith('/api/');
    const isStaticAsset = path?.includes('/assets/') || path?.includes('.js') || path?.includes('.css') || path?.includes('.map') || path?.includes('.ico') || path?.includes('.png') || path?.includes('.jpg') || path?.includes('.svg');
    const isSpecialRoute = path === '/sitemap-florida.xml';
    
    if (!isApiRoute && !isStaticAsset && !isSpecialRoute) {
      console.log('📄 PAGE REQUEST DETECTED - Handling with SSR:', path);
      const { default: ssrHandler } = await import('./ssr-handler');
      return await ssrHandler(req, res);
    }

    // Add this debug block
    if (path?.includes('facilities')) {
      console.log('🔍 FACILITIES REQUEST DETECTED');
      console.log('🔍 Full path:', path);
      const pathParts = path.split('/');
      console.log('🔍 Path parts:', pathParts);
    }

    // Health check
    if (path === '/api/health') {
      res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
      return;
    }



    // Sitemap route
    if (path === '/sitemap-florida.xml') {
      // Get all Florida cities
      const floridaCities = await db
        .select({
          slug: schema.cities.slug,
          name: schema.cities.name
        })
        .from(schema.cities)
        .where(eq(schema.cities.stateId, 3))
        .orderBy(schema.cities.slug);

      // Get all Florida facilities
      const facilityUrls = await db
        .select({
          facilitySlug: schema.facilities.slug,
          citySlug: schema.cities.slug,
          facilityName: schema.facilities.name
        })
        .from(schema.facilities)
        .innerJoin(schema.cities, eq(schema.facilities.cityId, schema.cities.id))
        .where(eq(schema.cities.stateId, 3))
        .orderBy(schema.cities.slug, schema.facilities.slug);

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

      res.setHeader('Content-Type', 'application/xml');
      res.status(200).send(sitemapContent);
      return;
    }

    // Handle API routes with direct database queries
    if (path === '/api/states') {
      const states = await db.select().from(schema.states);
      res.status(200).json(states);
      return;
    }

    if (path?.startsWith('/api/states/')) {
      const slug = path.split('/')[3];
      const [state] = await db.select({
        id: schema.states.id,
        name: schema.states.name,
        slug: schema.states.slug,
        facilityCount: schema.states.facilityCount
      })
      .from(schema.states)
      .where(eq(schema.states.slug, slug));

      if (!state) {
        res.status(404).json({ message: 'State not found' });
        return;
      }

      // Get cities for this state
      const cities = await db.select({
        id: schema.cities.id,
        name: schema.cities.name,
        slug: schema.cities.slug,
        facilityCount: schema.cities.facilityCount
      })
      .from(schema.cities)
      .where(eq(schema.cities.stateId, state.id))
      .orderBy(desc(schema.cities.facilityCount));


      const stateWithCities = {
        ...state,
        cities: cities
      };

      res.status(200).json(stateWithCities);
      return;
    }

    if (path === '/api/categories') {
      const categories = await db.select().from(schema.categories);
      res.status(200).json(categories);
      return;
    }

    // Handle facilities route (general) - Check for query parameters first
    if (path === '/api/facilities' || (path?.startsWith('/api/facilities?') && Object.keys(req.query).length > 0)) {
      const cityId = req.query.cityId ? parseInt(req.query.cityId as string) : null;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;

      let whereClause;
      if (cityId) {
        whereClause = eq(schema.facilities.cityId, cityId);
      }

      const facilities = await buildFacilityQuery(whereClause, limit);

      res.status(200).json(facilities);
      return;
    }

    // Handle individual facility routes (more specific path structure, no query params)
    if (path?.includes('/api/facilities/') && path.split('/').length >= 6 && Object.keys(req.query).length === 0) {
      const pathParts = path.split('/');
      const stateSlug = pathParts[3];
      const citySlug = pathParts[4];
      const facilitySlug = pathParts[5].replace('-asbestos-exposure', ''); // Remove suffix if present

      console.log('Individual facility route - State:', stateSlug, 'City:', citySlug, 'Facility:', facilitySlug);

      if (stateSlug && citySlug && facilitySlug) {
        const whereClause = and(
          eq(schema.facilities.slug, facilitySlug),
          eq(schema.cities.slug, citySlug),
          eq(schema.states.slug, stateSlug)
        );

        const facilities = await buildFacilityQuery(whereClause, 1);
        const facility = facilities[0];

        if (!facility) {
          console.log('Facility not found for:', stateSlug, citySlug, facilitySlug);
          res.status(404).json({ message: 'Facility not found' });
          return;
        }

        console.log('Found facility:', facility.name, facility.id);
        res.status(200).json(facility);
        return;
      }
    }

    // FIXED: Handle city facilities route (more specific) - MOVED ABOVE general city route
    if (path?.startsWith('/api/cities/') && path.includes('/facilities')) {
      console.log('🎯 CITY FACILITIES ROUTE HANDLER TRIGGERED');
      const pathParts = path.split('/');
      const stateSlug = pathParts[3];
      const citySlug = pathParts[4];

      if (stateSlug && citySlug) {
        const whereClause = and(
          eq(schema.cities.slug, citySlug),
          eq(schema.states.slug, stateSlug)
        );

        const facilities = await buildFacilityQuery(whereClause);

        res.status(200).json(facilities);
        return;
      }
    }

    // Handle related cities route - MUST BE BEFORE general city route
    if (path?.startsWith('/api/cities/') && path.endsWith('/related')) {
      const pathParts = path.split('/');
      const cityId = parseInt(pathParts[3]);

      if (isNaN(cityId)) {
        res.status(400).json({ message: 'Invalid city ID' });
        return;
      }

      try {
        console.log('🚀 Related cities route called for cityId:', cityId);
        console.log('🔍 Getting related cities for city ID:', cityId);

        // Get the target city
        const [targetCity] = await db
          .select()
          .from(schema.cities)
          .where(eq(schema.cities.id, cityId))
          .limit(1);

        console.log('✅ Target city found:', targetCity);

        if (!targetCity) {
          console.log('❌ No target city found');
          res.status(404).json({ message: 'City not found' });
          return;
        }

        // Get related cities (same state, ordered by facility count, excluding current city)
        const relatedCities = await db.select({
          id: schema.cities.id,
          name: schema.cities.name,
          slug: schema.cities.slug,
          facilityCount: schema.cities.facilityCount
        })
        .from(schema.cities)
        .where(and(
          eq(schema.cities.stateId, targetCity.stateId),
          ne(schema.cities.id, cityId),
          sql`${schema.cities.facilityCount} > 0`
        ))
        .orderBy(desc(schema.cities.facilityCount))
        .limit(10);

        console.log('✅ Returning', relatedCities.length, 'related cities');
        console.log('✅ Successfully got', relatedCities.length, 'related cities');
        res.status(200).json(relatedCities);
        return;
      } catch (error) {
        console.error('❌ Error fetching related cities:', error);
        res.status(500).json({ message: 'Failed to fetch related cities' });
        return;
      }
    }

    // Handle city routes (general) - MOVED BELOW city facilities and related cities routes
    if (path?.includes('/api/cities/')) {
      const pathParts = path.split('/');
      const stateSlug = pathParts[3];
      const citySlug = pathParts[4];

      if (stateSlug && citySlug) {
        const [city] = await db.select({
          id: schema.cities.id,
          name: schema.cities.name,
          slug: schema.cities.slug,
          facilityCount: schema.cities.facilityCount,
          state: {
            id: schema.states.id,
            name: schema.states.name,
            slug: schema.states.slug
          }
        })
        .from(schema.cities)
        .leftJoin(schema.states, eq(schema.cities.stateId, schema.states.id))
        .where(and(
          eq(schema.cities.slug, citySlug),
          eq(schema.states.slug, stateSlug)
        ));

        if (!city) {
          res.status(404).json({ message: 'City not found' });
          return;
        }
        res.status(200).json(city);
        return;
      }
    }

    // Handle search
    if (path?.startsWith('/api/search')) {
      const query = req.query.q as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      if (!query) {
        res.status(400).json({ message: 'Search query is required' });
        return;
      }

      const results = await db.select({
        id: schema.facilities.id,
        name: schema.facilities.name,
        slug: schema.facilities.slug,
        address: schema.facilities.address,
        city: {
          id: schema.cities.id,
          name: schema.cities.name,
          slug: schema.cities.slug
        },
        state: {
          id: schema.states.id,
          name: schema.states.name,
          slug: schema.states.slug
        }
      })
      .from(schema.facilities)
      .leftJoin(schema.cities, eq(schema.facilities.cityId, schema.cities.id))
      .leftJoin(schema.states, eq(schema.cities.stateId, schema.states.id))
      .where(like(schema.facilities.name, `%${query}%`))
      .limit(limit);

      res.status(200).json(results);
      return;
    }

    // Handle content templates
    if (path?.startsWith('/api/content-templates/')) {
      const pathParts = path.split('/');
      const templateType = pathParts[3]; // state, city, or facility
      const templateName = pathParts[4];

      if (templateType && templateName) {
        const [template] = await db.select({
          id: schema.contentTemplates.id,
          templateType: schema.contentTemplates.templateType,
          templateName: schema.contentTemplates.templateName,
          contentBlocks: schema.contentTemplates.contentBlocks,
          placeholders: schema.contentTemplates.placeholders,
          isActive: schema.contentTemplates.isActive
        })
          .from(schema.contentTemplates)
          .where(and(
            eq(schema.contentTemplates.templateType, templateType),
            eq(schema.contentTemplates.templateName, templateName)
          ));

        if (!template) {
          res.status(404).json({ message: 'Content template not found' });
          return;
        }
        res.status(200).json(template);
        return;
      }
    }

    // Handle nearby facilities route
    if (path?.includes('/api/facilities/') && path.endsWith('/nearby')) {
      const facilityId = parseInt(path.split('/')[3]);

      if (facilityId) {
        const facility = await db.select()
          .from(schema.facilities)
          .where(eq(schema.facilities.id, facilityId))
          .limit(1);

        if (!facility || facility.length === 0) {
          res.status(404).json({ message: 'Facility not found' });
          return;
        }

        const targetFacility = facility[0];

        // Get nearby facilities in the same city
        const nearbyFacilities = await buildFacilityQuery(
          and(
            eq(schema.facilities.cityId, targetFacility.cityId),
            ne(schema.facilities.id, facilityId)
          ),
          10
        );

        res.status(200).json(nearbyFacilities);
        return;
      }
    }

    // Handle related facilities route
    if (path?.includes('/api/facilities/') && path.endsWith('/related')) {
      const facilityId = parseInt(path.split('/')[3]);

      if (facilityId) {
        const facility = await db.select()
          .from(schema.facilities)
          .where(eq(schema.facilities.id, facilityId))
          .limit(1);

        if (!facility || facility.length === 0) {
          res.status(404).json({ message: 'Facility not found' });
          return;
        }

        const targetFacility = facility[0];

        // Get related facilities (same category)
        let relatedFacilities = [];
        if (targetFacility.categoryId !== null) {
          relatedFacilities = await buildFacilityQuery(
            and(
              eq(schema.facilities.categoryId, targetFacility.categoryId),
              ne(schema.facilities.id, facilityId)
            ),
            10
          );
        }

        res.status(200).json(relatedFacilities);
        return;
      }
    }

    // Handle lead qualification and Google Sheets POST request
    if (req.method === 'POST' && path === '/api/leads') {
      const { 
        name, 
        email, 
        phone, 
        message, 
        cityName, 
        facilityName, 
        companyName,
        inquiryType = 'general',
        subject = 'Contact Form Submission'
      } = req.body;

      if (!name || !email || !phone || !message) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
      }

      try {
        // Import lead qualification and Google Sheets utilities
        const { qualifyLead } = await import('../server/utils/leadQualification.js');
        const { addLeadToSheet } = await import('../server/utils/googleSheets.js');

        // Qualify the lead
        const qualificationResult = qualifyLead(
          name, 
          email, 
          phone, 
          message, 
          inquiryType, 
          subject, 
          cityName, 
          facilityName, 
          companyName
        );

        const { 
          qualityScore, 
          qualificationLevel, 
          highValueKeywords, 
          contactQuality, 
          wordCount 
        } = qualificationResult;

        // Store in database
        const [newSubmission] = await db.insert(schema.contactSubmissions).values({
          name,
          email,
          phone,
          message,
          cityName,
          facilityName,
          companyName,
          inquiryType,
          subject,
          qualityScore,
          qualificationLevel,
          highValueKeywords,
          contactQuality,
          wordCount,
          submissionDate: new Date()
        }).returning();

        // Add to Google Sheets
        const leadData = {
          name, email, phone, message, inquiryType, subject,
          cityName, facilityName, companyName,
          qualityScore, qualificationLevel, highValueKeywords,
          contactQuality, wordCount, submissionDate: new Date()
        };

        await addLeadToSheet(leadData);

        res.status(200).json({ 
          message: 'Lead submitted successfully',
          qualificationResult,
          submissionId: newSubmission.id
        });
        return;
      } catch (error) {
        console.error('Lead submission error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
    }

    // Handle SEO metadata route
    if (path?.startsWith('/api/seo-metadata')) {
      const { generateSEOMetadata } = await import('./seo.js');
      const metadata = await generateSEOMetadata(req.url || '/');
      res.status(200).json(metadata);
      return;
    }

    // Default 404 for unhandled routes
    res.status(404).json({ message: 'Route not found' });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
