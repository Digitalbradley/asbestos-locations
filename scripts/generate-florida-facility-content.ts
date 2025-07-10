import { db } from '../server/db';
import { facilities, cities, states, categories, contentTemplates } from '../shared/schema';
import { eq, and, isNull, or } from 'drizzle-orm';

interface FacilityData {
  facility: typeof facilities.$inferSelect;
  city: typeof cities.$inferSelect;
  state: typeof states.$inferSelect;
  category: typeof categories.$inferSelect | null;
}

interface TemplateVariables {
  facility_name: string;
  city_name: string;
  state_name: string;
  facility_type: string;
  company_name: string;
  operational_period: string;
  exposure_materials: string;
  industry_type: string;
  exposure_risk: string;
  material_applications: string;
  peak_exposure_years: string;
  workforce_description: string;
}

function generateFacilityContent(variables: TemplateVariables): string {
  return `The ${variables.facility_name} in ${variables.city_name}, ${variables.state_name} was a ${variables.facility_type} that operated during ${variables.operational_period}. This facility was owned and operated by ${variables.company_name}, employing ${variables.workforce_description} who were potentially exposed to dangerous asbestos fibers.

Workers at ${variables.facility_name} were routinely exposed to asbestos through ${variables.exposure_materials}. The facility's operations involved ${variables.material_applications}, which frequently contained asbestos-containing materials that posed ${variables.exposure_risk} health risks to employees.

During the peak exposure years of ${variables.peak_exposure_years}, safety regulations regarding asbestos were minimal or non-existent. Workers at ${variables.facility_name} often handled asbestos-containing materials without proper protective equipment or awareness of the health risks.

The ${variables.industry_type} industry was known for heavy use of asbestos-containing materials due to their fire-resistant and insulating properties. At facilities like ${variables.facility_name}, asbestos was commonly found in insulation, fireproofing materials, gaskets, and various construction materials.

Many former employees of ${variables.facility_name} have since developed mesothelioma, lung cancer, and other asbestos-related diseases. These conditions often have long latency periods, with symptoms appearing decades after initial exposure.

If you or a loved one worked at ${variables.facility_name} and have been diagnosed with mesothelioma or another asbestos-related disease, you may be entitled to compensation. Contact a qualified attorney who specializes in asbestos litigation to discuss your legal options.`;
}

class FloridaFacilityContentGenerator {
  async generateFacilityContent(): Promise<void> {
    console.log('🚀 Starting Florida facility content generation...');
    
    // Get Florida state
    const [florida] = await db
      .select()
      .from(states)
      .where(eq(states.slug, 'florida'));
    
    if (!florida) {
      console.error('❌ Florida state not found');
      return;
    }
    
    console.log(`📊 Found Florida state: ${florida.name}`);
    
    // Get all Florida facilities without content templates
    const floridaFacilities = await db
      .select({
        facility: facilities,
        city: cities,
        state: states,
        category: categories
      })
      .from(facilities)
      .innerJoin(cities, eq(facilities.cityId, cities.id))
      .innerJoin(states, eq(cities.stateId, states.id))
      .leftJoin(categories, eq(facilities.categoryId, categories.id))
      .where(eq(states.slug, 'florida'));
    
    console.log(`🏭 Found ${floridaFacilities.length} Florida facilities`);
    
    // Generate content for each facility
    let processedCount = 0;
    
    for (const facilityData of floridaFacilities) {
      const facility = facilityData.facility;
      const city = facilityData.city;
      const category = facilityData.category;
      
      // Check if content template already exists
      const [existingTemplate] = await db
        .select()
        .from(contentTemplates)
        .where(and(
          eq(contentTemplates.templateType, 'facility'),
          eq(contentTemplates.templateName, `${facility.slug}_content`)
        ));
      
      if (existingTemplate) {
        continue; // Skip if template already exists
      }
      
      const variables: TemplateVariables = {
        facility_name: facility.name,
        city_name: city.name,
        state_name: "Florida",
        facility_type: facility.facilityType || category?.name || "industrial facility",
        company_name: facility.companyName || "various companies",
        operational_period: facility.operationalYears || "the mid-20th century",
        exposure_materials: this.getExposureMaterials(category?.name || "industrial"),
        industry_type: category?.name || "industrial",
        exposure_risk: facility.exposureRisk || "significant",
        material_applications: this.getMaterialApplications(category?.name || "industrial"),
        peak_exposure_years: this.getPeakExposureYears(facility.operationalYears),
        workforce_description: facility.workforceSize || "numerous workers"
      };
      
      const facilityContent = generateFacilityContent(variables);
      
      // Store content template
      await this.storeContentTemplate(
        'facility',
        `${facility.slug}_content`,
        facilityContent
      );
      
      processedCount++;
      
      if (processedCount % 100 === 0) {
        console.log(`✅ Generated content for ${processedCount} facilities`);
      }
    }
    
    console.log(`🎉 Generated content for ${processedCount} facilities total`);
  }
  
  private getExposureMaterials(industryType: string): string {
    const materialMap: { [key: string]: string } = {
      "Shipyards": "insulation materials, fireproofing compounds, gaskets, and pipe coverings",
      "Manufacturing": "thermal insulation, protective equipment, building materials, and machinery components",
      "Power Plants": "boiler insulation, turbine components, fireproofing materials, and steam pipe coverings",
      "Schools": "ceiling tiles, floor tiles, building insulation, and HVAC components",
      "Hospitals": "fireproofing materials, insulation systems, and construction materials",
      "Government": "building materials, insulation products, and maintenance supplies",
      "Commercial Buildings": "insulation, fireproofing, ceiling tiles, and construction materials",
      "Transportation": "brake components, gaskets, insulation, and mechanical parts",
      "Residential": "insulation, roofing materials, and construction products"
    };
    
    return materialMap[industryType] || "insulation materials, fireproofing compounds, and industrial components";
  }
  
  private getMaterialApplications(industryType: string): string {
    const applicationMap: { [key: string]: string } = {
      "Shipyards": "hull insulation, engine room fireproofing, pipe lagging, and deck coating",
      "Manufacturing": "equipment insulation, protective coatings, structural fireproofing, and machinery maintenance",
      "Power Plants": "boiler insulation, steam pipe coverings, turbine fireproofing, and electrical insulation",
      "Schools": "ceiling installation, floor construction, HVAC insulation, and building maintenance",
      "Hospitals": "fireproofing systems, insulation installation, building construction, and equipment maintenance",
      "Government": "construction projects, maintenance operations, building renovations, and infrastructure work",
      "Commercial Buildings": "construction, renovation, maintenance, and HVAC installation",
      "Transportation": "vehicle maintenance, brake servicing, and mechanical repairs",
      "Residential": "home construction, renovation, and maintenance work"
    };
    
    return applicationMap[industryType] || "insulation installation, fireproofing applications, and construction work";
  }
  
  private getPeakExposureYears(operationalYears: string | null): string {
    if (operationalYears) {
      // Extract years from operational years string
      const yearMatch = operationalYears.match(/(\d{4})/g);
      if (yearMatch && yearMatch.length >= 2) {
        return `${yearMatch[0]}-${yearMatch[yearMatch.length - 1]}`;
      }
      return operationalYears;
    }
    return "1940-1980";
  }
  
  private async storeContentTemplate(type: string, name: string, content: string): Promise<void> {
    // Check if template already exists
    const [existing] = await db
      .select()
      .from(contentTemplates)
      .where(and(
        eq(contentTemplates.templateType, type),
        eq(contentTemplates.templateName, name)
      ));
    
    if (existing) {
      // Update existing template
      await db
        .update(contentTemplates)
        .set({
          contentBlocks: [content],
          updatedAt: new Date()
        })
        .where(eq(contentTemplates.id, existing.id));
    } else {
      // Create new template
      await db
        .insert(contentTemplates)
        .values({
          templateType: type,
          templateName: name,
          contentBlocks: [content],
          createdAt: new Date(),
          updatedAt: new Date()
        });
    }
  }
}

async function main() {
  const generator = new FloridaFacilityContentGenerator();
  await generator.generateFacilityContent();
}

main().catch(console.error);