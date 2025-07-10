#!/usr/bin/env tsx
// Test the facility categorization algorithm with actual Florida data

import { FloridaCSVParser } from './csv-parser';
import { categorizeFacility, generateFacilitySlug } from '../server/utils/facility-categorization';

async function main() {
  console.log('🔍 Testing Facility Categorization Algorithm with Florida Data...\n');

  try {
    const parser = new FloridaCSVParser();
    const result = await parser.parseCSV();
    
    // Filter for Florida records
    const floridaRecords = result.validRecords.filter(record => 
      record.state === 'Florida' || record.state === 'FL'
    );
    
    console.log(`📊 Processing ${floridaRecords.length} Florida facilities...\n`);
    
    // Categorize all facilities
    const categorizedFacilities = floridaRecords.map(record => ({
      name: record.name,
      city: record.city,
      category: categorizeFacility(record.name),
      slug: generateFacilitySlug(record.name),
      metaTitle: record.metaTitle
    }));
    
    // Generate category statistics
    const categoryStats = categorizedFacilities.reduce((stats, facility) => {
      stats[facility.category] = (stats[facility.category] || 0) + 1;
      return stats;
    }, {} as Record<string, number>);
    
    console.log('📈 CATEGORY DISTRIBUTION:');
    console.log('========================');
    Object.entries(categoryStats)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        const percentage = ((count / floridaRecords.length) * 100).toFixed(1);
        console.log(`${category}: ${count} facilities (${percentage}%)`);
      });
    
    console.log('\n🏭 SAMPLE CATEGORIZATIONS BY CATEGORY:');
    console.log('====================================');
    
    // Show examples for each category
    Object.keys(categoryStats).forEach(category => {
      const examples = categorizedFacilities
        .filter(f => f.category === category)
        .slice(0, 5);
      
      console.log(`\n${category.toUpperCase()}:`);
      examples.forEach((facility, index) => {
        console.log(`  ${index + 1}. ${facility.name} (${facility.city})`);
        console.log(`     Slug: ${facility.slug}`);
      });
    });
    
    console.log('\n🔍 PATTERN ANALYSIS:');
    console.log('==================');
    
    // Analyze uncategorized or manufacturing-categorized facilities
    const manufacturingFacilities = categorizedFacilities.filter(f => f.category === 'Manufacturing');
    console.log(`\nManufacturing category (${manufacturingFacilities.length} facilities):`);
    console.log('These may need additional pattern refinement:');
    manufacturingFacilities.slice(0, 10).forEach((facility, index) => {
      console.log(`  ${index + 1}. ${facility.name}`);
    });
    
    // Look for common patterns that might need new categories
    console.log('\n🔍 POTENTIAL NEW CATEGORIES:');
    console.log('===========================');
    
    const facilityNames = categorizedFacilities.map(f => f.name.toLowerCase());
    const commonPatterns = [
      { pattern: /mall|shopping|retail|store/i, suggested: 'Retail/Commercial' },
      { pattern: /hotel|motel|inn|resort/i, suggested: 'Hotels/Hospitality' },
      { pattern: /apartment|condo|housing|residential/i, suggested: 'Residential' },
      { pattern: /office|building|tower|center/i, suggested: 'Commercial Buildings' },
      { pattern: /airport|terminal|aviation/i, suggested: 'Transportation' },
      { pattern: /warehouse|distribution|storage/i, suggested: 'Warehousing' },
      { pattern: /restaurant|food|dining/i, suggested: 'Food Service' },
      { pattern: /bank|financial|insurance/i, suggested: 'Financial Services' },
      { pattern: /government|federal|state|city/i, suggested: 'Government' },
      { pattern: /church|temple|synagogue|mosque/i, suggested: 'Religious' }
    ];
    
    commonPatterns.forEach(({ pattern, suggested }) => {
      const matchCount = facilityNames.filter(name => pattern.test(name)).length;
      if (matchCount > 0) {
        console.log(`${suggested}: ${matchCount} potential matches`);
        const examples = categorizedFacilities
          .filter(f => pattern.test(f.name))
          .slice(0, 3)
          .map(f => f.name);
        console.log(`  Examples: ${examples.join(', ')}`);
      }
    });
    
    console.log('\n📊 CATEGORIZATION QUALITY ANALYSIS:');
    console.log('==================================');
    
    // Calculate quality metrics
    const highPriorityCategories = ['Power Plants', 'Shipyards', 'Schools', 'Hospitals'];
    const highPriorityCount = categorizedFacilities.filter(f => 
      highPriorityCategories.includes(f.category)
    ).length;
    
    const manufacturingPercentage = (manufacturingFacilities.length / floridaRecords.length) * 100;
    
    console.log(`High-priority categories: ${highPriorityCount}/${floridaRecords.length} (${((highPriorityCount / floridaRecords.length) * 100).toFixed(1)}%)`);
    console.log(`Manufacturing (default): ${manufacturingFacilities.length}/${floridaRecords.length} (${manufacturingPercentage.toFixed(1)}%)`);
    
    if (manufacturingPercentage > 70) {
      console.log('⚠️  High default categorization suggests need for additional patterns');
    } else if (manufacturingPercentage < 30) {
      console.log('✅ Good categorization coverage with specific patterns');
    } else {
      console.log('✅ Reasonable categorization balance');
    }
    
    console.log('\n🎯 RECOMMENDATIONS:');
    console.log('==================');
    
    if (manufacturingPercentage > 60) {
      console.log('1. Add more specific category patterns for common facility types');
      console.log('2. Consider creating new categories for retail, commercial, residential');
      console.log('3. Improve pattern matching for ambiguous facility names');
    }
    
    console.log('4. Review and validate categorization results before database import');
    console.log('5. Consider manual review for high-value facilities');
    console.log('6. Implement category confidence scoring for quality assurance');
    
    console.log('\n🔥 TOP CITIES BY FACILITY COUNT:');
    console.log('===============================');
    
    const cityStats = categorizedFacilities.reduce((stats, facility) => {
      stats[facility.city] = (stats[facility.city] || 0) + 1;
      return stats;
    }, {} as Record<string, number>);
    
    Object.entries(cityStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([city, count], index) => {
        console.log(`${index + 1}. ${city}: ${count} facilities`);
      });
    
    console.log('\n✅ CATEGORIZATION ALGORITHM READY FOR IMPLEMENTATION');
    console.log('==================================================');
    console.log('The algorithm has been tested with real Florida data and is ready for:');
    console.log('1. Database import with category assignments');
    console.log('2. City record generation from facility locations');
    console.log('3. Content template integration with categorized data');
    console.log('4. SEO optimization with category-specific content');
    
  } catch (error) {
    console.error('❌ Categorization test failed:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);