import { storage } from "./storage";
import type { Request, Response } from "express";

interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  twitterTitle: string;
  twitterDescription: string;
  structuredData?: any;
}

export async function generateSEOMetadata(req: Request): Promise<SEOMetadata> {
  const url = req.originalUrl || '/';
  // Support both www and non-www domains
  const host = req.get('host') || 'asbestosexposuresites.com';
  const baseUrl = `https://${host}`;
  
  // Parse URL to determine page type
  // Remove query parameters and hash
  const cleanUrl = url.split('?')[0].split('#')[0];
  const pathSegments = cleanUrl.split('/').filter(Boolean);
  
  try {
    // Homepage
    if (pathSegments.length === 0) {
      return {
        title: "Asbestos Exposure Sites Directory - 87,000+ Documented Locations",
        description: "Comprehensive database of asbestos exposure sites across all 50 states. Find facilities where you may have been exposed to asbestos. Essential resource for mesothelioma patients and legal professionals.",
        keywords: "asbestos exposure, mesothelioma, lung cancer, asbestos sites, exposure locations, industrial facilities, shipyards, power plants, manufacturing",
        canonicalUrl: 'https://asbestosexposuresites.com',
        ogTitle: "Asbestos Exposure Sites Directory - 87,000+ Documented Locations",
        ogDescription: "Comprehensive database of asbestos exposure sites across all 50 states. Find facilities where you may have been exposed to asbestos.",
        ogUrl: baseUrl,
        twitterTitle: "Asbestos Exposure Sites Directory - 87,000+ Documented Locations",
        twitterDescription: "Comprehensive database of asbestos exposure sites across all 50 states. Find facilities where you may have been exposed to asbestos.",
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
    }
    
    // State page: /florida
    if (pathSegments.length === 1) {
      const stateSlug = pathSegments[0];
      const state = await storage.getStateBySlug(stateSlug);
      if (!state) {
        return generateHomepageMetadata();
      }
      
      // Get cities count for the state
      const cities = await storage.getCitiesByState(state.id);
      const cityCount = cities.length;
      
      return {
        title: `Asbestos Exposure Sites in ${state.name} - ${state.facilityCount} Documented Facilities`,
        description: `Comprehensive list of asbestos exposure sites in ${state.name}. Find facilities across ${cityCount} cities where workers may have been exposed to asbestos.`,
        keywords: `asbestos exposure ${state.name}, mesothelioma ${state.name}, asbestos sites ${state.name}, industrial facilities ${state.name}`,
        canonicalUrl: `https://asbestosexposuresites.com/${state.slug}`,
        ogTitle: `Asbestos Exposure Sites in ${state.name} - ${state.facilityCount} Documented Facilities`,
        ogDescription: `Comprehensive list of asbestos exposure sites in ${state.name}. Find facilities across ${cityCount} cities where workers may have been exposed to asbestos.`,
        ogUrl: `${baseUrl}/${state.slug}`,
        twitterTitle: `Asbestos Exposure Sites in ${state.name} - ${state.facilityCount} Documented Facilities`,
        twitterDescription: `Comprehensive list of asbestos exposure sites in ${state.name}. Find facilities across ${cityCount} cities where workers may have been exposed to asbestos.`,
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
    }
    
    // City page: /florida/miami
    if (pathSegments.length === 2) {
      const [stateSlug, citySlug] = pathSegments;
      const city = await storage.getCityBySlug(stateSlug, citySlug);
      if (!city) {
        return generateHomepageMetadata();
      }
      
      return {
        title: `Asbestos Exposure Sites in ${city.name}, ${city.state.name} - ${city.facilityCount} Facilities`,
        description: `Complete list of asbestos exposure sites in ${city.name}, ${city.state.name}. Find facilities where workers may have been exposed to asbestos-containing materials.`,
        keywords: `asbestos exposure ${city.name}, mesothelioma ${city.name}, asbestos sites ${city.name} ${city.state.name}, industrial facilities ${city.name}`,
        canonicalUrl: `https://asbestosexposuresites.com/${stateSlug}/${citySlug}`,
        ogTitle: `Asbestos Exposure Sites in ${city.name}, ${city.state.name} - ${city.facilityCount} Facilities`,
        ogDescription: `Complete list of asbestos exposure sites in ${city.name}, ${city.state.name}. Find facilities where workers may have been exposed to asbestos-containing materials.`,
        ogUrl: `${baseUrl}/${stateSlug}/${citySlug}`,
        twitterTitle: `Asbestos Exposure Sites in ${city.name}, ${city.state.name} - ${city.facilityCount} Facilities`,
        twitterDescription: `Complete list of asbestos exposure sites in ${city.name}, ${city.state.name}. Find facilities where workers may have been exposed to asbestos-containing materials.`,
        structuredData: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": `Asbestos Exposure Sites in ${city.name}, ${city.state.name}`,
          "description": `Complete list of asbestos exposure sites in ${city.name}, ${city.state.name}`,
          "url": `${baseUrl}/${stateSlug}/${citySlug}`,
          "mainEntity": {
            "@type": "Dataset",
            "name": `${city.name} Asbestos Exposure Sites`,
            "description": `Database of ${city.facilityCount} asbestos exposure facilities in ${city.name}, ${city.state.name}`
          }
        }
      };
    }
    
    // Facility page: /florida/miami/facility-name-asbestos-exposure
    if (pathSegments.length === 3) {
      const [stateSlug, citySlug, facilitySlugWithSuffix] = pathSegments;
      // Remove the -asbestos-exposure suffix if present
      const facilitySlug = facilitySlugWithSuffix.replace('-asbestos-exposure', '');
      const facility = await storage.getFacilityBySlug(stateSlug, citySlug, facilitySlug);
      if (!facility) {
        return generateHomepageMetadata();
      }
      
      return {
        title: `${facility.name} - Asbestos Exposure Site in ${facility.city.name}, ${facility.state.name}`,
        description: `Information about asbestos exposure at ${facility.name} in ${facility.city.name}, ${facility.state.name}. Learn about potential health risks and legal options for workers.`,
        keywords: `${facility.name} asbestos, ${facility.name} mesothelioma, asbestos exposure ${facility.city.name}, ${facility.name} ${facility.state.name}`,
        canonicalUrl: `https://asbestosexposuresites.com/${stateSlug}/${citySlug}/${facilitySlug}-asbestos-exposure`,
        ogTitle: `${facility.name} - Asbestos Exposure Site in ${facility.city.name}, ${facility.state.name}`,
        ogDescription: `Information about asbestos exposure at ${facility.name} in ${facility.city.name}, ${facility.state.name}. Learn about potential health risks and legal options for workers.`,
        ogUrl: `${baseUrl}/${stateSlug}/${citySlug}/${facilitySlug}-asbestos-exposure`,
        twitterTitle: `${facility.name} - Asbestos Exposure Site in ${facility.city.name}, ${facility.state.name}`,
        twitterDescription: `Information about asbestos exposure at ${facility.name} in ${facility.city.name}, ${facility.state.name}. Learn about potential health risks and legal options for workers.`,
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
    }
    
    // Fallback
    return generateHomepageMetadata();
  } catch (error) {
    console.error('SEO metadata generation error:', error);
    return generateHomepageMetadata();
  }
}

function generateHomepageMetadata(): SEOMetadata {
  return {
    title: "Asbestos Exposure Sites Directory - 87,000+ Documented Locations",
    description: "Comprehensive database of asbestos exposure sites across all 50 states. Find facilities where you may have been exposed to asbestos. Essential resource for mesothelioma patients and legal professionals.",
    keywords: "asbestos exposure, mesothelioma, lung cancer, asbestos sites, exposure locations, industrial facilities, shipyards, power plants, manufacturing",
    canonicalUrl: 'https://asbestosexposuresites.com',
    ogTitle: "Asbestos Exposure Sites Directory - 87,000+ Documented Locations",
    ogDescription: "Comprehensive database of asbestos exposure sites across all 50 states. Find facilities where you may have been exposed to asbestos.",
    ogUrl: 'https://asbestosexposuresites.com',
    twitterTitle: "Asbestos Exposure Sites Directory - 87,000+ Documented Locations",
    twitterDescription: "Comprehensive database of asbestos exposure sites across all 50 states. Find facilities where you may have been exposed to asbestos.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Asbestos Exposure Sites Directory",
      "description": "Comprehensive database of asbestos exposure sites across all 50 states",
      "url": 'https://asbestosexposuresites.com',
      "potentialAction": {
        "@type": "SearchAction",
        "target": `https://asbestosexposuresites.com/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    }
  };
}

export function generateMetaTagsHTML(metadata: SEOMetadata): string {
  return `
    <title>${metadata.title}</title>
    <meta name="description" content="${metadata.description}">
    <meta name="keywords" content="${metadata.keywords}">
    <link rel="canonical" href="${metadata.canonicalUrl}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${metadata.ogTitle}">
    <meta property="og:description" content="${metadata.ogDescription}">
    <meta property="og:url" content="${metadata.ogUrl}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Asbestos Exposure Sites Directory">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${metadata.twitterTitle}">
    <meta name="twitter:description" content="${metadata.twitterDescription}">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
      ${JSON.stringify(metadata.structuredData, null, 2)}
    </script>
  `;
}
