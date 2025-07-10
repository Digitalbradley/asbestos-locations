#!/usr/bin/env tsx
// Import only the missing facilities to reach 1,801 total

import { FloridaCSVParser } from './csv-parser';
import { categorizeFacility, generateFacilitySlug } from '../server/utils/facility-categorization';
import { db } from '../server/db';
import { states, cities, categories, facilities } from '../shared/schema';
import { eq, and } from 'drizzle-orm';

async function main() {
  console.log('🚀 Importing Missing Florida Facilities...\n');

  try {
    // Parse CSV data
    const parser = new FloridaCSVParser();
    const result = await parser.parseCSV();
    
    const floridaRecords = result.validRecords.filter(record => 
      record.state === 'Florida' || record.state === 'FL'
    );
    
    console.log(`📊 Found ${floridaRecords.length} Florida facilities in CSV`);
    
    // Get Florida state
    const [floridaState] = await db
      .select()
      .from(states)
      .where(eq(states.slug, 'florida'))
      .limit(1);
    
    if (!floridaState) {
      console.error('❌ Florida state not found');
      return;
    }
    
    // Get existing facilities to check for duplicates
    const existingFacilities = await db
      .select({ slug: facilities.slug })
      .from(facilities)
      .where(eq(facilities.stateId, floridaState.id));
    
    const existingSlugs = new Set(existingFacilities.map(f => f.slug));
    console.log(`📋 Found ${existingSlugs.size} existing facilities`);
    
    // Get all cities and categories
    const existingCities = await db
      .select()
      .from(cities)
      .where(eq(cities.stateId, floridaState.id));
    
    const existingCategories = await db
      .select()
      .from(categories);
    
    const cityMap = new Map(existingCities.map(c => [c.name, c]));
    const categoryMap = new Map(existingCategories.map(c => [c.name, c]));
    
    // Find missing facilities
    const missingFacilities = [];
    
    for (const record of floridaRecords) {
      const slug = generateFacilitySlug(record.name);
      
      if (!existingSlugs.has(slug)) {
        const city = cityMap.get(record.city);
        if (city) {
          const category = categorizeFacility(record.name);
          const categoryRecord = categoryMap.get(category);
          
          missingFacilities.push({
            ...record,
            slug,
            category,
            cityRecord: city,
            categoryRecord
          });
        }
      }
    }
    
    console.log(`🔍 Found ${missingFacilities.length} missing facilities to import`);
    
    if (missingFacilities.length === 0) {
      console.log('✅ No missing facilities found - database is complete!');
      return;
    }
    
    // Import missing facilities
    console.log('\n🏢 Importing missing facilities...');
    let createdCount = 0;
    
    for (const record of missingFacilities) {
      try {
        await db.insert(facilities).values({
          name: record.name,
          slug: record.slug,
          cityId: record.cityRecord.id,
          stateId: floridaState.id,
          categoryId: record.categoryRecord?.id || null,
          companyName: record.companyName,
          address: record.address,
          description: record.description,
          metaTitle: record.metaTitle,
          seoKeyword: record.seoKeyword,
          isActive: true,
          isFeatured: false
        });
        
        createdCount++;
        
        if (createdCount % 10 === 0) {
          console.log(`  ✅ Imported ${createdCount}/${missingFacilities.length} facilities`);
        }
      } catch (error) {
        console.error(`❌ Failed to import ${record.name}:`, error);
      }
    }
    
    console.log(`\n🎉 Successfully imported ${createdCount} missing facilities!`);
    
    // Update facility counts
    console.log('\n📊 Updating facility counts...');
    
    const finalCount = await db
      .select({ count: facilities.id })
      .from(facilities)
      .where(eq(facilities.stateId, floridaState.id));
    
    console.log(`📈 Total Florida facilities: ${finalCount.length}`);
    
    // Update state facility count
    await db
      .update(states)
      .set({ facilityCount: finalCount.length })
      .where(eq(states.id, floridaState.id));
    
    console.log('✅ Import complete!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);