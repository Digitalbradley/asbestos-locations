import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import BreadcrumbNav from "@/components/navigation/breadcrumb-nav";
import FacilityCard from "@/components/facilities/facility-card";
import { Button } from "@/components/ui/button";
import type { StateWithCities, FacilityWithRelations } from "@shared/schema";

// Define comprehensive category information with detailed content
const categoryInfo: Record<string, { 
  name: string; 
  description: string; 
  slug: string;
  historicalContext: string;
  exposureSources: string[];
  healthRisks: string;
  legalContext: string;
  peakUseYears: string;
  commonProducts: string[];
}> = {
  "manufacturing": {
    name: "Manufacturing",
    description: "Industrial manufacturing plants that used asbestos extensively in production processes, equipment, and building materials.",
    slug: "manufacturing",
    historicalContext: "From the 1940s through the 1980s, asbestos was extensively used in manufacturing facilities across the United States. The mineral's heat-resistant and fire-retardant properties made it ideal for industrial applications, particularly in high-temperature manufacturing processes. Manufacturing workers faced some of the highest asbestos exposure levels in American industry, with many facilities using asbestos-containing materials in machinery, insulation, and protective equipment.",
    exposureSources: [
      "Boiler and furnace insulation",
      "Pipe and steam system lagging",
      "Gaskets, packing, and seals",
      "Protective clothing and gloves",
      "Ceiling tiles and wall materials",
      "Electrical equipment insulation",
      "Brake linings and clutch facings",
      "Roofing and flooring materials"
    ],
    healthRisks: "Manufacturing workers faced particularly high asbestos exposure risks due to the industrial nature of their work environment. Daily exposure to airborne asbestos fibers occurred during routine operations, maintenance, and repair activities. The concentration of asbestos in manufacturing facilities was often significantly higher than in other industries, leading to increased rates of mesothelioma, lung cancer, and asbestosis among workers.",
    legalContext: "Manufacturing companies have faced extensive litigation for asbestos exposure. Many major manufacturers have been held liable for failing to warn workers about asbestos dangers and for continuing to use asbestos-containing materials despite known health risks. Significant settlements and jury awards have been obtained for manufacturing workers and their families.",
    peakUseYears: "1940s-1980s",
    commonProducts: [
      "Asbestos cement products",
      "Friction materials (brakes, clutches)",
      "Gaskets and sealing materials",
      "Insulation products",
      "Protective equipment"
    ]
  },
  "power-plants": {
    name: "Power Plants",
    description: "Electric power generation facilities where asbestos was used extensively in turbines, boilers, and insulation systems.",
    slug: "power-plants",
    historicalContext: "Power plants constructed between 1940 and 1980 extensively used asbestos due to its exceptional heat resistance and insulating properties. Both coal-fired and nuclear power plants relied heavily on asbestos-containing materials in their construction and operation. The high-temperature environment of power generation made asbestos seemingly ideal for protecting equipment and workers from extreme heat, leading to widespread use throughout these facilities.",
    exposureSources: [
      "Boiler and turbine insulation",
      "Steam pipe lagging and coverings",
      "Electrical switchgear and panels",
      "Cooling tower components",
      "Gaskets and valve packing",
      "Fireproofing materials",
      "Protective clothing and blankets",
      "Ceiling tiles and wall panels"
    ],
    healthRisks: "Power plant workers experienced significant asbestos exposure during construction, maintenance, and repair operations. The enclosed nature of power plant facilities meant that asbestos fibers could become concentrated in the air, creating dangerous working conditions. Workers involved in boiler maintenance, turbine repair, and insulation work faced the highest exposure risks.",
    legalContext: "Utility companies and power plant operators have faced substantial litigation for asbestos exposure. Many cases have resulted in significant verdicts and settlements for workers who developed mesothelioma, lung cancer, and other asbestos-related diseases. The documented use of asbestos in power plants has provided strong evidence in legal proceedings.",
    peakUseYears: "1940s-1980s",
    commonProducts: [
      "Turbine insulation blankets",
      "Boiler block insulation",
      "Pipe covering materials",
      "Electrical panel linings",
      "Cooling system components"
    ]
  },
  "shipyards": {
    name: "Shipyards",
    description: "Naval and commercial shipbuilding facilities where workers were exposed to asbestos in ship construction and repair.",
    slug: "shipyards",
    historicalContext: "Shipyards were among the most hazardous workplaces for asbestos exposure in the United States. From World War II through the 1980s, virtually every U.S. Navy ship and many commercial vessels were constructed with extensive asbestos-containing materials. The confined spaces of ships, combined with the need for fire protection and insulation, created environments where asbestos was used liberally throughout vessel construction and repair.",
    exposureSources: [
      "Ship insulation and lagging",
      "Boiler and engine room materials",
      "Pipe covering and wrapping",
      "Gaskets and packing materials",
      "Deck compounds and sealants",
      "Fireproofing materials",
      "Electrical insulation",
      "Ventilation system components"
    ],
    healthRisks: "Shipyard workers faced some of the highest asbestos exposure levels of any industry. The enclosed nature of ship construction meant that asbestos fibers could become highly concentrated in work areas. Workers in engine rooms, boiler rooms, and other mechanical spaces experienced particularly dangerous exposure levels during both construction and repair operations.",
    legalContext: "Shipyard asbestos cases have resulted in some of the largest verdicts and settlements in asbestos litigation history. The extensive documentation of asbestos use in naval and commercial shipbuilding has provided substantial evidence for legal claims. Many major shipbuilders and the U.S. Navy have faced significant liability for asbestos exposure.",
    peakUseYears: "1940s-1980s",
    commonProducts: [
      "Ship insulation materials",
      "Boiler room components",
      "Pipe lagging materials",
      "Deck sealants and compounds",
      "Electrical system insulation"
    ]
  },
  "commercial-buildings": {
    name: "Commercial Buildings",
    description: "Office buildings and commercial structures built with asbestos-containing construction materials.",
    slug: "commercial-buildings",
    historicalContext: "Commercial buildings constructed between 1940 and 1980 commonly incorporated asbestos-containing materials due to their fire-resistant properties and cost-effectiveness. Office buildings, retail spaces, and other commercial structures used asbestos in various construction applications, from structural fireproofing to decorative ceiling tiles.",
    exposureSources: [
      "Ceiling tiles and acoustic materials",
      "Floor tiles and adhesives",
      "Spray-applied fireproofing",
      "Pipe and boiler insulation",
      "Roofing materials and sealants",
      "Wall panels and partitions",
      "Electrical components",
      "HVAC system insulation"
    ],
    healthRisks: "Workers in commercial buildings faced asbestos exposure during construction, renovation, and maintenance activities. Building maintenance staff, construction workers, and renovation crews were at highest risk, particularly when disturbing asbestos-containing materials during repair or demolition work.",
    legalContext: "Commercial building owners and contractors have faced liability for asbestos exposure in workplace environments. Legal cases have focused on duty to warn occupants and workers about asbestos presence and failure to properly manage asbestos-containing materials during building operations.",
    peakUseYears: "1940s-1980s",
    commonProducts: [
      "Ceiling and floor tiles",
      "Spray-applied fireproofing",
      "Pipe and duct insulation",
      "Roofing and siding materials",
      "Joint compounds and adhesives"
    ]
  },
  "government": {
    name: "Government",
    description: "Government facilities and buildings where workers and personnel were exposed to asbestos.",
    slug: "government",
    historicalContext: "Government facilities, including military bases, federal buildings, and public institutions, extensively used asbestos-containing materials from the 1940s through the 1980s. The federal government was one of the largest consumers of asbestos products, using them in construction and maintenance of public buildings, military installations, and government infrastructure.",
    exposureSources: [
      "Building insulation and fireproofing",
      "Boiler and mechanical room materials",
      "Ceiling and floor tiles",
      "Pipe covering and lagging",
      "Electrical system components",
      "Roofing and siding materials",
      "Military equipment and vehicles",
      "Maintenance and repair materials"
    ],
    healthRisks: "Government workers, military personnel, and contractors faced asbestos exposure in federal facilities and installations. Maintenance workers, construction crews, and military personnel working in mechanical spaces experienced the highest exposure levels during routine operations and facility maintenance.",
    legalContext: "The federal government has faced extensive litigation for asbestos exposure in federal facilities and military installations. While sovereign immunity provides some protection, many cases have been successful under the Federal Tort Claims Act and other legal theories addressing government liability for asbestos exposure.",
    peakUseYears: "1940s-1980s",
    commonProducts: [
      "Federal building construction materials",
      "Military equipment insulation",
      "Infrastructure components",
      "Maintenance and repair supplies",
      "Protective equipment"
    ]
  },
  "hospitals": {
    name: "Hospitals",
    description: "Medical facilities where asbestos was used in construction materials and equipment.",
    slug: "hospitals",
    historicalContext: "Hospitals and medical facilities built between 1940 and 1980 commonly used asbestos-containing materials for fire protection and insulation. The critical nature of hospital operations made fire-resistant materials essential, leading to widespread use of asbestos in medical facility construction and equipment.",
    exposureSources: [
      "Boiler and mechanical room insulation",
      "Ceiling tiles and wall materials",
      "Pipe covering and lagging",
      "Electrical equipment insulation",
      "Floor tiles and adhesives",
      "Roofing and fireproofing materials",
      "HVAC system components",
      "Laboratory equipment insulation"
    ],
    healthRisks: "Hospital workers, maintenance staff, and construction personnel faced asbestos exposure during building operations, maintenance, and renovation activities. The enclosed nature of hospital mechanical systems and the need for continuous operation created environments where asbestos exposure could occur during routine maintenance.",
    legalContext: "Hospital systems and medical facility operators have faced liability for asbestos exposure to workers and contractors. Legal cases have focused on duty to protect workers during maintenance and renovation activities in medical facilities containing asbestos materials.",
    peakUseYears: "1940s-1980s",
    commonProducts: [
      "Medical facility construction materials",
      "Boiler and mechanical insulation",
      "Ceiling and floor systems",
      "Laboratory equipment components",
      "HVAC system materials"
    ]
  },
  "schools": {
    name: "Schools",
    description: "Educational institutions built with asbestos-containing materials in construction and maintenance.",
    slug: "schools",
    historicalContext: "Schools constructed between 1940 and 1980 extensively used asbestos-containing materials due to their fire-resistant properties and cost-effectiveness. Educational facilities from elementary schools to universities incorporated asbestos in various building components, creating potential exposure risks for students, teachers, and maintenance workers.",
    exposureSources: [
      "Ceiling tiles and acoustic materials",
      "Floor tiles and adhesives",
      "Pipe and boiler insulation",
      "Roofing materials and sealants",
      "Wall panels and partitions",
      "Electrical components",
      "HVAC system insulation",
      "Science laboratory equipment"
    ],
    healthRisks: "School personnel, maintenance workers, and contractors faced asbestos exposure during building operations, maintenance, and renovation activities. Custodial staff and maintenance workers were at highest risk, particularly when working in mechanical rooms and during repair activities that disturbed asbestos-containing materials.",
    legalContext: "School districts and educational institutions have faced liability for asbestos exposure in school buildings. Legal cases have focused on duty to protect workers and occupants from asbestos exposure and proper management of asbestos-containing materials in educational facilities.",
    peakUseYears: "1940s-1980s",
    commonProducts: [
      "School building construction materials",
      "Ceiling and floor tiles",
      "Boiler and mechanical insulation",
      "Science laboratory components",
      "HVAC system materials"
    ]
  }
};

export default function CategoryPage() {
  const [, params] = useRoute("/:stateSlug/category/:categorySlug");
  const stateSlug = params?.stateSlug || "";
  const categorySlug = params?.categorySlug || "";
  
  const category = categoryInfo[categorySlug];

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const { data: state, isLoading: isLoadingState } = useQuery({
    queryKey: ["/api/states", stateSlug],
    queryFn: async () => {
      const response = await fetch(`/api/states/${stateSlug}`);
      if (!response.ok) throw new Error("State not found");
      return response.json() as StateWithCities;
    },
    enabled: !!stateSlug,
  });

  // Get facility count for this category in this state
  const { data: facilityCount = 0, isLoading: isLoadingFacilities } = useQuery({
    queryKey: ["/api/facilities/count", stateSlug, categorySlug],
    queryFn: async () => {
      if (!state?.id) return 0;
      const response = await fetch(`/api/facilities/count?stateId=${state.id}&categorySlug=${categorySlug}`);
      if (!response.ok) throw new Error("Failed to fetch facility count");
      const data = await response.json();
      return data.count || 0;
    },
    enabled: !!state?.id && !!categorySlug,
  });

  // Set document title and meta tags
  useEffect(() => {
    if (state && category) {
      document.title = `${category.name} Asbestos Exposure Sites in ${state.name}`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', `Directory of ${category.name.toLowerCase()} asbestos exposure sites in ${state.name}. ${category.description}`);
      }
      
      // Update meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', `${category.name} asbestos exposure ${state.name}, ${category.slug} mesothelioma, ${category.slug} asbestos sites`);
    }
  }, [state, category]);

  if (isLoadingState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading category information...</p>
        </div>
      </div>
    );
  }

  if (!state || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground">The requested category could not be found.</p>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: state.name, href: `/${state.slug}` },
    { label: category.name },
  ];

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BreadcrumbNav items={breadcrumbItems} />

        <div className="mb-8">
          <h1 className="page-title mb-4">
            {category.name} Asbestos Exposure Sites in {state.name}
          </h1>
          <p className="text-xl text-muted-foreground">
            There are <span className="font-semibold text-primary">{facilityCount} {category.name.toLowerCase()} facilities</span> documented in {state.name}
          </p>
        </div>

        {/* Category Overview */}
        <div className="bg-muted/30 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">About {category.name} Asbestos Exposure</h2>
          
          {/* Historical Context */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-primary">Historical Context ({category.peakUseYears})</h3>
            <p className="text-muted-foreground leading-relaxed">
              {category.historicalContext}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary">Common Exposure Sources</h3>
              <ul className="text-muted-foreground space-y-2">
                {category.exposureSources.map((source, index) => (
                  <li key={index}>• {source}</li>
                ))}
              </ul>
              
              <h3 className="text-lg font-semibold mb-4 mt-6 text-primary">Common Asbestos Products</h3>
              <ul className="text-muted-foreground space-y-2">
                {category.commonProducts.map((product, index) => (
                  <li key={index}>• {product}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary">Health Risks</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {category.healthRisks}
              </p>
              
              <h3 className="text-lg font-semibold mb-4 text-primary">Legal Context</h3>
              <p className="text-muted-foreground leading-relaxed">
                {category.legalContext}
              </p>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="mt-8 p-6 bg-primary/10 rounded-lg border border-primary/20">
            <h3 className="text-lg font-semibold mb-3 text-primary">Need Legal Help?</h3>
            <p className="text-muted-foreground mb-4">
              If you or a loved one worked at any {category.name.toLowerCase()} facility in {state.name} and later developed 
              an asbestos-related disease, you may be entitled to compensation. Contact an experienced mesothelioma attorney 
              to discuss your legal options.
            </p>
            <Link href="/legal-help">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Get Free Legal Consultation
              </Button>
            </Link>
          </div>
        </div>

        {/* Internal Linking Strategy - City Navigation */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{category.name} Facilities by City in {state.name}</h2>
          <div className="bg-muted/30 rounded-lg p-6">
            <p className="text-muted-foreground mb-4">
              Explore {category.name.toLowerCase()} asbestos exposure sites in major cities across {state.name}. 
              Each city page contains detailed facility listings and location-specific information.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {state.cities?.slice(0, 12).map((city) => (
                <Link
                  key={city.id}
                  href={`/${state.slug}/${city.slug}`}
                  className="block p-3 bg-card rounded-lg border hover:border-primary hover:shadow-md transition-all duration-300 group"
                >
                  <h4 className="font-medium text-primary group-hover:underline">{city.name}</h4>
                  <p className="text-sm text-muted-foreground">{city.facilityCount} facilities</p>
                </Link>
              ))}
            </div>
            {state.cities && state.cities.length > 12 && (
              <div className="mt-4 text-center">
                <Link href={`/${state.slug}`} className="text-primary hover:underline font-medium">
                  View all {state.cities.length} cities in {state.name} →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Industry-Specific Resources */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Additional Resources for {category.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-primary">Legal Considerations</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>• Statute of limitations varies by state</li>
                <li>• Multiple liable parties may exist</li>
                <li>• Compensation may include medical costs</li>
                <li>• Family members may have claims</li>
              </ul>
            </div>
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-primary">Documentation Needed</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>• Employment records and dates</li>
                <li>• Medical diagnoses and reports</li>
                <li>• Witness statements if available</li>
                <li>• Company safety records</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Content Ad */}
        <div className="my-12">
          <div className="bg-muted/20 border-2 border-dashed border-muted-foreground/30 rounded-lg p-6">
            <div className="text-center text-muted-foreground">
              <div className="text-sm font-medium mb-1">Advertisement</div>
              <div className="text-xs">AdSense Content Banner</div>
              <div className="text-xs mt-2">728x90 Leaderboard</div>
            </div>
          </div>
        </div>

        {/* Other Categories - Beautiful Home Page Style */}
        <div className="mt-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6" style={{fontFamily: 'Merriweather, serif', color: 'hsl(var(--professional-gray))'}}>
              Other Facility Types in {state.name}
            </h2>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{color: 'hsl(var(--professional-gray-light))'}}>
              Explore other types of asbestos exposure sites throughout {state.name}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(categoryInfo).map(([slug, info]) => 
              slug !== categorySlug && (
                <Link
                  key={slug}
                  href={`/${state.slug}/category/${slug}`}
                  className="block medical-card group cursor-pointer transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-6 transition-all duration-300 group-hover:scale-110"
                       style={{backgroundColor: 'hsl(var(--medical-teal) / 0.1)'}}>
                    <div className="text-2xl">
                      {slug === 'manufacturing' && '🏭'}
                      {slug === 'commercial-buildings' && '🏢'}
                      {slug === 'power-plants' && '⚡'}
                      {slug === 'shipyards' && '🚢'}
                      {slug === 'government' && '🏛️'}
                      {slug === 'hospitals' && '🏥'}
                      {slug === 'schools' && '🎓'}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-center group-hover:text-primary transition-colors" 
                      style={{fontFamily: 'Merriweather, serif', color: 'hsl(var(--professional-gray))'}}>
                    {info.name}
                  </h3>
                  <p className="text-center leading-relaxed" style={{color: 'hsl(var(--professional-gray-light))'}}>
                    {info.description}
                  </p>
                  <div className="text-center mt-6">
                    <button className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 group-hover:shadow-lg"
                            style={{
                              backgroundColor: 'hsl(var(--medical-teal))',
                              color: 'white'
                            }}>
                      Explore {info.name}
                    </button>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}