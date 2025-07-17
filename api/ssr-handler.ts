import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🚀 SSR Handler started');
  console.log('Request URL:', req.url);

  try {
    // Bot detection
    const userAgent = req.headers['user-agent'] || '';
    const isBot = /bot|crawler|spider|crawling|facebook|twitter|google|bing|msn|duckduckbot|teoma|slurp|yandex/i.test(userAgent);
    
    console.log('User-Agent:', userAgent);
    console.log('Is Bot:', isBot);

    // If not a bot, serve the React app normally
    if (!isBot) {
      console.log('👤 HUMAN USER: Serving React app normally');
      
      // Redirect to React app - this will be handled by your main server
      return res.status(200).json({ 
        message: 'Not a bot, serve React app',
        redirect: true
      });
    }

    // For bots, generate SSR content
    console.log('🤖 BOT DETECTED: Generating SSR content for:', userAgent);

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
            // Get state template content
            let stateTemplateContent = '';
            try {
              const stateTemplateResponse = await fetch(`${baseUrl}/api/content-templates/state/${stateSlug}_state_content`);
              const stateTemplate = await stateTemplateResponse.json();
              if (stateTemplate && stateTemplate.contentBlocks) {
                stateTemplateContent = stateTemplate.contentBlocks.join(' ');
              }
            } catch (error) {
              console.log('State template not found, using basic content');
            }

            // Get facilities for this state
            let stateFacilities = [];
            try {
              const facilitiesResponse = await fetch(`${baseUrl}/api/facilities?stateId=${stateData.id}&limit=1000`);
              stateFacilities = await facilitiesResponse.json();
            } catch (error) {
              console.log('State facilities not found');
            }

            // Get categories
            let categories = [];
            try {
              const categoriesResponse = await fetch(`${baseUrl}/api/categories`);
              categories = await categoriesResponse.json();
            } catch (error) {
              console.log('Categories not found');
            }

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
                  ${stateTemplateContent ? `
                    <div style="line-height: 1.6; margin-bottom: 1rem;">${stateTemplateContent}</div>
                  ` : `
                    <p style="line-height: 1.6; margin-bottom: 1rem;">
                      ${stateData.name} has documented ${stateData.facilityCount || 0} asbestos exposure sites across ${stateData.cities?.length || 0} cities and towns throughout the state. These facilities span multiple industries including manufacturing, shipbuilding, power generation, and construction, representing decades of industrial activity where workers may have encountered asbestos-containing materials.
                    </p>
                    <p style="line-height: 1.6; margin-bottom: 1rem;">
                      The comprehensive ${stateData.name} asbestos exposure database serves as a critical resource for individuals seeking to identify potential exposure locations. From major industrial facilities to smaller operations, ${stateData.name}'s industrial history reveals extensive use of asbestos across diverse sectors.
                    </p>
                    <p style="line-height: 1.6;">
                      Workers in ${stateData.name} facilities were exposed to asbestos through various applications including insulation, fireproofing materials, gaskets, and construction products. This statewide directory provides detailed information about exposure sites, operational periods, and facility types to help individuals and legal professionals identify relevant exposure locations for mesothelioma and other asbestos-related disease cases.
                    </p>
                  `}
                </div>

                ${categories && categories.length > 0 ? `
                <div style="margin-bottom: 2rem;">
                  <h2 style="font-size: 2rem; margin-bottom: 1rem;">Facility Types in ${stateData.name}</h2>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    ${categories.slice(0, 8).map(category => `
                      <div style="padding: 1rem; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="font-weight: bold; color: #0891b2; margin-bottom: 0.5rem;">${category.name}</div>
                        <div style="color: #666; font-size: 0.9rem;">${category.description || 'Industrial facility type'}</div>
                      </div>
                    `).join('')}
                  </div>
                </div>
                ` : ''}

                ${stateFacilities && stateFacilities.length > 0 ? `
                <div style="margin-bottom: 2rem;">
                  <h2 style="font-size: 2rem; margin-bottom: 1rem;">Featured Facilities in ${stateData.name}</h2>
                  <div style="display: grid; gap: 1rem;">
                    ${stateFacilities.slice(0, 6).map(facility => `
                      <div style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 1.5rem;">
                        <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem;">
                          <a href="/${stateData.slug}/${facility.city?.slug || 'unknown'}/${facility.slug}-asbestos-exposure" style="color: #0891b2; text-decoration: none;">
                            ${facility.name}
                          </a>
                        </h3>
                        <p style="color: #666; margin-bottom: 0.5rem;">${facility.address || `${facility.city?.name || 'Unknown'}, ${stateData.name}`}</p>
                        ${facility.category ? `<p style="color: #888; font-size: 0.9rem; margin-bottom: 0.5rem;">Category: ${facility.category.name}</p>` : ''}
                        ${facility.description ? `<p style="color: #333; line-height: 1.6; margin-bottom: 1rem;">${facility.description}</p>` : ''}
                        <a href="/${stateData.slug}/${facility.city?.slug || 'unknown'}/${facility.slug}-asbestos-exposure" style="color: #0891b2; font-weight: 500; text-decoration: none;">
                          Learn More →
                        </a>
                      </div>
                    `).join('')}
                  </div>
                </div>
                ` : ''}

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
      } else if (pathSegments.length === 2) {
        // Real city page with API calls
        const [stateSlug, citySlug] = pathSegments;

        try {
          // Get city data
          const cityResponse = await fetch(`${baseUrl}/api/cities/${stateSlug}/${citySlug}`);
          const cityData = await cityResponse.json();

          if (cityData && !cityData.message) {
            // Get facilities for this city
            const facilitiesResponse = await fetch(`${baseUrl}/api/cities/${stateSlug}/${citySlug}/facilities`);
            const facilities = await facilitiesResponse.json();

            // Get city template content
            let cityTemplateContent = '';
            try {
              const cityTemplateResponse = await fetch(`${baseUrl}/api/content-templates/city/${citySlug}_content_adaptive`);
              const cityTemplate = await cityTemplateResponse.json();
              if (cityTemplate && cityTemplate.contentBlocks) {
                cityTemplateContent = cityTemplate.contentBlocks.join(' ');
              }
            } catch (error) {
              console.log('City template not found, using basic content');
            }

            // Get state template content
            let stateTemplateContent = '';
            try {
              const stateTemplateResponse = await fetch(`${baseUrl}/api/content-templates/state/${stateSlug}_state_content`);
              const stateTemplate = await stateTemplateResponse.json();
              if (stateTemplate && stateTemplate.contentBlocks) {
                stateTemplateContent = stateTemplate.contentBlocks.join(' ');
              }
            } catch (error) {
              console.log('State template not found');
            }

            // Get state data
            let stateData = null;
            try {
              const stateResponse = await fetch(`${baseUrl}/api/states/${stateSlug}`);
              stateData = await stateResponse.json();
            } catch (error) {
              console.log('State data not found');
            }

            // Get all state facilities
            let stateFacilities = [];
            try {
              const stateFacilitiesResponse = await fetch(`${baseUrl}/api/facilities?stateId=${cityData.state.id}&limit=1000`);
              stateFacilities = await stateFacilitiesResponse.json();
            } catch (error) {
              console.log('State facilities not found');
            }

            // Get categories
            let categories = [];
            try {
              const categoriesResponse = await fetch(`${baseUrl}/api/categories`);
              categories = await categoriesResponse.json();
            } catch (error) {
              console.log('Categories not found');
            }

            pageTitle = `Asbestos Exposure Sites in ${cityData.name}, ${cityData.state.name} - ${cityData.facilityCount || 0} Facilities`;
            pageDescription = `Complete list of asbestos exposure sites in ${cityData.name}, ${cityData.state.name}. Find facilities where workers may have been exposed to asbestos-containing materials.`;

            ssrContent = `
              <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
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
                  <h2 style="font-size: 2rem; margin-bottom: 1rem;">About Asbestos Exposure in ${cityData.name}</h2>
                  ${cityTemplateContent ? `
                    <div style="line-height: 1.6; margin-bottom: 1rem;">${cityTemplateContent}</div>
                  ` : `
                    <p style="line-height: 1.6; margin-bottom: 1rem;">
                      ${cityData.name}, ${cityData.state.name} has ${cityData.facilityCount || 0} documented asbestos exposure sites. These facilities represent decades of industrial activity where workers may have encountered asbestos-containing materials across various industries including manufacturing, construction, shipbuilding, and power generation.
                    </p>
                    <p style="line-height: 1.6; margin-bottom: 1rem;">
                      Workers in ${cityData.name} facilities were exposed to asbestos through various applications including insulation, fireproofing materials, gaskets, and construction products. This directory provides detailed information about exposure sites to help individuals and legal professionals identify relevant exposure locations for mesothelioma and other asbestos-related disease cases.
                    </p>
                  `}
                  ${stateTemplateContent ? `
                    <div style="line-height: 1.6; margin-bottom: 1rem; background: #f8f9fa; padding: 1rem; border-radius: 8px;">
                      <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem;">About ${cityData.state.name}</h3>
                      <div>${stateTemplateContent}</div>
                    </div>
                  ` : ''}
                </div>

                <div style="margin-bottom: 2rem;">
                  <h2 style="font-size: 2rem; margin-bottom: 1rem;">Asbestos Exposure Facilities in ${cityData.name}</h2>
                  <div style="display: grid; gap: 1rem;">
                    ${Array.isArray(facilities) && facilities.length > 0 ? facilities.map(facility => `
                      <div style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 1.5rem;">
                        <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem;">
                          <a href="/${cityData.state.slug}/${cityData.slug}/${facility.slug}-asbestos-exposure" style="color: #0891b2; text-decoration: none;">
                            ${facility.name}
                          </a>
                        </h3>
                        <p style="color: #666; margin-bottom: 0.5rem;">${facility.address || `${cityData.name}, ${cityData.state.name}`}</p>
                        ${facility.category ? `<p style="color: #888; font-size: 0.9rem; margin-bottom: 0.5rem;">Category: ${facility.category.name}</p>` : ''}
                        ${facility.description ? `<p style="color: #333; line-height: 1.6; margin-bottom: 1rem;">${facility.description}</p>` : ''}
                        <a href="/${cityData.state.slug}/${cityData.slug}/${facility.slug}-asbestos-exposure" style="color: #0891b2; font-weight: 500; text-decoration: none;">
                          Learn More →
                        </a>
                      </div>
                    `).join('') : '<p style="color: #666;">No facilities found for this city.</p>'}
                  </div>
                </div>

                ${categories && categories.length > 0 ? `
                <div style="margin-bottom: 2rem;">
                  <h2 style="font-size: 2rem; margin-bottom: 1rem;">Facility Categories</h2>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    ${categories.slice(0, 6).map(category => `
                      <div style="padding: 1rem; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="font-weight: bold; color: #0891b2; margin-bottom: 0.5rem;">${category.name}</div>
                        <div style="color: #666; font-size: 0.9rem;">${category.description || 'Industrial facility type'}</div>
                      </div>
                    `).join('')}
                  </div>
                </div>
                ` : ''}

                <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
                  <h3 style="font-size: 1.25rem; font-weight: bold; color: #92400e; margin-bottom: 0.5rem;">Important Information</h3>
                  <p style="color: #92400e; line-height: 1.6;">
                    If you worked at any of these facilities in ${cityData.name} and have been diagnosed with mesothelioma, lung cancer, or other asbestos-related diseases, 
                    you may be entitled to compensation. Contact a qualified attorney to discuss your legal options.
                  </p>
                </div>
              </div>
            `;
          } else {
            ssrContent = `
              <div style="max-width: 1200px; margin: 0 auto; padding: 20px; text-align: center;">
                <h1>City Not Found</h1>
                <p>The requested city could not be found.</p>
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

      } else if (pathSegments.length === 3) {
        // Facility page: /florida/jacksonville/facility-name-asbestos-exposure
        const [stateSlug, citySlug, facilitySlugWithSuffix] = pathSegments;
        const facilitySlug = facilitySlugWithSuffix.replace('-asbestos-exposure', '');

        try {
          // Get facility data from your working API
          const facilityResponse = await fetch(`${baseUrl}/api/facilities/${stateSlug}/${citySlug}/${facilitySlug}`);
          const facility = await facilityResponse.json();

          if (facility && !facility.message) {
            // Get facility template content
            let facilityTemplateContent = '';
            try {
              const facilityTemplateResponse = await fetch(`${baseUrl}/api/content-templates/facility/${facilitySlug}_content_v1`);
              const facilityTemplate = await facilityTemplateResponse.json();
              if (facilityTemplate && facilityTemplate.contentBlocks) {
                facilityTemplateContent = facilityTemplate.contentBlocks.join(' ');
              }
            } catch (error) {
              console.log('Facility template not found, using basic content');
            }

            // Get nearby facilities
            let nearbyFacilities = [];
            try {
              const nearbyResponse = await fetch(`${baseUrl}/api/facilities/${facility.id}/nearby`);
              nearbyFacilities = await nearbyResponse.json();
            } catch (error) {
              console.log('Nearby facilities not found');
            }

            // Get related facilities
            let relatedFacilities = [];
            try {
              const relatedResponse = await fetch(`${baseUrl}/api/facilities/${facility.id}/related`);
              relatedFacilities = await relatedResponse.json();
            } catch (error) {
              console.log('Related facilities not found');
            }

            // Get city data
            let cityData = null;
            try {
              const cityResponse = await fetch(`${baseUrl}/api/cities/${stateSlug}/${citySlug}`);
              cityData = await cityResponse.json();
            } catch (error) {
              console.log('City data not found');
            }

            // Get city template content
            let cityTemplateContent = '';
            try {
              const cityTemplateResponse = await fetch(`${baseUrl}/api/content-templates/city/${citySlug}_content_adaptive`);
              const cityTemplate = await cityTemplateResponse.json();
              if (cityTemplate && cityTemplate.contentBlocks) {
                cityTemplateContent = cityTemplate.contentBlocks.join(' ');
              }
            } catch (error) {
              console.log('City template not found');
            }

            // Get state template content
            let stateTemplateContent = '';
            try {
              const stateTemplateResponse = await fetch(`${baseUrl}/api/content-templates/state/${stateSlug}_state_content`);
              const stateTemplate = await stateTemplateResponse.json();
              if (stateTemplate && stateTemplate.contentBlocks) {
                stateTemplateContent = stateTemplate.contentBlocks.join(' ');
              }
            } catch (error) {
              console.log('State template not found');
            }

            // Get state data
            let stateData = null;
            try {
              const stateResponse = await fetch(`${baseUrl}/api/states/${stateSlug}`);
              stateData = await stateResponse.json();
            } catch (error) {
              console.log('State data not found');
            }

            // Get all state facilities
            let stateFacilities = [];
            try {
              const stateFacilitiesResponse = await fetch(`${baseUrl}/api/facilities?stateId=${facility.state.id}&limit=1000`);
              stateFacilities = await stateFacilitiesResponse.json();
            } catch (error) {
              console.log('State facilities not found');
            }

            // Get all city facilities
            let cityFacilities = [];
            try {
              const cityFacilitiesResponse = await fetch(`${baseUrl}/api/facilities?cityId=${facility.city.id}&limit=1000`);
              cityFacilities = await cityFacilitiesResponse.json();
            } catch (error) {
              console.log('City facilities not found');
            }

            // Get categories
            let categories = [];
            try {
              const categoriesResponse = await fetch(`${baseUrl}/api/categories`);
              categories = await categoriesResponse.json();
            } catch (error) {
              console.log('Categories not found');
            }

            pageTitle = `${facility.name} - Asbestos Exposure Site in ${facility.city.name}, ${facility.state.name}`;
            pageDescription = `Information about asbestos exposure at ${facility.name} in ${facility.city.name}, ${facility.state.name}. Learn about potential health risks and legal options for workers.`;

            ssrContent = `
              <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
                <nav style="margin-bottom: 1rem;">
                  <a href="/" style="color: #0066cc;">Home</a> > 
                  <a href="/${facility.state.slug}" style="color: #0066cc;">${facility.state.name}</a> > 
                  <a href="/${facility.state.slug}/${facility.city.slug}" style="color: #0066cc;">${facility.city.name}</a> > 
                  ${facility.name}
                </nav>

                <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">${facility.name} - Asbestos Exposure Site</h1>
                <p style="font-size: 1.25rem; margin-bottom: 2rem;">
                  ${facility.address || `${facility.city.name}, ${facility.state.name}`}
                </p>

                <div style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 2rem; margin-bottom: 2rem;">
                  <h2 style="font-size: 2rem; margin-bottom: 1rem;">About This Facility</h2>
                  ${facility.description ? `<p style="line-height: 1.6; margin-bottom: 1rem;">${facility.description}</p>` : ''}
                  ${facilityTemplateContent ? `<div style="line-height: 1.6; margin-bottom: 1rem;">${facilityTemplateContent}</div>` : ''}

                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
                    <div>
                      <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem;">Location Details</h3>
                      <p style="color: #666;">City: ${facility.city.name}</p>
                      <p style="color: #666;">State: ${facility.state.name}</p>
                      ${facility.address ? `<p style="color: #666;">Address: ${facility.address}</p>` : ''}
                    </div>

                    <div>
                      <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem;">Facility Information</h3>
                      ${facility.category ? `<p style="color: #666;">Type: ${facility.category.name}</p>` : ''}
                      ${facility.companyName ? `<p style="color: #666;">Company: ${facility.companyName}</p>` : ''}
                    </div>
                  </div>
                </div>

                ${nearbyFacilities && nearbyFacilities.length > 0 ? `
                <div style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 2rem; margin-bottom: 2rem;">
                  <h2 style="font-size: 2rem; margin-bottom: 1rem;">Nearby Facilities</h2>
                  <div style="display: grid; gap: 1rem;">
                    ${nearbyFacilities.slice(0, 5).map(nearbyFacility => `
                      <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                        <h3 style="font-size: 1.125rem; font-weight: bold; margin-bottom: 0.5rem;">
                          <a href="/${facility.state.slug}/${facility.city.slug}/${nearbyFacility.slug}-asbestos-exposure" style="color: #0891b2; text-decoration: none;">
                            ${nearbyFacility.name}
                          </a>
                        </h3>
                        <p style="color: #666; margin-bottom: 0.5rem;">${nearbyFacility.address || `${facility.city.name}, ${facility.state.name}`}</p>
                        ${nearbyFacility.category ? `<p style="color: #888; font-size: 0.9rem;">Category: ${nearbyFacility.category.name}</p>` : ''}
                      </div>
                    `).join('')}
                  </div>
                </div>
                ` : ''}

                ${relatedFacilities && relatedFacilities.length > 0 ? `
                <div style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 2rem; margin-bottom: 2rem;">
                  <h2 style="font-size: 2rem; margin-bottom: 1rem;">Related Facilities</h2>
                  <div style="display: grid; gap: 1rem;">
                    ${relatedFacilities.slice(0, 5).map(relatedFacility => `
                      <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                        <h3 style="font-size: 1.125rem; font-weight: bold; margin-bottom: 0.5rem;">
                          <a href="/${relatedFacility.state?.slug || stateSlug}/${relatedFacility.city?.slug || 'unknown'}/${relatedFacility.slug}-asbestos-exposure" style="color: #0891b2; text-decoration: none;">
                            ${relatedFacility.name}
                          </a>
                        </h3>
                        <p style="color: #666; margin-bottom: 0.5rem;">${relatedFacility.address || `${relatedFacility.city?.name || 'Unknown'}, ${relatedFacility.state?.name || facility.state.name}`}</p>
                        ${relatedFacility.category ? `<p style="color: #888; font-size: 0.9rem;">Category: ${relatedFacility.category.name}</p>` : ''}
                      </div>
                    `).join('')}
                  </div>
                </div>
                ` : ''}

                ${cityTemplateContent ? `
                <div style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 2rem; margin-bottom: 2rem;">
                  <h2 style="font-size: 2rem; margin-bottom: 1rem;">About ${facility.city.name}</h2>
                  <div style="line-height: 1.6;">${cityTemplateContent}</div>
                </div>
                ` : ''}

                ${categories && categories.length > 0 ? `
                <div style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 2rem; margin-bottom: 2rem;">
                  <h2 style="font-size: 2rem; margin-bottom: 1rem;">Facility Categories</h2>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    ${categories.slice(0, 8).map(category => `
                      <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                        <div style="font-weight: bold; color: #0891b2; margin-bottom: 0.5rem;">${category.name}</div>
                        <div style="color: #666; font-size: 0.9rem;">${category.description || 'Industrial facility type'}</div>
                      </div>
                    `).join('')}
                  </div>
                </div>
                ` : ''}

                <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
                  <h3 style="font-size: 1.25rem; font-weight: bold; color: #92400e; margin-bottom: 0.5rem;">Important Information</h3>
                  <p style="color: #92400e; line-height: 1.6;">
                    If you worked at ${facility.name} and have been diagnosed with mesothelioma, lung cancer, or other asbestos-related diseases, 
                    you may be entitled to compensation. Contact a qualified attorney to discuss your legal options.
                  </p>
                </div>
              </div>
            `;
          } else {
            ssrContent = `
              <div style="max-width: 1200px; margin: 0 auto; padding: 20px; text-align: center;">
                <h1>Facility Not Found</h1>
                <p>The requested facility could not be found.</p>
                <a href="/" style="color: #0066cc;">Return to Homepage</a>
              </div>
            `;
          }
        } catch (apiError) {
          console.error('Facility API Error:', apiError);
          ssrContent = `
            <div style="max-width: 1200px; margin: 0 auto; padding: 20px; text-align: center;">
              <h1>Error Loading Facility Data</h1>
              <p>Unable to load facility information. Please try again later.</p>
              <a href="/" style="color: #0066cc;">Return to Homepage</a>
            </div>
          `;
        }

      } else {
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
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
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
