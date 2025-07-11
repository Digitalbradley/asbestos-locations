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

        {/* Nearest Cities - positioned dynamically after content */}
        <NearestCitiesSection city={city} />

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

// Component for displaying nearest cities - positioned dynamically after main content
function NearestCitiesSection({ city }: { city: CityWithState }) {
  // For now, let's hardcode some example nearest cities for Florida
  const nearestCities = [
    { id: 16, name: "Fort Lauderdale", slug: "fort-lauderdale", distance: 15.5, facilityCount: 21 },
    { id: 18, name: "Saint Petersburg", slug: "saint-petersburg", distance: 31.0, facilityCount: 19 },
    { id: 20, name: "Port Saint Lucie", slug: "port-saint-lucie", distance: 46.5, facilityCount: 6 },
    { id: 21, name: "Cape Coral", slug: "cape-coral", distance: 62.0, facilityCount: 5 },
    { id: 24, name: "Miramar", slug: "miramar", distance: 77.5, facilityCount: 7 },
    { id: 25, name: "Coral Springs", slug: "coral-springs", distance: 93.0, facilityCount: 0 },
    { id: 28, name: "Pompano Beach", slug: "pompano-beach", distance: 108.5, facilityCount: 8 },
    { id: 31, name: "Davie", slug: "davie", distance: 124.0, facilityCount: 0 },
    { id: 34, name: "Deltona", slug: "deltona", distance: 139.5, facilityCount: 0 },
    { id: 35, name: "North Miami Beach", slug: "north-miami-beach", distance: 155.0, facilityCount: 2 }
  ];

  if (city.state.name !== 'Florida') {
    return null;
  }

  return (
    <div className="mt-4 sm:mt-6 bg-muted/30 rounded-lg px-4 sm:px-6 pb-4 sm:pb-6 pt-4 sm:pt-6">
      <h3 className="text-xl font-semibold mb-4">Ten Nearest Cities to {city.name}</h3>
      <p className="text-muted-foreground mb-6">
        Explore asbestos exposure sites in nearby cities within {city.state.name}, sorted by distance from {city.name}.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nearestCities.map((nearbyCity) => (
          <Link 
            key={nearbyCity.id} 
            href={`/${city.state.slug}/${nearbyCity.slug}`} 
            className="block p-4 bg-card rounded-lg border hover:border-primary transition-colors"
          >
            <h4 className="font-semibold text-primary">{nearbyCity.name}</h4>
            <p className="text-sm text-muted-foreground">
              {nearbyCity.facilityCount} documented facilities
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {nearbyCity.distance} miles from {city.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
