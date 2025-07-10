import { db } from '../server/db';
import { cities, states, facilities, categories, contentTemplates } from '../shared/schema';
import { eq, and, count, desc } from 'drizzle-orm';

interface CityData {
  id: number;
  name: string;
  slug: string;
  facilityCount: number;
  stateId: number;
}

interface TemplateVariables {
  city_name: string;
  state_name: string;
  facility_count: number;
  top_facility_types: string;
  primary_industries: string;
  exposure_materials: string;
  peak_exposure_years: string;
  workforce_description: string;
  industry_breakdown: string;
}

function generateCityContent(variables: TemplateVariables): string {
  return `${variables.city_name}, Florida has ${variables.facility_count} documented facilities with known asbestos exposure. The city's industrial history includes ${variables.top_facility_types} operations where workers handled asbestos-containing materials.

During peak exposure years (${variables.peak_exposure_years}), ${variables.workforce_description} worked with asbestos through insulation, fireproofing, and building materials. Many have since developed mesothelioma and other asbestos-related diseases.

If you worked at any facility in ${variables.city_name} and have been diagnosed with an asbestos-related disease, contact a qualified attorney specializing in asbestos cases.`;
}

async function completeCityGeneration() {
  console.log('🚀 Starting complete city generation...');
  
  // Get Florida state
  const [florida] = await db
    .select()
    .from(states)
    .where(eq(states.slug, 'florida'));
  
  if (!florida) {
    console.error('❌ Florida state not found');
    return;
  }
  
  // Get all Florida cities
  const floridaCities = await db
    .select({ 
      id: cities.id, 
      name: cities.name, 
      slug: cities.slug,
      facilityCount: cities.facilityCount,
      stateId: cities.stateId
    })
    .from(cities)
    .where(eq(cities.stateId, florida.id));
  
  console.log(`📊 Found ${floridaCities.length} Florida cities`);
  
  // Get existing templates
  const existingTemplates = await db
    .select()
    .from(contentTemplates)
    .where(eq(contentTemplates.templateType, 'city'));
  
  const templateNames = new Set(existingTemplates.map(t => t.templateName));
  
  // Find cities missing templates
  const missingCities = floridaCities.filter(city => 
    !templateNames.has(`${city.slug}_content`)
  );
  
  console.log(`📝 Processing ${missingCities.length} cities without templates`);
  
  let processedCount = 0;
  
  for (const city of missingCities) {
    // Get facilities for this city
    const cityFacilities = await db
      .select({
        facilityType: facilities.facilityType,
        categoryName: categories.name,
        operationalYears: facilities.operationalYears
      })
      .from(facilities)
      .leftJoin(categories, eq(facilities.categoryId, categories.id))
      .where(eq(facilities.cityId, city.id));
    
    // Analyze facility types
    const facilityTypes = cityFacilities
      .map(f => f.facilityType || f.categoryName)
      .filter(Boolean) as string[];
    
    const typeCounts: { [key: string]: number } = {};
    facilityTypes.forEach(type => {
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    const topTypes = Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);
    
    const variables: TemplateVariables = {
      city_name: city.name,
      state_name: "Florida",
      facility_count: city.facilityCount,
      top_facility_types: topTypes.length > 0 ? topTypes.join(', ') : 'various industrial',
      primary_industries: topTypes.length > 0 ? topTypes.slice(0, 2).join(' and ') : 'industrial',
      exposure_materials: getExposureMaterials(topTypes[0] || 'industrial'),
      peak_exposure_years: "1940-1980",
      workforce_description: "thousands of workers",
      industry_breakdown: getIndustryBreakdown(topTypes)
    };
    
    const cityContent = generateCityContent(variables);
    
    // Store content template
    await db
      .insert(contentTemplates)
      .values({
        templateType: 'city',
        templateName: `${city.slug}_content`,
        contentBlocks: [cityContent],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    
    processedCount++;
    
    if (processedCount % 50 === 0) {
      console.log(`✅ Generated content for ${processedCount} cities`);
    }
  }
  
  console.log(`🎉 Completed ${processedCount} city templates`);
}

function getExposureMaterials(industryType: string): string {
  const materialMap: { [key: string]: string } = {
    "Shipyards": "insulation materials, fireproofing compounds, gaskets, and pipe coverings",
    "Manufacturing": "thermal insulation, protective equipment, building materials, and machinery components",
    "Power Plants": "boiler insulation, turbine components, and steam pipe coverings",
    "Schools": "ceiling tiles, floor tiles, and HVAC insulation",
    "Hospitals": "fireproofing materials and building insulation",
    "Government": "building materials and insulation products",
    "Commercial Buildings": "insulation, fireproofing, and construction materials"
  };
  
  return materialMap[industryType] || "insulation materials, fireproofing compounds, and industrial components";
}

function getIndustryBreakdown(topTypes: string[]): string {
  if (topTypes.length === 0) return "Various industrial facilities";
  if (topTypes.length === 1) return `${topTypes[0]} operations`;
  if (topTypes.length === 2) return `${topTypes[0]} and ${topTypes[1]} operations`;
  
  const last = topTypes[topTypes.length - 1];
  const others = topTypes.slice(0, -1).join(', ');
  return `${others}, and ${last} operations`;
}

completeCityGeneration().catch(console.error);