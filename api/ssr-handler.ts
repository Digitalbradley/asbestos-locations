import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '../shared/schema';
import { eq, and } from 'drizzle-orm';

// Configure Neon for serverless
neonConfig.fetchConnectionCache = true;

// Database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

interface MetaData {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  structuredData?: any;
}

interface SSRResponse {
  html: string;
  meta: MetaData;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const userAgent = req.headers['user-agent'] || '';
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
    
    // For human users, serve a basic HTML page that makes API calls
    if (!isBot) {
      // Generate basic SEO metadata for the current page
      const ssrContent = await generateSSRContent(req);
      
      const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${ssrContent.meta.title}</title>
            <meta name="description" content="${ssrContent.meta.description}">
            <meta name="keywords" content="${ssrContent.meta.keywords}">
            <link rel="canonical" href="${ssrContent.meta.canonicalUrl}">
            
            <!-- Open Graph Tags -->
            <meta property="og:title" content="${ssrContent.meta.title}">
            <meta property="og:description" content="${ssrContent.meta.description}">
            <meta property="og:url" content="${ssrContent.meta.canonicalUrl}">
            <meta property="og:type" content="website">
            
            <!-- Twitter Cards -->
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:title" content="${ssrContent.meta.title}">
            <meta name="twitter:description" content="${ssrContent.meta.description}">
            
            <!-- Tailwind CSS -->
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { font-family: 'Inter', sans-serif; }
              .loading { animation: pulse 2s infinite; }
            </style>
          </head>
          <body class="bg-gray-50">
            <div class="min-h-screen">
              <!-- Header -->
              <header class="bg-white shadow-sm border-b">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  <div class="flex items-center justify-between">
                    <h1 class="text-2xl font-bold text-gray-900">Asbestos Exposure Sites Directory</h1>
                    <div class="text-sm text-gray-600">87,000+ Documented Locations</div>
                  </div>
                </div>
              </header>

              <!-- Main Content -->
              <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="text-center">
                  <h2 class="text-3xl font-bold text-gray-900 mb-4">${ssrContent.meta.title}</h2>
                  <p class="text-lg text-gray-600 mb-8">${ssrContent.meta.description}</p>
                  
                  <!-- Loading State -->
                  <div class="loading bg-white p-8 rounded-lg shadow-sm">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p class="text-gray-600">Loading directory data...</p>
                  </div>
                </div>
              </main>

              <!-- Footer -->
              <footer class="bg-gray-900 text-white py-8 mt-16">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <p>&copy; 2024 Asbestos Exposure Sites Directory. All rights reserved.</p>
                </div>
              </footer>
            </div>

            <!-- JavaScript to load dynamic content -->
            <script>
              // Load dynamic content via API
              fetch('/api/states')
                .then(response => response.json())
                .then(data => {
                  // Replace loading with actual content
                  document.querySelector('.loading').innerHTML = 
                    '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">' +
                    data.map(state => 
                      '<div class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">' +
                      '<h3 class="text-xl font-semibold text-gray-900 mb-2">' + state.name + '</h3>' +
                      '<p class="text-gray-600">' + state.facilityCount + ' facilities</p>' +
                      '<a href="/' + state.slug + '" class="text-blue-600 hover:text-blue-800 font-medium">View Details →</a>' +
                      '</div>'
                    ).join('') +
                    '</div>';
                })
                .catch(error => {
                  console.error('Error loading data:', error);
                  document.querySelector('.loading').innerHTML = 
                    '<p class="text-red-600">Unable to load directory data. Please try again later.</p>';
                });
            </script>
          </body>
        </html>
      `;
      
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(htmlTemplate);
      return;
    }

    // Generate SSR content for bots/crawlers
    const ssrContent = await generateSSRContent(req);
    
    // Create complete HTML document
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${ssrContent.meta.title}</title>
          <meta name="description" content="${ssrContent.meta.description}">
          <meta name="keywords" content="${ssrContent.meta.keywords}">
          <link rel="canonical" href="${ssrContent.meta.canonicalUrl}">
          
          <!-- Open Graph Tags -->
          <meta property="og:title" content="${ssrContent.meta.title}">
          <meta property="og:description" content="${ssrContent.meta.description}">
          <meta property="og:url" content="${ssrContent.meta.canonicalUrl}">
          <meta property="og:type" content="website">
          
          <!-- Twitter Cards -->
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${ssrContent.meta.title}">
          <meta name="twitter:description" content="${ssrContent.meta.description}">
          
          <!-- Structured Data -->
          <script type="application/ld+json">
            ${JSON.stringify(ssrContent.meta.structuredData)}
          </script>
          
          <!-- Tailwind CSS -->
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-50">
          <div id="root">
            ${ssrContent.html}
          </div>
        </body>
      </html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate'); // Cache for 24 hours
    res.status(200).send(fullHtml);
    
  } catch (error) {
    console.error('SSR error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function generateSSRContent(req: VercelRequest): Promise<SSRResponse> {
  const url = req.url || '/';
  const host = req.headers.host || 'asbestosexposuresites.com';
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${protocol}://${host}`;
  
  // Parse URL to determine page type
  const pathSegments = url.split('/').filter(Boolean);
  
  try {
    // Homepage
    if (pathSegments.length === 0) {
      return generateHomepageSSR(baseUrl);
    }
    
    // State page: /florida
    if (pathSegments.length === 1) {
      const stateSlug = pathSegments[0];
      return generateStatePageSSR(stateSlug, baseUrl);
    }
    
    // City page: /florida/miami
    if (pathSegments.length === 2) {
      const [stateSlug, citySlug] = pathSegments;
      return generateCityPageSSR(stateSlug, citySlug, baseUrl);
    }
    
    // Facility page: /florida/miami/facility-name-asbestos-exposure
    if (pathSegments.length === 3) {
      const [stateSlug, citySlug, facilitySlug] = pathSegments;
      return generateFacilityPageSSR(stateSlug, citySlug, facilitySlug, baseUrl);
    }
    
    // Fallback
    return generateHomepageSSR(baseUrl);
  } catch (error) {
    console.error('SSR generation error:', error);
    return generateHomepageSSR(baseUrl);
  }
}

async function generateHomepageSSR(baseUrl: string): Promise<SSRResponse> {
  let states: Array<{
    id: number;
    name: string;
    slug: string;
    facilityCount: number | null;
  }> = [];
  let categories: Array<{
    id: number;
    name: string;
    slug: string;
    facilityCount: number | null;
  }> = [];
  
  try {
    // Fetch states with facility counts
    states = await db.select({
      id: schema.states.id,
      name: schema.states.name,
      slug: schema.states.slug,
      facilityCount: schema.states.facilityCount
    }).from(schema.states);
    
    // Fetch categories with facility counts
    categories = await db.select({
      id: schema.categories.id,
      name: schema.categories.name,
      slug: schema.categories.slug,
      facilityCount: schema.categories.facilityCount
    }).from(schema.categories);
    
  } catch (error) {
    console.error('Database error in homepage SSR:', error);
  }
  
  const html = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center py-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Asbestos Exposure Sites Directory
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Comprehensive database of documented asbestos exposure locations across all states.
          Essential resource for patients, families, and legal professionals.
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div class="text-center">
          <div class="text-4xl font-bold text-teal-600 mb-2">1,770+</div>
          <div class="text-gray-600">Documented Sites</div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-bold text-teal-600 mb-2">281</div>
          <div class="text-gray-600">Cities Covered</div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-bold text-teal-600 mb-2">Legal</div>
          <div class="text-gray-600">Professional Verified</div>
        </div>
      </div>
      
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Browse by State</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          ${states.map(state => `
            <a href="/${state.slug}" class="block p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div class="font-medium text-gray-900">${state.name}</div>
              <div class="text-sm text-gray-500">${state.facilityCount} facilities</div>
            </a>
          `).join('')}
        </div>
      </div>
      
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Facility Categories</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          ${categories.map(category => `
            <a href="/facility-types/${category.slug}" class="block p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div class="font-medium text-gray-900">${category.name}</div>
              <div class="text-sm text-gray-500">${category.facilityCount} facilities</div>
            </a>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  
  const meta: MetaData = {
    title: "Asbestos Exposure Sites Directory - 1,770+ Documented Locations",
    description: "Comprehensive database of asbestos exposure sites across Florida. Find facilities where you may have been exposed to asbestos. Essential resource for mesothelioma patients and legal professionals.",
    keywords: "asbestos exposure, mesothelioma, lung cancer, asbestos sites, exposure locations, industrial facilities, shipyards, power plants, manufacturing",
    canonicalUrl: baseUrl,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Asbestos Exposure Sites Directory",
      "description": "Comprehensive database of asbestos exposure sites across Florida",
      "url": baseUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${baseUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    }
  };
  
  return { html, meta };
}

async function generateStatePageSSR(stateSlug: string, baseUrl: string): Promise<SSRResponse> {
  try {
    // Get state data
    const [state] = await db.select()
      .from(schema.states)
      .where(eq(schema.states.slug, stateSlug))
      .limit(1);
    
    if (!state) {
      return generateHomepageSSR(baseUrl);
    }
    
    // Get cities in this state
    const cities = await db.select()
      .from(schema.cities)
      .where(eq(schema.cities.stateId, state.id));
    
    // Get featured facilities
    const facilities = await db.select({
      id: schema.facilities.id,
      name: schema.facilities.name,
      slug: schema.facilities.slug,
      address: schema.facilities.address,
      description: schema.facilities.description,
      city: {
        id: schema.cities.id,
        name: schema.cities.name,
        slug: schema.cities.slug
      },
      category: {
        id: schema.categories.id,
        name: schema.categories.name,
        slug: schema.categories.slug
      }
    })
    .from(schema.facilities)
    .leftJoin(schema.cities, eq(schema.facilities.cityId, schema.cities.id))
    .leftJoin(schema.categories, eq(schema.facilities.categoryId, schema.categories.id))
    .where(eq(schema.cities.stateId, state.id))
    .limit(10);
    
    const html = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Asbestos Exposure Sites in ${state.name}
          </h1>
          <p class="text-xl text-gray-600 mb-8">
            There are ${state.facilityCount} facilities for you to review across ${cities.length} cities and towns
          </p>
        </div>
        
        <div class="mb-12">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Cities in ${state.name}</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            ${cities.map(city => `
              <a href="/${state.slug}/${city.slug}" class="block p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div class="font-medium text-gray-900">${city.name}</div>
                <div class="text-sm text-gray-500">${city.facilityCount} facilities</div>
              </a>
            `).join('')}
          </div>
        </div>
        
        <div class="mb-12">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Featured Facilities in ${state.name}</h2>
          <div class="space-y-4">
            ${facilities.map(facility => `
              <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  <a href="/${state.slug}/${facility.city?.slug}/${facility.slug}-asbestos-exposure" class="text-teal-600 hover:text-teal-800">
                    ${facility.name}
                  </a>
                </h3>
                <p class="text-gray-600 mb-2">${facility.city?.name}, ${state.name}</p>
                ${facility.description ? `<p class="text-gray-700">${facility.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    
    const meta: MetaData = {
      title: `Asbestos Exposure Sites in ${state.name} - ${state.facilityCount} Documented Facilities`,
      description: `Comprehensive list of asbestos exposure sites in ${state.name}. Find facilities across ${cities.length} cities where workers may have been exposed to asbestos.`,
      keywords: `asbestos exposure ${state.name}, mesothelioma ${state.name}, asbestos sites ${state.name}, industrial facilities ${state.name}`,
      canonicalUrl: `${baseUrl}/${state.slug}`,
      structuredData: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": `Asbestos Exposure Sites in ${state.name}`,
        "description": `Comprehensive list of asbestos exposure sites in ${state.name}`,
        "url": `${baseUrl}/${state.slug}`,
        "mainEntity": {
          "@type": "Dataset",
          "name": `${state.name} Asbestos Exposure Sites`,
          "description": `Database of ${state.facilityCount} asbestos exposure facilities in ${state.name}`,
          "creator": {
            "@type": "Organization",
            "name": "Asbestos Exposure Sites Directory"
          }
        }
      }
    };
    
    return { html, meta };
  } catch (error) {
    console.error('Database error in state SSR:', error);
    return generateHomepageSSR(baseUrl);
  }
}

async function generateCityPageSSR(stateSlug: string, citySlug: string, baseUrl: string): Promise<SSRResponse> {
  try {
    // Get city data
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
    ))
    .limit(1);
    
    if (!city) {
      return generateHomepageSSR(baseUrl);
    }
    
    // Get facilities in this city
    const facilities = await db.select({
      id: schema.facilities.id,
      name: schema.facilities.name,
      slug: schema.facilities.slug,
      address: schema.facilities.address,
      description: schema.facilities.description,
      category: {
        id: schema.categories.id,
        name: schema.categories.name,
        slug: schema.categories.slug
      }
    })
    .from(schema.facilities)
    .leftJoin(schema.categories, eq(schema.facilities.categoryId, schema.categories.id))
    .where(eq(schema.facilities.cityId, city.id));
    
    const html = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Asbestos Exposure Sites in ${city.name}, ${city.state?.name}
          </h1>
          <p class="text-xl text-gray-600 mb-8">
            ${city.facilityCount} documented asbestos exposure facilities in ${city.name}
          </p>
        </div>
        
        <div class="space-y-6">
          ${facilities.map(facility => `
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-2">
                <a href="/${stateSlug}/${citySlug}/${facility.slug}-asbestos-exposure" class="text-teal-600 hover:text-teal-800">
                  ${facility.name}
                </a>
              </h2>
              <p class="text-gray-600 mb-2">${facility.address || city.name}, ${city.state?.name}</p>
              ${facility.category?.name ? `<p class="text-sm text-gray-500 mb-2">Category: ${facility.category.name}</p>` : ''}
              ${facility.description ? `<p class="text-gray-700 mb-4">${facility.description}</p>` : ''}
              <a href="/${stateSlug}/${citySlug}/${facility.slug}-asbestos-exposure" class="text-teal-600 hover:text-teal-800 font-medium">
                Learn More →
              </a>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    const meta: MetaData = {
      title: `Asbestos Exposure Sites in ${city.name}, ${city.state?.name} - ${city.facilityCount} Facilities`,
      description: `Complete list of asbestos exposure sites in ${city.name}, ${city.state?.name}. Find facilities where workers may have been exposed to asbestos-containing materials.`,
      keywords: `asbestos exposure ${city.name}, mesothelioma ${city.name}, asbestos sites ${city.name} ${city.state?.name}, industrial facilities ${city.name}`,
      canonicalUrl: `${baseUrl}/${stateSlug}/${citySlug}`,
      structuredData: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": `Asbestos Exposure Sites in ${city.name}, ${city.state?.name}`,
        "description": `Complete list of asbestos exposure sites in ${city.name}, ${city.state?.name}`,
        "url": `${baseUrl}/${stateSlug}/${citySlug}`,
        "mainEntity": {
          "@type": "Dataset",
          "name": `${city.name} Asbestos Exposure Sites`,
          "description": `Database of ${city.facilityCount} asbestos exposure facilities in ${city.name}, ${city.state?.name}`
        }
      }
    };
    
    return { html, meta };
  } catch (error) {
    console.error('Database error in city SSR:', error);
    return generateHomepageSSR(baseUrl);
  }
}

async function generateFacilityPageSSR(stateSlug: string, citySlug: string, facilitySlugWithSuffix: string, baseUrl: string): Promise<SSRResponse> {
  try {
    // Remove the -asbestos-exposure suffix if present
    const facilitySlug = facilitySlugWithSuffix.replace('-asbestos-exposure', '');
    
    // Get facility data
    const [facility] = await db.select({
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
      eq(schema.facilities.slug, facilitySlug),
      eq(schema.cities.slug, citySlug),
      eq(schema.states.slug, stateSlug)
    ))
    .limit(1);
    
    if (!facility) {
      return generateHomepageSSR(baseUrl);
    }
    
    const html = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            ${facility.name} - Asbestos Exposure Site
          </h1>
          <p class="text-xl text-gray-600 mb-2">${facility.address || facility.city?.name}, ${facility.state?.name}</p>
          ${facility.category?.name ? `<p class="text-lg text-gray-500 mb-8">Category: ${facility.category.name}</p>` : ''}
        </div>
        
        <div class="bg-white rounded-lg shadow p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">About This Facility</h2>
          ${facility.description ? `<p class="text-gray-700 mb-4">${facility.description}</p>` : ''}
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Location Details</h3>
              <p class="text-gray-600">City: ${facility.city?.name}</p>
              <p class="text-gray-600">State: ${facility.state?.name}</p>
              ${facility.address ? `<p class="text-gray-600">Address: ${facility.address}</p>` : ''}
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Facility Information</h3>
              ${facility.category?.name ? `<p class="text-gray-600">Type: ${facility.category.name}</p>` : ''}
              ${facility.companyName ? `<p class="text-gray-600">Company: ${facility.companyName}</p>` : ''}
            </div>
          </div>
          
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 class="text-lg font-semibold text-yellow-800 mb-2">Important Information</h3>
            <p class="text-yellow-700">
              If you worked at this facility and have been diagnosed with mesothelioma, lung cancer, or other asbestos-related diseases, 
              you may be entitled to compensation. Contact a qualified attorney to discuss your legal options.
            </p>
          </div>
        </div>
        
        <div class="bg-teal-50 border border-teal-200 rounded-lg p-8">
          <h2 class="text-2xl font-bold text-teal-900 mb-4">Get Legal Help</h2>
          <p class="text-teal-700 mb-4">
            If you were exposed to asbestos at this facility, you may be entitled to compensation. 
            Our legal partners specialize in asbestos litigation and can help you understand your rights.
          </p>
          <a href="/legal-help" class="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
            Get Free Legal Consultation
          </a>
        </div>
      </div>
    `;
    
    const meta: MetaData = {
      title: `${facility.name} - Asbestos Exposure Site in ${facility.city?.name}, ${facility.state?.name}`,
      description: `Information about asbestos exposure at ${facility.name} in ${facility.city?.name}, ${facility.state?.name}. Learn about potential health risks and legal options for workers.`,
      keywords: `${facility.name} asbestos, ${facility.name} mesothelioma, asbestos exposure ${facility.city?.name}, ${facility.name} ${facility.state?.name}`,
      canonicalUrl: `${baseUrl}/${stateSlug}/${citySlug}/${facilitySlug}-asbestos-exposure`,
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Place",
        "name": `${facility.name}`,
        "description": `Asbestos exposure site in ${facility.city?.name}, ${facility.state?.name}`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": facility.city?.name,
          "addressRegion": facility.state?.name,
          "addressCountry": "US"
        },
        "url": `${baseUrl}/${stateSlug}/${citySlug}/${facilitySlug}-asbestos-exposure`
      }
    };
    
    return { html, meta };
  } catch (error) {
    console.error('Database error in facility SSR:', error);
    return generateHomepageSSR(baseUrl);
  }
}
