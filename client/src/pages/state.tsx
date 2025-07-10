import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import AdSenseAd from "@/components/ads/adsense-ad";

import BreadcrumbNav from "@/components/navigation/breadcrumb-nav";
import CityPills from "@/components/navigation/city-pills";
import FacilityCard from "@/components/facilities/facility-card";
import type { StateWithCities, FacilityWithRelations, Category, ContentTemplate } from "@shared/schema";

export default function StatePage() {
  const [, params] = useRoute("/:stateSlug");
  const stateSlug = params?.stateSlug || "";
  
  // Get URL parameters for filtering
  const urlParams = new URLSearchParams(window.location.search);
  const typeFilter = urlParams.get('type') || '';
  


  const { data: state, isLoading: isLoadingState } = useQuery({
    queryKey: ["/api/states", stateSlug],
    queryFn: async () => {
      const response = await fetch(`/api/states/${stateSlug}`);
      if (!response.ok) throw new Error("State not found");
      return response.json() as StateWithCities;
    },
    enabled: !!stateSlug,
  });

  const { data: allFacilities = [], isLoading: isLoadingFacilities } = useQuery({
    queryKey: ["/api/facilities", state?.id],
    queryFn: async () => {
      if (!state?.id) return [];
      const response = await fetch(`/api/facilities?stateId=${state.id}&limit=1000`);
      if (!response.ok) throw new Error("Failed to fetch facilities");
      return response.json() as FacilityWithRelations[];
    },
    enabled: !!state?.id,
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json() as Category[];
    },
  });

  // Fetch state content template
  const { data: stateContent } = useQuery({
    queryKey: ["/api/content-templates", "state", `${stateSlug}_state_content`],
    queryFn: async () => {
      const response = await fetch(`/api/content-templates/state/${stateSlug}_state_content`);
      if (!response.ok) return null;
      return response.json() as ContentTemplate;
    },
    enabled: !!stateSlug,
  });

  // Get top categories with facilities in this state
  const topCategories = categories.filter(cat => {
    const count = allFacilities.filter(f => f.category?.id === cat.id).length;
    return count > 0;
  }).slice(0, 4).map(cat => ({
    ...cat,
    facilityCount: allFacilities.filter(f => f.category?.id === cat.id).length
  }));

  // Filter facilities based on URL parameters
  const facilities = allFacilities.filter(facility => {
    if (!typeFilter) return true;
    return facility.facilityType === typeFilter;
  });

  // Set document title and meta tags
  useEffect(() => {
    if (state) {
      document.title = `Asbestos Exposure Sites in ${state.name}`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', `Comprehensive directory of asbestos exposure sites in ${state.name}. Find facilities where workers may have been exposed to asbestos across ${state.cities.length} cities.`);
      }
      
      // Update meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', `asbestos exposure ${state.name}, mesothelioma ${state.name}, asbestos sites`);
    }
  }, [state]);



  if (isLoadingState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading state information...</p>
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">State Not Found</h1>
          <p className="text-muted-foreground">The requested state could not be found.</p>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: state.name },
  ];



  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BreadcrumbNav items={breadcrumbItems} />

        <div className="mb-8">
          <h1 className="page-title mb-4">
            {typeFilter ? `${typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1).replace('-', ' ')} Facilities in ${state.name}` : `Asbestos Exposure Sites in ${state.name}`}
          </h1>
          <p className="text-xl text-muted-foreground">
            {typeFilter ? (
              <>
                Showing <span className="font-semibold text-primary">{facilities.length} {typeFilter.replace('-', ' ')} facilities</span> in {state.name}
                <button 
                  onClick={() => window.location.href = `/${state.slug}`}
                  className="ml-4 text-primary hover:underline"
                >
                  View all facilities
                </button>
              </>
            ) : (
              <>
                There are <span className="font-semibold text-primary">{state.facilityCount?.toLocaleString() || 0} facilities</span> for you to review across <span className="font-semibold text-primary">{state.cities.length} cities and towns</span>
              </>
            )}
          </p>
        </div>

        {/* State Content Section */}
        {stateContent && stateContent.contentBlocks && stateContent.contentBlocks.length > 0 && (
          <div className="mb-8 bg-muted/30 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">About Asbestos Exposure in {state.name}</h2>
            <div className="text-muted-foreground">
              {stateContent.contentBlocks.map((block, index) => {
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
          </div>
        )}

        {/* Complete City Directory Section */}
        {state.cities.length > 0 && (
          <div className="mb-12 bg-muted/30 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">Browse Exposure Sites by City in {state.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {state.cities
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((city) => (
                  <Link 
                    key={city.id} 
                    href={`/${state.slug}/${city.slug}`}
                    className="block p-3 bg-card rounded-lg hover:bg-muted transition-colors border hover:border-primary"
                  >
                    <div className="text-primary font-medium">
                      {city.name} ({city.facilityCount || 0})
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* Simplified City Navigation Widget */}
        <section className="mb-16">
          <div className="bg-card rounded-xl border p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Browse Cities in {state.name}</h2>
            <div className="max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium mb-2">Select City</label>
                <select 
                  className="w-full p-3 border rounded-lg bg-background"
                  onChange={(e) => {
                    if (e.target.value) {
                      window.location.href = `/${state.slug}/${e.target.value}`;
                    }
                  }}
                >
                  <option value="">All Cities</option>
                  {state.cities.map((city) => (
                    <option key={city.id} value={city.slug}>{city.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Facility Type Overview - Using Home Page Style Blocks */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{fontFamily: 'Merriweather, serif', color: 'hsl(var(--professional-gray))'}}>
            Facility Types in {state.name}
          </h2>
          {isLoadingCategories ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading facility types...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topCategories.map((category, index) => {
                const categoryIcons = {
                  'Manufacturing': '🏭',
                  'Commercial Buildings': '🏢',
                  'Power Plants': '⚡',
                  'Shipyards': '🚢',
                  'Government': '🏛️',
                  'Hospitals': '🏥',
                  'Schools': '🎓',
                  'Transportation': '🚆',
                  'Residential': '🏘️'
                };
                
                const categoryDescriptions = {
                  'Manufacturing': 'Industrial manufacturing plants that used asbestos extensively in production processes, equipment, and building materials.',
                  'Commercial Buildings': 'Office buildings and commercial structures built with asbestos-containing construction materials.',
                  'Power Plants': 'Electric power generation facilities where asbestos was used extensively in turbines, boilers, and insulation systems.',
                  'Shipyards': 'Naval and commercial shipbuilding facilities where workers were exposed to asbestos in ship construction and repair.',
                  'Government': 'Government facilities and buildings where workers and personnel were exposed to asbestos.',
                  'Hospitals': 'Medical facilities where asbestos was used in construction materials and equipment.',
                  'Schools': 'Educational institutions built with asbestos-containing materials in construction and maintenance.',
                  'Transportation': 'Transportation facilities including railways, airports, and vehicle manufacturing where asbestos was used.',
                  'Residential': 'Residential buildings and apartment complexes where asbestos-containing materials were used in construction.'
                };
                
                return (
                  <Link key={category.slug} href={`/${state.slug}/category/${category.slug}`}>
                    <div className="medical-card group h-full cursor-pointer hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start space-x-6 mb-6">
                        <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                             style={{backgroundColor: `hsl(var(--medical-teal) / ${0.1 + (index % 3) * 0.05})`}}>
                          {categoryIcons[category.name] || '🏢'}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2 group-hover:opacity-80 transition-opacity" 
                              style={{fontFamily: 'Merriweather, serif', color: 'hsl(var(--professional-gray))'}}>
                            {category.name}
                          </h3>
                          <p className="text-sm font-medium" style={{color: 'hsl(var(--medical-teal))'}}>
                            {category.facilityCount} facilities in {state.name}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-base leading-relaxed mb-6" style={{color: 'hsl(var(--professional-gray-light))'}}>
                        {categoryDescriptions[category.name] || 'Industrial facilities where workers were exposed to asbestos-containing materials.'}
                      </p>
                      
                      <div className="mt-auto pt-4">
                        <span className="text-base font-semibold group-hover:underline transition-all inline-flex items-center"
                              style={{color: 'hsl(var(--medical-teal))'}}>
                          Explore {category.name}
                          <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>


      </div>


    </div>
  );
}
