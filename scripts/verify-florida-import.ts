#!/usr/bin/env tsx
// Verify Florida data import results

import { db } from '../server/db';
import { states, cities, categories, facilities } from '../shared/schema';
import { eq, desc } from 'drizzle-orm';

async function main() {
  console.log('🔍 Verifying Florida Data Import Results...\n');

  try {
    // Get Florida state
    const floridaState = await db
      .select()
      .from(states)
      .where(eq(states.slug, 'florida'))
      .limit(1);

    if (floridaState.length === 0) {
      console.error('❌ Florida state not found in database');
      return;
    }

    const florida = floridaState[0];
    console.log(`📍 Florida State: ${florida.name} (ID: ${florida.id})`);

    // Get cities in Florida
    const floridaCities = await db
      .select()
      .from(cities)
      .where(eq(cities.stateId, florida.id))
      .orderBy(desc(cities.facilityCount));

    console.log(`\n🏙️  Florida Cities: ${floridaCities.length}`);
    console.log('Top 10 Cities by Facility Count:');
    floridaCities.slice(0, 10).forEach((city, index) => {
      console.log(`  ${index + 1}. ${city.name}: ${city.facilityCount} facilities`);
    });

    // Get facilities in Florida
    const floridaFacilities = await db
      .select()
      .from(facilities)
      .where(eq(facilities.stateId, florida.id))
      .limit(10);

    console.log(`\n🏢 Florida Facilities: ${floridaFacilities.length}`);
    console.log('Sample Facilities:');
    floridaFacilities.forEach((facility, index) => {
      console.log(`  ${index + 1}. ${facility.name}`);
      console.log(`     Company: ${facility.companyName || 'N/A'}`);
      console.log(`     Meta Title: ${facility.metaTitle || 'N/A'}`);
      console.log(`     SEO Keyword: ${facility.seoKeyword || 'N/A'}`);
      console.log(`     Slug: ${facility.slug}`);
      console.log('');
    });

    // Get categories
    const allCategories = await db
      .select()
      .from(categories)
      .orderBy(desc(categories.facilityCount));

    console.log(`\n📊 Categories: ${allCategories.length}`);
    console.log('Category Distribution:');
    allCategories.forEach((category, index) => {
      console.log(`  ${index + 1}. ${category.name}: ${category.facilityCount} facilities`);
    });

    // Check for facilities with new fields
    const facilitiesWithSEO = await db
      .select()
      .from(facilities)
      .where(eq(facilities.stateId, florida.id))
      .limit(1000);

    const withMetaTitle = facilitiesWithSEO.filter(f => f.metaTitle).length;
    const withSEOKeyword = facilitiesWithSEO.filter(f => f.seoKeyword).length;
    const withCompanyName = facilitiesWithSEO.filter(f => f.companyName).length;

    console.log(`\n🎯 SEO Field Analysis (from ${facilitiesWithSEO.length} facilities):`);
    console.log(`  Meta Titles: ${withMetaTitle} (${((withMetaTitle / facilitiesWithSEO.length) * 100).toFixed(1)}%)`);
    console.log(`  SEO Keywords: ${withSEOKeyword} (${((withSEOKeyword / facilitiesWithSEO.length) * 100).toFixed(1)}%)`);
    console.log(`  Company Names: ${withCompanyName} (${((withCompanyName / facilitiesWithSEO.length) * 100).toFixed(1)}%)`);

    console.log('\n✅ Florida data verification complete!');

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

main().catch(console.error);