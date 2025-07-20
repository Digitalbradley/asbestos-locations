import { VercelRequest, VercelResponse } from '@vercel/node';
import { generateFooterHTML } from './utils/footer-generator.js';
import { generateNavHTML } from './utils/nav-generator.js';
import { generateBreadcrumbHTML } from './utils/breadcrumb-generator.js';
import { categoryInfo } from './utils/category-content.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🚀 SSR Handler started');
  console.log('Request URL:', req.url);

  try {
    // Bot detection
    const userAgent = req.headers['user-agent'] || '';
    const isBot = /bot|crawler|spider|crawling|facebook|twitter|google|bing|msn|duckduckbot|teoma|slurp|yandex/i.test(userAgent);
    const forceSSR = req.query.forceSSR === 'true';
    const shouldServeSSR = isBot || forceSSR;

    console.log('User-Agent:', userAgent);
    console.log('Is Bot:', isBot);
    console.log('Force SSR:', forceSSR);
    console.log('Should Serve SSR:', shouldServeSSR);

    // Generate full content for both bots and humans (for SEO injection)
    console.log('🤖 Generating full SSR content for SEO injection');

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
        // Homepage - Using client/index.html, no SSR needed
        ssrContent = '';
        
      } else if (pathSegments[0] === 'category' && pathSegments.length === 2) {
        // Category page: /category/manufacturing
        const categorySlug = pathSegments[1];
        
        console.log('📁 Category page detected:', categorySlug);
        console.log('CategoryInfo type:', typeof categoryInfo);
        console.log('CategoryInfo exists:', !!categoryInfo);
        
        // Add fallback in case import failed
        const category = categoryInfo ? categoryInfo[categorySlug] : null;
        
        if (category && category.sections) {
          try {
            // Use the imported category data
            pageTitle = category.pageTitle;
            pageDescription = category.metaDescription;
            
            // Define breadcrumb items
            const breadcrumbItems = [
              { label: 'Home', href: '/' },
              { label: category.name }
            ];
            
            // Build the SSR content
            ssrContent = generateNavHTML();
            ssrContent += generateBreadcrumbHTML(breadcrumbItems);
            ssrContent += `
            <div style="max-width: 1152px; margin: 0 auto; padding: 0 1rem;">
              <h1 style="font-size: 2.5rem; margin-bottom: 1rem; font-family: 'Merriweather', serif;">${category.h1Title}</h1>
              
              <!-- Overview Section -->
              <section style="margin: 2rem 0;">
                <h2 style="font-size: 2rem; margin-bottom: 1rem; font-family: 'Merriweather', serif;">${category.sections.overview.heading}</h2>
                <div style="background: #f8f9fa; border: 1px solid #e5e7eb; border-left: 4px solid #52d2e3; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem;">
                  <p style="line-height: 1.6; margin-bottom: 1rem;">${category.sections.overview.content}</p>
                </div>
              </section>
              
              <!-- History Section -->
              <section style="margin: 2rem 0;">
                <h2 style="font-size: 2rem; margin-bottom: 1rem; font-family: 'Merriweather', serif;">${category.sections.history.heading}</h2>
                <div style="background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem;">
                  <p style="line-height: 1.6; margin-bottom: 1rem;">${category.sections.history.content}</p>
                </div>
              </section>
              
              <!-- Exposure Sources Section -->
              <section style="margin: 2rem 0;">
                <h2 style="font-size: 2rem; margin-bottom: 1rem; font-family: 'Merriweather', serif;">${category.sections.exposureSources.heading}</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                  <div style="background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.5rem;">
                    <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem; font-family: 'Merriweather', serif;">${category.sections.exposureSources.subheading}</h3>
                    <ul style="list-style: none; padding: 0;">
                      ${category.sections.exposureSources.items.map(item => `
                        <li style="display: flex; align-items: flex-start; margin-bottom: 0.5rem;">
                          <span style="color: #52d2e3; font-weight: bold; margin-right: 0.5rem;">•</span>
                          ${item}
                        </li>
                      `).join('')}
                    </ul>
                  </div>
                </div>
              </section>
              
              <!-- Health Risks and Legal Rights Section -->
              <section style="margin: 2rem 0;">
                <h2 style="font-size: 2rem; margin-bottom: 1rem; font-family: 'Merriweather', serif;">${category.sections.healthAndLegal.heading}</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                  <div style="background: #f8f9fa; border: 1px solid #e5e7eb; border-top: 4px solid #dc3545; border-radius: 8px; padding: 1.5rem;">
                    <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem; font-family: 'Merriweather', serif;">${category.sections.healthAndLegal.healthRisks.subheading}</h3>
                    <p style="line-height: 1.6;">${category.sections.healthAndLegal.healthRisks.content}</p>
                  </div>
                  <div style="background: #f8f9fa; border: 1px solid #e5e7eb; border-left: 4px solid #52d2e3; border-radius: 8px; padding: 1.5rem;">
                    <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem; font-family: 'Merriweather', serif;">${category.sections.healthAndLegal.legalContext.subheading}</h3>
                    <p style="line-height: 1.6;">${category.sections.healthAndLegal.legalContext.content}</p>
                  </div>
                </div>
              </section>
              
              <!-- State Filter Section -->
              <section style="background: #e3f2fd; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
                <h2 style="font-size: 2rem; margin-bottom: 1rem; font-family: 'Merriweather', serif;">${category.sections.stateFilter.heading}</h2>
                <p style="margin-bottom: 1rem;"><strong>${category.sections.stateFilter.description}</strong> ${category.sections.stateFilter.content}</p>
                <p>${category.sections.stateFilter.instruction}</p>
              </section>
              
              <!-- Industries Affected Section (NEW) -->
              ${category.sections.industriesAffected && category.sections.industriesAffected.industries ? `
              <section style="margin: 2rem 0;">
                <h2 style="font-size: 2rem; margin-bottom: 1rem; font-family: 'Merriweather', serif;">${category.sections.industriesAffected.heading}</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                  ${category.sections.industriesAffected.industries.map(industry => `
                    <div style="background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.5rem;">
                      <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem; font-family: 'Merriweather', serif; color: #0891b2;">${industry.name}</h3>
                      <p style="line-height: 1.6; margin: 0;">${industry.description}</p>
                    </div>
                  `).join('')}
                </div>
              </section>
              ` : ''}
              
              <!-- Call to Action Section (NEW ENHANCED) -->
              ${category.sections.callToAction ? `
              <section style="margin: 2rem 0;">
                <h2 style="font-size: 2rem; margin-bottom: 1rem; font-family: 'Merriweather', serif;">${category.sections.callToAction.heading}</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                  <div style="background: #f0f9ff; border: 1px solid #0891b2; border-radius: 8px; padding: 1.5rem;">
                    <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem; font-family: 'Merriweather', serif; color: #0891b2;">${category.sections.callToAction.workers.subheading}</h3>
                    <p style="line-height: 1.6; margin: 0;">${category.sections.callToAction.workers.content}</p>
                  </div>
                  <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 1.5rem;">
                    <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem; font-family: 'Merriweather', serif; color: #92400e;">${category.sections.callToAction.families.subheading}</h3>
                    <p style="line-height: 1.6; margin: 0;">${category.sections.callToAction.families.content}</p>
                  </div>
                  <div style="background: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 1.5rem;">
                    <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem; font-family: 'Merriweather', serif; color: #15803d;">${category.sections.callToAction.legal.subheading}</h3>
                    <p style="line-height: 1.6; margin: 0;">${category.sections.callToAction.legal.content}</p>
                  </div>
                </div>
                <div style="text-align: center; margin-top: 2rem;">
                  <a href="/legal-help" style="background: #52d2e3; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 4px; display: inline-block;">Get Free Legal Consultation</a>
                </div>
              </section>
              ` : ''}
              
              <!-- Citations Section (NEW) -->
              ${category.sections.citations && category.sections.citations.references ? `
              <section style="margin: 2rem 0;">
                <h2 style="font-size: 2rem; margin-bottom: 1rem; font-family: 'Merriweather', serif;">${category.sections.citations.heading}</h2>
                <ol style="padding-left: 1.5rem;">
                  ${category.sections.citations.references.map(ref => `
                    <li style="margin-bottom: 0.5rem;">
                      ${ref.text} 
                      <a href="${ref.url}" style="color: #0066cc; text-decoration: none;">[Source]</a>
                    </li>
                  `).join('')}
                </ol>
              </section>
              ` : ''}
            </div>
          `;
          
          ssrContent += generateFooterHTML();
          
          console.log('✅ Category content generated successfully');
          } catch (error) {
            console.error('❌ Error generating category content:', error);
            ssrContent = `
              <div style="max-width: 1200px; margin: 0 auto; padding: 20px; text-align: center;">
                <h1>Error Loading Category</h1>
                <p>Unable to generate category content: ${error.message}</p>
                <a href="/" style="color: #0066cc;">Return to Homepage</a>
              </div>
            `;
          }
        } else {
          // Category not found
          ssrContent = `
            <div style="max-width: 1200px; margin: 0 auto; padding: 20px; text-align: center;">
              <h1>Category Not Found</h1>
              <p>The requested category could not be found.</p>
              <a href="/" style="color: #0066cc;">Return to Homepage</a>
            </div>
          `;
        }
        
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

            ssrContent = generateNavHTML();
            ssrContent += `<div style="max-width: 1200px; margin: 0 auto; padding: 20px;">`;
            ssrContent += generateBreadcrumbHTML([
              { label: 'Home', href: '/' },
              { label: stateData.name, href: null }
            ]);

            ssrContent += `
                <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">Asbestos Exposure Sites in ${stateData.name}</h1>
                <p style="font-size: 1.25rem; margin-bottom: 2rem;">
                  There are ${stateData.facilityCount || 0} facilities for you to review across ${stateData.cities?.length || 0} cities and towns
                </p>

                ${stateTemplateContent ? `
                <div style="margin-bottom: 2rem;">
                  <div style="line-height: 1.6; margin-bottom: 1rem;">${stateTemplateContent}</div>
                </div>
                ` : ''}

                ${stateData.cities && stateData.cities.length > 0 ? `
                <div style="margin-bottom: 2rem;">
                  <h2 style="font-size: 2rem; margin-bottom: 1rem;">Cities in ${stateData.name}</h2>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    ${stateData.cities.map((city: any) => `
                      <a href="/${stateData.slug}/${city.slug}" style="display: block; padding: 1rem; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-decoration: none; color: inherit;">
                        <div style="font-weight: bold;">${city.name}</div>
                        <div style="color: #666; font-size: 0.9rem;">${city.facilityCount || 0} facilities</div>
                      </a>
                    `).join('')}
                  </div>
                </div>
                ` : ''}

                <div style="margin-bottom: 2rem;">
                  <div style="background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 12px; padding: 2rem;">
                    <h2 style="font-size: 1.875rem; font-weight: bold; margin-bottom: 1.5rem; text-align: center;">Browse Cities in ${stateData.name}</h2>
                    <div style="max-width: 400px; margin: 0 auto;">
                      <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem;">Select City</label>
                      <select style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; font-size: 1rem; background: white;">
                        <option value="">All Cities</option>
                        ${stateData.cities ? stateData.cities.map((city: any) => `
                          <option value="${city.slug}">${city.name}</option>
                        `).join('') : ''}
                      </select>
                    </div>
                  </div>
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
              </div>
            `;
            ssrContent += generateFooterHTML();
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
            // Get facilities for this city (using city endpoint - primary method)
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



            // Get nearest cities
            let nearestCities = [];
            try {
              const nearestCitiesResponse = await fetch(`${baseUrl}/api/cities/${cityData.id}/related`);
              nearestCities = await nearestCitiesResponse.json();
            } catch (error) {
              console.log('Nearest cities not found');
            }

            pageTitle = `Asbestos Exposure Sites in ${cityData.name}, ${cityData.state.name} - ${cityData.facilityCount || 0} Facilities`;
            pageDescription = `Complete list of asbestos exposure sites in ${cityData.name}, ${cityData.state.name}. Find facilities where workers may have been exposed to asbestos-containing materials.`;

            // Define breadcrumb items
            const breadcrumbItems = [
              { label: 'Home', href: '/' },
              { label: cityData.state.name, href: `/${cityData.state.slug}` },
              { label: cityData.name }
            ];

            // Start building SSR content with navigation
            ssrContent = generateNavHTML();
            ssrContent += `<div style="max-width: 1200px; margin: 0 auto; padding: 20px;">`;
            ssrContent += generateBreadcrumbHTML(breadcrumbItems);
            ssrContent += `

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
                </div>

                <div style="margin-bottom: 2rem;">
                  <h2 style="font-size: 2rem; margin-bottom: 1rem;">
                    All ${Array.isArray(facilities) ? facilities.length : cityData.facilityCount || 0} Documented Exposure Sites in ${cityData.name}
                  </h2>
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

                ${nearestCities && nearestCities.length > 0 ? `
                <div style="margin-bottom: 2rem;">
                  <h2 style="font-size: 2rem; margin-bottom: 1rem;">Related Cities in Florida</h2>
                  <p style="color: #666; margin-bottom: 1rem;">
                    Explore asbestos exposure sites in other cities within Florida, sorted by number of documented facilities.
                  </p>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    ${nearestCities.slice(0, 10).map(nearbyCity => `
                      <a href="/${cityData.state.slug}/${nearbyCity.slug}" style="display: block; padding: 1rem; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-decoration: none; color: inherit; border: 1px solid #e5e7eb;">
                        <div style="font-weight: bold; color: #0891b2; margin-bottom: 0.5rem;">${nearbyCity.name}</div>
                        <div style="color: #666; font-size: 0.9rem;">${nearbyCity.facilityCount || 0} documented facilities</div>

                      </a>
                    `).join('')}
                  </div>
                </div>
                ` : ''}

                ${(() => {
                  // Determine variation based on city ID
                  const variationIndex = cityData.id % 3;
                  
                  const importantInfoVariations = [
                    {
                      heading: "Important Legal Information",
                      text: `If you worked at any of the ${cityData.facilityCount || 0} facilities in ${cityData.name} and have been diagnosed with mesothelioma, lung cancer, or other asbestos-related diseases, you may be entitled to significant compensation.`,
                      linkText: "Get free legal consultation for mesothelioma claims"
                    },
                    {
                      heading: "Workers' Rights & Compensation",
                      text: `Workers exposed to asbestos at ${cityData.name}'s ${cityData.facilityCount || 0} documented facilities may qualify for substantial settlements if diagnosed with asbestos-related illnesses including mesothelioma, asbestosis, or lung cancer.`,
                      linkText: "Get free legal consultation for mesothelioma claims"
                    },
                    {
                      heading: "Legal Help Available",
                      text: `Have you or a loved one worked at facilities in ${cityData.name}? Those diagnosed with mesothelioma or asbestos-related diseases from workplace exposure may have valuable legal claims.`,
                      linkText: "Get free legal consultation for mesothelioma claims"
                    }
                  ];

                  const selectedVariation = importantInfoVariations[variationIndex];

                  return `
                    <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
                      <h3 style="font-size: 1.25rem; font-weight: bold; color: #92400e; margin-bottom: 0.5rem;">${selectedVariation.heading}</h3>
                      <p style="color: #92400e; line-height: 1.6;">
                        ${selectedVariation.text} 
                        <a href="/legal-help" style="color: #92400e; text-decoration: underline; font-weight: bold;">
                          ${selectedVariation.linkText}
                        </a>.
                      </p>
                    </div>
                  `;
                })()}
            `;
            ssrContent += `</div>`; // Close the container div
            ssrContent += generateFooterHTML();
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
            // Get facility template content using same logic as React
            let facilityTemplateContent = '';
            try {
              // Determine template version based on facility ID (same logic as React)
              const templateVersion = (facility.id % 3) + 1;
              console.log('Fetching facility content template for:', facilitySlug, 'version:', templateVersion);
              
              // Try versioned template first
              let facilityTemplateResponse = await fetch(`${baseUrl}/api/content-templates/facility/${facilitySlug}_content_v${templateVersion}`);
              console.log('Primary template API response:', facilityTemplateResponse.status, facilityTemplateResponse.statusText);
              
              if (facilityTemplateResponse.ok) {
                const facilityTemplate = await facilityTemplateResponse.json();
                console.log('Template found:', facilityTemplate?.templateName);
                if (facilityTemplate && facilityTemplate.contentBlocks) {
                  facilityTemplateContent = facilityTemplate.contentBlocks.join(' ');
                }
              } else {
                // Fall back to other versions if primary not found
                for (let v = 1; v <= 3; v++) {
                  if (v !== templateVersion) {
                    console.log('Trying fallback template version:', v);
                    facilityTemplateResponse = await fetch(`${baseUrl}/api/content-templates/facility/${facilitySlug}_content_v${v}`);
                    console.log('Fallback template API response:', facilityTemplateResponse.status, facilityTemplateResponse.statusText);
                    if (facilityTemplateResponse.ok) {
                      const facilityTemplate = await facilityTemplateResponse.json();
                      console.log('Fallback template found:', facilityTemplate?.templateName);
                      if (facilityTemplate && facilityTemplate.contentBlocks) {
                        facilityTemplateContent = facilityTemplate.contentBlocks.join(' ');
                        break;
                      }
                    }
                  }
                }
              }
              
              if (!facilityTemplateContent) {
                console.log('No content template found for facility:', facilitySlug);
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



            // State template content and categories removed from facility pages

            pageTitle = `${facility.name} - Asbestos Exposure Site in ${facility.city.name}, ${facility.state.name}`;
            pageDescription = `Information about asbestos exposure at ${facility.name} in ${facility.city.name}, ${facility.state.name}. Learn about potential health risks and legal options for workers.`;

            ssrContent = generateNavHTML();
            ssrContent += `<div style="max-width: 1200px; margin: 0 auto; padding: 20px;">`;
            ssrContent += generateBreadcrumbHTML([
              { label: 'Home', href: '/' },
              { label: facility.state.name, href: `/${facility.state.slug}` },
              { label: facility.city.name, href: `/${facility.state.slug}/${facility.city.slug}` },
              { label: facility.name, href: null }
            ]);

            ssrContent += `
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
                    ${nearbyFacilities.map(nearbyFacility => `
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
                    ${relatedFacilities.map(relatedFacility => `
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

                <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
                  <h3 style="font-size: 1.25rem; font-weight: bold; color: #92400e; margin-bottom: 0.5rem;">Important Legal Information</h3>
                  <p style="color: #92400e; line-height: 1.6; margin-bottom: 1rem;">
                    If you worked at ${facility.name} in ${facility.city.name}, ${facility.state.name} and have been diagnosed with mesothelioma, lung cancer, or other asbestos-related diseases, 
                    you may be entitled to significant compensation. Former employees of ${facility.category?.name || 'industrial facilities'} like this often qualify for legal claims.
                  </p>
                  <div style="text-align: center;">
                    <a href="/legal-help" style="display: inline-flex; align-items: center; padding: 0.75rem 1.5rem; background: #d97706; color: white; font-weight: 600; border-radius: 8px; text-decoration: none; transition: background-color 0.2s;">
                      Get Free Legal Consultation
                    </a>
                  </div>
                </div>
              </div>
            `;
            ssrContent += generateFooterHTML();
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

      // Dynamic asset path detection
      let jsAssetPath = '/src/main.tsx'; // fallback for development
      let cssAssetPath = '';

      try {
        // Try to read the built index.html to get actual asset paths
        const fs = require('fs');
        const path = require('path');
        const indexHtmlPath = path.join(process.cwd(), 'dist/public/index.html');

        if (fs.existsSync(indexHtmlPath)) {
          const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

          // Extract JS asset path
          const jsMatch = indexHtml.match(/<script[^>]*src="([^"]*assets\/index-[^"]*\.js)"[^>]*>/);
          if (jsMatch) {
            jsAssetPath = jsMatch[1];
          }

          // Extract CSS asset path
          const cssMatch = indexHtml.match(/<link[^>]*href="([^"]*assets\/index-[^"]*\.css)"[^>]*>/);
          if (cssMatch) {
            cssAssetPath = cssMatch[1];
          }
        }
      } catch (error) {
        console.log('Could not read built assets, using fallback paths');
      }

      // Create HTML with dynamic asset paths
      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${pageDescription}">
  <meta name="keywords" content="asbestos exposure, mesothelioma, legal help, ${pageTitle}">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${pageDescription}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://asbestosexposuresites.com${url}">
  <link rel="canonical" href="https://asbestosexposuresites.com${url}">

  <!-- React App Assets -->
  ${cssAssetPath ? `<link rel="stylesheet" crossorigin href="${cssAssetPath}">` : ''}
  <script type="module" crossorigin src="${jsAssetPath}"></script>
</head>
<body>
  <!-- React App Mount Point -->
  <div id="root"></div>

  <!-- SEO Content for Search Engines -->
  <div id="seo-content" style="${shouldServeSSR ? 'display: block; font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; color: #333; background: #f9f9f9;' : 'display: none; visibility: hidden;'}">
    ${ssrContent}
  </div>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).send(fullHtml);

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
