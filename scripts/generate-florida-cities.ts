#!/usr/bin/env tsx
// Generate comprehensive Florida city records from CSV data

import { FloridaCSVParser } from './csv-parser';
import { generateCitySlug } from '../server/utils/facility-categorization';
import { db } from '../server/db';
import { states, cities } from '../shared/schema';
import { eq, and } from 'drizzle-orm';

interface CityData {
  name: string;
  normalizedName: string;
  slug: string;
  facilityCount: number;
  facilities: string[];
}

async function main() {
  console.log('🏙️  Generating Florida City Records...\n');

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
    
    // Analyze city data from CSV
    const cityAnalysis = new Map<string, CityData>();
    
    floridaRecords.forEach(record => {
      const cityName = record.city.trim();
      const normalizedName = normalizeCityName(cityName);
      const slug = generateCitySlug(cityName);
      
      if (!cityAnalysis.has(normalizedName)) {
        cityAnalysis.set(normalizedName, {
          name: cityName,
          normalizedName,
          slug,
          facilityCount: 0,
          facilities: []
        });
      }
      
      const cityData = cityAnalysis.get(normalizedName)!;
      cityData.facilityCount++;
      cityData.facilities.push(record.name);
    });
    
    console.log(`🔍 Found ${cityAnalysis.size} unique cities (normalized)`);
    
    // Handle city name variations and duplicates
    const cityConsolidation = consolidateCityNames(cityAnalysis);
    console.log(`📋 Consolidated to ${cityConsolidation.size} final cities`);
    
    // Display city analysis
    console.log('\n📊 CITY ANALYSIS:');
    console.log('================');
    
    const sortedCities = Array.from(cityConsolidation.values())
      .sort((a, b) => b.facilityCount - a.facilityCount);
    
    console.log('\nTop 20 Cities by Facility Count:');
    sortedCities.slice(0, 20).forEach((city, index) => {
      console.log(`${index + 1}. ${city.name}: ${city.facilityCount} facilities`);
    });
    
    // Check existing cities in database
    const existingCities = await db
      .select()
      .from(cities)
      .where(eq(cities.stateId, floridaState.id));
    
    console.log(`\n🏛️  Database Status:`);
    console.log(`Existing cities: ${existingCities.length}`);
    console.log(`Cities to process: ${cityConsolidation.size}`);
    
    // Create or update city records
    let citiesCreated = 0;
    let citiesUpdated = 0;
    
    for (const cityData of cityConsolidation.values()) {
      const existingCity = existingCities.find(c => c.slug === cityData.slug);
      
      if (existingCity) {
        // Update existing city
        if (existingCity.facilityCount !== cityData.facilityCount) {
          await db
            .update(cities)
            .set({ 
              facilityCount: cityData.facilityCount,
              name: cityData.name // Use the most common name variant
            })
            .where(eq(cities.id, existingCity.id));
          
          citiesUpdated++;
          console.log(`  ↻ Updated: ${cityData.name} (${cityData.facilityCount} facilities)`);
        }
      } else {
        // Create new city
        await db
          .insert(cities)
          .values({
            name: cityData.name,
            slug: cityData.slug,
            stateId: floridaState.id,
            facilityCount: cityData.facilityCount
          });
        
        citiesCreated++;
        console.log(`  ✅ Created: ${cityData.name} (${cityData.facilityCount} facilities)`);
      }
    }
    
    // Update state facility count
    const totalFacilities = Array.from(cityConsolidation.values())
      .reduce((sum, city) => sum + city.facilityCount, 0);
    
    await db
      .update(states)
      .set({ facilityCount: totalFacilities })
      .where(eq(states.id, floridaState.id));
    
    console.log('\n✅ CITY GENERATION COMPLETE:');
    console.log('============================');
    console.log(`Cities created: ${citiesCreated}`);
    console.log(`Cities updated: ${citiesUpdated}`);
    console.log(`Total facilities: ${totalFacilities}`);
    console.log(`Average facilities per city: ${(totalFacilities / cityConsolidation.size).toFixed(1)}`);
    
    // City distribution analysis
    console.log('\n📈 CITY DISTRIBUTION:');
    console.log('====================');
    
    const sizeCategories = {
      'Large (50+ facilities)': sortedCities.filter(c => c.facilityCount >= 50).length,
      'Medium (10-49 facilities)': sortedCities.filter(c => c.facilityCount >= 10 && c.facilityCount < 50).length,
      'Small (1-9 facilities)': sortedCities.filter(c => c.facilityCount < 10).length
    };
    
    Object.entries(sizeCategories).forEach(([category, count]) => {
      console.log(`${category}: ${count} cities`);
    });
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('=============');
    console.log('1. Run facility import script to populate all 1,794 facilities');
    console.log('2. Verify city-facility relationships');
    console.log('3. Generate content templates for each city');
    console.log('4. Implement SEO optimization for city pages');
    
  } catch (error) {
    console.error('❌ City generation failed:', error.message);
    process.exit(1);
  }
}

function normalizeCityName(cityName: string): string {
  return cityName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function consolidateCityNames(cityAnalysis: Map<string, CityData>): Map<string, CityData> {
  const consolidated = new Map<string, CityData>();
  
  // Define consolidation rules for known variations
  const consolidationRules = new Map([
    ['st petersburg', ['saint petersburg', 'st. petersburg']],
    ['ft lauderdale', ['fort lauderdale', 'ft. lauderdale']],
    ['ft meade', ['fort meade', 'ft. meade']],
    ['ft pierce', ['fort pierce', 'ft. pierce']],
    ['ft myers', ['fort myers', 'ft. myers']],
    ['pensacola', ['pensecola']],
    ['jacksonville', ['jacsonville']],
    ['fernandina beach', ['fernandina', 'fernandine beach']],
    ['bartow', ['bartw']],
    ['gonzalez', ['gonzales']],
    ['foley perry', ['foley / perry', 'foley', 'perry']]
  ]);
  
  // First pass: identify primary cities
  for (const [normalizedName, cityData] of cityAnalysis) {
    let primaryKey = normalizedName;
    
    // Check if this city should be consolidated
    for (const [primary, variations] of consolidationRules) {
      if (variations.includes(normalizedName) || normalizedName === primary) {
        primaryKey = primary;
        break;
      }
    }
    
    if (!consolidated.has(primaryKey)) {
      consolidated.set(primaryKey, {
        name: cityData.name,
        normalizedName: primaryKey,
        slug: generateCitySlug(cityData.name),
        facilityCount: 0,
        facilities: []
      });
    }
    
    const consolidatedCity = consolidated.get(primaryKey)!;
    consolidatedCity.facilityCount += cityData.facilityCount;
    consolidatedCity.facilities.push(...cityData.facilities);
    
    // Use the name with the most facilities as the primary name
    if (cityData.facilityCount > (consolidated.get(primaryKey)?.facilityCount || 0)) {
      consolidatedCity.name = cityData.name;
      consolidatedCity.slug = generateCitySlug(cityData.name);
    }
  }
  
  return consolidated;
}

main().catch(console.error);