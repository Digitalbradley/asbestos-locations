import { storage } from "./storage";
import type { Request, Response } from "express";

interface MetaData {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  structuredData?: any;
}

export async function generateSSRContent(req: Request): Promise<{ html: string; meta: MetaData }> {
  const url = req.originalUrl;
  const host = req.get('host') || 'asbestos-locations.vercel.app';
  const protocol = req.secure ? 'https' : 'http';
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

async function generateHomepageSSR(baseUrl: string): Promise<{ html: string; meta: MetaData }> {
  let states: any[] = [];
  let categories: any[] = [];
  
  try {
    states = await storage.getStates();
    categories = await storage.getCategories();
  } catch (error) {
    console.error('Database error in SSR:', error);
    // Fallback to empty arrays if database fails
  }
  
  const html = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center py-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Asbestos Exposure Sites Directory
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Comprehensive database of 87,000+ documented asbestos exposure locations across all 50 states.
          Essential resource for patients, families, and legal professionals.
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div class="text-center">
          <div class="text-4xl font-bold text-teal-600 mb-2">87K+</div>
          <div class="text-gray-600">Documented Sites</div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-bold text-teal-600 mb-2">50</div>
          <div class="text-gray-600">States Covered</div>
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
              <div class="text-sm text-gray-500">${state.facilityCount || 0} facilities</div>
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
              <div class="text-sm text-gray-500">${category.facilityCount || 0} facilities</div>
            </a>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  
  const meta: MetaData = {
    title: "Asbestos Exposure Sites Directory - 87,000+ Documented Locations",
    description: "Comprehensive database of asbestos exposure sites across all 50 states. Find facilities where you may have been exposed to asbestos. Essential resource for mesothelioma patients and legal professionals.",
    keywords: "asbestos exposure, mesothelioma, lung cancer, asbestos sites, exposure locations, industrial facilities, shipyards, power plants, manufacturing",
    canonicalUrl: baseUrl,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Asbestos Exposure Sites Directory",
      "description": "Comprehensive database of asbestos exposure sites across all 50 states",
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

async function generateStatePageSSR(stateSlug: string, baseUrl: string): Promise<{ html: string; meta: MetaData }> {
  let state = null;
  let cities: any[] = [];
  let facilities: any[] = [];
  
  try {
    state = await storage.getStateBySlug(stateSlug);
    if (!state) {
      return generateHomepageSSR(baseUrl);
    }
    
    cities = await storage.getCitiesByStateId(state.id);
    facilities = await storage.getFacilitiesByStateId(state.id, 10); // Get top 10 facilities
  } catch (error) {
    console.error('Database error in state SSR:', error);
    return generateHomepageSSR(baseUrl);
  }
  
  const html = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Asbestos Exposure Sites in ${state.name}
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          There are ${state.facilityCount || 0} facilities for you to review across ${cities.length} cities and towns
        </p>
      </div>
      
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Cities in ${state.name}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          ${cities.map(city => `
            <a href="/${state.slug}/${city.slug}" class="block p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div class="font-medium text-gray-900">${city.name}</div>
              <div class="text-sm text-gray-500">${city.facilityCount || 0} facilities</div>
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
                <a href="/${state.slug}/${facility.city.slug}/${facility.slug}-asbestos-exposure" class="text-teal-600 hover:text-teal-800">
                  ${facility.name}
                </a>
              </h3>
              <p class="text-gray-600 mb-2">${facility.city.name}, ${state.name}</p>
              ${facility.description ? `<p class="text-gray-700">${facility.description}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  
  const meta: MetaData = {
    title: `Asbestos Exposure Sites in ${state.name} - ${state.facilityCount || 0} Documented Facilities`,
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
        "description": `Database of ${state.facilityCount || 0} asbestos exposure facilities in ${state.name}`,
        "creator": {
          "@type": "Organization",
          "name": "Asbestos Exposure Sites Directory"
        }
      }
    }
  };
  
  return { html, meta };
}

async function generateCityPageSSR(stateSlug: string, citySlug: string, baseUrl: string): Promise<{ html: string; meta: MetaData }> {
  let city = null;
  let facilities: any[] = [];
  
  try {
    city = await storage.getCityBySlug(stateSlug, citySlug);
    if (!city) {
      return generateHomepageSSR(baseUrl);
    }
    
    facilities = await storage.getFacilitiesByCityId(city.id);
  } catch (error) {
    console.error('Database error in city SSR:', error);
    return generateHomepageSSR(baseUrl);
  }
  
  const html = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Asbestos Exposure Sites in ${city.name}, ${city.state.name}
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          ${city.facilityCount || 0} documented asbestos exposure facilities in ${city.name}
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
            <p class="text-gray-600 mb-2">${facility.address || city.name}, ${city.state.name}</p>
            ${facility.category ? `<p class="text-sm text-gray-500 mb-2">Category: ${facility.category.name}</p>` : ''}
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
    title: `Asbestos Exposure Sites in ${city.name}, ${city.state.name} - ${city.facilityCount || 0} Facilities`,
    description: `Complete list of asbestos exposure sites in ${city.name}, ${city.state.name}. Find facilities where workers may have been exposed to asbestos-containing materials.`,
    keywords: `asbestos exposure ${city.name}, mesothelioma ${city.name}, asbestos sites ${city.name} ${city.state.name}, industrial facilities ${city.name}`,
    canonicalUrl: `${baseUrl}/${stateSlug}/${citySlug}`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `Asbestos Exposure Sites in ${city.name}, ${city.state.name}`,
      "description": `Complete list of asbestos exposure sites in ${city.name}, ${city.state.name}`,
      "url": `${baseUrl}/${stateSlug}/${citySlug}`,
      "mainEntity": {
        "@type": "Dataset",
        "name": `${city.name} Asbestos Exposure Sites`,
        "description": `Database of ${city.facilityCount || 0} asbestos exposure facilities in ${city.name}, ${city.state.name}`
      }
    }
  };
  
  return { html, meta };
}

async function generateFacilityPageSSR(stateSlug: string, citySlug: string, facilitySlug: string, baseUrl: string): Promise<{ html: string; meta: MetaData }> {
  let facility = null;
  
  try {
    facility = await storage.getFacilityBySlug(stateSlug, citySlug, facilitySlug);
    if (!facility) {
      return generateHomepageSSR(baseUrl);
    }
  } catch (error) {
    console.error('Database error in facility SSR:', error);
    return generateHomepageSSR(baseUrl);
  }
  
  const html = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          ${facility.name} - Asbestos Exposure Site
        </h1>
        <p class="text-xl text-gray-600 mb-2">${facility.address || facility.city.name}, ${facility.state.name}</p>
        ${facility.category ? `<p class="text-lg text-gray-500 mb-8">Category: ${facility.category.name}</p>` : ''}
      </div>
      
      <div class="bg-white rounded-lg shadow p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">About This Facility</h2>
        ${facility.description ? `<p class="text-gray-700 mb-4">${facility.description}</p>` : ''}
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Location Details</h3>
            <p class="text-gray-600">City: ${facility.city.name}</p>
            <p class="text-gray-600">State: ${facility.state.name}</p>
            ${facility.address ? `<p class="text-gray-600">Address: ${facility.address}</p>` : ''}
            ${facility.county ? `<p class="text-gray-600">County: ${facility.county}</p>` : ''}
          </div>
          
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Facility Information</h3>
            ${facility.category ? `<p class="text-gray-600">Type: ${facility.category.name}</p>` : ''}
            ${facility.companyName ? `<p class="text-gray-600">Company: ${facility.companyName}</p>` : ''}
            ${facility.operationalPeriod ? `<p class="text-gray-600">Operational Period: ${facility.operationalPeriod}</p>` : ''}
            ${facility.exposureRisk ? `<p class="text-gray-600">Exposure Risk: ${facility.exposureRisk}</p>` : ''}
          </div>
        </div>
        
        ${facility.historicalDescription ? `
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Historical Information</h3>
          <p class="text-gray-700">${facility.historicalDescription}</p>
        </div>
        ` : ''}
        
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
    title: `${facility.name} - Asbestos Exposure Site in ${facility.city.name}, ${facility.state.name}`,
    description: `Information about asbestos exposure at ${facility.name} in ${facility.city.name}, ${facility.state.name}. Learn about potential health risks and legal options for workers.`,
    keywords: `${facility.name} asbestos, ${facility.name} mesothelioma, asbestos exposure ${facility.city.name}, ${facility.name} ${facility.state.name}`,
    canonicalUrl: `${baseUrl}/${stateSlug}/${citySlug}/${facilitySlug}-asbestos-exposure`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Place",
      "name": `${facility.name}`,
      "description": `Asbestos exposure site in ${facility.city.name}, ${facility.state.name}`,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": facility.city.name,
        "addressRegion": facility.state.name,
        "addressCountry": "US"
      },
      "url": `${baseUrl}/${stateSlug}/${citySlug}/${facilitySlug}-asbestos-exposure`
    }
  };
  
  return { html, meta };
}
export const storage = new DatabaseStorage();
