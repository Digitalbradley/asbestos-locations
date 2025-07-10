#!/usr/bin/env tsx
// Final Florida data import - streamlined and efficient

import { FloridaCSVParser } from './csv-parser';
import { categorizeFacility, generateFacilitySlug, generateCitySlug } from '../server/utils/facility-categorization';
import { db } from '../server/db';
import { states, cities, categories, facilities } from '../shared/schema';
import { eq, and } from 'drizzle-orm';

async function main() {
  console.log('🚀 Final Florida Data Import Process...\n');

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
    
    // Process cities first
    const uniqueCities = [...new Set(floridaRecords.map(r => r.city))];
    const cityMap = new Map<string, any>();
    
    console.log(`🏙️  Processing ${uniqueCities.length} unique cities...`);
    
    for (const cityName of uniqueCities) {
      const citySlug = generateCitySlug(cityName);
      const facilitiesInCity = floridaRecords.filter(r => r.city === cityName);
      
      const [existingCity] = await db
        .select()
        .from(cities)
        .where(and(
          eq(cities.slug, citySlug),
          eq(cities.stateId, floridaState.id)
        ))
        .limit(1);
      
      if (existingCity) {
        cityMap.set(cityName, existingCity);
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
      }
    }
    
    // Process categories
    const categorizedFacilities = floridaRecords.map(record => ({
      ...record,
      category: categorizeFacility(record.name)
    }));
    
    const uniqueCategories = [...new Set(categorizedFacilities.map(f => f.category))];
    const categoryMap = new Map<string, any>();
    
    console.log(`🏭 Processing ${uniqueCategories.length} categories...`);
    
    for (const categoryName of uniqueCategories) {
      const categorySlug = generateCitySlug(categoryName);
      const facilitiesInCategory = categorizedFacilities.filter(f => f.category === categoryName);
      
      const [existingCategory] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, categorySlug))
        .limit(1);
      
      if (existingCategory) {
        categoryMap.set(categoryName, existingCategory);
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
      }
    }
    
    // Process facilities in batches
    console.log(`🏢 Processing ${categorizedFacilities.length} facilities...`);
    
    const batchSize = 100;
    let processedCount = 0;
    
    for (let i = 0; i < categorizedFacilities.length; i += batchSize) {
      const batch = categorizedFacilities.slice(i, i + batchSize);
      const facilityBatch = [];
      
      for (const record of batch) {
        const city = cityMap.get(record.city);
        const category = categoryMap.get(record.category);
        
        if (!city || !category) continue;
        
        const facilitySlug = generateFacilitySlug(record.name);
        
        // Check if facility already exists
        const [existingFacility] = await db
          .select()
          .from(facilities)
          .where(and(
            eq(facilities.slug, facilitySlug),
            eq(facilities.stateId, floridaState.id)
          ))
          .limit(1);
        
        if (existingFacility) continue;
        
        facilityBatch.push({
          name: record.name,
          slug: facilitySlug,
          cityId: city.id,
          stateId: floridaState.id,
          categoryId: category.id,
          companyName: record.companyName,
          address: record.address,
          metaTitle: record.metaTitle,
          metaDescription: `Learn about potential asbestos exposure at ${record.name} in ${record.city}, Florida. Find information about exposure periods and legal resources.`,
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
        processedCount += facilityBatch.length;
        console.log(`  ✅ Processed ${processedCount}/${categorizedFacilities.length} facilities`);
      }
    }
    
    console.log(`\n✅ Import complete!`);
    console.log(`📊 Final stats:`);
    console.log(`  - Cities: ${uniqueCities.length}`);
    console.log(`  - Categories: ${uniqueCategories.length}`);
    console.log(`  - Facilities: ${processedCount}`);
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
  }
}

main().catch(console.error);