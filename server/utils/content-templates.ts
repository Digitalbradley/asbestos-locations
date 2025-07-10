// Content template generation utilities

export interface TemplateVariables {
  [key: string]: string | number | string[];
}

export class ContentTemplateRenderer {
  static render(template: string, variables: TemplateVariables): string {
    let content = template;
    
    // Replace variables in the format [variable_name]
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `[${key}]`;
      const replacement = Array.isArray(value) ? value.join(', ') : String(value);
      // Use simple string replacement instead of regex to avoid issues
      content = content.split(placeholder).join(replacement);
    }
    
    return content;
  }
}

export const stateContentTemplate = `[state_name] has documented [facility_count] asbestos exposure sites across [city_count] cities and towns throughout the state. These facilities span multiple industries including manufacturing, shipbuilding, power generation, and construction, representing decades of industrial activity where workers may have encountered asbestos-containing materials.

The comprehensive [state_name] asbestos exposure database serves as a critical resource for individuals seeking to identify potential exposure locations. From the major shipyards in [major_city_1] and [major_city_2] to the industrial facilities in [industrial_city], [state_name]'s industrial history reveals extensive use of asbestos across diverse sectors.

Workers in [state_name] facilities were exposed to asbestos through various applications including insulation, fireproofing materials, gaskets, and construction products. This statewide directory provides detailed information about exposure sites, operational periods, and facility types to help individuals and legal professionals identify relevant exposure locations for mesothelioma and other asbestos-related disease cases.`;

export const cityContentTemplate = `[city_name], [state_name] has [facility_count] documented asbestos exposure sites representing the city's industrial heritage spanning [earliest_year] to [latest_year]. The facilities in [city_name] primarily consist of [primary_facility_types], reflecting the region's economic focus on [industry_description].

Workers in [city_name] were potentially exposed to asbestos through employment at various facilities including [top_facility_types]. The city's [historical_context] contributed to widespread asbestos use in industrial applications, construction materials, and safety equipment throughout the mid-20th century.

The documented exposure sites in [city_name] include [facility_type_breakdown], providing comprehensive coverage of potential exposure locations. This information serves as a valuable resource for individuals seeking to establish occupational asbestos exposure history for legal and medical purposes. Each facility listing includes operational periods, facility types, and relevant exposure details to assist in case development and medical evaluation.`;

export const facilityContentTemplate = `
[facility_name] in [city_name], [state_name] was an active [facility_type] facility that operated during [operational_period]. Workers at this facility were potentially exposed to asbestos through [exposure_materials] commonly used in [industry_type] operations during this time period.

The facility employed approximately [workforce_size] and was classified as a [exposure_risk] risk environment for asbestos exposure. [facility_name] used asbestos-containing materials in various applications including [material_applications], which created potential exposure scenarios for workers in multiple departments and job functions.

Historical records indicate that [facility_name] operated during the peak period of asbestos use in American industry. Workers who were employed at this facility between [peak_exposure_years] may have been exposed to significant levels of asbestos fibers through their daily work activities and should seek medical evaluation for asbestos-related diseases.
`;

export const majorExposureSitesTemplate = `
[state_name]'s [facility_count] documented asbestos exposure sites are distributed across [city_count] cities, with the highest concentrations in [top_city_1] ([city_1_count] facilities), [top_city_2] ([city_2_count] facilities), and [top_city_3] ([city_3_count] facilities). These exposure sites fall into five primary categories: [category_breakdown].

The industrial infrastructure in [state_name] developed extensively during the mid-20th century, when asbestos use was at its peak. Major industrial centers like [industrial_center_1] and [industrial_center_2] became hubs for manufacturing, shipbuilding, and power generation activities that relied heavily on asbestos-containing materials for insulation, fireproofing, and construction applications.
`;

export function generateStateContent(variables: TemplateVariables): string {
  return ContentTemplateRenderer.render(stateContentTemplate, variables);
}

export function generateCityContent(variables: TemplateVariables): string {
  return ContentTemplateRenderer.render(cityContentTemplate, variables);
}

export function generateFacilityContent(variables: TemplateVariables): string {
  return ContentTemplateRenderer.render(facilityContentTemplate, variables);
}

export function generateMajorExposureSitesContent(variables: TemplateVariables): string {
  return ContentTemplateRenderer.render(majorExposureSitesTemplate, variables);
}

export function generateCategoryBreakdown(categoryCounts: { [key: string]: number }): string {
  const entries = Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)
    .map(([category, count]) => `${category.toLowerCase()} (${count})`);
  
  return entries.join(', ');
}

export function generateHistoricalContext(cityName: string, stateName: string, primaryIndustries: string[]): string {
  const contexts: { [key: string]: string } = {
    'manufacturing': 'industrial manufacturing base',
    'shipbuilding': 'maritime and shipbuilding heritage',
    'power generation': 'energy production infrastructure',
    'construction': 'construction and building industry',
    'transportation': 'transportation hub status'
  };
  
  const primaryIndustry = primaryIndustries[0]?.toLowerCase() || 'manufacturing';
  const context = contexts[primaryIndustry] || 'diverse industrial economy';
  
  return `${cityName}'s ${context}`;
}

export function generateIndustryDescription(primaryIndustries: string[]): string {
  if (primaryIndustries.length === 1) {
    return primaryIndustries[0].toLowerCase();
  } else if (primaryIndustries.length === 2) {
    return `${primaryIndustries[0].toLowerCase()} and ${primaryIndustries[1].toLowerCase()}`;
  } else {
    const last = primaryIndustries[primaryIndustries.length - 1].toLowerCase();
    const others = primaryIndustries.slice(0, -1).map(i => i.toLowerCase()).join(', ');
    return `${others}, and ${last}`;
  }
}