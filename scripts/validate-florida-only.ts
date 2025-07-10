#!/usr/bin/env tsx
// Script to validate ONLY Florida CSV data

import { FloridaCSVParser } from './csv-parser';

async function main() {
  console.log('🔍 Starting Florida-Only CSV Validation...\n');

  try {
    const parser = new FloridaCSVParser();
    
    // Parse the CSV
    console.log('📋 Parsing CSV file...');
    const result = await parser.parseCSV();
    
    // Filter for Florida only
    const floridaRecords = result.validRecords.filter(record => 
      record.state === 'Florida' || record.state === 'FL'
    );
    
    // Get unique Florida cities
    const floridaCities = new Set<string>();
    floridaRecords.forEach(record => floridaCities.add(record.city));
    const uniqueFloridaCities = Array.from(floridaCities).sort();
    
    console.log('\n📊 FLORIDA CSV VALIDATION REPORT');
    console.log('=================================');
    console.log(`Total records in CSV: ${result.totalRecords}`);
    console.log(`Valid records: ${result.validRecords.length}`);
    console.log(`Florida facilities: ${floridaRecords.length}`);
    console.log(`Florida cities: ${uniqueFloridaCities.length}`);
    
    // Show Florida city statistics
    const floridaCityCount: { [key: string]: number } = {};
    floridaRecords.forEach(record => {
      floridaCityCount[record.city] = (floridaCityCount[record.city] || 0) + 1;
    });
    
    const topFloridaCities = Object.entries(floridaCityCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    console.log('\n🏙️  TOP 10 FLORIDA CITIES BY FACILITY COUNT:');
    console.log('===========================================');
    topFloridaCities.forEach(([city, count], index) => {
      console.log(`${index + 1}. ${city}: ${count} facilities`);
    });
    
    // Show sample Florida facilities
    console.log('\n📝 SAMPLE FLORIDA FACILITIES:');
    console.log('=============================');
    floridaRecords.slice(0, 10).forEach((record, index) => {
      console.log(`${index + 1}. ${record.name} (${record.city})`);
    });
    
    // Show all Florida cities
    console.log(`\n🏙️  ALL ${uniqueFloridaCities.length} FLORIDA CITIES:');
    console.log('===============================');
    uniqueFloridaCities.forEach((city, index) => {
      console.log(`${index + 1}. ${city}`);
    });
    
    // Data quality for Florida
    console.log('\n📊 FLORIDA DATA QUALITY SUMMARY:');
    console.log('================================');
    console.log(`Florida facilities found: ${floridaRecords.length}`);
    console.log(`Florida cities found: ${uniqueFloridaCities.length}`);
    
    if (floridaRecords.length >= 1800) {
      console.log('✅ SUCCESS: Found expected ~1,801 Florida facilities');
    } else {
      console.log(`⚠️  WARNING: Expected ~1,801 facilities, found ${floridaRecords.length}`);
    }
    
    if (uniqueFloridaCities.length >= 60) {
      console.log('✅ SUCCESS: Found expected ~63 Florida cities');
    } else {
      console.log(`⚠️  WARNING: Expected ~63 cities, found ${uniqueFloridaCities.length}`);
    }
    
    // Check for coordinate data
    const facilitiesWithCoords = floridaRecords.filter(f => f.latitude && f.longitude);
    console.log(`\nCoordinate data: ${facilitiesWithCoords.length}/${floridaRecords.length} facilities (${((facilitiesWithCoords.length / floridaRecords.length) * 100).toFixed(1)}%)`);
    
  } catch (error) {
    console.error('❌ Florida CSV validation failed:', error.message);
    process.exit(1);
  }
}

// Run the validation
main().catch(console.error);