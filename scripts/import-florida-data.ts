#!/usr/bin/env tsx
// Complete Florida data import script - Phase 2 Step 2 Implementation

import { FloridaCSVParser } from './csv-parser';
import { categorizeFacility, generateFacilitySlug, generateCitySlug } from '../server/utils/facility-categorization';
import { db } from '../server/db';
import { states, cities, categories, facilities } from '../shared/schema';
import { eq } from 'drizzle-orm';

interface ImportStats {
  totalRecords: number;
  stateCreated: boolean;
  citiesCreated: number;
  categoriesCreated: number;
  facilitiesCreated: number;
  errors: string[];
}

async function main() {
  console.log('🚀 Starting Florida Asbestos Data Import Process...\n');
  
  const stats: ImportStats = {
    totalRecords: 0,
    stateCreated: false,
    citiesCreated: 0,
    categoriesCreated: 0,
    facilitiesCreated: 0,
    errors: []
  };

  try {
    // Step 1: Parse CSV data
    console.log('📋 Step 1: Parsing CSV data...');
    const parser = new FloridaCSVParser();
    const result = await parser.parseCSV();
    
    const floridaRecords = result.validRecords.filter(record => 
      record.state === 'Florida' || record.state === 'FL'
    );
    
    stats.totalRecords = floridaRecords.length;
    console.log(`✅ Parsed ${floridaRecords.length} Florida facilities`);
    
    // Step 2: Create or get Florida state
    console.log('\n🏛️  Step 2: Creating Florida state record...');
    let floridaState;
    
    // Check if Florida state already exists
    const existingState = await db
      .select()
      .from(states)
      .where(eq(states.slug, 'florida'))
      .limit(1);
    
    if (existingState.length > 0) {
      floridaState = existingState[0];
      console.log(`✅ Found existing Florida state (ID: ${floridaState.id})`);
    } else {
      const [newState] = await db
        .insert(states)
        .values({
          name: 'Florida',
          slug: 'florida',
          abbreviation: 'FL',
          facilityCount: floridaRecords.length
        })
        .returning();
      
      floridaState = newState;
      stats.stateCreated = true;
      console.log(`✅ Created Florida state (ID: ${floridaState.id})`);
    }
    
    // Step 3: Create city records
    console.log('\n🏙️  Step 3: Creating city records...');
    const uniqueCities = [...new Set(floridaRecords.map(record => record.city))];
    const cityMap = new Map<string, any>();
    
    for (const cityName of uniqueCities) {
      const citySlug = generateCitySlug(cityName);
      const facilitiesInCity = floridaRecords.filter(record => record.city === cityName);
      
      // Check if city already exists
      const existingCity = await db
        .select()
        .from(cities)
        .where(eq(cities.slug, citySlug))
        .limit(1);
      
      if (existingCity.length > 0) {
        cityMap.set(cityName, existingCity[0]);
        console.log(`  ✅ Found existing city: ${cityName} (${facilitiesInCity.length} facilities)`);
      } else {
        const [newCity] = await db
          .insert(cities)
          .values({
            name: cityName,
            slug: citySlug,
            stateId: floridaState.id,
            facilityCount: facilitiesInCity.length
          })
          .returning();
        
        cityMap.set(cityName, newCity);
        stats.citiesCreated++;
        console.log(`  ✅ Created city: ${cityName} (${facilitiesInCity.length} facilities)`);
      }
    }
    
    // Step 4: Create category records
    console.log('\n🏭 Step 4: Creating category records...');
    const categorizedFacilities = floridaRecords.map(record => ({
      ...record,
      category: categorizeFacility(record.name)
    }));
    
    const uniqueCategories = [...new Set(categorizedFacilities.map(f => f.category))];
    const categoryMap = new Map<string, any>();
    
    for (const categoryName of uniqueCategories) {
      const categorySlug = generateCitySlug(categoryName);
      const facilitiesInCategory = categorizedFacilities.filter(f => f.category === categoryName);
      
      // Check if category already exists
      const existingCategory = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, categorySlug))
        .limit(1);
      
      if (existingCategory.length > 0) {
        categoryMap.set(categoryName, existingCategory[0]);
        console.log(`  ✅ Found existing category: ${categoryName} (${facilitiesInCategory.length} facilities)`);
      } else {
        const [newCategory] = await db
          .insert(categories)
          .values({
            name: categoryName,
            slug: categorySlug,
            description: `Asbestos exposure sites in the ${categoryName.toLowerCase()} industry`,
            facilityCount: facilitiesInCategory.length
          })
          .returning();
        
        categoryMap.set(categoryName, newCategory);
        stats.categoriesCreated++;
        console.log(`  ✅ Created category: ${categoryName} (${facilitiesInCategory.length} facilities)`);
      }
    }
    
    // Step 5: Create facility records
    console.log('\n🏢 Step 5: Creating facility records...');
    let facilityBatch = [];
    const batchSize = 50;
    
    for (let i = 0; i < categorizedFacilities.length; i++) {
      const record = categorizedFacilities[i];
      const city = cityMap.get(record.city);
      const category = categoryMap.get(record.category);
      
      if (!city) {
        stats.errors.push(`City not found for facility: ${record.name}`);
        continue;
      }
      
      if (!category) {
        stats.errors.push(`Category not found for facility: ${record.name}`);
        continue;
      }
      
      const facilitySlug = generateFacilitySlug(record.name);
      
      // Check if facility already exists
      const existingFacility = await db
        .select()
        .from(facilities)
        .where(eq(facilities.slug, facilitySlug))
        .limit(1);
      
      if (existingFacility.length > 0) {
        console.log(`  ⚠️  Skipping existing facility: ${record.name}`);
        continue;
      }
      
      const facilityData = {
        name: record.name,
        slug: facilitySlug,
        cityId: city.id,
        stateId: floridaState.id,
        categoryId: category.id,
        companyName: record.companyName,
        address: record.address,
        metaTitle: record.metaTitle,
        metaDescription: `Learn about potential asbestos exposure at ${record.name} in ${record.city}, Florida. Find information about exposure periods, worker safety, and legal resources.`,
        seoKeyword: record.seoKeyword,
        pageTitleTemplate: record.metaTitle,
        latitude: record.latitude ? parseFloat(record.latitude) : null,
        longitude: record.longitude ? parseFloat(record.longitude) : null,
        isActive: true,
        isFeatured: false
      };
      
      facilityBatch.push(facilityData);
      
      // Process in batches
      if (facilityBatch.length >= batchSize || i === categorizedFacilities.length - 1) {
        try {
          await db.insert(facilities).values(facilityBatch);
          stats.facilitiesCreated += facilityBatch.length;
          console.log(`  ✅ Created ${facilityBatch.length} facilities (${stats.facilitiesCreated}/${categorizedFacilities.length})`);
          facilityBatch = [];
        } catch (error) {
          stats.errors.push(`Batch insert failed: ${error.message}`);
          console.error(`  ❌ Batch insert failed: ${error.message}`);
        }
      }
    }
    
    // Step 6: Update facility counts
    console.log('\n📊 Step 6: Updating facility counts...');
    
    // Update state facility count
    await db
      .update(states)
      .set({ facilityCount: stats.facilitiesCreated })
      .where(eq(states.id, floridaState.id));
    
    // Update city facility counts
    for (const [cityName, city] of cityMap) {
      const facilitiesInCity = categorizedFacilities.filter(f => f.city === cityName);
      await db
        .update(cities)
        .set({ facilityCount: facilitiesInCity.length })
        .where(eq(cities.id, city.id));
    }
    
    // Update category facility counts
    for (const [categoryName, category] of categoryMap) {
      const facilitiesInCategory = categorizedFacilities.filter(f => f.category === categoryName);
      await db
        .update(categories)
        .set({ facilityCount: facilitiesInCategory.length })
        .where(eq(categories.id, category.id));
    }
    
    console.log('✅ Updated facility counts');
    
    // Final Report
    console.log('\n📋 IMPORT COMPLETE - FINAL REPORT');
    console.log('================================');
    console.log(`Total records processed: ${stats.totalRecords}`);
    console.log(`State created: ${stats.stateCreated ? 'Yes' : 'No (already existed)'}`);
    console.log(`Cities created: ${stats.citiesCreated}`);
    console.log(`Categories created: ${stats.categoriesCreated}`);
    console.log(`Facilities created: ${stats.facilitiesCreated}`);
    console.log(`Errors: ${stats.errors.length}`);
    
    if (stats.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      stats.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Verify data integrity in the database');
    console.log('2. Test facility categorization accuracy');
    console.log('3. Generate content templates for facilities');
    console.log('4. Test SEO optimization with meta titles');
    console.log('5. Implement facility proximity calculations');
    
    console.log('\n✅ Florida asbestos data import successfully completed!');
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

main().catch(console.error);