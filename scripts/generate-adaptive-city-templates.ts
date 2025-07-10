import { db } from '../server/db';
import { cities, facilities, categories, contentTemplates } from '../shared/schema';
import { eq, and } from 'drizzle-orm';

interface CityData {
  id: number;
  name: string;
  slug: string;
  facilityCount: number;
  categories: Map<string, number>;
  totalFacilities: number;
}

interface RegionalHub {
  name: string;
  region: string;
  keywords: string[];
}

const REGIONAL_HUBS: RegionalHub[] = [
  { name: 'Miami', region: 'South Florida', keywords: ['economic center', 'metropolitan area', 'coastal'] },
  { name: 'Jacksonville', region: 'Northeast Florida', keywords: ['port city', 'industrial corridor', 'transportation hub'] },
  { name: 'Tampa', region: 'Tampa Bay', keywords: ['bay area', 'industrial district', 'commercial center'] },
  { name: 'Orlando', region: 'Central Florida', keywords: ['central region', 'industrial development', 'growth center'] },
  { name: 'Fort Lauderdale', region: 'South Florida', keywords: ['coastal region', 'industrial zone', 'metropolitan area'] },
  { name: 'St. Petersburg', region: 'Tampa Bay', keywords: ['bay area', 'industrial community', 'waterfront'] },
  { name: 'Tallahassee', region: 'North Florida', keywords: ['capital city', 'government center', 'state facilities'] },
  { name: 'Pensacola', region: 'Northwest Florida', keywords: ['panhandle region', 'naval facilities', 'coastal industry'] },
  { name: 'Panama City', region: 'Northwest Florida', keywords: ['manufacturing center', 'industrial hub', 'coastal operations'] },
  { name: 'Gainesville', region: 'North Central Florida', keywords: ['university city', 'regional center', 'industrial facilities'] }
];

const CATEGORY_DESCRIPTORS = {
  'Manufacturing': {
    materials: 'industrial machinery, production equipment, and manufacturing components',
    operations: 'manufacturing processes, equipment maintenance, and production activities',
    context: 'manufacturing sector'
  },
  'Power Plants': {
    materials: 'turbine insulation, boiler components, and electrical equipment',
    operations: 'power generation, equipment maintenance, and utility operations',
    context: 'energy sector'
  },
  'Shipyards': {
    materials: 'marine insulation, hull materials, and shipbuilding components',
    operations: 'shipbuilding, vessel maintenance, and marine construction',
    context: 'maritime industry'
  },
  'Government': {
    materials: 'facility infrastructure, building materials, and mechanical systems',
    operations: 'government operations, facility maintenance, and public services',
    context: 'public sector'
  },
  'Schools': {
    materials: 'building insulation, floor tiles, and construction materials',
    operations: 'educational facilities, building maintenance, and campus operations',
    context: 'educational sector'
  },
  'Hospitals': {
    materials: 'building systems, medical equipment areas, and structural materials',
    operations: 'healthcare facilities, building maintenance, and medical operations',
    context: 'healthcare sector'
  },
  'Transportation': {
    materials: 'vehicle components, infrastructure materials, and maintenance equipment',
    operations: 'transportation systems, vehicle maintenance, and infrastructure work',
    context: 'transportation sector'
  },
  'Commercial Buildings': {
    materials: 'structural materials, fireproofing systems, and building components',
    operations: 'commercial facilities, building maintenance, and construction work',
    context: 'commercial sector'
  }
};

class AdaptiveCityTemplateGenerator {
  
  async generateAllCityTemplates(): Promise<void> {
    console.log('🏙️ Generating adaptive city templates...');
    
    // Get all Florida cities with facility data
    const cityData = await this.getCityData();
    
    console.log(`Processing ${cityData.length} cities...`);
    
    let microCount = 0;
    let categoryCount = 0;
    let regionalCount = 0;
    let genericCount = 0;
    
    for (const city of cityData) {
      const templateType = this.determineTemplateType(city);
      const content = this.generateContent(city, templateType);
      const templateName = `${city.slug}_content_adaptive`;
      
      // Store template
      await db.insert(contentTemplates).values({
        templateType: 'city',
        templateName,
        contentBlocks: [content],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Count template types
      switch (templateType) {
        case 'micro': microCount++; break;
        case 'category': categoryCount++; break;
        case 'regional': regionalCount++; break;
        case 'generic': genericCount++; break;
      }
      
      if (cityData.indexOf(city) % 50 === 0) {
        console.log(`Progress: ${cityData.indexOf(city) + 1}/${cityData.length}`);
      }
    }
    
    console.log('✅ Adaptive city templates generated');
    console.log(`Micro templates (< 5 facilities): ${microCount}`);
    console.log(`Category-dominant templates: ${categoryCount}`);
    console.log(`Regional hub templates: ${regionalCount}`);
    console.log(`Generic templates: ${genericCount}`);
  }
  
  private async getCityData(): Promise<CityData[]> {
    // Get all Florida cities
    const floridaCities = await db
      .select({
        id: cities.id,
        name: cities.name,
        slug: cities.slug,
        facilityCount: cities.facilityCount
      })
      .from(cities)
      .where(eq(cities.stateId, 3));
    
    // Get facility categories for each city
    const cityFacilities = await db
      .select({
        cityId: cities.id,
        categoryName: categories.name
      })
      .from(cities)
      .leftJoin(facilities, eq(facilities.cityId, cities.id))
      .leftJoin(categories, eq(facilities.categoryId, categories.id))
      .where(eq(cities.stateId, 3));
    
    // Process city data
    const cityDataMap = new Map<number, CityData>();
    
    floridaCities.forEach(city => {
      cityDataMap.set(city.id, {
        id: city.id,
        name: city.name,
        slug: city.slug,
        facilityCount: city.facilityCount,
        categories: new Map(),
        totalFacilities: city.facilityCount
      });
    });
    
    // Count categories per city
    cityFacilities.forEach(({ cityId, categoryName }) => {
      if (cityId && categoryName) {
        const city = cityDataMap.get(cityId);
        if (city) {
          city.categories.set(categoryName, (city.categories.get(categoryName) || 0) + 1);
        }
      }
    });
    
    return Array.from(cityDataMap.values());
  }
  
  private determineTemplateType(city: CityData): 'micro' | 'category' | 'regional' | 'generic' {
    // Micro cities (< 5 facilities)
    if (city.facilityCount < 5) {
      return 'micro';
    }
    
    // Regional hubs
    if (REGIONAL_HUBS.some(hub => 
      hub.name.toLowerCase() === city.name.toLowerCase() ||
      city.name.toLowerCase().includes(hub.name.toLowerCase())
    )) {
      return 'regional';
    }
    
    // Category-dominant cities (40%+ from one category)
    if (city.categories.size > 0) {
      for (const [category, count] of city.categories) {
        const percentage = (count / city.totalFacilities) * 100;
        if (percentage >= 40) {
          return 'category';
        }
      }
    }
    
    // Generic for everything else
    return 'generic';
  }
  
  private generateContent(city: CityData, templateType: 'micro' | 'category' | 'regional' | 'generic'): string {
    switch (templateType) {
      case 'micro':
        return this.generateMicroContent(city);
      case 'category':
        return this.generateCategoryContent(city);
      case 'regional':
        return this.generateRegionalContent(city);
      case 'generic':
        return this.generateGenericContent(city);
    }
  }
  
  private generateMicroContent(city: CityData): string {
    const facilityText = city.facilityCount === 1 ? 'facility' : 'facilities';
    const exposureText = city.facilityCount === 1 ? 'this facility' : 'these facilities';
    
    return `${city.name}, Florida documented ${city.facilityCount} industrial ${facilityText} with known asbestos exposure. This community housed operations where workers encountered asbestos-containing materials during daily work activities. The industrial operations in ${city.name} utilized materials and equipment that posed occupational exposure risks to employees and contractors.

Workers from ${city.name} and surrounding areas may have been exposed to asbestos through operations at ${exposureText}. Former employees who developed mesothelioma, lung cancer, or other asbestos-related illnesses may be eligible for legal compensation. Specialized attorneys can help evaluate cases involving occupational asbestos exposure in smaller Florida communities.`;
  }
  
  private generateCategoryContent(city: CityData): string {
    // Find dominant category
    let dominantCategory = '';
    let maxCount = 0;
    
    for (const [category, count] of city.categories) {
      if (count > maxCount) {
        maxCount = count;
        dominantCategory = category;
      }
    }
    
    const descriptor = CATEGORY_DESCRIPTORS[dominantCategory];
    if (!descriptor) {
      return this.generateGenericContent(city);
    }
    
    return `${city.name} served as a major center for Florida's ${descriptor.context}, with ${city.facilityCount} documented exposure sites. The city's ${dominantCategory.toLowerCase()} operations extensively used ${descriptor.materials} containing asbestos. Workers faced widespread occupational exposure through ${descriptor.operations}. Legal consultation is available for former employees diagnosed with asbestos-related diseases.`;
  }
  
  private generateRegionalContent(city: CityData): string {
    const hub = REGIONAL_HUBS.find(h => 
      h.name.toLowerCase() === city.name.toLowerCase() ||
      city.name.toLowerCase().includes(h.name.toLowerCase())
    );
    
    if (!hub) {
      return this.generateGenericContent(city);
    }
    
    const contextKeyword = hub.keywords[Math.floor(Math.random() * hub.keywords.length)];
    
    return `${city.name} anchored ${hub.region}'s industrial development with ${city.facilityCount} documented asbestos exposure sites. As the region's ${contextKeyword}, the city housed diverse industrial operations from manufacturing to construction. Workers throughout ${city.name}'s industrial districts encountered asbestos exposure during the area's economic growth periods. Former workers may be eligible for legal compensation.`;
  }
  
  private generateGenericContent(city: CityData): string {
    return `${city.name} documented ${city.facilityCount} facilities with known asbestos exposure. The city's industrial operations included facilities where workers handled asbestos-containing materials. Former employees from ${city.name} industrial sites may qualify for legal assistance if diagnosed with asbestos-related illnesses.`;
  }
}

async function main() {
  const generator = new AdaptiveCityTemplateGenerator();
  await generator.generateAllCityTemplates();
}

main().catch(console.error);