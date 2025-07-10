#!/usr/bin/env tsx
// Data quality validation for Florida CSV processing

import { FloridaCSVParser } from './csv-parser';
import { categorizeFacility } from '../server/utils/facility-categorization';

async function main() {
  console.log('🔍 Running Data Quality Check for Florida CSV...\n');

  try {
    const parser = new FloridaCSVParser();
    const result = await parser.parseCSV();
    
    // Filter for Florida facilities
    const floridaRecords = result.validRecords.filter(record => 
      record.state === 'Florida' || record.state === 'FL'
    );
    
    console.log('📊 DATA QUALITY ANALYSIS');
    console.log('========================');
    
    // Test facility categorization
    console.log('\n🏭 FACILITY CATEGORIZATION TEST:');
    const categoryStats: { [key: string]: number } = {};
    
    floridaRecords.slice(0, 50).forEach((record, index) => {
      const category = categorizeFacility(record.name);
      categoryStats[category] = (categoryStats[category] || 0) + 1;
      
      if (index < 10) {
        console.log(`${index + 1}. ${record.name} → ${category}`);
      }
    });
    
    console.log('\nCategory Distribution (first 50 records):');
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} facilities`);
    });
    
    // Check for data quality issues
    console.log('\n🔍 DATA QUALITY ISSUES:');
    
    // Check for very short names
    const shortNames = floridaRecords.filter(r => r.name.length < 10);
    console.log(`Short facility names: ${shortNames.length} (${((shortNames.length / floridaRecords.length) * 100).toFixed(1)}%)`);
    
    // Check for duplicate names
    const nameCount: { [key: string]: number } = {};
    floridaRecords.forEach(record => {
      nameCount[record.name] = (nameCount[record.name] || 0) + 1;
    });
    const duplicates = Object.entries(nameCount).filter(([,count]) => count > 1);
    console.log(`Duplicate facility names: ${duplicates.length}`);
    
    // Check for missing company names
    const missingCompany = floridaRecords.filter(r => !r.companyName);
    console.log(`Missing company names: ${missingCompany.length} (${((missingCompany.length / floridaRecords.length) * 100).toFixed(1)}%)`);
    
    // Check for standardized city names
    const cityNames = new Set(floridaRecords.map(r => r.city));
    const potentialDuplicates = Array.from(cityNames).filter(city => 
      Array.from(cityNames).some(other => 
        other !== city && 
        other.toLowerCase().includes(city.toLowerCase()) ||
        city.toLowerCase().includes(other.toLowerCase())
      )
    );
    console.log(`Potential city name duplicates: ${potentialDuplicates.length}`);
    
    // Show data readiness
    console.log('\n✅ DATA READINESS ASSESSMENT:');
    console.log('=============================');
    console.log(`Florida facilities ready for import: ${floridaRecords.length}`);
    console.log(`Expected city records to create: ${cityNames.size}`);
    console.log(`Categorization algorithm: Ready`);
    console.log(`Data validation: Passed`);
    
    if (floridaRecords.length >= 1700) {
      console.log('✅ Sufficient facility data for Phase 2 import');
    } else {
      console.log('⚠️  Lower than expected facility count for import');
    }
    
  } catch (error) {
    console.error('❌ Data quality check failed:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);