#!/usr/bin/env tsx
// Script to validate and analyze the Florida CSV data

import { FloridaCSVParser } from './csv-parser';

async function main() {
  console.log('🔍 Starting CSV Validation for Florida Asbestos Data...\n');

  try {
    const parser = new FloridaCSVParser();
    
    // Parse the CSV
    console.log('📋 Parsing CSV file...');
    const result = await parser.parseCSV();
    
    // Generate and display report
    console.log('\n' + parser.generateReport(result));
    
    // Show sample valid records
    console.log('\n📝 SAMPLE VALID RECORDS:');
    console.log('========================');
    result.validRecords.slice(0, 5).forEach((record, index) => {
      console.log(`\n${index + 1}. ${record.name}`);
      console.log(`   City: ${record.city}`);
      console.log(`   Company: ${record.companyName || 'N/A'}`);
      console.log(`   Address: ${record.address || 'N/A'}`);
      console.log(`   Coordinates: ${record.latitude || 'N/A'}, ${record.longitude || 'N/A'}`);
    });
    
    // Show sample invalid records
    if (result.invalidRecords.length > 0) {
      console.log('\n❌ SAMPLE INVALID RECORDS:');
      console.log('===========================');
      result.invalidRecords.slice(0, 3).forEach((record, index) => {
        console.log(`\n${index + 1}. Errors: ${record.errors.join(', ')}`);
        console.log(`   Raw data: ${JSON.stringify(record.record, null, 2)}`);
      });
    }
    
    // Show all unique cities
    console.log('\n🏙️  ALL FLORIDA CITIES FOUND:');
    console.log('============================');
    result.uniqueCities.forEach((city, index) => {
      console.log(`${index + 1}. ${city}`);
    });
    
    // Data quality summary
    console.log('\n📊 DATA QUALITY SUMMARY:');
    console.log('========================');
    console.log(`Total facilities to process: ${result.validRecords.length}`);
    console.log(`Cities that need to be created: ${result.cityCount}`);
    console.log(`Data quality score: ${((result.validRecords.length / result.totalRecords) * 100).toFixed(1)}%`);
    
    if (result.validRecords.length >= 1800) {
      console.log('\n✅ SUCCESS: CSV contains expected ~1,801 Florida facilities');
    } else {
      console.log(`\n⚠️  WARNING: Expected ~1,801 facilities, found ${result.validRecords.length}`);
    }
    
    if (result.cityCount >= 60) {
      console.log('✅ SUCCESS: CSV contains expected ~63 Florida cities');
    } else {
      console.log(`⚠️  WARNING: Expected ~63 cities, found ${result.cityCount}`);
    }
    
  } catch (error) {
    console.error('❌ CSV validation failed:', error.message);
    process.exit(1);
  }
}

// Run the validation
main().catch(console.error);