import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import BreadcrumbNav from "@/components/navigation/breadcrumb-nav";
import FacilityCard from "@/components/facilities/facility-card";
import AdSenseAd from "@/components/ads/adsense-ad";
import { Button } from "@/components/ui/button";
import type { CityWithState, FacilityWithRelations, ContentTemplate } from "@shared/schema";

export default function CityPage() {
  const [, params] = useRoute("/:stateSlug/:citySlug");
  const stateSlug = params?.stateSlug || "";
  const citySlug = params?.citySlug || "";



  const { data: city, isLoading: isLoadingCity } = useQuery({
    queryKey: ["/api/cities", stateSlug, citySlug],
    queryFn: async () => {
      const response = await fetch(`/api/cities/${stateSlug}/${citySlug}`);
      if (!response.ok) throw new Error("City not found");
      return response.json() as CityWithState;
    },
    enabled: !!(stateSlug && citySlug),
  });

  const { data: facilities = [], isLoading: isLoadingFacilities, error: facilitiesError } = useQuery({
    queryKey: ["/api/facilities", city?.id],
    queryFn: async () => {
      if (!city?.id) return [];
      console.log('Fetching facilities for city ID:', city.id);
      const response = await fetch(`/api/facilities?cityId=${city.id}&limit=1000`);
      console.log('Facilities API response:', response.status, response.statusText);
      if (!response.ok) throw new Error(`Failed to fetch facilities: ${response.status}`);
      const data = await response.json();
      console.log('Facilities data length:', data.length);
      return data as FacilityWithRelations[];
    },
    enabled: !!city?.id,
  });

  // Fetch city content template (adaptive)
  const { data: cityContent } = useQuery({
    queryKey: ["/api/content-templates", "city", `${citySlug}_content_adaptive`],
    queryFn: async () => {
      const response = await fetch(`/api/content-templates/city/${citySlug}_content_adaptive`);
      if (!response.ok) return null;
      return response.json() as ContentTemplate;
    },
    enabled: !!citySlug,
  });

  // Set document title and meta tags
  useEffect(() => {
    if (city) {
      document.title = `Asbestos Exposure Sites in ${city.name}, ${city.state.name}`;

      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', `Comprehensive directory of ${city.facilityCount} asbestos exposure sites in ${city.name}, ${city.state.name}. Find information about industrial facilities where workers may have been exposed to asbestos.`);
      }

      // Update meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', `asbestos exposure ${city.name}, mesothelioma ${city.name}, asbestos sites ${city.state.name}`);
    }
  }, [city]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  if (isLoadingCity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading city information...</p>
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">City Not Found</h1>
          <p className="text-muted-foreground">The requested city could not be found.</p>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: city.state.name, href: `/${city.state.slug}` },
    { label: city.name },
  ];



  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BreadcrumbNav items={breadcrumbItems} />

        <div className="mb-8">
          <h1 className="page-title mb-4">
            Asbestos Exposure Sites in {city.name}, {city.state.name}
          </h1>
          <p className="text-xl text-muted-foreground">
            There are <span className="font-semibold text-primary">{city.facilityCount?.toLocaleString() || 0} facilities</span> documented in {city.name}
          </p>
        </div>

        {/* Google AdSense Block */}
        <div className="bg-muted/20 border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 mb-8">
          <div className="text-center text-muted-foreground">
            <div className="text-sm font-medium mb-1">Advertisement</div>
            <div className="text-xs">Google AdSense code will be placed here</div>
            <div className="text-xs mt-2">728x90 Leaderboard or 320x50 Mobile Banner</div>
          </div>
        </div>

        {/* City Content Section */}
        <div className="bg-muted/30 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">About Asbestos Exposure in {city.name}</h2>

          {cityContent && cityContent.contentBlocks && cityContent.contentBlocks.length > 0 ? (
            <div className="text-muted-foreground">
              {cityContent.contentBlocks.map((block, index) => {
                const paragraphs = block.split('\n').filter(p => p.trim()).map(p => p.trim());
                return (
                  <div key={index}>
                    {paragraphs.map((paragraph, pIndex) => (
                      <p key={pIndex} className={pIndex > 0 ? "mt-4" : ""}>{paragraph}</p>
                    ))}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-muted-foreground">
              <p>Content is being generated for this city. Please check back soon.</p>
            </div>
          )}


        </div>

        {/* Facility Listings */}
        <div>
          {facilitiesError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800">Error loading facilities: {facilitiesError.message}</p>
            </div>
          )}
          {isLoadingFacilities ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading facilities...</p>
            </div>
          ) : facilities.length > 0 ? (
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                All {facilities.length} Documented Exposure Sites in {city.name}
              </h2>
              <div className="space-y-4">
                {facilities.map((facility, index) => (
                  <div key={facility.id} className={index === facilities.length - 1 ? "mb-0 sm:mb-6 last-facility-mobile" : ""}>
                    <FacilityCard
                      facility={facility}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">No facilities found in {city.name}.</p>
            </div>
          )}
        </div>

        {/* SEO Enhancement Section */}
        <SEOEnhancementSection city={city} />

        {/* Nearest Cities - positioned dynamically after content */}
        <RelatedCitiesSection city={city} />

        {/* Important Information Box */}
        <ImportantInfoBox city={city} />

        {/* Footer Ad */}
        <div className="mt-4 sm:mt-6 mb-0">
          <AdSenseAd 
            adSlot="3456789012"
            className="text-center"
            style={{ display: "block", minHeight: "60px" }}
          />
        </div>
      </div>
    </div>
  );
}

// Component for displaying SEO enhancement content
function SEOEnhancementSection({ city }: { city: CityWithState }) {
  // Fetch SEO enhancement content from API
  const { data: seoContent, isLoading: isLoadingSEO, error: seoError } = useQuery({
    queryKey: ["/api/content-templates", "city_seo_enhancement", `${city.slug}_seo_enhancement`],
    queryFn: async () => {
      console.log('Fetching SEO enhancement content for city:', city.slug);
      const response = await fetch(`/api/content-templates/city_seo_enhancement/${city.slug}_seo_enhancement`);
      console.log('SEO enhancement API response:', response.status, response.statusText);
      if (!response.ok) throw new Error(`Failed to fetch SEO content: ${response.status}`);
      const data = await response.json();
      console.log('SEO enhancement data:', data);
      return data as {contentBlocks: string[]};
    },
    enabled: !!city.slug,
  });

  // Show loading state
  if (isLoadingSEO) {
    return (
      <div className="mt-4 sm:mt-6 bg-muted/30 rounded-lg px-4 sm:px-6 pb-4 sm:pb-6 pt-4 sm:pt-6">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-full"></div>
            <div className="h-3 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state or no content
  if (seoError || !seoContent?.contentBlocks?.[0]) {
    return null; // Hide section if content not available
  }

  return (
    <div className="mt-4 sm:mt-6 bg-muted/30 rounded-lg px-4 sm:px-6 pb-4 sm:pb-6 pt-4 sm:pt-6">
      <h3 className="text-xl font-semibold mb-4">Industrial History & Exposure Context</h3>
      <div className="prose prose-sm max-w-none text-muted-foreground">
        <p>{seoContent.contentBlocks[0]}</p>
      </div>
    </div>
  );
}

// Component for displaying related cities - positioned dynamically after main content
function RelatedCitiesSection({ city }: { city: CityWithState }) {
  // Fetch related cities from API
  const { data: relatedCities = [], isLoading: isLoadingRelated, error: relatedError } = useQuery({
    queryKey: ["/api/cities", city.id, "related"],
    queryFn: async () => {
      console.log('Fetching related cities for city ID:', city.id);
      const response = await fetch(`/api/cities/${city.id}/related`);
      console.log('Related cities API response:', response.status, response.statusText);
      if (!response.ok) throw new Error(`Failed to fetch related cities: ${response.status}`);
      const data = await response.json();
      console.log('Related cities data:', data);
      return data as Array<{id: number, name: string, slug: string, facilityCount: number}>;
    },
    enabled: !!city.id,
  });

  // Show loading state
  if (isLoadingRelated) {
    return (
      <div className="mt-4 sm:mt-6 bg-muted/30 rounded-lg px-4 sm:px-6 pb-4 sm:pb-6 pt-4 sm:pt-6">
        <h3 className="text-xl font-semibold mb-4">Related Cities in {city.state.name}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <p className="text-muted-foreground">Loading related cities...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (relatedError) {
    console.error('Error loading related cities:', relatedError);
    return (
      <div className="mt-4 sm:mt-6 bg-muted/30 rounded-lg px-4 sm:px-6 pb-4 sm:pb-6 pt-4 sm:pt-6">
        <h3 className="text-xl font-semibold mb-4">Related Cities in {city.state.name}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <p className="text-red-800">Error loading related cities: {relatedError.message}</p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!relatedCities || relatedCities.length === 0) {
    return (
      <div className="mt-4 sm:mt-6 bg-muted/30 rounded-lg px-4 sm:px-6 pb-4 sm:pb-6 pt-4 sm:pt-6">
        <h3 className="text-xl font-semibold mb-4">Related Cities in {city.state.name}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <p className="text-muted-foreground">No related cities found.</p>
        </div>
      </div>
    );
  }

  // Show related cities
  return (
    <div className="mt-4 sm:mt-6 bg-muted/30 rounded-lg px-4 sm:px-6 pb-4 sm:pb-6 pt-4 sm:pt-6">
      <h3 className="text-xl font-semibold mb-4">Related Cities in {city.state.name}</h3>
      <p className="text-muted-foreground mb-6">
        Explore asbestos exposure sites in other cities within {city.state.name}, sorted by number of documented facilities.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedCities.map((relatedCity) => (
          <Link 
            key={relatedCity.id} 
            href={`/${city.state.slug}/${relatedCity.slug}`} 
            className="block p-4 bg-card rounded-lg border hover:border-primary transition-colors"
          >
            <h4 className="font-semibold text-primary">{relatedCity.name}</h4>
            <p className="text-sm text-muted-foreground">
              {relatedCity.facilityCount} documented facilities
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Component for Important Information Box with rotation
function ImportantInfoBox({ city }: { city: CityWithState }) {
  // Determine variation based on city ID
  const variationIndex = city.id % 3;
  
  const importantInfoVariations = [
    {
      heading: "Important Legal Information",
      text: `If you worked at any of the ${city.facilityCount || 0} facilities in ${city.name} and have been diagnosed with mesothelioma, lung cancer, or other asbestos-related diseases, you may be entitled to significant compensation.`,
      linkText: "Get free legal consultation for mesothelioma claims"
    },
    {
      heading: "Workers' Rights & Compensation",
      text: `Workers exposed to asbestos at ${city.name}'s ${city.facilityCount || 0} documented facilities may qualify for substantial settlements if diagnosed with asbestos-related illnesses including mesothelioma, asbestosis, or lung cancer.`,
      linkText: "Get free legal consultation for mesothelioma claims"
    },
    {
      heading: "Legal Help Available",
      text: `Have you or a loved one worked at facilities in ${city.name}? Those diagnosed with mesothelioma or asbestos-related diseases from workplace exposure may have valuable legal claims.`,
      linkText: "Get free legal consultation for mesothelioma claims"
    }
  ];

  const selectedVariation = importantInfoVariations[variationIndex];

  return (
    <div style={{ 
      background: '#fef3c7', 
      border: '1px solid #f59e0b', 
      borderRadius: '8px', 
      padding: '1.5rem', 
      marginBottom: '2rem',
      marginTop: '1rem'
    }}>
      <h3 style={{ 
        fontSize: '1.25rem', 
        fontWeight: 'bold', 
        color: '#92400e', 
        marginBottom: '0.5rem' 
      }}>
        {selectedVariation.heading}
      </h3>
      <p style={{ 
        color: '#92400e', 
        lineHeight: '1.6' 
      }}>
        {selectedVariation.text}{' '}
        <Link 
          href="/legal-help" 
          style={{ 
            color: '#92400e', 
            textDecoration: 'underline',
            fontWeight: 'bold'
          }}
        >
          {selectedVariation.linkText}
        </Link>
        .
      </p>
    </div>
  );
}
