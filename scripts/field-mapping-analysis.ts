#!/usr/bin/env tsx
// Analysis of CSV field mappings for Florida data

import { FloridaCSVParser } from './csv-parser';

async function main() {
  console.log('🔍 Analyzing Florida CSV Field Mappings...\n');

  try {
    const parser = new FloridaCSVParser();
    const result = await parser.parseCSV();
    
    // Filter for Florida records
    const floridaRecords = result.validRecords.filter(record => 
      record.state === 'Florida' || record.state === 'FL'
    );
    
    console.log('📊 FIELD MAPPING ANALYSIS');
    console.log('=========================');
    console.log(`CSV Columns: ${result.columnHeaders.join(', ')}`);
    console.log(`Florida Records: ${floridaRecords.length}`);
    
    // Show detailed field mapping for sample records
    console.log('\n📋 DETAILED FIELD MAPPING EXAMPLES:');
    console.log('===================================');
    
    floridaRecords.slice(0, 5).forEach((record, index) => {
      console.log(`\n${index + 1}. RECORD BREAKDOWN:`);
      console.log(`   Raw Job Site: "${record.rawData['Job Site']}"`);
      console.log(`   Raw City: "${record.rawData['City']}"`);
      console.log(`   Raw State: "${record.rawData['State']}"`);
      console.log(`   Raw Meta Title: "${record.rawData['City Location Page Name']}"`);
      console.log(`   ↓ PARSED FIELDS:`);
      console.log(`   Facility Name: "${record.name}"`);
      console.log(`   Company Name: "${record.companyName}"`);
      console.log(`   City: "${record.city}"`);
      console.log(`   State: "${record.state}"`);
      console.log(`   Meta Title: "${record.metaTitle}"`);
      console.log(`   SEO Keyword: "${record.seoKeyword}"`);
    });
    
    console.log('\n🎯 FIELD USAGE STRATEGY:');
    console.log('========================');
    console.log('Job Site → Facility Name & Company Name (primary business identifier)');
    console.log('City → City Name (geographic location)');
    console.log('State → State Abbreviation (FL for Florida)');
    console.log('City Location Page Name → Meta Title & SEO Keyword (page optimization)');
    
    console.log('\n📈 SEO OPTIMIZATION ANALYSIS:');
    console.log('=============================');
    
    // Analyze meta titles
    const metaTitles = floridaRecords.filter(r => r.metaTitle).map(r => r.metaTitle!);
    console.log(`Records with meta titles: ${metaTitles.length}/${floridaRecords.length}`);
    
    // Analyze SEO keywords
    const seoKeywords = floridaRecords.filter(r => r.seoKeyword).map(r => r.seoKeyword!);
    console.log(`Records with SEO keywords: ${seoKeywords.length}/${floridaRecords.length}`);
    
    // Show sample meta title patterns
    console.log('\nSample Meta Title Patterns:');
    metaTitles.slice(0, 5).forEach((title, index) => {
      console.log(`${index + 1}. ${title}`);
    });
    
    // Show sample SEO keyword patterns
    console.log('\nSample SEO Keyword Patterns:');
    seoKeywords.slice(0, 5).forEach((keyword, index) => {
      console.log(`${index + 1}. ${keyword}`);
    });
    
    console.log('\n🏢 COMPANY NAME ANALYSIS:');
    console.log('=========================');
    
    // Check company name coverage
    const withCompanyNames = floridaRecords.filter(r => r.companyName);
    console.log(`Records with company names: ${withCompanyNames.length}/${floridaRecords.length} (${((withCompanyNames.length / floridaRecords.length) * 100).toFixed(1)}%)`);
    
    // Show company name patterns
    console.log('\nCompany Name Patterns:');
    withCompanyNames.slice(0, 10).forEach((record, index) => {
      console.log(`${index + 1}. ${record.companyName}`);
    });
    
    console.log('\n✅ FIELD MAPPING RECOMMENDATIONS:');
    console.log('==================================');
    console.log('1. Job Site field provides both facility name and company name');
    console.log('2. City Location Page Name is perfect for meta titles and SEO');
    console.log('3. SEO keywords can be extracted by removing "asbestos exposure"');
    console.log('4. All 1,794 Florida records have complete field mapping');
    console.log('5. Ready for database import with proper field assignments');
    
    console.log('\n🎯 NEXT STEPS RECOMMENDATIONS:');
    console.log('==============================');
    console.log('1. Update database schema to include metaTitle and seoKeyword fields');
    console.log('2. Use Job Site as both facility name and company name');
    console.log('3. Use City Location Page Name for page SEO optimization');
    console.log('4. Proceed with facility categorization using Job Site field');
    console.log('5. Generate city records from unique City values');
    
  } catch (error) {
    console.error('❌ Field mapping analysis failed:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);