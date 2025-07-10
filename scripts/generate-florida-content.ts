import { db } from "../server/db";
import { facilities, cities, states, categories, contentTemplates } from "../shared/schema";
import { eq, sql, desc, asc, count, and } from "drizzle-orm";
import { 
  generateStateContent, 
  generateCityContent, 
  generateFacilityContent,
  generateCategoryBreakdown,
  generateHistoricalContext,
  generateIndustryDescription,
  type TemplateVariables 
} from "../server/utils/content-templates";

interface FacilityStats {
  totalFacilities: number;
  cityCount: number;
  topCities: Array<{ name: string; count: number }>;
  categoryBreakdown: { [key: string]: number };
  operationalYears: { earliest: string; latest: string };
}

interface CityStats {
  facilityCount: number;
  topFacilityTypes: string[];
  primaryIndustries: string[];
  operationalPeriod: { earliest: string; latest: string };
}

class FloridaContentGenerator {
  
  async generateFloridaContent(): Promise<void> {
    console.log("🚀 Starting Florida content generation...");
    
    // Get Florida state data
    const [floridaState] = await db.select().from(states).where(eq(states.slug, "florida"));
    if (!floridaState) {
      throw new Error("Florida state not found in database");
    }
    
    console.log(`📊 Found Florida state: ${floridaState.name} (${floridaState.facilityCount} facilities)`);
    
    // Generate state-level content
    await this.generateStateContent(floridaState);
    
    // Generate city-level content
    await this.generateCityContent(floridaState.id);
    
    // Generate facility-level content
    await this.generateFacilityContent(floridaState.id);
    
    console.log("✅ Florida content generation completed successfully!");
  }
  
  async generateStateContent(state: typeof states.$inferSelect): Promise<void> {
    console.log("📝 Generating state-level content for Florida...");
    
    const stats = await this.getFloridaStats(state.id);
    
    // Create template variables for Florida
    const variables: TemplateVariables = {
      state_name: state.name,
      facility_count: stats.totalFacilities,
      city_count: stats.cityCount,
      major_city_1: stats.topCities[0]?.name || "Jacksonville",
      major_city_2: stats.topCities[1]?.name || "Miami",
      industrial_city: stats.topCities[2]?.name || "Tampa",
      category_breakdown: generateCategoryBreakdown(stats.categoryBreakdown),
      top_city_1: stats.topCities[0]?.name || "Jacksonville",
      city_1_count: stats.topCities[0]?.count || 0,
      top_city_2: stats.topCities[1]?.name || "Miami", 
      city_2_count: stats.topCities[1]?.count || 0,
      top_city_3: stats.topCities[2]?.name || "Tampa",
      city_3_count: stats.topCities[2]?.count || 0,
      industrial_center_1: stats.topCities[0]?.name || "Jacksonville",
      industrial_center_2: stats.topCities[1]?.name || "Miami",
      earliest_year: stats.operationalYears.earliest,
      latest_year: stats.operationalYears.latest
    };
    
    // Generate content using template
    const stateContent = generateStateContent(variables);
    
    // Store in content templates table
    await this.storeContentTemplate('state', 'florida_state_content', stateContent);
    
    console.log("✅ State content generated for Florida");
  }
  
  async generateCityContent(stateId: number): Promise<void> {
    console.log("🏙️ Generating city-level content for Florida cities...");
    
    // Get all Florida cities with facilities
    const floridaCities = await db
      .select({
        city: cities,
        facilityCount: count(facilities.id)
      })
      .from(cities)
      .leftJoin(facilities, eq(cities.id, facilities.cityId))
      .where(eq(cities.stateId, stateId))
      .groupBy(cities.id)
      .having(sql`COUNT(${facilities.id}) > 0`)
      .orderBy(desc(count(facilities.id)));
    
    console.log(`📊 Processing ${floridaCities.length} cities with facilities`);
    
    for (const cityData of floridaCities) {
      const city = cityData.city;
      const cityStats = await this.getCityStats(city.id);
      
      const variables: TemplateVariables = {
        city_name: city.name,
        state_name: "Florida",
        facility_count: cityStats.facilityCount,
        earliest_year: cityStats.operationalPeriod.earliest,
        latest_year: cityStats.operationalPeriod.latest,
        primary_facility_types: cityStats.topFacilityTypes.slice(0, 3).join(', '),
        industry_description: generateIndustryDescription(cityStats.primaryIndustries),
        historical_context: generateHistoricalContext(city.name, "Florida", cityStats.primaryIndustries),
        top_facility_types: cityStats.topFacilityTypes.slice(0, 5).join(', '),
        facility_type_breakdown: this.generateFacilityTypeBreakdown(cityStats.topFacilityTypes)
      };
      
      const cityContent = generateCityContent(variables);
      await this.storeContentTemplate('city', `${city.slug}_content`, cityContent);
      
      console.log(`✅ Generated content for ${city.name} (${cityStats.facilityCount} facilities)`);
    }
  }
  
  async generateFacilityContent(stateId: number): Promise<void> {
    console.log("🏭 Generating facility-level content for Florida facilities...");
    
    // Get all Florida facilities
    const floridaFacilities = await db
      .select({
        facility: facilities,
        city: cities,
        state: states,
        category: categories
      })
      .from(facilities)
      .innerJoin(cities, eq(facilities.cityId, cities.id))
      .innerJoin(states, eq(facilities.stateId, states.id))
      .leftJoin(categories, eq(facilities.categoryId, categories.id))
      .where(eq(facilities.stateId, stateId))
      .orderBy(asc(facilities.name));
    
    console.log(`📊 Processing ${floridaFacilities.length} facilities`);
    
    let processedCount = 0;
    
    for (const facilityData of floridaFacilities) {
      const facility = facilityData.facility;
      const city = facilityData.city;
      const category = facilityData.category;
      
      // Skip if facility already has description
      if (facility.description && facility.description.trim().length > 100) {
        continue;
      }
      
      const variables: TemplateVariables = {
        facility_name: facility.name,
        city_name: city.name,
        state_name: "Florida",
        facility_type: facility.facilityType || category?.name || "industrial facility",
        operational_period: facility.operationalYears || "mid-20th century",
        exposure_materials: this.getExposureMaterials(category?.name || "industrial"),
        industry_type: category?.name || "industrial",
        workforce_size: facility.workforceSize || "unknown number of workers",
        exposure_risk: facility.exposureRisk || "significant",
        material_applications: this.getMaterialApplications(category?.name || "industrial"),
        peak_exposure_years: this.getPeakExposureYears(facility.operationalYears)
      };
      
      const facilityContent = generateFacilityContent(variables);
      
      // Update facility with generated content
      await db
        .update(facilities)
        .set({
          description: facilityContent,
          templateContentGenerated: true,
          lastContentUpdate: new Date()
        })
        .where(eq(facilities.id, facility.id));
      
      processedCount++;
      
      if (processedCount % 100 === 0) {
        console.log(`✅ Generated content for ${processedCount} facilities`);
      }
    }
    
    console.log(`✅ Generated content for ${processedCount} facilities total`);
  }
  
  private async getFloridaStats(stateId: number): Promise<FacilityStats> {
    // Get total facilities and cities
    const [totalStats] = await db
      .select({
        totalFacilities: count(facilities.id),
        cityCount: sql<number>`COUNT(DISTINCT ${facilities.cityId})`
      })
      .from(facilities)
      .where(eq(facilities.stateId, stateId));
    
    // Get top cities by facility count
    const topCities = await db
      .select({
        name: cities.name,
        count: count(facilities.id)
      })
      .from(cities)
      .leftJoin(facilities, eq(cities.id, facilities.cityId))
      .where(eq(cities.stateId, stateId))
      .groupBy(cities.id, cities.name)
      .orderBy(desc(count(facilities.id)))
      .limit(10);
    
    // Get category breakdown
    const categoryStats = await db
      .select({
        categoryName: categories.name,
        count: count(facilities.id)
      })
      .from(facilities)
      .leftJoin(categories, eq(facilities.categoryId, categories.id))
      .where(eq(facilities.stateId, stateId))
      .groupBy(categories.name)
      .orderBy(desc(count(facilities.id)));
    
    const categoryBreakdown: { [key: string]: number } = {};
    categoryStats.forEach(stat => {
      if (stat.categoryName) {
        categoryBreakdown[stat.categoryName] = stat.count;
      }
    });
    
    return {
      totalFacilities: totalStats.totalFacilities,
      cityCount: totalStats.cityCount,
      topCities: topCities.map(city => ({ name: city.name, count: city.count })),
      categoryBreakdown,
      operationalYears: { earliest: "1920", latest: "2000" } // Default values
    };
  }
  
  private async getCityStats(cityId: number): Promise<CityStats> {
    // Get facility count and types for city
    const cityFacilities = await db
      .select({
        facilityType: facilities.facilityType,
        categoryName: categories.name,
        operationalYears: facilities.operationalYears
      })
      .from(facilities)
      .leftJoin(categories, eq(facilities.categoryId, categories.id))
      .where(eq(facilities.cityId, cityId));
    
    const facilityTypes = cityFacilities
      .map(f => f.facilityType || f.categoryName)
      .filter(Boolean) as string[];
    
    const typeCounts: { [key: string]: number } = {};
    facilityTypes.forEach(type => {
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    const topFacilityTypes = Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([type]) => type)
      .slice(0, 5);
    
    const primaryIndustries = Object.keys(typeCounts).slice(0, 3);
    
    return {
      facilityCount: cityFacilities.length,
      topFacilityTypes,
      primaryIndustries,
      operationalPeriod: { earliest: "1920", latest: "2000" }
    };
  }
  
  private generateFacilityTypeBreakdown(facilityTypes: string[]): string {
    if (facilityTypes.length === 0) return "various industrial facilities";
    if (facilityTypes.length === 1) return facilityTypes[0];
    if (facilityTypes.length === 2) return `${facilityTypes[0]} and ${facilityTypes[1]}`;
    
    const last = facilityTypes[facilityTypes.length - 1];
    const others = facilityTypes.slice(0, -1).join(', ');
    return `${others}, and ${last}`;
  }
  
  private getExposureMaterials(industryType: string): string {
    const materialMap: { [key: string]: string } = {
      "Shipyards": "insulation, fireproofing materials, gaskets, and pipe coverings",
      "Manufacturing": "thermal insulation, protective equipment, and building materials",
      "Power Plants": "boiler insulation, turbine components, and fireproofing materials",
      "Schools": "ceiling tiles, floor tiles, and building insulation",
      "Hospitals": "fireproofing materials, insulation, and construction materials",
      "Government": "building materials, insulation, and maintenance supplies"
    };
    
    return materialMap[industryType] || "insulation, fireproofing materials, and industrial components";
  }
  
  private getMaterialApplications(industryType: string): string {
    const applicationMap: { [key: string]: string } = {
      "Shipyards": "hull insulation, engine room fireproofing, and pipe lagging",
      "Manufacturing": "equipment insulation, protective coatings, and structural fireproofing",
      "Power Plants": "boiler insulation, steam pipe coverings, and turbine fireproofing",
      "Schools": "ceiling construction, floor installation, and HVAC insulation",
      "Hospitals": "fireproofing systems, insulation installation, and building construction",
      "Government": "construction projects, maintenance operations, and building renovations"
    };
    
    return applicationMap[industryType] || "insulation, fireproofing, and construction applications";
  }
  
  private getPeakExposureYears(operationalYears: string | null): string {
    if (operationalYears) {
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
          placeholders: [],
          isActive: true
        });
    }
  }
}

async function main() {
  try {
    const generator = new FloridaContentGenerator();
    await generator.generateFloridaContent();
    console.log("🎉 Florida content generation completed successfully!");
  } catch (error) {
    console.error("❌ Error generating Florida content:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { FloridaContentGenerator };