#!/usr/bin/env tsx
// Calculate distances between cities and store nearest cities data

import { db } from '../server/db';
import { cities } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

async function main() {
  console.log('🗺️ Calculating city distances for Florida...\n');

  try {
    // Get all Florida cities with facility counts > 0
    const floridaCities = await db
      .select()
      .from(cities)
      .where(eq(cities.stateId, 3));

    console.log(`📍 Found ${floridaCities.length} Florida cities`);

    // Filter cities that have coordinates and facilities
    const citiesWithCoords = floridaCities.filter(city => 
      city.latitude && city.longitude && city.facilityCount > 0
    );

    console.log(`📊 ${citiesWithCoords.length} cities have coordinates and facilities`);

    // Calculate distances between all cities
    const cityDistances = new Map<number, Array<{id: number, name: string, slug: string, distance: number}>>();

    for (const city of citiesWithCoords) {
      const distances = [];
      
      for (const otherCity of citiesWithCoords) {
        if (city.id !== otherCity.id) {
          const distance = calculateDistance(
            parseFloat(city.latitude!),
            parseFloat(city.longitude!),
            parseFloat(otherCity.latitude!),
            parseFloat(otherCity.longitude!)
          );
          
          distances.push({
            id: otherCity.id,
            name: otherCity.name,
            slug: otherCity.slug,
            distance: Math.round(distance * 10) / 10 // Round to 1 decimal
          });
        }
      }
      
      // Sort by distance and take top 10
      distances.sort((a, b) => a.distance - b.distance);
      cityDistances.set(city.id, distances.slice(0, 10));
    }

    // Store results in a JSON structure that can be used by the API
    const distanceData = {};
    for (const [cityId, nearestCities] of cityDistances) {
      distanceData[cityId] = nearestCities;
    }

    console.log('💾 Distance calculations complete');
    console.log(`📈 Sample distances for first city:`);
    
    const firstCity = citiesWithCoords[0];
    const firstCityDistances = cityDistances.get(firstCity.id) || [];
    
    console.log(`   ${firstCity.name} nearest cities:`);
    firstCityDistances.slice(0, 5).forEach(city => {
      console.log(`     - ${city.name}: ${city.distance} miles`);
    });

    // Save to a file for the API to use
    const fs = require('fs');
    fs.writeFileSync('city-distances.json', JSON.stringify(distanceData, null, 2));
    
    console.log('\n✅ City distances calculated and saved to city-distances.json');
    
  } catch (error) {
    console.error('❌ Distance calculation failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);