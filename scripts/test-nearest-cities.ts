#!/usr/bin/env tsx
// Test script to verify nearest cities functionality

import { storage } from '../server/storage';

async function testNearestCities() {
  console.log('Testing nearest cities functionality...');
  
  try {
    // Test with Plant City (ID 90)
    const plantCityNearest = await storage.getNearestCities(90, 10);
    console.log('Plant City nearest cities:', plantCityNearest);
    
    // Test with a non-existent city
    const nonExistentNearest = await storage.getNearestCities(999, 10);
    console.log('Non-existent city nearest cities:', nonExistentNearest);
    
  } catch (error) {
    console.error('Error testing nearest cities:', error);
  }
}

testNearestCities().catch(console.error);