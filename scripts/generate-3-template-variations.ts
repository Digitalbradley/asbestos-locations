import { db } from '../server/db';
import { facilities, cities, categories, contentTemplates } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Template A: Company-Focused
function createCompanyFocusedTemplate(facilityData: any): string {
  const companyName = facilityData.companyName || facilityData.name;
  const yearsText = facilityData.operationalYears ? ` operating from ${facilityData.operationalYears}` : '';
  const category = facilityData.categoryName || 'Industrial';
  
  return `${companyName} was a ${category.toLowerCase()} company${yearsText} in ${facilityData.cityName}, Florida. The company's operations exposed workers to asbestos through standard industry practices and materials used during that era.

Company employees faced occupational asbestos exposure through daily work activities, equipment maintenance, and facility operations. Workers in various departments encountered asbestos-containing materials as part of their regular duties at this ${category.toLowerCase()} facility.

Former employees who developed asbestos-related illnesses may have legal options for compensation. If you worked at ${facilityData.name} and have been diagnosed with mesothelioma or other asbestos-related diseases, consult with a qualified attorney specializing in occupational exposure cases.`;
}

// Template B: Industry-Focused  
function createIndustryFocusedTemplate(facilityData: any): string {
  const category = facilityData.categoryName || 'Industrial';
  const facilityType = facilityData.facilityType || 'facility';
  
  const industryMaterials = {
    'Power Plants': 'turbine insulation, boiler components, steam system materials, and electrical equipment containing asbestos',
    'Shipyards': 'marine insulation, engine room components, hull materials, and shipbuilding products with asbestos fibers',
    'Manufacturing': 'industrial machinery, production equipment, heat-resistant materials, and manufacturing components containing asbestos',
    'Schools': 'building insulation, floor tiles, ceiling materials, and construction products with asbestos content',
    'Commercial Buildings': 'structural materials, fireproofing systems, roofing products, and building components containing asbestos',
    'Government': 'facility infrastructure, mechanical systems, building materials, and government facility components with asbestos',
    'Hospitals': 'building systems, medical equipment areas, structural materials, and healthcare facility components containing asbestos',
    'Transportation': 'vehicle components, infrastructure materials, maintenance equipment, and transportation systems with asbestos content',
    'Residential': 'home construction materials, insulation products, building components, and residential systems containing asbestos'
  };
  
  const materials = industryMaterials[category] || 'industrial materials, equipment components, and facility systems containing asbestos';
  
  return `${facilityData.name} operated as a ${facilityType} in the ${category.toLowerCase()} sector in ${facilityData.cityName}, Florida. This type of facility typically utilized ${materials} throughout its operations.

The ${category.toLowerCase()} industry historically relied on asbestos-containing materials for their heat-resistant and durable properties. Workers in these facilities encountered asbestos exposure through routine maintenance, equipment operation, and facility management activities.

Industrial workers from this sector who developed asbestos-related health conditions may be eligible for legal compensation. If you have a diagnosis of mesothelioma or other asbestos-related illness from working at ${facilityData.name}, contact an experienced attorney for case evaluation.`;
}

// Template C: Location-Focused
function createLocationFocusedTemplate(facilityData: any): string {
  const category = facilityData.categoryName || 'Industrial';
  const cityName = facilityData.cityName;
  
  const locationContext = {
    'Tampa': 'Tampa Bay industrial corridor',
    'Jacksonville': 'Northeast Florida industrial region',
    'Miami': 'South Florida metropolitan area',
    'Orlando': 'Central Florida industrial district',
    'Fort Lauderdale': 'South Florida commercial zone',
    'Tallahassee': 'North Florida government center',
    'St. Petersburg': 'Tampa Bay area',
    'Pensacola': 'Northwest Florida industrial region',
    'Cape Coral': 'Southwest Florida development area',
    'Port Saint Lucie': 'Treasure Coast region'
  };
  
  const regionText = locationContext[cityName] || `${cityName} area`;
  
  return `Located in ${cityName}, Florida, ${facilityData.name} was part of the ${regionText}'s industrial landscape. The facility contributed to the local economy while exposing workers to asbestos through typical ${category.toLowerCase()} operations of that period.

${cityName} housed numerous industrial facilities where workers encountered asbestos in their daily work environment. The geographic concentration of such facilities in this region created widespread occupational exposure risks for the local workforce during peak industrial periods.

Workers who lived and worked in the ${cityName} area during this time may have developed asbestos-related diseases. If you worked at ${facilityData.name} and have been diagnosed with mesothelioma or other asbestos-related conditions, legal assistance may be available for your case.`;
}

async function generateThreeTemplateVariations() {
  console.log('🏭 Generating 3 template variations for all Florida facilities...');
  
  // Get all Florida facilities
  const floridaFacilities = await db
    .select({
      id: facilities.id,
      name: facilities.name,
      slug: facilities.slug,
      facilityType: facilities.facilityType,
      operationalYears: facilities.operationalYears,
      companyName: facilities.companyName,
      cityName: cities.name,
      categoryName: categories.name
    })
    .from(facilities)
    .leftJoin(cities, eq(facilities.cityId, cities.id))
    .leftJoin(categories, eq(facilities.categoryId, categories.id))
    .where(eq(cities.stateId, 3));
  
  console.log(`Processing ${floridaFacilities.length} Florida facilities`);
  
  let created = 0;
  
  for (const facility of floridaFacilities) {
    // Determine template version based on facility ID
    const templateVersion = (facility.id % 3) + 1;
    
    let content: string;
    switch (templateVersion) {
      case 1:
        content = createCompanyFocusedTemplate(facility);
        break;
      case 2:
        content = createIndustryFocusedTemplate(facility);
        break;
      case 3:
        content = createLocationFocusedTemplate(facility);
        break;
      default:
        content = createCompanyFocusedTemplate(facility);
    }
    
    const templateName = `${facility.slug}_content_v${templateVersion}`;
    
    // Create the template
    await db.insert(contentTemplates).values({
      templateType: 'facility',
      templateName,
      contentBlocks: [content],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    created++;
    
    if (created % 100 === 0) {
      console.log(`Created ${created}/${floridaFacilities.length} facility templates`);
    }
  }
  
  console.log(`✅ Created ${created} facility templates with 3 variations`);
  
  // Show distribution
  const v1Count = await db.select().from(contentTemplates).where(eq(contentTemplates.templateName, '%_content_v1'));
  const v2Count = await db.select().from(contentTemplates).where(eq(contentTemplates.templateName, '%_content_v2'));
  const v3Count = await db.select().from(contentTemplates).where(eq(contentTemplates.templateName, '%_content_v3'));
  
  console.log(`Template distribution:`);
  console.log(`  Version 1 (Company-Focused): ${Math.floor(floridaFacilities.length / 3)} facilities`);
  console.log(`  Version 2 (Industry-Focused): ${Math.floor(floridaFacilities.length / 3)} facilities`);
  console.log(`  Version 3 (Location-Focused): ${Math.floor(floridaFacilities.length / 3)} facilities`);
}

async function main() {
  try {
    await generateThreeTemplateVariations();
  } catch (error) {
    console.error('Error generating template variations:', error);
  }
}

main();