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

    // Main sitemap route
    if (path === '/sitemap.xml') {
      let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://asbestos-locations.vercel.app/sitemap-florida.xml</loc>
    <lastmod>2025-01-10</lastmod>
  </sitemap>
</sitemapindex>`;

      res.setHeader('Content-Type', 'application/xml');
      res.status(200).send(sitemapContent);
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
      
      const facilities = await db.select({
        id: schema.facilities.id,
        name: schema.facilities.name,
        slug: schema.facilities.slug,
        address: schema.facilities.address,
        companyName: schema.facilities.companyName,
        description: schema.facilities.description,
        metaTitle: schema.facilities.metaTitle,
        metaDescription: schema.facilities.metaDescription,
        seoKeyword: schema.facilities.seoKeyword,
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
      .limit(limit);
      
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
        const [facility] = await db.select({
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
        .where(and(
          eq(schema.facilities.slug, facilitySlug),
          eq(schema.cities.slug, citySlug),
          eq(schema.states.slug, stateSlug)
        ));
        
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

// Handle contact form submissions - FIXED VERSION (exposure field removed)
if (path === '/api/contact' && req.method === 'POST') {
  const { name, email, phone, message, diagnosis, pathologyReport, diagnosisTimeline } = req.body;
  
  try {
    console.log('Contact form data received:', req.body);
    
    // Generate subject based on diagnosis
    const generateSubject = (diagnosis: string) => {
      if (!diagnosis) return 'Asbestos Exposure Lead';
      
      switch (diagnosis.toLowerCase()) {
        case 'mesothelioma': return 'Mesothelioma Lead';
        case 'lung-cancer': return 'Lung Cancer Lead';
        case 'asbestosis': return 'Asbestosis Lead';
        default: return 'Asbestos Exposure Lead';
      }
    };

    // Insert using CORRECT camelCase field names (removed exposure field)
const submission = await db.insert(schema.contactSubmissions).values({
  name: name || '',
  email: email || '',
  phone: phone || null,
  inquiryType: 'legal-consultation',
  subject: generateSubject(diagnosis),
  message: message || '',
  diagnosis: diagnosis || null,
  pathologyReport: pathologyReport || null,     // ✅ Use camelCase (schema name)
  diagnosisTimeline: diagnosisTimeline || null, // ✅ Use camelCase (schema name)
  status: 'new'
}).returning();
    
    console.log('Database insertion successful:', submission[0].id);
        
// Post to Google Sheets (if credentials are available)
if (process.env.GOOGLE_SHEETS_CLIENT_EMAIL && process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
  try {
    console.log('Adding to Google Sheets...');
    
    const { google } = await import('googleapis');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1nIBlcGbxaXw_2LxlOSb9BW8G1xmboAktAAgBaVtmsBQ';
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: 'All Leads!A:V',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[
          submission[0].id.toString(),
          new Date().toISOString(),
          submission[0].name,
          submission[0].email,
          submission[0].phone || '',
          submission[0].inquiryType,
          submission[0].subject,
          submission[0].message,
          submission[0].diagnosis || '',
          submission[0].pathologyReport || '',
          submission[0].diagnosisTimeline || '',
          '', // quality_score
          '', // qualification_level
          '', // high_value_keywords
          '', // contact_quality
          '', // word_count
          'new', // status
          '', // assigned_to_firm
          '', // date_sent_to_firm
          '', // firm_response
          '', // notes
          req.headers.referer || ''
        ]],
      },
    });
    
    console.log('Google Sheets integration successful');
  } catch (sheetsError) {
    console.error('Failed to add lead to Google Sheets:', sheetsError);
  }
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
        const facilities = await db.select({
          id: schema.facilities.id,
          name: schema.facilities.name,
          slug: schema.facilities.slug,
          address: schema.facilities.address,
          companyName: schema.facilities.companyName,
          description: schema.facilities.description,
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
        .where(and(
          eq(schema.cities.slug, citySlug),
          eq(schema.states.slug, stateSlug)
        ))
        .orderBy(asc(schema.facilities.name));
        
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
          const nearbyFacilities = await db.select({
            id: schema.facilities.id,
            name: schema.facilities.name,
            slug: schema.facilities.slug,
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
          .where(and(
            eq(schema.facilities.cityId, facility[0].cityId),
            ne(schema.facilities.id, facilityId)
          ))
          .orderBy(asc(schema.facilities.name))
          .limit(10);
          
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
          const relatedFacilities = await db.select({
            id: schema.facilities.id,
            name: schema.facilities.name,
            slug: schema.facilities.slug,
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
          .where(and(
  facility[0].categoryId ? eq(schema.facilities.categoryId, facility[0].categoryId) : sql`1=1`,
  ne(schema.facilities.id, facilityId)
))
          .orderBy(asc(schema.facilities.name))
          .limit(10);
          
          res.status(200).json(relatedFacilities);
          return;
        }
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
      
      const searchResults = await db.select({
        id: schema.facilities.id,
        name: schema.facilities.name,
        slug: schema.facilities.slug,
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
      .where(or(
        ilike(schema.facilities.name, `%${query}%`),
        ilike(schema.cities.name, `%${query}%`),
        ilike(schema.facilities.companyName, `%${query}%`)
      ))
      .orderBy(asc(schema.facilities.name))
      .limit(limit);
      
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
}
