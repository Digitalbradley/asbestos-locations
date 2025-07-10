import { FloridaAnalyticsGenerator } from "./generate-florida-analytics";
import { FloridaContentGenerator } from "./generate-florida-content";
import { FloridaSEOEnhancer } from "./enhance-florida-seo";

async function main() {
  console.log("🚀 Starting comprehensive Florida content generation process...");
  console.log("=".repeat(80));
  
  try {
    // Step 1: Generate analytics to understand current state
    console.log("📊 STEP 1: Analyzing current Florida data...");
    const analytics = new FloridaAnalyticsGenerator();
    await analytics.printAnalytics();
    await analytics.validateDataQuality();
    
    // Step 2: Generate content templates
    console.log("\n📝 STEP 2: Generating content templates...");
    const contentGenerator = new FloridaContentGenerator();
    await contentGenerator.generateFloridaContent();
    
    // Step 3: Enhance SEO data
    console.log("\n🔍 STEP 3: Enhancing SEO metadata...");
    const seoEnhancer = new FloridaSEOEnhancer();
    await seoEnhancer.enhanceFloridaSEO();
    
    // Step 4: Final analytics report
    console.log("\n📊 STEP 4: Final analytics report...");
    await analytics.printAnalytics();
    
    console.log("\n🎉 SUCCESS: Florida content generation completed!");
    console.log("✅ State-level content generated");
    console.log("✅ City-level content generated");
    console.log("✅ Facility-level content generated");
    console.log("✅ SEO metadata enhanced");
    console.log("✅ Analytics reports generated");
    
    console.log("\n🔄 Next steps:");
    console.log("1. Review generated content quality");
    console.log("2. Test pages in browser");
    console.log("3. Verify SEO completeness");
    console.log("4. Ready for additional states");
    
  } catch (error) {
    console.error("❌ Error in Florida content generation process:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as runFloridaContentGeneration };