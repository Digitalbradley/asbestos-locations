import { VercelRequest, VercelResponse } from '@vercel/node';

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

    // Dynamic import to avoid module loading issues
    const { storage } = await import('../server/storage');
    
    // Handle API routes
    if (path === '/api/states') {
      const states = await storage.getStates();
      res.status(200).json(states);
      return;
    }

    if (path?.startsWith('/api/states/')) {
      const slug = path.split('/')[3];
      const state = await storage.getStateBySlug(slug);
      if (!state) {
        res.status(404).json({ message: 'State not found' });
        return;
      }
      res.status(200).json(state);
      return;
    }

    if (path === '/api/categories') {
      const categories = await storage.getCategories();
      res.status(200).json(categories);
      return;
    }

    // Handle city routes
    if (path?.includes('/api/cities/')) {
      const pathParts = path.split('/');
      const stateSlug = pathParts[3];
      const citySlug = pathParts[4];
      
      if (stateSlug && citySlug) {
        const city = await storage.getCityBySlug(stateSlug, citySlug);
        if (!city) {
          res.status(404).json({ message: 'City not found' });
          return;
        }
        res.status(200).json(city);
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
        const facility = await storage.getFacilityBySlug(stateSlug, citySlug, facilitySlug);
        if (!facility) {
          res.status(404).json({ message: 'Facility not found' });
          return;
        }
        res.status(200).json(facility);
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

      const results = await storage.searchFacilities(query, limit);
      res.status(200).json(results);
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

