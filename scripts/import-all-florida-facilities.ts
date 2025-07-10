#!/usr/bin/env tsx
// Import all 1,794 Florida facilities with optimized batch processing

import { FloridaCSVParser } from './csv-parser';
import { categorizeFacility, generateFacilitySlug } from '../server/utils/facility-categorization';
import { db } from '../server/db';
import { states, cities, categories, facilities } from '../shared/schema';
import { eq, and } from 'drizzle-orm';

async function main() {
  console.log('🚀 Importing All Florida Facilities...\n');

  try {
    // Parse CSV data
    const parser = new FloridaCSVParser();
    const result = await parser.parseCSV();
    
    const floridaRecords = result.validRecords.filter(record => 
      record.state === 'Florida' || record.state === 'FL'
    );
    
    console.log(`📊 Processing ${floridaRecords.length} Florida facilities...`);
    
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
    
    // Get all existing cities and categories
    const existingCities = await db
      .select()
      .from(cities)
      .where(eq(cities.stateId, floridaState.id));
    
    const existingCategories = await db
      .select()
      .from(categories);
    
    console.log(`📋 Found ${existingCities.length} cities and ${existingCategories.length} categories`);
    
    // Create maps for quick lookup
    const cityMap = new Map(existingCities.map(c => [c.name, c]));
    const categoryMap = new Map(existingCategories.map(c => [c.name, c]));
    
    // Process facilities with categorization
    console.log('\n🏭 Categorizing facilities...');
    const categorizedFacilities = floridaRecords.map(record => ({
      ...record,
      category: categorizeFacility(record.name),
      slug: generateFacilitySlug(record.name)
    }));
    
    // Create missing categories
    const uniqueCategories = [...new Set(categorizedFacilities.map(f => f.category))];
    const missingCategories = uniqueCategories.filter(cat => !categoryMap.has(cat));
    
    if (missingCategories.length > 0) {
      console.log(`Creating ${missingCategories.length} new categories...`);
      
      for (const categoryName of missingCategories) {
        const categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
        const facilitiesInCategory = categorizedFacilities.filter(f => f.category === categoryName);
        
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
        console.log(`  ✅ Created category: ${categoryName}`);
      }
    }
    
    // Import facilities in batches
    console.log('\n🏢 Importing facilities...');
    const batchSize = 50;
    let processedCount = 0;
    let createdCount = 0;
    let skippedCount = 0;
    
    for (let i = 0; i < categorizedFacilities.length; i += batchSize) {
      const batch = categorizedFacilities.slice(i, i + batchSize);
      const facilityBatch = [];
      
      for (const record of batch) {
        // Find city (with fallback for name variations)
        let city = cityMap.get(record.city);
        if (!city) {
          // Try to find city with similar name
          const similarCity = existingCities.find(c => 
            c.name.toLowerCase().includes(record.city.toLowerCase()) ||
            record.city.toLowerCase().includes(c.name.toLowerCase())
          );
          if (similarCity) {
            city = similarCity;
          }
        }
        
        const category = categoryMap.get(record.category);
        
        if (!city) {
          console.log(`  ⚠️  No city found for: ${record.name} (${record.city})`);
          skippedCount++;
          continue;
        }
        
        if (!category) {
          console.log(`  ⚠️  No category found for: ${record.name} (${record.category})`);
          skippedCount++;
          continue;
        }
        
        // Check if facility already exists
        const existingFacility = await db
          .select()
          .from(facilities)
          .where(and(
            eq(facilities.slug, record.slug),
            eq(facilities.stateId, floridaState.id)
          ))
          .limit(1);
        
        if (existingFacility.length > 0) {
          skippedCount++;
          continue;
        }
        
        facilityBatch.push({
          name: record.name,
          slug: record.slug,
          cityId: city.id,
          stateId: floridaState.id,
          categoryId: category.id,
          companyName: record.companyName,
          address: record.address,
          metaTitle: record.metaTitle,
          metaDescription: `Learn about potential asbestos exposure at ${record.name} in ${record.city}, Florida. Find information about exposure periods, worker safety, and legal resources for mesothelioma cases.`,
          seoKeyword: record.seoKeyword,
          pageTitleTemplate: record.metaTitle,
          latitude: record.latitude ? parseFloat(record.latitude) : null,
          longitude: record.longitude ? parseFloat(record.longitude) : null,
          isActive: true,
          isFeatured: false
        });
      }
      
      if (facilityBatch.length > 0) {
        await db.insert(facilities).values(facilityBatch);
        createdCount += facilityBatch.length;
      }
      
      processedCount += batch.length;
      console.log(`  ✅ Processed ${processedCount}/${categorizedFacilities.length} facilities (${createdCount} created, ${skippedCount} skipped)`);
    }
    
    // Update facility counts
    console.log('\n📊 Updating facility counts...');
    
    // Update category counts
    for (const [categoryName, category] of categoryMap) {
      const facilitiesInCategory = categorizedFacilities.filter(f => f.category === categoryName);
      await db
        .update(categories)
        .set({ facilityCount: facilitiesInCategory.length })
        .where(eq(categories.id, category.id));
    }
    
    // Update city counts
    for (const [cityName, city] of cityMap) {
      const facilitiesInCity = categorizedFacilities.filter(f => f.city === cityName);
      if (facilitiesInCity.length > 0) {
        await db
          .update(cities)
          .set({ facilityCount: facilitiesInCity.length })
          .where(eq(cities.id, city.id));
      }
    }
    
    // Update state count
    await db
      .update(states)
      .set({ facilityCount: createdCount })
      .where(eq(states.id, floridaState.id));
    
    console.log('\n✅ IMPORT COMPLETE!');
    console.log('==================');
    console.log(`Total processed: ${processedCount}`);
    console.log(`Facilities created: ${createdCount}`);
    console.log(`Facilities skipped: ${skippedCount}`);
    console.log(`Categories created: ${missingCategories.length}`);
    
    // Generate final report
    const finalCities = await db
      .select()
      .from(cities)
      .where(eq(cities.stateId, floridaState.id));
    
    const finalCategories = await db
      .select()
      .from(categories);
    
    const finalFacilities = await db
      .select()
      .from(facilities)
      .where(eq(facilities.stateId, floridaState.id));
    
    console.log('\n📊 FINAL STATISTICS:');
    console.log('===================');
    console.log(`Florida cities: ${finalCities.length}`);
    console.log(`Total categories: ${finalCategories.length}`);
    console.log(`Florida facilities: ${finalFacilities.length}`);
    
    console.log('\n🎯 READY FOR:');
    console.log('============');
    console.log('1. Content generation for all facilities');
    console.log('2. SEO optimization implementation');
    console.log('3. City page content generation');
    console.log('4. Facility proximity calculations');
    console.log('5. Frontend integration testing');
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);