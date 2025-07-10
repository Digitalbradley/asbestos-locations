import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, MapPin, Calendar, AlertTriangle, Users, FileText, Phone, Mail } from "lucide-react";
import type { StateWithCities } from "@shared/schema";

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
    description: "Office buildings, retail spaces, and commercial facilities constructed with asbestos-containing materials.",
    slug: "commercial-buildings",
    historicalContext: "Commercial buildings constructed between 1940 and 1980 commonly incorporated asbestos-containing materials due to their fire-resistant properties and cost-effectiveness. Office buildings, retail spaces, and commercial facilities extensively used asbestos in construction materials, creating potential exposure risks for workers, tenants, and maintenance personnel.",
    exposureSources: [
      "Ceiling tiles and acoustic panels",
      "Floor tiles and adhesives",
      "Pipe and boiler insulation",
      "Roofing materials and sealants",
      "Wall panels and partitions",
      "Electrical components",
      "HVAC system insulation",
      "Fireproofing spray materials"
    ],
    healthRisks: "Commercial building workers, maintenance staff, and construction personnel faced asbestos exposure during building operations, maintenance, and renovation activities. Custodial staff and maintenance workers were at highest risk, particularly when working in mechanical rooms and during repair activities that disturbed asbestos-containing materials.",
    legalContext: "Building owners and commercial property managers have faced liability for asbestos exposure in commercial buildings. Legal cases have focused on duty to protect workers and tenants from asbestos exposure and proper management of asbestos-containing materials in commercial facilities.",
    peakUseYears: "1940s-1980s",
    commonProducts: [
      "Commercial building construction materials",
      "Ceiling and floor tiles",
      "Boiler and mechanical insulation",
      "Fireproofing spray materials",
      "HVAC system components"
    ]
  },
  "government": {
    name: "Government",
    description: "Federal, state, and local government facilities including military bases and public buildings.",
    slug: "government",
    historicalContext: "Government facilities constructed between 1940 and 1980 extensively used asbestos-containing materials in public buildings, military installations, and federal facilities. The government's own use of asbestos in construction projects and military applications created significant exposure risks for federal employees, military personnel, and contractors working on government properties.",
    exposureSources: [
      "Military barracks and housing",
      "Government office buildings",
      "Federal facility construction",
      "Military vehicle components",
      "Ship and aircraft insulation",
      "Base maintenance facilities",
      "Public building materials",
      "Equipment and machinery"
    ],
    healthRisks: "Government employees, military personnel, and contractors faced asbestos exposure in federal facilities and military installations. Veterans who served during peak asbestos use periods faced particularly high exposure risks, especially those in naval service and military construction roles.",
    legalContext: "The federal government has faced extensive litigation for asbestos exposure in military and civilian facilities. Veterans' benefits programs have recognized asbestos-related diseases as service-connected conditions, and numerous lawsuits have been filed against government contractors and military suppliers.",
    peakUseYears: "1940s-1980s",
    commonProducts: [
      "Military construction materials",
      "Government building components",
      "Military equipment insulation",
      "Base infrastructure materials",
      "Federal facility construction"
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
  },
  "transportation": {
    name: "Transportation",
    description: "Transportation facilities including airports, railway stations, and transit systems where asbestos was used.",
    slug: "transportation",
    historicalContext: "Transportation facilities constructed between 1940 and 1980 used asbestos-containing materials in terminals, maintenance facilities, and vehicles. Airports, railway stations, and transit systems incorporated asbestos for fire protection and insulation in both infrastructure and transportation equipment.",
    exposureSources: [
      "Terminal building materials",
      "Maintenance facility insulation",
      "Vehicle brake and clutch components",
      "Railway equipment insulation",
      "Airport hangar materials",
      "Transit system components",
      "Maintenance shop materials",
      "Infrastructure insulation"
    ],
    healthRisks: "Transportation workers, maintenance personnel, and construction staff faced asbestos exposure during facility operations, vehicle maintenance, and infrastructure work. Mechanics and maintenance workers were at highest risk due to direct contact with asbestos-containing vehicle components and building materials.",
    legalContext: "Transportation authorities and equipment manufacturers have faced liability for asbestos exposure in transportation facilities and vehicles. Legal cases have focused on exposure during maintenance operations and the use of asbestos-containing materials in transportation infrastructure.",
    peakUseYears: "1940s-1980s",
    commonProducts: [
      "Transportation facility materials",
      "Vehicle brake and clutch components",
      "Terminal building insulation",
      "Maintenance facility materials",
      "Railway equipment components"
    ]
  },
  "residential": {
    name: "Residential",
    description: "Residential buildings and housing complexes where asbestos was used in construction materials.",
    slug: "residential",
    historicalContext: "Residential buildings constructed between 1940 and 1980 commonly used asbestos-containing materials in various construction applications. Apartment complexes, condominiums, and residential developments incorporated asbestos for fire protection, insulation, and cost-effectiveness in building construction.",
    exposureSources: [
      "Ceiling tiles and acoustic materials",
      "Floor tiles and adhesives",
      "Pipe and boiler insulation",
      "Roofing materials and shingles",
      "Wall panels and siding",
      "Electrical components",
      "HVAC system insulation",
      "Basement and garage materials"
    ],
    healthRisks: "Residential maintenance workers, construction personnel, and building contractors faced asbestos exposure during building operations, maintenance, and renovation activities. Maintenance staff and contractors were at highest risk during repair and renovation work that disturbed asbestos-containing materials.",
    legalContext: "Property owners and building managers have faced liability for asbestos exposure in residential buildings. Legal cases have focused on duty to protect workers and residents from asbestos exposure during maintenance and renovation activities in residential facilities.",
    peakUseYears: "1940s-1980s",
    commonProducts: [
      "Residential building materials",
      "Ceiling and floor tiles",
      "Boiler and mechanical insulation",
      "Roofing and siding materials",
      "HVAC system components"
    ]
  }
};

export default function CategoryGlobalPage() {
  const [, params] = useRoute("/category/:categorySlug");
  const categorySlug = params?.categorySlug || "";
  
  const category = categoryInfo[categorySlug];

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get all states for internal linking
  const { data: states = [] } = useQuery({
    queryKey: ["/api/states"],
    queryFn: async () => {
      const response = await fetch("/api/states");
      if (!response.ok) throw new Error("Failed to fetch states");
      return response.json() as StateWithCities[];
    },
  });

  // Set document title and meta tags
  useEffect(() => {
    if (category) {
      document.title = `${category.name} Asbestos Exposure Sites | Comprehensive Directory`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', `Comprehensive directory of ${category.name.toLowerCase()} asbestos exposure sites across the United States. ${category.description} Find legal help for mesothelioma victims.`);
      }
      
      // Update meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', `${category.name} asbestos exposure, ${category.slug} mesothelioma, asbestos ${category.slug}, mesothelioma lawsuits, asbestos litigation`);
    }
  }, [category]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground">The requested category could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-title mb-4">
            {category.name} Asbestos Exposure Sites
          </h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive directory of {category.name.toLowerCase()} facilities where workers were exposed to asbestos across the United States
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

        {/* Call to Action */}
        <div className="mb-12 p-6 bg-primary/10 rounded-lg border border-primary/20">
          <h3 className="text-lg font-semibold mb-3 text-primary">Need Legal Help?</h3>
          <p className="text-muted-foreground mb-4">
            If you or a loved one worked at any {category.name.toLowerCase()} facility and later developed 
            mesothelioma or other asbestos-related diseases, you may be entitled to compensation.
          </p>
          <Link href="/legal-help">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get Free Legal Consultation
            </Button>
          </Link>
        </div>

        {/* Internal Linking - State Navigation */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{category.name} Facilities by State</h2>
          <div className="bg-muted/30 rounded-lg p-6">
            <p className="text-muted-foreground mb-4">
              Explore {category.name.toLowerCase()} asbestos exposure sites across the United States. 
              Click on any state to view detailed facility listings and location-specific information.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {states.slice(0, 16).map((state) => (
                <Link
                  key={state.id}
                  href={`/${state.slug}`}
                  className="block p-3 bg-card rounded-lg border hover:border-primary hover:shadow-md transition-all duration-300 group"
                >
                  <h4 className="font-medium text-primary group-hover:underline">{state.name}</h4>
                  <p className="text-sm text-muted-foreground">{state.facilityCount} total facilities</p>
                </Link>
              ))}
            </div>
            {states.length > 16 && (
              <div className="mt-4 text-center">
                <Link href="/states" className="text-primary hover:underline font-medium">
                  View all {states.length} states →
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

        {/* Related Categories - Beautiful Home Page Style */}
        <div className="mb-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6" style={{fontFamily: 'Merriweather, serif', color: 'hsl(var(--professional-gray))'}}>
              Related Facility Types
            </h2>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{color: 'hsl(var(--professional-gray-light))'}}>
              Explore other industries where asbestos exposure occurred across the United States
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(categoryInfo)
              .filter(([key]) => key !== categorySlug)
              .slice(0, 6)
              .map(([key, info]) => (
                <Link
                  key={key}
                  href={`/category/${key}`}
                  className="block medical-card group cursor-pointer transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-6 transition-all duration-300 group-hover:scale-110"
                       style={{backgroundColor: 'hsl(var(--medical-teal) / 0.1)'}}>
                    <div className="text-2xl">
                      {key === 'manufacturing' && '🏭'}
                      {key === 'commercial-buildings' && '🏢'}
                      {key === 'power-plants' && '⚡'}
                      {key === 'shipyards' && '🚢'}
                      {key === 'government' && '🏛️'}
                      {key === 'hospitals' && '🏥'}
                      {key === 'schools' && '🎓'}
                      {key === 'transportation' && '🚆'}
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
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}