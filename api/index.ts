import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq, like, and, desc, asc, sql } from 'drizzle-orm';
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
        facilityCount: schema.states.facilityCount,
        cities: sql`(
          SELECT COALESCE(json_agg(json_build_object(
            'id', c.id,
            'name', c.name,
            'slug', c.slug,
            'facilityCount', c.facility_count
          ) ORDER BY c.facility_count DESC), '[]')
          FROM ${schema.cities} c 
          WHERE c.state_id = ${schema.states.id}
        )`.as('cities')
      })
      .from(schema.states)
      .where(eq(schema.states.slug, slug));
      
      if (!state) {
        res.status(404).json({ message: 'State not found' });
        return;
      }
      res.status(200).json(state);
      return;
    }

    if (path === '/api/categories') {
      const categories = await db.select().from(schema.categories);
      res.status(200).json(categories);
      return;
    }

    // Handle facilities route
    if (path === '/api/facilities') {
      const facilities = await db.select({
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
      .limit(100);
      
      res.status(200).json(facilities);
      return;
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
        const [template] = await db.select()
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

    // Handle facility routes
    if (path?.includes('/api/facilities/')) {
      const pathParts = path.split('/');
      const stateSlug = pathParts[3];
      const citySlug = pathParts[4];
      const facilitySlug = pathParts[5];
      
      if (stateSlug && citySlug && facilitySlug) {
        const [facility] = await db.select({
          id: schema.facilities.id,
          name: schema.facilities.name,
          slug: schema.facilities.slug,
          address: schema.facilities.address,
          companyName: schema.facilities.companyName,
          description: schema.facilities.description,
          content: schema.facilities.content,
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
        .where(and(
          eq(schema.facilities.slug, facilitySlug),
          eq(schema.cities.slug, citySlug),
          eq(schema.states.slug, stateSlug)
        ));
        
        if (!facility) {
          res.status(404).json({ message: 'Facility not found' });
          return;
        }
        res.status(200).json(facility);
        return;
      }
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

