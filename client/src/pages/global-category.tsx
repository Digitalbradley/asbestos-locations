import { useEffect, useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { categoryInfo } from "./category";

// Import the comprehensive category content
const enhancedCategoryInfo = {
  "manufacturing": {
    name: "Manufacturing",
    slug: "manufacturing",
    description: "Industrial manufacturing plants across the United States extensively used asbestos-containing materials from the 1940s through the 1980s. These facilities represent some of the highest concentrations of occupational asbestos exposure in American industrial history. Manufacturing workers routinely handled raw asbestos fibers and worked in environments saturated with asbestos dust from insulation, machinery components, and protective equipment. The combination of high-temperature industrial processes and the widespread use of asbestos for heat resistance created particularly hazardous conditions that have resulted in thousands of mesothelioma and asbestos-related disease cases among manufacturing workers and their families.",
    historicalContext: "The American manufacturing boom following World War II coincided with the peak use of asbestos in industrial applications. Manufacturing facilities relied heavily on asbestos for its fire-resistant and insulating properties, particularly in high-temperature processes involving furnaces, boilers, and industrial ovens. Major manufacturing corporations knowingly exposed workers to dangerous levels of asbestos fibers despite mounting evidence of health risks beginning in the 1930s. Internal company documents revealed during litigation show that many manufacturers actively concealed the dangers of asbestos exposure from their workforce while continuing to use asbestos-containing materials well into the 1980s. This widespread use has left a lasting legacy of asbestos contamination in manufacturing facilities across the nation.",
    exposureSources: [
      "Boiler and furnace insulation containing up to 80% asbestos",
      "Pipe insulation and lagging materials",
      "Gaskets, packing materials, and valve seals",
      "Protective clothing, gloves, and aprons",
      "Ceiling tiles and spray-on fireproofing",
      "Electrical insulation and wiring",
      "Brake linings and clutch facings",
      "Roofing materials and floor tiles",
      "Cement products and construction materials",
      "Machine components and friction materials"
    ],
    healthRisks: "Manufacturing workers faced extreme asbestos exposure levels, often working in poorly ventilated areas where asbestos fibers accumulated to dangerous concentrations. Studies have shown that manufacturing workers have some of the highest rates of mesothelioma, lung cancer, and asbestosis among all occupational groups. The latency period for asbestos-related diseases means that workers exposed decades ago are still being diagnosed today. Family members of manufacturing workers also faced secondary exposure from asbestos fibers brought home on work clothes, leading to mesothelioma cases among spouses and children who never worked directly with asbestos.",
    legalContext: "Manufacturing companies have faced extensive litigation for knowingly exposing workers to asbestos without adequate warnings or protection. Major manufacturers have paid billions in settlements and jury awards to victims and their families. Many companies filed for bankruptcy protection and established asbestos trust funds to compensate current and future victims. Workers and their families may be entitled to compensation through multiple sources including workers' compensation, personal injury lawsuits, and asbestos trust fund claims. The statute of limitations for filing claims typically begins at diagnosis, not exposure, recognizing the long latency period of asbestos-related diseases.",
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
    ...categoryInfo["power-plants"],
    description: "Electric power generation facilities constructed between 1940 and 1980 used massive quantities of asbestos-containing materials throughout their operations. Both coal-fired and nuclear power plants relied heavily on asbestos insulation to protect equipment and workers from extreme temperatures reaching over 1,000 degrees Fahrenheit. Power plant workers, including boilermakers, pipefitters, electricians, and maintenance personnel, faced daily exposure to asbestos fibers during routine operations, repairs, and renovations. The confined spaces, high-temperature environments, and constant vibration in power plants created ideal conditions for asbestos fibers to become airborne, resulting in widespread contamination that affected thousands of workers across the United States.",
    historicalContext: "The rapid expansion of America's electrical infrastructure in the post-World War II era coincided with the peak use of asbestos in industrial applications. Power plants built during this period used asbestos extensively in turbines, boilers, generators, and throughout the facility's pipe systems. The extreme temperatures involved in power generation made asbestos seem like an ideal solution for protecting equipment and preventing fires. Major utility companies continued using asbestos-containing materials despite growing awareness of health risks, prioritizing operational efficiency over worker safety. Many power plants operated for decades with original asbestos insulation intact, exposing multiple generations of workers to hazardous fibers.",
    healthRisks: "Power plant workers experienced some of the highest occupational asbestos exposure levels due to the extensive use of asbestos throughout these facilities. The combination of confined spaces, high temperatures, and routine maintenance activities created perfect conditions for asbestos fiber release. Studies show power plant workers have significantly elevated rates of mesothelioma, lung cancer, and asbestosis compared to the general population. The risk extends beyond direct employees to contractors, inspection personnel, and even administrative staff who worked in contaminated areas. Family members also faced secondary exposure from asbestos dust brought home on work clothes.",
    legalContext: "Power generation companies face ongoing litigation from workers and their families affected by asbestos exposure. Many utility companies have been held liable for failing to protect workers and for continuing to use asbestos despite known health risks. Successful lawsuits have resulted in substantial verdicts and settlements for victims. Workers may pursue compensation through multiple channels including workers' compensation, personal injury lawsuits, and claims against asbestos bankruptcy trusts established by equipment manufacturers. The unique exposure patterns in power plants often allow victims to pursue claims against multiple defendants."
  },
  // Add all other categories with enhanced content...
  "shipyards": {...categoryInfo["shipyards"]},
  "commercial-buildings": {...categoryInfo["commercial-buildings"]},
  "government": {...categoryInfo["government"]},
  "hospitals": {...categoryInfo["hospitals"]},
  "schools": {...categoryInfo["schools"]},
  "transportation": {
    name: "Transportation",
    slug: "transportation",
    description: "Transportation facilities and vehicles extensively used asbestos-containing materials for heat resistance and friction applications from the 1930s through the 1980s. Railroad shops, bus depots, airports, and vehicle manufacturing plants all exposed workers to asbestos through brake linings, clutches, gaskets, and insulation materials.",
    historicalContext: "The American transportation industry's growth throughout the 20th century relied heavily on asbestos for critical safety components.",
    exposureSources: ["Brake linings", "Clutch facings", "Locomotive insulation", "Aircraft components"],
    healthRisks: "Transportation workers faced unique asbestos exposure patterns during vehicle maintenance and repair.",
    legalContext: "Transportation workers have successfully pursued compensation through various legal avenues.",
    peakUseYears: "1940s-1980s",
    commonProducts: ["Brake components", "Clutch materials", "Insulation products"]
  },
  "residential": {
    name: "Residential",
    slug: "residential", 
    description: "Residential buildings constructed between 1930 and 1980 commonly contained asbestos materials in numerous applications, from insulation to decorative finishes.",
    historicalContext: "The post-war housing boom led to massive residential construction projects that frequently used asbestos-containing materials.",
    exposureSources: ["Floor tiles", "Pipe insulation", "Roofing materials", "Ceiling tiles"],
    healthRisks: "Workers in residential buildings face varied asbestos exposure depending on their specific duties.",
    legalContext: "Workers exposed to asbestos in residential buildings may pursue workers' compensation claims.",
    peakUseYears: "1940s-1980s",
    commonProducts: ["Building materials", "Insulation products", "Flooring materials"]
  }
};

export default function GlobalCategoryPage() {
  const [, params] = useRoute("/category/:categorySlug");
  const [location] = useLocation();
  const categorySlug = params?.categorySlug || "";
  const [selectedState, setSelectedState] = useState<string>("");
  const [displayedFacilities, setDisplayedFacilities] = useState(100);
  
  const category = enhancedCategoryInfo[categorySlug as keyof typeof enhancedCategoryInfo];

  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Fetch all states for the filter dropdown
  const { data: states = [] } = useQuery({
    queryKey: ["/api/states"],
  });

  // Fetch facilities only when a state is selected
  const { data: facilities = [], isLoading: isLoadingFacilities } = useQuery({
    queryKey: ["/api/facilities", { category: categorySlug, state: selectedState, limit: 1000 }],
    queryFn: async () => {
      if (!selectedState || selectedState === "all") {
        // Don't fetch if no state selected
        return [];
      }
      const response = await fetch(`/api/facilities?category=${categorySlug}&state=${selectedState}&limit=1000`);
      if (!response.ok) throw new Error('Failed to fetch facilities');
      return response.json();
    },
    enabled: !!categorySlug && !!category && !!selectedState && selectedState !== "all",
  });

  // Facilities to display (for pagination)
  const visibleFacilities = facilities.slice(0, displayedFacilities);

  // Set page metadata
  useEffect(() => {
    if (category) {
      document.title = `${category.name} Asbestos Exposure Sites - Comprehensive Directory`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `Comprehensive directory of ${category.name.toLowerCase()} facilities with documented asbestos exposure. Find exposure sites, learn about health risks, and get legal help.`
        );
      }
    }
  }, [category, facilities.length]);

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Category not found. Please check the URL and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: category.name }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
          <BreadcrumbNav items={breadcrumbItems} />

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{fontFamily: 'Merriweather, serif'}}>
              {category.name} Asbestos Exposure Sites | Mesothelioma Risk Locations
            </h1>
          </div>

          {/* Overview Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{fontFamily: 'Merriweather, serif'}}>
              {category.name} Workers at High Risk for Asbestos-Related Diseases
            </h2>
            <Card className="border-l-4 border-l-primary">
              <CardContent className="pt-6">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Historical Context */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{fontFamily: 'Merriweather, serif'}}>
              History of Asbestos Use in {category.name} ({category.peakUseYears})
            </h2>
            <Card>
              <CardContent className="pt-6">
                <p className="leading-relaxed text-muted-foreground">
                  {category.historicalContext}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Exposure and Products Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{fontFamily: 'Merriweather, serif'}}>
              Asbestos Exposure Sources in {category.name} Facilities
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Common Exposure Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.exposureSources.map((source, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span className="text-muted-foreground">{source}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {category.commonProducts && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Common Asbestos Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.commonProducts.map((product, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-muted-foreground">{product}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            </div>
          </div>

          {/* Health and Legal Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{fontFamily: 'Merriweather, serif'}}>
              Health Risks and Legal Rights for {category.name} Workers
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-t-4 border-t-destructive">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-destructive" />
                  Health Risks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">
                  {category.healthRisks}
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="text-xl">Legal Context</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">
                  {category.legalContext}
                </p>
              </CardContent>
            </Card>
            </div>
          </div>

          {/* State Filter and Facilities Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{fontFamily: 'Merriweather, serif'}}>
              Find {category.name} Asbestos Exposure Sites by State
            </h2>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Select a state to view facilities:</label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Choose a state..." />
              </SelectTrigger>
              <SelectContent>
                {states.map((state: any) => (
                  <SelectItem key={state.id} value={state.slug}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </div>
          </div>

          {/* Facilities Grid */}
          {!selectedState || selectedState === "" ? (
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground text-lg">
                  Please select a state above to view {category.name.toLowerCase()} facilities with documented asbestos exposure.
                </p>
              </CardContent>
            </Card>
          ) : isLoadingFacilities ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : facilities.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No {category.name.toLowerCase()} facilities found in this state.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {visibleFacilities.map((facility: any) => (
                  <Link
                    key={facility.id}
                    href={`/${facility.state?.slug}/${facility.city?.slug}/${facility.slug}-asbestos-exposure`}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="text-lg">{facility.name}</CardTitle>
                        <CardDescription>
                          {facility.city?.name}, {facility.state?.name}
                        </CardDescription>
                      </CardHeader>
                      {facility.company && (
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Company: {facility.company}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Load More Button */}
              {displayedFacilities < facilities.length && (
                <div className="text-center">
                  <Button
                    onClick={() => setDisplayedFacilities(prev => prev + 100)}
                    size="lg"
                  >
                    Load More Facilities ({facilities.length - displayedFacilities} remaining)
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Contact CTA */}
          <Card className="mt-12 bg-muted/50">
            <CardHeader>
              <CardTitle className="text-2xl">Were You Exposed to Asbestos?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                If you worked at any of these {category.name.toLowerCase()} facilities and have been diagnosed with 
                mesothelioma, lung cancer, or other asbestos-related diseases, you may be entitled to significant compensation.
              </p>
              <Link href="/legal-help">
                <Button size="lg" className="w-full md:w-auto">
                  Get Free Legal Consultation
                </Button>
              </Link>
            </CardContent>
          </Card>
    </div>
  );
}
