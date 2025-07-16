import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🚀 SSR Handler started');
  console.log('Request URL:', req.url);
  
  try {
    // TEMPORARY: Always serve SSR content for testing
    console.log('🧪 TESTING MODE: Always serving SSR content via API');
    
    try {
      const url = req.url || '/';
      const host = req.headers.host || 'localhost';
      const baseUrl = `https://${host}`;
      
      // Parse URL to determine page type
      const pathSegments = url.split('/').filter(Boolean);
      
      let ssrContent = '';
      let pageTitle = 'Asbestos Exposure Sites Directory';
      let pageDescription = 'Comprehensive database of asbestos exposure sites across all states.';
      
      if (pathSegments.length === 0) {
        // Homepage
        const statesResponse = await fetch(`${baseUrl}/api/states`);
        const states = await statesResponse.json();
        
        ssrContent = `
          <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
            <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">Asbestos Exposure Sites Directory</h1>
            <p style="font-size: 1.25rem; margin-bottom: 2rem;">
              Comprehensive database of 87,000+ documented asbestos exposure locations across all 50 states.
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
              <div style="text-align: center; padding: 1rem; background: #f0f9ff; border-radius: 8px;">
                <div style="font-size: 2rem; font-weight: bold; color: #0891b2;">87K+</div>
                <div>Documented Sites</div>
              </div>
              <div style="text-align: center; padding: 1rem; background: #f0f9ff; border-radius: 8px;">
                <div style="font-size: 2rem; font-weight: bold; color: #0891b2;">50</div>
                <div>States Covered</div>
              </div>
              <div style="text-align: center; padding: 1rem; background: #f0f9ff; border-radius: 8px;">
                <div style="font-size: 2rem; font-weight: bold; color: #0891b2;">Legal</div>
                <div>Professional Verified</div>
              </div>
            </div>
            
            <h2 style="font-size: 2rem; margin-bottom: 1rem;">Browse by State</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
              ${Array.isArray(states) ? states.map(state => `
                <a href="/${state.slug}" style="display: block; padding: 1rem; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-decoration: none; color: inherit;">
                  <div style="font-weight: bold;">${state.name}</div>
                  <div style="color: #666; font-size: 0.9rem;">${state.facilityCount || 0} facilities</div>
                </a>
              `).join('') : '<p>No states available</p>'}
            </div>
          </div>
        `;
        
      } else if (pathSegments.length === 1) {
        // State page: /florida
        const stateSlug = pathSegments[0];
        
        try {
          const stateResponse = await fetch(`${baseUrl}/api/states/${stateSlug}`);
          const stateData = await stateResponse.json();
          
          if (stateData && !stateData.message) {
            pageTitle = `Asbestos Exposure Sites in ${stateData.name} - ${stateData.facilityCount || 0} Documented Facilities`;
            pageDescription = `Comprehensive list of asbestos exposure sites in ${stateData.name}. Find facilities across ${stateData.cities?.length || 0} cities where workers may have been exposed to asbestos.`;
            
            ssrContent = `
              <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
                <nav style="margin-bottom: 1rem;">
                  <a href="/" style="color: #0066cc;">Home</a> > ${stateData.name}
                </nav>
                
                <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">Asbestos Exposure Sites in ${stateData.name}</h1>
                <p style="font-size: 1.25rem; margin-bottom: 2rem;">
                  There are ${stateData.facilityCount || 0} facilities for you to review across ${stateData.cities?.length || 0} cities and towns
                </p>
                
                <div style="margin-bottom: 2rem;">
                  <h2 style="font-size: 2rem; margin-bottom: 1rem;">About Asbestos Exposure in ${stateData.name}</h2>
                  <p style="line-height: 1.6; margin-bottom: 1rem;">
                    ${stateData.name} has documented ${stateData.facilityCount || 0} asbestos exposure sites across ${stateData.cities?.length || 0} cities and towns throughout the state. These facilities span multiple industries including manufacturing, shipbuilding, power generation, and construction, representing decades of industrial activity where workers may have encountered asbestos-containing materials.
                  </p>
                  <p style="line-height: 1.6; margin-bottom: 1rem;">
                    The comprehensive ${stateData.name} asbestos exposure database serves as a critical resource for individuals seeking to identify potential exposure locations. From major industrial facilities to smaller operations, ${stateData.name}'s industrial history reveals extensive use of asbestos across diverse sectors.
                  </p>
                  <p style="line-height: 1.6;">
                    Workers in ${stateData.name} facilities were exposed to asbestos through various applications including insulation, fireproofing materials, gaskets, and construction products. This statewide directory provides detailed information about exposure sites, operational periods, and facility types to help individuals and legal professionals identify relevant exposure locations for mesothelioma and other asbestos-related disease cases.
                  </p>
                </div>
                
                ${stateData.cities && stateData.cities.length > 0 ? `
                <div style="margin-bottom: 2rem;">
                  <h2 style="font-size: 2rem; margin-bottom: 1rem;">Cities in ${stateData.name}</h2>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    ${stateData.cities.slice(0, 12).map((city: any) => `
                      <a href="/${stateData.slug}/${city.slug}" style="display: block; padding: 1rem; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-decoration: none; color: inherit;">
                        <div style="font-weight: bold;">${city.name}</div>
                        <div style="color: #666; font-size: 0.9rem;">${city.facilityCount || 0} facilities</div>
                      </a>
                    `).join('')}
                  </div>
                </div>
                ` : ''}
              </div>
            `;
          } else {
            ssrContent = `
              <div style="max-width: 1200px; margin: 0 auto; padding: 20px; text-align: center;">
                <h1>State Not Found</h1>
                <p>The requested state could not be found.</p>
                <a href="/" style="color: #0066cc;">Return to Homepage</a>
              </div>
            `;
          }
        } catch (apiError) {
          console.error('API Error:', apiError);
          ssrContent = `
            <div style="max-width: 1200px; margin: 0 auto; padding: 20px; text-align: center;">
              <h1>Error Loading State Data</h1>
              <p>Unable to load state information. Please try again later.</p>
              <a href="/" style="color: #0066cc;">Return to Homepage</a>
            </div>
          `;
        }
      } else {
} else if (pathSegments.length === 2) {
        // City page: /florida/jacksonville
        const [stateSlug, citySlug] = pathSegments;
        
        console.log('🔍 SSR Debug - State:', stateSlug, 'City:', citySlug);
        console.log('🔍 SSR Debug - Full URL:', url);
        console.log('🔍 SSR Debug - Base URL:', baseUrl);
        
        try {
          const cityApiUrl = `${baseUrl}/api/cities/${stateSlug}/${citySlug}`;
          console.log('🔍 SSR Debug - City API URL:', cityApiUrl);
          
          // Get city data
          const cityResponse = await fetch(cityApiUrl);
          console.log('🔍 SSR Debug - City Response Status:', cityResponse.status);
          
          const cityData = await cityResponse.json();
          console.log('🔍 SSR Debug - City Data:', cityData);
          
          if (cityData && !cityData.message) {
            // Get facilities for this city
            const facilitiesApiUrl = `${baseUrl}/api/cities/${stateSlug}/${citySlug}/facilities`;
            console.log('🔍 SSR Debug - Facilities API URL:', facilitiesApiUrl);
            
            const facilitiesResponse = await fetch(facilitiesApiUrl);
            console.log('🔍 SSR Debug - Facilities Response Status:', facilitiesResponse.status);
            
            const facilities = await facilitiesResponse.json();
            console.log('🔍 SSR Debug - Facilities Data:', facilities);
            
            pageTitle = `Asbestos Exposure Sites in ${cityData.name}, ${cityData.state.name} - ${cityData.facilityCount || 0} Facilities`;
            pageDescription = `Complete list of asbestos exposure sites in ${cityData.name}, ${cityData.state.name}. Find facilities where workers may have been exposed to asbestos-containing materials.`;
            
            ssrContent = `
              <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
                <div style="background: #e0f2fe; padding: 10px; margin-bottom: 20px; border-radius: 4px;">
                  <strong>🔍 DEBUG:</strong> City: ${cityData.name}, Facilities: ${Array.isArray(facilities) ? facilities.length : 'Not array'}
                </div>
                
                <nav style="margin-bottom: 1rem;">
                  <a href="/" style="color: #0066cc;">Home</a> > 
                  <a href="/${cityData.state.slug}" style="color: #0066cc;">${cityData.state.name}</a> > 
                  ${cityData.name}
                </nav>
                
                <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">Asbestos Exposure Sites in ${cityData.name}, ${cityData.state.name}</h1>
                <p style="font-size: 1.25rem; margin-bottom: 2rem;">
                  ${cityData.facilityCount || 0} documented asbestos exposure facilities in ${cityData.name}
                </p>
                
                <div style="margin-bottom: 2rem;">
                  <h2 style="font-size: 2rem; margin-bottom: 1rem;">Asbestos Exposure Facilities in ${cityData.name}</h2>
                  <div style="space-y: 1rem;">
                    ${Array.isArray(facilities) ? facilities.slice(0, 5).map(facility => `
                      <div style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 1.5rem; margin-bottom: 1rem;">
                        <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem;">
                          <a href="/${cityData.state.slug}/${cityData.slug}/${facility.slug}-asbestos-exposure" style="color: #0891b2; text-decoration: none;">
                            ${facility.name}
                          </a>
                        </h3>
                        <p style="color: #666; margin-bottom: 0.5rem;">${facility.address || cityData.name}, ${cityData.state.name}</p>
                        ${facility.category ? `<p style="color: #888; font-size: 0.9rem; margin-bottom: 0.5rem;">Category: ${facility.category.name}</p>` : ''}
                      </div>
                    `).join('') : '<p>❌ No facilities found or facilities data is not an array</p>'}
                  </div>
                </div>
              </div>
            `;
          } else {
            console.log('🔍 SSR Debug - City not found or has error message');
            ssrContent = `
              <div style="max-width: 1200px; margin: 0 auto; padding: 20px; text-align: center;">
                <h1>City Not Found</h1>
                <p>The requested city could not be found.</p>
                <p>Debug: ${JSON.stringify(cityData)}</p>
                <a href="/" style="color: #0066cc;">Return to Homepage</a>
              </div>
            `;
          }
        } catch (apiError) {
          console.error('🔍 SSR Debug - City API Error:', apiError);
          ssrContent = `
            <div style="max-width: 1200px; margin: 0 auto; padding: 20px; text-align: center;">
              <h1>Error Loading City Data</h1>
              <p>Unable to load city information. Please try again later.</p>
              <p>Debug Error: ${apiError.message}</p>
              <a href="/" style="color: #0066cc;">Return to Homepage</a>
            </div>
          `;
        }
        } catch (apiError) {
          console.error('City API Error:', apiError);
          ssrContent = `
            <div style="max-width: 1200px; margin: 0 auto; padding: 20px; text-align: center;">
              <h1>Error Loading City Data</h1>
              <p>Unable to load city information. Please try again later.</p>
              <a href="/" style="color: #0066cc;">Return to Homepage</a>
            </div>
          `;
        }
       
        // Other pages - basic fallback
        ssrContent = `
          <div style="max-width: 1200px; margin: 0 auto; padding: 20px; text-align: center;">
            <h1>Page Not Found</h1>
            <p>The requested page could not be found.</p>
            <a href="/" style="color: #0066cc;">Return to Homepage</a>
          </div>
        `;
      }
      
      const botHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${pageDescription}">
  <link rel="canonical" href="${baseUrl}${url}">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; color: #333; background: #f9f9f9; }
    .test-banner { background: #fef3c7; border: 1px solid #f59e0b; padding: 10px; margin-bottom: 20px; border-radius: 4px; text-align: center; }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="test-banner">
    <strong>🧪 TESTING MODE:</strong> SSR content generated using your working API
  </div>
  ${ssrContent}
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).send(botHtml);
      
    } catch (error) {
      console.error('❌ Error generating SSR content:', error);
      
      const errorHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SSR Error</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px;">
  <h1>🚨 SSR Error</h1>
  <p><strong>Error:</strong> ${error instanceof Error ? error.message : 'Unknown error'}</p>
  <p><strong>URL:</strong> ${req.url}</p>
  <a href="/" style="color: #0066cc;">Return to Homepage</a>
</body>
</html>`;
      
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.status(500).send(errorHtml);
    }
    
  } catch (error) {
    console.error('🚨 Critical SSR Handler Error:', error);
    
    const errorHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Critical SSR Error</title>
</head>
<body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
  <h1>🚨 Critical SSR Error</h1>
  <p><strong>Error:</strong> ${error instanceof Error ? error.message : 'Unknown error'}</p>
  <p><strong>URL:</strong> ${req.url}</p>
</body>
</html>`;
    
    res.status(500).send(errorHtml);
  }
}

