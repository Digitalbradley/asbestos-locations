import { db } from "../server/db";
import { facilities, cities, states, categories } from "../shared/schema";
import { eq, sql, desc, asc, count, and } from "drizzle-orm";

interface FloridaAnalytics {
  totalFacilities: number;
  totalCities: number;
  categoryBreakdown: { [key: string]: number };
  cityBreakdown: Array<{ name: string; count: number }>;
  contentStats: {
    facilitiesWithContent: number;
    facilitiesWithSEO: number;
    contentCoverage: number;
    seoCompleteness: number;
  };
}

class FloridaAnalyticsGenerator {
  
  async generateAnalytics(): Promise<FloridaAnalytics> {
    console.log("📊 Generating Florida analytics...");
    
    // Get Florida state data
    const [floridaState] = await db.select().from(states).where(eq(states.slug, "florida"));
    if (!floridaState) {
      throw new Error("Florida state not found in database");
    }
    
    const analytics: FloridaAnalytics = {
      totalFacilities: 0,
      totalCities: 0,
      categoryBreakdown: {},
      cityBreakdown: [],
      contentStats: {
        facilitiesWithContent: 0,
        facilitiesWithSEO: 0,
        contentCoverage: 0,
        seoCompleteness: 0
      }
    };
    
    // Get total facilities and cities
    const [totalStats] = await db
      .select({
        totalFacilities: count(facilities.id),
        totalCities: sql<number>`COUNT(DISTINCT ${facilities.cityId})`
      })
      .from(facilities)
      .where(eq(facilities.stateId, floridaState.id));
    
    analytics.totalFacilities = totalStats.totalFacilities;
    analytics.totalCities = totalStats.totalCities;
    
    // Get category breakdown
    const categoryStats = await db
      .select({
        categoryName: categories.name,
        count: count(facilities.id)
      })
      .from(facilities)
      .leftJoin(categories, eq(facilities.categoryId, categories.id))
      .where(eq(facilities.stateId, floridaState.id))
      .groupBy(categories.name)
      .orderBy(desc(count(facilities.id)));
    
    categoryStats.forEach(stat => {
      if (stat.categoryName) {
        analytics.categoryBreakdown[stat.categoryName] = stat.count;
      }
    });
    
    // Get city breakdown
    const cityStats = await db
      .select({
        cityName: cities.name,
        count: count(facilities.id)
      })
      .from(cities)
      .leftJoin(facilities, eq(cities.id, facilities.cityId))
      .where(eq(cities.stateId, floridaState.id))
      .groupBy(cities.id, cities.name)
      .orderBy(desc(count(facilities.id)))
      .limit(20);
    
    analytics.cityBreakdown = cityStats.map(stat => ({
      name: stat.cityName,
      count: stat.count
    }));
    
    // Get content statistics
    const [contentStats] = await db
      .select({
        facilitiesWithContent: sql<number>`COUNT(CASE WHEN ${facilities.description} IS NOT NULL AND LENGTH(${facilities.description}) > 100 THEN 1 END)`,
        facilitiesWithSEO: sql<number>`COUNT(CASE WHEN ${facilities.metaTitle} IS NOT NULL AND ${facilities.metaDescription} IS NOT NULL THEN 1 END)`,
        templateGenerated: sql<number>`COUNT(CASE WHEN ${facilities.templateContentGenerated} = true THEN 1 END)`
      })
      .from(facilities)
      .where(eq(facilities.stateId, floridaState.id));
    
    analytics.contentStats = {
      facilitiesWithContent: contentStats.facilitiesWithContent,
      facilitiesWithSEO: contentStats.facilitiesWithSEO,
      contentCoverage: Math.round((contentStats.facilitiesWithContent / analytics.totalFacilities) * 100),
      seoCompleteness: Math.round((contentStats.facilitiesWithSEO / analytics.totalFacilities) * 100)
    };
    
    return analytics;
  }
  
  async printAnalytics(): Promise<void> {
    const analytics = await this.generateAnalytics();
    
    console.log("\n" + "=".repeat(60));
    console.log("🏴 FLORIDA ASBESTOS EXPOSURE SITES - ANALYTICS REPORT");
    console.log("=".repeat(60));
    
    console.log(`\n📊 OVERVIEW:`);
    console.log(`   Total Facilities: ${analytics.totalFacilities.toLocaleString()}`);
    console.log(`   Total Cities: ${analytics.totalCities}`);
    
    console.log(`\n🏭 CATEGORY BREAKDOWN:`);
    Object.entries(analytics.categoryBreakdown)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        const percentage = ((count / analytics.totalFacilities) * 100).toFixed(1);
        console.log(`   ${category}: ${count.toLocaleString()} (${percentage}%)`);
      });
    
    console.log(`\n🏙️ TOP CITIES BY FACILITY COUNT:`);
    analytics.cityBreakdown.slice(0, 10).forEach((city, index) => {
      const percentage = ((city.count / analytics.totalFacilities) * 100).toFixed(1);
      console.log(`   ${index + 1}. ${city.name}: ${city.count.toLocaleString()} (${percentage}%)`);
    });
    
    console.log(`\n📝 CONTENT STATISTICS:`);
    console.log(`   Facilities with Content: ${analytics.contentStats.facilitiesWithContent.toLocaleString()}`);
    console.log(`   Content Coverage: ${analytics.contentStats.contentCoverage}%`);
    console.log(`   Facilities with SEO: ${analytics.contentStats.facilitiesWithSEO.toLocaleString()}`);
    console.log(`   SEO Completeness: ${analytics.contentStats.seoCompleteness}%`);
    
    console.log(`\n🎯 CONTENT GENERATION TARGETS:`);
    const remainingContent = analytics.totalFacilities - analytics.contentStats.facilitiesWithContent;
    const remainingSEO = analytics.totalFacilities - analytics.contentStats.facilitiesWithSEO;
    
    console.log(`   Facilities needing content: ${remainingContent.toLocaleString()}`);
    console.log(`   Facilities needing SEO: ${remainingSEO.toLocaleString()}`);
    
    console.log("\n" + "=".repeat(60));
    console.log("✅ Analytics report completed");
    console.log("=".repeat(60) + "\n");
  }
  
  async validateDataQuality(): Promise<void> {
    console.log("🔍 Validating Florida data quality...");
    
    // Check for facilities without categories
    const [noCategoryCount] = await db
      .select({ count: count(facilities.id) })
      .from(facilities)
      .innerJoin(states, eq(facilities.stateId, states.id))
      .where(and(
        eq(states.slug, "florida"),
        sql`${facilities.categoryId} IS NULL`
      ));
    
    // Check for facilities without company names
    const [noCompanyCount] = await db
      .select({ count: count(facilities.id) })
      .from(facilities)
      .innerJoin(states, eq(facilities.stateId, states.id))
      .where(and(
        eq(states.slug, "florida"),
        sql`${facilities.companyName} IS NULL OR ${facilities.companyName} = ''`
      ));
    
    // Check for facilities without facility types
    const [noTypeCount] = await db
      .select({ count: count(facilities.id) })
      .from(facilities)
      .innerJoin(states, eq(facilities.stateId, states.id))
      .where(and(
        eq(states.slug, "florida"),
        sql`${facilities.facilityType} IS NULL OR ${facilities.facilityType} = ''`
      ));
    
    console.log(`\n🔍 DATA QUALITY REPORT:`);
    console.log(`   Facilities without categories: ${noCategoryCount.count}`);
    console.log(`   Facilities without company names: ${noCompanyCount.count}`);
    console.log(`   Facilities without facility types: ${noTypeCount.count}`);
    
    if (noCategoryCount.count > 0 || noCompanyCount.count > 0 || noTypeCount.count > 0) {
      console.log(`\n⚠️  Data quality issues detected. Consider running data cleanup scripts.`);
    } else {
      console.log(`\n✅ Data quality validation passed.`);
    }
  }
}

async function main() {
  try {
    const analyzer = new FloridaAnalyticsGenerator();
    await analyzer.printAnalytics();
    await analyzer.validateDataQuality();
  } catch (error) {
    console.error("❌ Error generating Florida analytics:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { FloridaAnalyticsGenerator };