// Utility functions for facility categorization and content generation

export interface CategoryPattern {
  name: string;
  patterns: RegExp[];
  priority: number; // Higher priority takes precedence
}

export const categoryPatterns: CategoryPattern[] = [
  {
    name: 'Power Plants',
    patterns: [
      /power plant/i,
      /electric/i,
      /steam plant/i,
      /power station/i,
      /nuclear/i,
      /coal/i,
      /utility/i,
      /generation/i,
      /electric.*plant/i,
      /steam.*station/i,
      /power.*company/i,
      /electric.*company/i,
      /\bfpl\b/i, // Florida Power & Light
      /\bteco\b/i, // Tampa Electric Company
      /ice.*electric/i,
      /ice.*coal/i,
    ],
    priority: 8
  },
  {
    name: 'Shipyards',
    patterns: [
      /shipyard/i,
      /naval/i,
      /marine/i,
      /dock/i,
      /shipbuilding/i,
      /vessel/i,
      /maritime/i,
      /port/i,
      /dry.*dock/i,
      /ship.*build/i,
      /naval.*base/i,
      /coast.*guard/i,
      /boat.*work/i,
      /aerojet.*shipyard/i,
      /broward.*marine/i,
      /shipyard.*jacksonville/i,
    ],
    priority: 9
  },
  {
    name: 'Schools',
    patterns: [
      /school/i,
      /university/i,
      /college/i,
      /academy/i,
      /institute/i,
      /education/i,
      /campus/i,
      /elementary/i,
      /middle/i,
      /high.*school/i,
      /technical.*school/i,
      /vocational/i,
      /county.*school/i,
      /junior.*high/i,
    ],
    priority: 7
  },
  {
    name: 'Hospitals',
    patterns: [
      /hospital/i,
      /medical/i,
      /health/i,
      /clinic/i,
      /care/i,
      /medical.*center/i,
      /health.*center/i,
      /emergency/i,
      /surgery/i,
      /patient/i,
      /baptist.*hospital/i,
      /general.*hospital/i,
      /memorial.*hospital/i,
    ],
    priority: 7
  },
  {
    name: 'Government',
    patterns: [
      /government/i,
      /federal/i,
      /state/i,
      /county/i,
      /city/i,
      /municipal/i,
      /courthouse/i,
      /city.*hall/i,
      /post.*office/i,
      /immigration/i,
      /customs/i,
      /irs/i,
      /social.*security/i,
      /veterans/i,
      /military/i,
      /air.*force/i,
      /army/i,
      /navy/i,
      /marine.*corps/i,
      /department.*of/i,
      /bureau.*of/i,
    ],
    priority: 6
  },
  {
    name: 'Transportation',
    patterns: [
      /airport/i,
      /terminal/i,
      /aviation/i,
      /airline/i,
      /railway/i,
      /railroad/i,
      /train/i,
      /bus.*station/i,
      /transit/i,
      /transportation/i,
      /seaport/i,
      /port.*authority/i,
      /municipal.*airport/i,
      /international.*airport/i,
      /regional.*airport/i,
    ],
    priority: 5
  },
  {
    name: 'Hotels & Hospitality',
    patterns: [
      /hotel/i,
      /motel/i,
      /inn/i,
      /resort/i,
      /lodge/i,
      /hospitality/i,
      /breakers.*hotel/i,
      /holiday.*inn/i,
      /marriott/i,
      /hilton/i,
      /sheraton/i,
      /hyatt/i,
      /restaurant/i,
      /dining/i,
      /cafe/i,
      /bar/i,
      /club/i,
    ],
    priority: 4
  },
  {
    name: 'Retail & Commercial',
    patterns: [
      /mall/i,
      /shopping/i,
      /retail/i,
      /store/i,
      /market/i,
      /grocery/i,
      /supermarket/i,
      /department.*store/i,
      /shopping.*center/i,
      /plaza/i,
      /outlet/i,
      /delchamps/i,
      /big.*star/i,
      /colonial.*store/i,
      /sunshine.*shopping/i,
    ],
    priority: 4
  },
  {
    name: 'Residential',
    patterns: [
      /apartment/i,
      /condo/i,
      /condominium/i,
      /housing/i,
      /residential/i,
      /manor/i,
      /terrace/i,
      /complex/i,
      /homes/i,
      /village/i,
      /gardens/i,
      /estates/i,
      /towers/i,
      /place/i,
      /court/i,
      /arrington.*manor/i,
      /baptist.*terrace/i,
      /plantation.*apartments/i,
    ],
    priority: 3
  },
  {
    name: 'Commercial Buildings',
    patterns: [
      /building/i,
      /tower/i,
      /office/i,
      /center/i,
      /complex/i,
      /headquarters/i,
      /corporate/i,
      /business/i,
      /professional/i,
      /commercial/i,
      /plaza/i,
      /bank/i,
      /financial/i,
      /insurance/i,
      /atlantic.*national/i,
      /florida.*national/i,
      /gulf.*life/i,
      /laboratory.*building/i,
    ],
    priority: 3
  },
  {
    name: 'Warehousing & Storage',
    patterns: [
      /warehouse/i,
      /storage/i,
      /distribution/i,
      /logistics/i,
      /depot/i,
      /terminal/i,
      /cold.*storage/i,
      /ice.*storage/i,
      /jax.*ice/i,
      /crown.*warehouse/i,
    ],
    priority: 2
  },
  {
    name: 'Food & Beverage',
    patterns: [
      /food/i,
      /beverage/i,
      /bottling/i,
      /brewery/i,
      /distillery/i,
      /processing/i,
      /seafood/i,
      /meat/i,
      /dairy/i,
      /restaurant/i,
      /anderson.*seafood/i,
      /clinton.*foods/i,
      /florida.*foods/i,
      /bacardi.*bottling/i,
    ],
    priority: 2
  },
  {
    name: 'Manufacturing',
    patterns: [
      /manufacturing/i,
      /factory/i,
      /mill/i,
      /corp/i,
      /company/i,
      /inc/i,
      /industries/i,
      /works/i,
      /chemical/i,
      /steel/i,
      /aluminum/i,
      /cement/i,
      /textile/i,
      /paper/i,
      /oil.*refinery/i,
      /petrochemical/i,
      /pharmaceutical/i,
      /lumber/i,
      /building.*products/i,
      /insulation/i,
      /machinery/i,
      /equipment/i,
      /fabrication/i,
      /assembly/i,
      /production/i,
    ],
    priority: 1
  }
];

export function categorizeFacility(facilityName: string): string {
  const matches: { category: string; priority: number }[] = [];
  
  for (const category of categoryPatterns) {
    for (const pattern of category.patterns) {
      if (pattern.test(facilityName)) {
        matches.push({ category: category.name, priority: category.priority });
        break; // Only count one match per category
      }
    }
  }
  
  if (matches.length === 0) {
    return 'Manufacturing'; // Default category
  }
  
  // Sort by priority (highest first) and return the best match
  matches.sort((a, b) => b.priority - a.priority);
  return matches[0].category;
}

export function generateFacilitySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 100); // Limit length
}

export function generateCitySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function generateMetaTitle(facilityName: string, cityName: string, stateName: string): string {
  return `${facilityName} - Asbestos Exposure Site in ${cityName}, ${stateName}`;
}

export function generateMetaDescription(facilityName: string, cityName: string, stateName: string): string {
  return `Learn about asbestos exposure at ${facilityName} in ${cityName}, ${stateName}. Find documented exposure periods, worker information, and legal resources for mesothelioma cases.`;
}

export function extractOperationalPeriod(facilityName: string): string | null {
  // Look for year patterns in facility names
  const yearPattern = /(\d{4})/g;
  const matches = facilityName.match(yearPattern);
  
  if (matches && matches.length >= 2) {
    const years = matches.map(y => parseInt(y)).sort((a, b) => a - b);
    return `${years[0]}-${years[years.length - 1]}`;
  } else if (matches && matches.length === 1) {
    const year = parseInt(matches[0]);
    if (year >= 1900 && year <= 2000) {
      return `${year}-1980`; // Estimate end date based on typical asbestos use
    }
  }
  
  return null;
}

export function determineExposureRisk(facilityName: string, categoryName: string): string {
  const highRiskKeywords = [
    'shipyard', 'naval', 'insulation', 'boiler', 'steam', 'power plant',
    'construction', 'demolition', 'steel', 'refinery', 'chemical'
  ];
  
  const mediumRiskKeywords = [
    'manufacturing', 'factory', 'mill', 'assembly', 'production',
    'automotive', 'textile', 'paper'
  ];
  
  const facilityLower = facilityName.toLowerCase();
  
  // Check for high-risk keywords
  for (const keyword of highRiskKeywords) {
    if (facilityLower.includes(keyword)) {
      return 'High';
    }
  }
  
  // Check for medium-risk keywords
  for (const keyword of mediumRiskKeywords) {
    if (facilityLower.includes(keyword)) {
      return 'Medium';
    }
  }
  
  // Default based on category
  switch (categoryName) {
    case 'Shipyards':
    case 'Power Plants':
      return 'High';
    case 'Manufacturing':
      return 'Medium';
    case 'Schools':
    case 'Hospitals':
      return 'Low';
    default:
      return 'Medium';
  }
}

export function generateExposureMaterials(facilityName: string, categoryName: string): string[] {
  const commonMaterials = [
    'Asbestos insulation',
    'Asbestos-containing gaskets',
    'Asbestos cement products',
    'Asbestos floor tiles',
    'Asbestos pipe insulation'
  ];
  
  const categorySpecific: { [key: string]: string[] } = {
    'Shipyards': [
      'Ship insulation materials',
      'Boiler insulation',
      'Pipe lagging',
      'Fireproofing materials',
      'Asbestos blankets'
    ],
    'Power Plants': [
      'Boiler insulation',
      'Steam pipe insulation',
      'Turbine insulation',
      'Electrical insulation',
      'Refractory materials'
    ],
    'Manufacturing': [
      'Industrial insulation',
      'Machinery gaskets',
      'Conveyor belts',
      'Protective clothing',
      'Heat shields'
    ],
    'Schools': [
      'Ceiling tiles',
      'Pipe insulation',
      'Boiler insulation',
      'Floor tiles',
      'Roofing materials'
    ],
    'Hospitals': [
      'Ceiling tiles',
      'Pipe insulation',
      'Boiler insulation',
      'Floor tiles',
      'Laboratory equipment'
    ]
  };
  
  const specific = categorySpecific[categoryName] || [];
  return [...specific, ...commonMaterials].slice(0, 5);
}

export function estimateWorkforceSize(facilityName: string, categoryName: string): string {
  const facilityLower = facilityName.toLowerCase();
  
  // Large facility indicators
  if (facilityLower.includes('steel') || 
      facilityLower.includes('shipyard') || 
      facilityLower.includes('naval') ||
      facilityLower.includes('power plant')) {
    return '1000+ employees';
  }
  
  // Medium facility indicators
  if (facilityLower.includes('manufacturing') || 
      facilityLower.includes('factory') || 
      facilityLower.includes('mill')) {
    return '500-1000 employees';
  }
  
  // Small facility indicators
  if (facilityLower.includes('school') || 
      facilityLower.includes('hospital') || 
      facilityLower.includes('clinic')) {
    return '100-500 employees';
  }
  
  // Default based on category
  switch (categoryName) {
    case 'Shipyards':
    case 'Power Plants':
      return '1000+ employees';
    case 'Manufacturing':
      return '500-1000 employees';
    case 'Schools':
    case 'Hospitals':
      return '100-500 employees';
    default:
      return '250-500 employees';
  }
}