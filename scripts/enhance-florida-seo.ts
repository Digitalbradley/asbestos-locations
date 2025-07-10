import { db } from "../server/db";
import { facilities, cities, states, categories } from "../shared/schema";
import { eq, sql, desc, asc, and } from "drizzle-orm";

interface SEOData {
  metaTitle: string;
  metaDescription: string;
  seoKeyword: string;
  pageTitleTemplate: string;
}

class FloridaSEOEnhancer {
  
  async enhanceFloridaSEO(): Promise<void> {
    console.log("🔍 Starting Florida SEO enhancement...");
    
    // Get Florida state data
    const [floridaState] = await db.select().from(states).where(eq(states.slug, "florida"));
    if (!floridaState) {
      throw new Error("Florida state not found in database");
    }
    
    console.log(`📊 Enhancing SEO for Florida facilities...`);
    
    // Enhance facility-level SEO
    await this.enhanceFacilitySEO(floridaState.id);
    
    console.log("✅ Florida SEO enhancement completed successfully!");
  }
  
  async enhanceFacilitySEO(stateId: number): Promise<void> {
    console.log("🏭 Enhancing SEO for Florida facilities...");
    
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
    
    console.log(`📊 Processing SEO for ${floridaFacilities.length} facilities`);
    
    let processedCount = 0;
    
    for (const facilityData of floridaFacilities) {
      const facility = facilityData.facility;
      const city = facilityData.city;
      const category = facilityData.category;
      
      // Skip if facility already has complete SEO data
      if (facility.metaTitle && facility.metaDescription && facility.seoKeyword) {
        continue;
      }
      
      const seoData = this.generateFacilitySEO(facility, city, category);
      
      // Update facility with SEO data
      await db
        .update(facilities)
        .set({
          metaTitle: seoData.metaTitle,
          metaDescription: seoData.metaDescription,
          seoKeyword: seoData.seoKeyword,
          pageTitleTemplate: seoData.pageTitleTemplate,
          lastContentUpdate: new Date()
        })
        .where(eq(facilities.id, facility.id));
      
      processedCount++;
      
      if (processedCount % 100 === 0) {
        console.log(`✅ Enhanced SEO for ${processedCount} facilities`);
      }
    }
    
    console.log(`✅ Enhanced SEO for ${processedCount} facilities total`);
  }
  
  private generateFacilitySEO(
    facility: typeof facilities.$inferSelect,
    city: typeof cities.$inferSelect,
    category: typeof categories.$inferSelect | null
  ): SEOData {
    const facilityName = facility.name;
    const cityName = city.name;
    const stateName = "Florida";
    const categoryName = category?.name || "Industrial Facility";
    
    // Generate meta title (50-60 characters optimal)
    const metaTitle = `${facilityName} ${cityName} FL - Asbestos Exposure Site`;
    
    // Generate meta description (150-160 characters optimal)
    const metaDescription = `Learn about asbestos exposure at ${facilityName} in ${cityName}, Florida. Worker safety information, exposure periods, and legal resources for mesothelioma victims and families.`;
    
    // Generate SEO keyword
    const seoKeyword = `${facilityName} ${cityName} FL, ${facilityName} asbestos, ${categoryName} ${cityName}, mesothelioma ${cityName}`;
    
    // Generate page title template
    const pageTitleTemplate = `${facilityName} ${cityName} FL - Asbestos Exposure Information`;
    
    return {
      metaTitle,
      metaDescription,
      seoKeyword,
      pageTitleTemplate
    };
  }
  
  private truncateDescription(description: string, maxLength: number = 160): string {
    if (description.length <= maxLength) {
      return description;
    }
    
    // Find the last space before the limit
    const truncated = description.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > 0) {
      return truncated.substring(0, lastSpace) + '...';
    }
    
    return truncated + '...';
  }
  
  private generateLocationKeywords(cityName: string, stateName: string): string[] {
    return [
      `${cityName} asbestos exposure`,
      `${cityName} mesothelioma`,
      `${cityName} ${stateName} asbestos`,
      `asbestos sites ${cityName}`,
      `industrial facilities ${cityName}`
    ];
  }
  
  private generateIndustryKeywords(categoryName: string): string[] {
    const industryMap: { [key: string]: string[] } = {
      "Shipyards": ["shipyard asbestos", "naval shipyard exposure", "ship building asbestos"],
      "Manufacturing": ["manufacturing asbestos", "factory asbestos exposure", "industrial manufacturing"],
      "Power Plants": ["power plant asbestos", "utility asbestos exposure", "energy facility"],
      "Schools": ["school asbestos", "educational facility asbestos", "school building exposure"],
      "Hospitals": ["hospital asbestos", "healthcare facility asbestos", "medical facility exposure"],
      "Government": ["government facility asbestos", "federal building asbestos", "public building exposure"]
    };
    
    return industryMap[categoryName] || ["industrial facility asbestos", "workplace asbestos exposure"];
  }
}

async function main() {
  try {
    const enhancer = new FloridaSEOEnhancer();
    await enhancer.enhanceFloridaSEO();
    console.log("🎉 Florida SEO enhancement completed successfully!");
  } catch (error) {
    console.error("❌ Error enhancing Florida SEO:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { FloridaSEOEnhancer };