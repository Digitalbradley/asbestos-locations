import { db } from '../server/db';
import { cities, facilities } from '../shared/schema';
import { eq, sql } from 'drizzle-orm';

async function fixFacilityCounts() {
  console.log('🔧 Fixing facility count mismatches...');
  
  // Get all Florida cities
  const floridaCities = await db
    .select()
    .from(cities)
    .where(eq(cities.stateId, 3))
    .orderBy(cities.name);
  
  console.log(`Processing ${floridaCities.length} Florida cities...`);
  
  let updatedCities = 0;
  let mismatches = 0;
  
  for (const city of floridaCities) {
    // Get actual facility count
    const actualCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(facilities)
      .where(eq(facilities.cityId, city.id));
    
    const realCount = Number(actualCount[0]?.count || 0);
    
    // Check if there's a mismatch
    if (city.facilityCount !== realCount) {
      console.log(`  Updating ${city.name}: ${city.facilityCount} → ${realCount}`);
      
      // Update the city's facility count
      await db
        .update(cities)
        .set({ facilityCount: realCount })
        .where(eq(cities.id, city.id));
      
      mismatches++;
      updatedCities++;
    }
  }
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`Total cities processed: ${floridaCities.length}`);
  console.log(`Mismatches found: ${mismatches}`);
  console.log(`Cities updated: ${updatedCities}`);
  
  if (mismatches === 0) {
    console.log('✅ All facility counts are accurate!');
  } else {
    console.log('✅ All facility counts have been corrected!');
  }
  
  // Verify a few problematic cities
  console.log('\n=== VERIFICATION ===');
  const testCities = ['deltona', 'coral-springs', 'davie'];
  
  for (const citySlug of testCities) {
    const [city] = await db
      .select()
      .from(cities)
      .where(eq(cities.slug, citySlug));
    
    if (city) {
      const facilityCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(facilities)
        .where(eq(facilities.cityId, city.id));
      
      const actualCount = Number(facilityCount[0]?.count || 0);
      console.log(`${city.name}: stored=${city.facilityCount}, actual=${actualCount} ${city.facilityCount === actualCount ? '✅' : '❌'}`);
    }
  }
}

fixFacilityCounts().catch(console.error);