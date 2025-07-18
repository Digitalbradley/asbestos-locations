// Add this to the top of your production seoUtils.ts file
console.log('seoUtils.ts file loaded successfully');
/**
 * Client-side SEO utility functions for dynamic meta tag management
 */

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

/**
 * Update page meta tags dynamically on the client side
 */
export function updatePageMetadata(metadata: SEOMetadata): void {
  // Update title
  document.title = metadata.title;
  
  // Update meta tags
  updateMetaTag('description', metadata.description);
  updateMetaTag('keywords', metadata.keywords);
  
  // Update canonical URL
  updateLinkTag('canonical', metadata.canonicalUrl);
  
  // Update Open Graph tags
  updateMetaTag('og:title', metadata.ogTitle, 'property');
  updateMetaTag('og:description', metadata.ogDescription, 'property');
  updateMetaTag('og:url', metadata.ogUrl, 'property');
  updateMetaTag('og:type', 'website', 'property');
  updateMetaTag('og:site_name', 'Asbestos Exposure Sites Directory', 'property');
  
  // Update Twitter tags
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', metadata.twitterTitle);
  updateMetaTag('twitter:description', metadata.twitterDescription);
  
  // Update structured data
  if (metadata.structuredData) {
    updateStructuredData(metadata.structuredData);
  }
}

function updateMetaTag(name: string, content: string, attribute: string = 'name'): void {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
}

function updateLinkTag(rel: string, href: string): void {
  let link = document.querySelector(`link[rel="${rel}"]`);
  
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  
  link.setAttribute('href', href);
}

function updateStructuredData(data: any): void {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }
  
  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

// Simple cache for SEO metadata with homepage cache management
const seoCache = new Map<string, SEOMetadata>();

/**
 * Clear homepage cache to force fresh metadata
 */
export function clearHomepageCache(): void {
  seoCache.delete('/');
}

/**
 * Generate SEO metadata based on current page location - Client-side only
 */
export async function generatePageSEOMetadata(location: string): Promise<SEOMetadata> {
  const baseUrl = `https://${window.location.host}`;
  
  // Parse URL to determine page type and generate metadata
  const pathSegments = location.split('/').filter(Boolean);
  
  try {
    // Homepage
    if (pathSegments.length === 0) {
      return {
        title: "Asbestos Exposure Sites Directory - 87,000+ Documented Locations",
        description: "Comprehensive database of asbestos exposure sites across all 50 states. Find facilities where you may have been exposed to asbestos. Essential resource for mesothelioma patients and legal professionals.",
        keywords: "asbestos exposure, mesothelioma, lung cancer, asbestos sites, exposure locations, industrial facilities, shipyards, power plants, manufacturing",
        canonicalUrl: baseUrl,
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
      const stateName = capitalizeWords(pathSegments[0].replace('-', ' '));
      return {
        title: `Asbestos Exposure Sites in ${stateName} - Documented Facilities`,
        description: `Comprehensive list of asbestos exposure sites in ${stateName}. Find facilities where workers may have been exposed to asbestos.`,
        keywords: `asbestos exposure ${stateName}, mesothelioma ${stateName}, asbestos sites ${stateName}, industrial facilities ${stateName}`,
        canonicalUrl: `${baseUrl}/${pathSegments[0]}`,
        ogTitle: `Asbestos Exposure Sites in ${stateName} - Documented Facilities`,
        ogDescription: `Comprehensive list of asbestos exposure sites in ${stateName}. Find facilities where workers may have been exposed to asbestos.`,
        ogUrl: `${baseUrl}/${pathSegments[0]}`,
        twitterTitle: `Asbestos Exposure Sites in ${stateName} - Documented Facilities`,
        twitterDescription: `Comprehensive list of asbestos exposure sites in ${stateName}. Find facilities where workers may have been exposed to asbestos.`
      };
    }
    
    // City page: /florida/miami
    if (pathSegments.length === 2) {
      const stateName = capitalizeWords(pathSegments[0].replace('-', ' '));
      const cityName = capitalizeWords(pathSegments[1].replace('-', ' '));
      return {
        title: `Asbestos Exposure Sites in ${cityName}, ${stateName} - Facilities`,
        description: `Directory of asbestos exposure sites in ${cityName}, ${stateName}. Find facilities where workers may have been exposed to asbestos.`,
        keywords: `asbestos exposure ${cityName}, mesothelioma ${cityName}, asbestos sites ${cityName} ${stateName}`,
        canonicalUrl: `${baseUrl}/${pathSegments[0]}/${pathSegments[1]}`,
        ogTitle: `Asbestos Exposure Sites in ${cityName}, ${stateName} - Facilities`,
        ogDescription: `Directory of asbestos exposure sites in ${cityName}, ${stateName}. Find facilities where workers may have been exposed to asbestos.`,
        ogUrl: `${baseUrl}/${pathSegments[0]}/${pathSegments[1]}`,
        twitterTitle: `Asbestos Exposure Sites in ${cityName}, ${stateName} - Facilities`,
        twitterDescription: `Directory of asbestos exposure sites in ${cityName}, ${stateName}. Find facilities where workers may have been exposed to asbestos.`
      };
    }
    
    // Facility page: /florida/miami/facility-name-asbestos-exposure
    if (pathSegments.length === 3 && pathSegments[2].endsWith('-asbestos-exposure')) {
      const stateName = capitalizeWords(pathSegments[0].replace('-', ' '));
      const cityName = capitalizeWords(pathSegments[1].replace('-', ' '));
      const facilityName = capitalizeWords(pathSegments[2].replace('-asbestos-exposure', '').replace('-', ' '));
      
      return {
        title: `${facilityName} - Asbestos Exposure Site in ${cityName}, ${stateName}`,
        description: `Information about asbestos exposure at ${facilityName} in ${cityName}, ${stateName}. Learn about potential health risks and legal options for workers.`,
        keywords: `${facilityName} asbestos, ${facilityName} mesothelioma, asbestos exposure ${cityName}, ${facilityName} ${stateName}`,
        canonicalUrl: `${baseUrl}/${pathSegments[0]}/${pathSegments[1]}/${pathSegments[2]}`,
        ogTitle: `${facilityName} - Asbestos Exposure Site in ${cityName}, ${stateName}`,
        ogDescription: `Information about asbestos exposure at ${facilityName} in ${cityName}, ${stateName}. Learn about potential health risks and legal options for workers.`,
        ogUrl: `${baseUrl}/${pathSegments[0]}/${pathSegments[1]}/${pathSegments[2]}`,
        twitterTitle: `${facilityName} - Asbestos Exposure Site in ${cityName}, ${stateName}`,
        twitterDescription: `Information about asbestos exposure at ${facilityName} in ${cityName}, ${stateName}. Learn about potential health risks and legal options for workers.`
      };
    }
  } catch (error) {
    console.warn('Error generating client-side SEO metadata:', error);
  }
  
  // Fallback to homepage metadata
  return {
    title: "Asbestos Exposure Sites Directory - 87,000+ Documented Locations",
    description: "Comprehensive database of asbestos exposure sites across all 50 states. Find facilities where you may have been exposed to asbestos. Essential resource for mesothelioma patients and legal professionals.",
    keywords: "asbestos exposure, mesothelioma, lung cancer, asbestos sites, exposure locations, industrial facilities, shipyards, power plants, manufacturing",
    canonicalUrl: baseUrl,
    ogTitle: "Asbestos Exposure Sites Directory - 87,000+ Documented Locations",
    ogDescription: "Comprehensive database of asbestos exposure sites across all 50 states. Find facilities where you may have been exposed to asbestos.",
    ogUrl: baseUrl,
    twitterTitle: "Asbestos Exposure Sites Directory - 87,000+ Documented Locations",
    twitterDescription: "Comprehensive database of asbestos exposure sites across all 50 states. Find facilities where you may have been exposed to asbestos."
  };
}

/**
 * Helper function to capitalize words
 */
function capitalizeWords(str: string): string {
  return str.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}
