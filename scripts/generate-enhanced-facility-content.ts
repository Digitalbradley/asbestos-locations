import { db } from '../server/db';
import { facilities, cities, categories, contentTemplates } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Define exposure materials by category
const exposureMaterials = {
  'Power Plants': 'boiler insulation, steam pipe covering, turbine gaskets, and high-temperature valve packing',
  'Shipyards': 'ship hull insulation, engine room materials, pipe covering, and marine construction components',
  'Manufacturing': 'production equipment insulation, machinery gaskets, protective materials, and industrial components',
  'Schools': 'ceiling tiles, floor tiles, HVAC insulation, and building construction materials',
  'Commercial Buildings': 'structural insulation, roofing materials, fireproofing compounds, and building components',
  'Government': 'building insulation, mechanical systems, maintenance materials, and facility infrastructure',
  'Hospitals': 'medical equipment insulation, building materials, HVAC systems, and maintenance components',
  'Transportation': 'vehicle insulation, brake components, engine materials, and infrastructure maintenance',
  'Residential': 'building insulation, roofing materials, flooring, and construction components'
};

const jobRoles = {
  'Power Plants': 'power plant operators, maintenance technicians, and boiler workers',
  'Shipyards': 'shipbuilders, welders, insulators, and marine construction workers',
  'Manufacturing': 'production workers, machine operators, and maintenance personnel',
  'Schools': 'maintenance staff, construction workers, and renovation crews',
  'Commercial Buildings': 'construction workers, maintenance staff, and building trades personnel',
  'Government': 'facility maintenance workers, construction crews, and federal employees',
  'Hospitals': 'maintenance staff, construction workers, and facility personnel',
  'Transportation': 'mechanics, maintenance workers, and transportation personnel',
  'Residential': 'construction workers, renovators, and maintenance personnel'
};

function createEnhancedFacilityContent(facilityData: any): string {
  const companyText = facilityData.companyName ? ` operated by ${facilityData.companyName}` : '';
  const yearsText = facilityData.operationalYears ? ` from ${facilityData.operationalYears}` : '';
  const typeText = facilityData.facilityType ? `${facilityData.facilityType} ` : '';
  const category = facilityData.categoryName || 'Industrial';
  
  const materials = exposureMaterials[category] || 'insulation materials, protective equipment, and industrial components';
  const workers = jobRoles[category] || 'workers and maintenance personnel';
  
  const content = `The ${facilityData.name} was a ${typeText}facility${companyText} in ${facilityData.cityName}, Florida${yearsText}. As a ${category.toLowerCase()} facility, workers were primarily exposed to asbestos through ${materials}.

${workers.charAt(0).toUpperCase() + workers.slice(1)} at this facility faced daily exposure risks during routine operations and maintenance activities. Peak exposure typically occurred during equipment maintenance, renovation projects, and material handling procedures.

Many former employees have developed mesothelioma and other asbestos-related diseases decades after their exposure. If you worked at ${facilityData.name} and have been diagnosed with an asbestos-related condition, contact a qualified attorney specializing in asbestos litigation.`;
  
  return content;
}

async function generateEnhancedFacilityTemplates() {
  console.log('🚀 Generating enhanced facility content templates...');
  
  // Get all Florida facilities with full data
  const floridaFacilities = await db
    .select({
      id: facilities.id,
      name: facilities.name,
      slug: facilities.slug,
      facilityType: facilities.facilityType,
      operationalYears: facilities.operationalYears,
      companyName: facilities.companyName,
      address: facilities.address,
      cityName: cities.name,
      categoryName: categories.name
    })
    .from(facilities)
    .leftJoin(cities, eq(facilities.cityId, cities.id))
    .leftJoin(categories, eq(facilities.categoryId, categories.id))
    .where(eq(cities.stateId, 3));
  
  console.log(`Processing ${floridaFacilities.length} Florida facilities`);
  
  let created = 0;
  let updated = 0;
  
  for (const facility of floridaFacilities) {
    const templateName = `${facility.slug}_content_enhanced`;
    
    // Check if enhanced template already exists
    const existing = await db
      .select()
      .from(contentTemplates)
      .where(eq(contentTemplates.templateName, templateName));
    
    const enhancedContent = createEnhancedFacilityContent(facility);
    
    if (existing.length === 0) {
      // Create new enhanced template
      await db.insert(contentTemplates).values({
        templateType: 'facility',
        templateName,
        contentBlocks: [enhancedContent],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      created++;
    } else {
      // Update existing enhanced template
      await db
        .update(contentTemplates)
        .set({
          contentBlocks: [enhancedContent],
          updatedAt: new Date()
        })
        .where(eq(contentTemplates.id, existing[0].id));
      updated++;
    }
    
    if ((created + updated) % 100 === 0) {
      console.log(`Processed ${created + updated}/${floridaFacilities.length} facilities`);
    }
  }
  
  console.log(`✅ Enhanced facility templates: ${created} created, ${updated} updated`);
  
  // Test a sample template
  const sampleTemplate = await db
    .select()
    .from(contentTemplates)
    .where(eq(contentTemplates.templateName, `${floridaFacilities[0].slug}_content_enhanced`));
  
  if (sampleTemplate.length > 0) {
    const content = sampleTemplate[0].contentBlocks[0];
    const wordCount = content.split(/\s+/).length;
    console.log(`Sample template word count: ${wordCount} words`);
  }
}

async function main() {
  try {
    await generateEnhancedFacilityTemplates();
  } catch (error) {
    console.error('Error generating enhanced facility templates:', error);
  }
}

main();