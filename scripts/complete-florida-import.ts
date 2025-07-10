#!/usr/bin/env tsx
// Complete Florida facility import to reach 1,801 total

import { FloridaCSVParser } from './csv-parser';
import { db } from '../server/db';
import { states, cities, categories, facilities } from '../shared/schema';
import { eq, count } from 'drizzle-orm';

async function main() {
  console.log('🔍 Analyzing Florida facility import status...\n');

  try {
    // Get current database counts
    const [facilityCount] = await db
      .select({ count: count() })
      .from(facilities)
      .where(eq(facilities.stateId, 3));

    console.log(`📊 Current database: ${facilityCount.count} facilities`);

    // Parse CSV to see how many valid Florida records we have
    const parser = new FloridaCSVParser();
    const result = await parser.parseCSV();
    
    const floridaRecords = result.validRecords.filter(record => 
      record.state === 'Florida' || record.state === 'FL'
    );
    
    console.log(`📋 CSV contains: ${floridaRecords.length} valid Florida facilities`);
    console.log(`📈 Target: 1,801 total facilities`);
    console.log(`🎯 Need to import: ${1801 - facilityCount.count} more facilities`);

    if (facilityCount.count >= 1801) {
      console.log('✅ Target reached! Database already contains 1,801+ facilities');
      return;
    }

    // Calculate what we need
    const needed = 1801 - facilityCount.count;
    console.log(`\n🚀 Importing ${needed} additional facilities...`);

    // Get existing facility names to avoid duplicates
    const existingFacilities = await db
      .select({ name: facilities.name })
      .from(facilities)
      .where(eq(facilities.stateId, 3));

    const existingNames = new Set(existingFacilities.map(f => f.name));

    // Get states, cities, and categories
    const [floridaState] = await db
      .select()
      .from(states)
      .where(eq(states.slug, 'florida'));

    const existingCities = await db
      .select()
      .from(cities)
      .where(eq(cities.stateId, floridaState.id));

    const existingCategories = await db
      .select()
      .from(categories);

    const cityMap = new Map(existingCities.map(c => [c.name, c]));
    const categoryMap = new Map(existingCategories.map(c => [c.name, c]));

    // Find facilities not yet imported
    const toImport = [];
    for (const record of floridaRecords) {
      if (!existingNames.has(record.name)) {
        const city = cityMap.get(record.city);
        if (city) {
          toImport.push({
            ...record,
            cityRecord: city
          });
        }
      }
    }

    console.log(`📦 Found ${toImport.length} unique facilities to import`);

    // Import facilities up to our target
    const facilitiesToImport = toImport.slice(0, needed);
    let imported = 0;

    for (const record of facilitiesToImport) {
      try {
        // Simple categorization
        let category = 'Manufacturing';
        if (record.name.toLowerCase().includes('school')) category = 'Schools';
        else if (record.name.toLowerCase().includes('hospital')) category = 'Hospitals';
        else if (record.name.toLowerCase().includes('power')) category = 'Power Plants';
        else if (record.name.toLowerCase().includes('ship')) category = 'Shipyards';

        const categoryRecord = categoryMap.get(category);
        const slug = record.name.toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .substring(0, 50);

        await db.insert(facilities).values({
          name: record.name,
          slug: slug,
          cityId: record.cityRecord.id,
          stateId: floridaState.id,
          categoryId: categoryRecord?.id || null,
          companyName: record.companyName,
          address: record.address,
          description: record.description,
          metaTitle: record.metaTitle,
          seoKeyword: record.seoKeyword,
          isActive: true,
          isFeatured: false
        });

        imported++;
        
        if (imported % 50 === 0) {
          console.log(`  ✅ Imported ${imported}/${needed} facilities`);
        }
      } catch (error) {
        console.error(`❌ Failed to import ${record.name}:`, error);
      }
    }

    // Final count
    const [finalCount] = await db
      .select({ count: count() })
      .from(facilities)
      .where(eq(facilities.stateId, 3));

    console.log(`\n🎉 Import complete!`);
    console.log(`📊 Final count: ${finalCount.count} Florida facilities`);
    console.log(`🎯 Target: ${finalCount.count >= 1801 ? 'ACHIEVED' : 'PARTIAL'}`);

    // Update state facility count
    await db
      .update(states)
      .set({ facilityCount: finalCount.count })
      .where(eq(states.id, floridaState.id));

    console.log('✅ State facility count updated');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);