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
  .limit(limit || 100);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    // Handle city routes
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

    // Handle city facilities route
    if (path?.startsWith('/api/cities/') && path.includes('/facilities')) {
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



    // Handle nearby facilities route
    if (path?.includes('/api/facilities/') && path.endsWith('/nearby')) {
      const facilityId = parseInt(path.split('/')[3]);
      
      if (facilityId) {
        const facility = await db.select()
          .from(schema.facilities)
          .where(eq(schema.facilities.id, facilityId))
          .limit(1);
        
        if (facility.length > 0) {
          const whereClause = and(
            eq(schema.facilities.cityId, facility[0].cityId),
            ne(schema.facilities.id, facilityId)
          );
          
          const nearbyFacilities = await buildFacilityQuery(whereClause, 10);
          
          res.status(200).json(nearbyFacilities);
          return;
        }
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
        
        if (facility.length > 0) {
          const whereClause = and(
            facility[0].categoryId ? eq(schema.facilities.categoryId, facility[0].categoryId) : undefined,
            ne(schema.facilities.id, facilityId)
          );
          
          const relatedFacilities = await buildFacilityQuery(whereClause, 10);
          
          res.status(200).json(relatedFacilities);
          return;
        }
      }
    }

    // Handle contact form submissions
    if (path === '/api/contact' && req.method === 'POST') {
      try {
        // Import lead qualification system
        const { qualifyLead } = await import('../server/utils/leadQualification.js');
        const { createGoogleSheetsService } = await import('../server/utils/googleSheets.js');
        
        // Validate required fields
        const requiredFields = ['name', 'email', 'phone', 'message'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
          res.status(400).json({ 
            message: `Missing required fields: ${missingFields.join(', ')}` 
          });
          return;
        }

        // Qualify the lead
        const qualification = qualifyLead(
          req.body.name,
          req.body.email,
          req.body.phone,
          req.body.inquiryType || 'facility-inquiry',
          req.body.message,
          req.body.exposure || undefined,
          req.body.diagnosis || undefined,
          req.body.pathologyReport || undefined,
          req.body.diagnosisTimeline || undefined
        );
        
        // Generate subject based on diagnosis
        const generateSubject = (originalSubject: string, diagnosis: string | null) => {
          let diagnosisType = 'Asbestos Exposure';
          
          if (diagnosis) {
            switch (diagnosis.toLowerCase()) {
              case 'mesothelioma':
                diagnosisType = 'Mesothelioma';
                break;
              case 'lung-cancer':
                diagnosisType = 'Lung Cancer';
                break;
              case 'asbestosis':
                diagnosisType = 'Asbestosis';
                break;
              default:
                diagnosisType = 'Asbestos Exposure';
            }
          }
          
          return `${diagnosisType} Lead`;
        };

        // Create submission data with qualification
        const submissionData = {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          inquiryType: req.body.inquiryType || 'facility-inquiry',
          subject: generateSubject(req.body.subject || '', req.body.diagnosis),
          message: req.body.message,
          diagnosis: req.body.diagnosis || null,
          pathologyReport: req.body.pathologyReport || null,
          diagnosisTimeline: req.body.diagnosisTimeline || null,
          pageUrl: req.headers.referer || req.body.pageUrl || '',
          status: 'new',
          // Qualification data
          qualityScore: qualification.qualityScore,
          qualificationLevel: qualification.qualificationLevel,
          highValueKeywords: qualification.contentAnalysis.highValueKeywords.join(', '),
          contactQuality: `Email: ${qualification.contactQuality.emailValid ? 'Valid' : 'Invalid'}, Phone: ${qualification.contactQuality.phoneValid ? 'Valid' : 'Invalid'}, Name: ${qualification.contactQuality.nameComplete ? 'Complete' : 'Incomplete'}`,
          wordCount: qualification.contentAnalysis.wordCount,
          notes: `Quality Score: ${qualification.qualityScore}/100 | Level: ${qualification.qualificationLevel}\n` +
                 `Reasons: ${qualification.qualificationReasons.join('; ')}\n` +
                 `Contact Quality - Email: ${qualification.contactQuality.emailValid ? 'Valid' : 'Invalid'}, ` +
                 `Phone: ${qualification.contactQuality.phoneValid ? 'Valid' : 'Invalid'}, ` +
                 `Name: ${qualification.contactQuality.nameComplete ? 'Complete' : 'Incomplete'}\n` +
                 `Content Analysis - High-value keywords: ${qualification.contentAnalysis.highValueKeywords.length}, ` +
                 `Medium-value keywords: ${qualification.contentAnalysis.mediumValueKeywords.length}, ` +
                 `Word count: ${qualification.contentAnalysis.wordCount}, ` +
                 `Specific details: ${qualification.contentAnalysis.containsSpecificDetails ? 'Yes' : 'No'}` +
                 (qualification.contentAnalysis.redFlags.length > 0 ? `\nRed flags: ${qualification.contentAnalysis.redFlags.join(', ')}` : ''),
        };

        // Save to database
        const submission = await db.insert(schema.contactSubmissions).values(submissionData).returning();
        
        // Send to Google Sheets with enhanced qualification data
        const googleSheetsService = createGoogleSheetsService();
        if (googleSheetsService) {
          try {
            // Transform database submission to match LeadData interface
            const leadData = {
              id: submission[0].id,
              name: submission[0].name,
              email: submission[0].email,
              phone: submission[0].phone || '',
              inquiryType: submission[0].inquiryType,
              subject: submission[0].subject,
              message: submission[0].message,
              diagnosis: submission[0].diagnosis || undefined,
              pathologyReport: submission[0].pathologyReport || undefined,
              diagnosisTimeline: submission[0].diagnosisTimeline || undefined,
              submittedAt: submission[0].createdAt || new Date(),
              pageUrl: submission[0].pageUrl || undefined,
              qualification: qualification
            };
            
            await googleSheetsService.addLeadToSheet(leadData);
            console.log(`Lead ${submission[0].id} added to Google Sheets with qualification data`);
          } catch (sheetsError) {
            console.error('Failed to add lead to Google Sheets:', sheetsError);
            // Continue processing even if Google Sheets fails
          }
        }
        
        res.status(201).json({ 
          message: 'Contact form submitted successfully',
          id: submission[0].id,
          qualificationLevel: submission[0].qualificationLevel,
          qualityScore: submission[0].qualityScore
        });
        return;
      } catch (error) {
        console.error('Contact form submission error:', error);
        res.status(500).json({ message: 'Failed to submit contact form' });
        return;
      }
    }

    // Handle search route
    if (path?.startsWith('/api/search')) {
      const query = req.query.q as string;
      const limit = parseInt(req.query.limit as string) || 50;
      
      if (!query) {
        res.status(400).json({ message: 'Search query is required' });
        return;
      }
      
      const whereClause = or(
        ilike(schema.facilities.name, `%${query}%`),
        ilike(schema.cities.name, `%${query}%`),
        ilike(schema.facilities.companyName, `%${query}%`)
      );
      
      const searchResults = await buildFacilityQuery(whereClause, limit);
      
      res.status(200).json(searchResults);
      return;
    }

    res.status(404).json({ message: 'API endpoint not found' });
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
