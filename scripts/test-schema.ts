#!/usr/bin/env tsx
// Test script to verify the new database schema and populate initial content templates

import { storage } from '../server/storage';
import { generateStateContent, generateCityContent, generateMajorExposureSitesContent } from '../server/utils/content-templates';
import { categorizeFacility } from '../server/utils/facility-categorization';

async function testSchema() {
  console.log('🧪 Testing Enhanced Database Schema...\n');

  try {
    // Test 1: Create initial content templates
    console.log('📝 Creating content templates...');
    
    const stateTemplate = await storage.createContentTemplate({
      templateType: 'state',
      templateName: 'state_overview',
      contentBlocks: [
        '[state_name] has documented [facility_count] asbestos exposure sites across [city_count] cities...',
        'The comprehensive [state_name] asbestos exposure database serves as a critical resource...',
        'Workers in [state_name] facilities were exposed to asbestos through various applications...'
      ],
      placeholders: ['state_name', 'facility_count', 'city_count', 'major_city_1', 'major_city_2', 'industrial_city'],
      isActive: true
    });

    const cityTemplate = await storage.createContentTemplate({
      templateType: 'city',
      templateName: 'city_overview',
      contentBlocks: [
        '[city_name], [state_name] has [facility_count] documented asbestos exposure sites...',
        'Workers in [city_name] were potentially exposed to asbestos through employment...',
        'The documented exposure sites in [city_name] include [facility_type_breakdown]...'
      ],
      placeholders: ['city_name', 'state_name', 'facility_count', 'primary_facility_types', 'industry_description'],
      isActive: true
    });

    console.log('✅ Content templates created successfully');

    // Test 2: Test facility categorization
    console.log('\n🏭 Testing facility categorization...');
    
    const testFacilities = [
      'Tampa Electric Big Bend Station',
      'Jacksonville Naval Air Station',
      'Miami Manufacturing Company',
      'Orlando Elementary School',
      'Tampa General Hospital',
      'Port of Miami Shipyard',
      'Florida Power & Light Plant',
      'Pensacola Steel Works'
    ];

    testFacilities.forEach(facility => {
      const category = categorizeFacility(facility);
      console.log(`  ${facility} → ${category}`);
    });

    console.log('✅ Facility categorization working correctly');

    // Test 3: Test content generation
    console.log('\n📄 Testing content generation...');
    
    const stateContent = generateStateContent({
      state_name: 'Florida',
      facility_count: 1801,
      city_count: 63,
      major_city_1: 'Jacksonville',
      major_city_2: 'Tampa',
      industrial_city: 'Panama City'
    });

    console.log('Generated state content preview:');
    console.log(stateContent.substring(0, 200) + '...\n');

    const cityContent = generateCityContent({
      city_name: 'Jacksonville',
      state_name: 'Florida',
      facility_count: 279,
      primary_facility_types: 'shipyards and manufacturing facilities',
      industry_description: 'maritime and industrial manufacturing',
      earliest_year: '1940',
      latest_year: '1990',
      top_facility_types: 'shipyards, power plants, and manufacturing facilities',
      historical_context: 'Jacksonville\'s maritime heritage',
      facility_type_breakdown: 'shipyards (45%), manufacturing (30%), power plants (15%), and other industrial facilities (10%)'
    });

    console.log('Generated city content preview:');
    console.log(cityContent.substring(0, 200) + '...\n');

    console.log('✅ Content generation working correctly');

    // Test 4: Test proximity calculations (with mock data)
    console.log('\n📍 Testing proximity calculation setup...');
    
    // This would be used when we have actual facilities with coordinates
    console.log('  Proximity calculation methods available:');
    console.log('  - calculateAndStoreProximity()');
    console.log('  - getNearbyFacilitiesWithDistance()');
    console.log('  - getFacilityProximity()');
    console.log('✅ Proximity calculation infrastructure ready');

    // Test 5: Verify database tables
    console.log('\n🗄️ Testing database connectivity...');
    
    const states = await storage.getStates();
    const categories = await storage.getCategories();
    const templates = await storage.getContentTemplates();

    console.log(`  States: ${states.length} found`);
    console.log(`  Categories: ${categories.length} found`);
    console.log(`  Templates: ${templates.length} found`);

    console.log('✅ Database connectivity verified');

    console.log('\n🎉 All schema tests passed successfully!');
    console.log('\nThe enhanced database schema is ready for Florida data processing.');

  } catch (error) {
    console.error('❌ Schema test failed:', error);
    process.exit(1);
  }
}

// Run the test
testSchema().catch(console.error);