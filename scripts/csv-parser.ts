#!/usr/bin/env tsx
// CSV Parser and Validator for Florida Asbestos Locations Data

import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

export interface RawFacilityRecord {
  [key: string]: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ParsedFacilityData {
  name: string;
  city: string;
  state: string;
  address?: string;
  companyName?: string;
  description?: string;
  latitude?: string;
  longitude?: string;
  metaTitle?: string;
  seoKeyword?: string;
  rawData: RawFacilityRecord;
}

export interface CSVParseResult {
  totalRecords: number;
  validRecords: ParsedFacilityData[];
  invalidRecords: { record: RawFacilityRecord; errors: string[] }[];
  warnings: string[];
  columnHeaders: string[];
  cityCount: number;
  uniqueCities: string[];
}

export class FloridaCSVParser {
  private readonly csvPath: string;

  constructor(csvPath: string = 'attached_assets/Florida_Asbestos_Locations_1752087615035.csv') {
    this.csvPath = csvPath;
  }

  /**
   * Parse the CSV file and return structured data
   */
  public async parseCSV(): Promise<CSVParseResult> {
    try {
      const csvContent = fs.readFileSync(this.csvPath, 'utf-8');
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      }) as RawFacilityRecord[];

      console.log(`📊 Found ${records.length} total records in CSV`);
      
      // Get column headers
      const columnHeaders = Object.keys(records[0] || {});
      console.log(`📋 Column headers: ${columnHeaders.join(', ')}`);

      const validRecords: ParsedFacilityData[] = [];
      const invalidRecords: { record: RawFacilityRecord; errors: string[] }[] = [];
      const warnings: string[] = [];
      const cities = new Set<string>();

      // Process each record
      for (let i = 0; i < records.length; i++) {
        const record = records[i];
        const validation = this.validateRecord(record, i + 1);
        
        if (validation.isValid) {
          const parsedData = this.parseRecord(record);
          validRecords.push(parsedData);
          cities.add(parsedData.city);
        } else {
          invalidRecords.push({
            record,
            errors: validation.errors
          });
        }
        
        warnings.push(...validation.warnings);
      }

      return {
        totalRecords: records.length,
        validRecords,
        invalidRecords,
        warnings,
        columnHeaders,
        cityCount: cities.size,
        uniqueCities: Array.from(cities).sort()
      };
    } catch (error) {
      throw new Error(`Failed to parse CSV: ${error.message}`);
    }
  }

  /**
   * Validate a single record
   */
  private validateRecord(record: RawFacilityRecord, rowNumber: number): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for required fields - adapt based on actual CSV structure
    const requiredFields = this.getRequiredFields(record);
    
    for (const field of requiredFields) {
      if (!record[field] || record[field].trim() === '') {
        errors.push(`Row ${rowNumber}: Missing required field '${field}'`);
      }
    }

    // Validate facility name
    const facilityName = this.extractFacilityName(record);
    if (!facilityName || facilityName.length < 3) {
      errors.push(`Row ${rowNumber}: Facility name too short or missing`);
    }

    // Validate city name
    const cityName = this.extractCityName(record);
    if (!cityName || cityName.length < 2) {
      errors.push(`Row ${rowNumber}: City name missing or invalid`);
    }

    // Check for data quality issues
    if (facilityName && facilityName.length > 200) {
      warnings.push(`Row ${rowNumber}: Facility name very long (${facilityName.length} chars)`);
    }

    // Check for coordinate data
    const coords = this.extractCoordinates(record);
    if (!coords.latitude || !coords.longitude) {
      warnings.push(`Row ${rowNumber}: Missing coordinate data`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Parse a validated record into structured data
   */
  private parseRecord(record: RawFacilityRecord): ParsedFacilityData {
    return {
      name: this.extractFacilityName(record),
      city: this.extractCityName(record),
      state: this.extractState(record),
      address: this.extractAddress(record),
      companyName: this.extractCompanyName(record),
      description: this.extractDescription(record),
      latitude: this.extractCoordinates(record).latitude,
      longitude: this.extractCoordinates(record).longitude,
      metaTitle: this.extractMetaTitle(record),
      seoKeyword: this.extractSEOKeyword(record),
      rawData: record
    };
  }

  /**
   * Determine required fields based on CSV structure
   */
  private getRequiredFields(record: RawFacilityRecord): string[] {
    const headers = Object.keys(record);
    const required: string[] = [];

    // Look for facility name field
    const nameField = headers.find(h => 
      h.toLowerCase().includes('name') || 
      h.toLowerCase().includes('facility') ||
      h.toLowerCase().includes('site')
    );
    if (nameField) required.push(nameField);

    // Look for city field
    const cityField = headers.find(h => 
      h.toLowerCase().includes('city') ||
      h.toLowerCase().includes('location')
    );
    if (cityField) required.push(cityField);

    return required;
  }

  /**
   * Extract facility name from record
   */
  private extractFacilityName(record: RawFacilityRecord): string {
    // For Florida CSV: Use "Job Site" field as the facility name
    if (record['Job Site']) {
      return this.standardizeName(record['Job Site']);
    }
    
    // Fallback to other possible field names
    const nameFields = [
      'name', 'facility_name', 'site_name', 'facility', 'site',
      'Name', 'Facility Name', 'Site Name', 'Facility', 'Site'
    ];

    for (const field of nameFields) {
      if (record[field]) {
        return this.standardizeName(record[field]);
      }
    }

    const headers = Object.keys(record);
    const nameField = headers.find(h => 
      h.toLowerCase().includes('name') || 
      h.toLowerCase().includes('facility')
    );
    
    return nameField ? this.standardizeName(record[nameField]) : '';
  }

  /**
   * Extract city name from record
   */
  private extractCityName(record: RawFacilityRecord): string {
    const headers = Object.keys(record);
    
    // Try different possible field names
    const cityFields = [
      'city', 'location', 'municipality', 'town',
      'City', 'Location', 'Municipality', 'Town'
    ];

    for (const field of cityFields) {
      if (record[field]) {
        return this.standardizeCityName(record[field]);
      }
    }

    // Fallback to first field that looks like a city
    const cityField = headers.find(h => 
      h.toLowerCase().includes('city') ||
      h.toLowerCase().includes('location')
    );
    
    return cityField ? this.standardizeCityName(record[cityField]) : '';
  }

  /**
   * Extract state from record
   */
  private extractState(record: RawFacilityRecord): string {
    const headers = Object.keys(record);
    
    // Try different possible field names
    const stateFields = [
      'state', 'State', 'st', 'ST'
    ];

    for (const field of stateFields) {
      if (record[field]) {
        return record[field].trim();
      }
    }

    // Fallback to first field that looks like a state
    const stateField = headers.find(h => 
      h.toLowerCase().includes('state') ||
      h.toLowerCase() === 'st'
    );
    
    return stateField ? record[stateField].trim() : '';
  }

  /**
   * Extract address from record
   */
  private extractAddress(record: RawFacilityRecord): string | undefined {
    const headers = Object.keys(record);
    
    const addressFields = [
      'address', 'street', 'location', 'addr',
      'Address', 'Street', 'Location', 'Addr'
    ];

    for (const field of addressFields) {
      if (record[field] && record[field].trim() !== '') {
        return record[field].trim();
      }
    }

    return undefined;
  }

  /**
   * Extract company name from record
   */
  private extractCompanyName(record: RawFacilityRecord): string | undefined {
    // For Florida CSV: Use "Job Site" field as the company name (same as facility name)
    if (record['Job Site']) {
      return this.standardizeName(record['Job Site']);
    }
    
    // Fallback to other possible field names
    const companyFields = [
      'company', 'company_name', 'employer', 'corporation',
      'Company', 'Company Name', 'Employer', 'Corporation'
    ];

    for (const field of companyFields) {
      if (record[field] && record[field].trim() !== '') {
        return record[field].trim();
      }
    }

    return undefined;
  }

  /**
   * Extract description from record
   */
  private extractDescription(record: RawFacilityRecord): string | undefined {
    const headers = Object.keys(record);
    
    const descFields = [
      'description', 'details', 'notes', 'info',
      'Description', 'Details', 'Notes', 'Info'
    ];

    for (const field of descFields) {
      if (record[field] && record[field].trim() !== '') {
        return record[field].trim();
      }
    }

    return undefined;
  }

  /**
   * Extract coordinates from record
   */
  private extractCoordinates(record: RawFacilityRecord): { latitude?: string; longitude?: string } {
    const headers = Object.keys(record);
    
    const latFields = ['latitude', 'lat', 'Latitude', 'Lat'];
    const lonFields = ['longitude', 'lon', 'lng', 'Longitude', 'Lon', 'Lng'];

    let latitude: string | undefined;
    let longitude: string | undefined;

    for (const field of latFields) {
      if (record[field] && record[field].trim() !== '') {
        latitude = record[field].trim();
        break;
      }
    }

    for (const field of lonFields) {
      if (record[field] && record[field].trim() !== '') {
        longitude = record[field].trim();
        break;
      }
    }

    return { latitude, longitude };
  }

  /**
   * Standardize facility name
   */
  private standardizeName(name: string): string {
    return name
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s&.-]/g, '')
      .substring(0, 200);
  }

  /**
   * Standardize city name
   */
  private standardizeCityName(city: string): string {
    return city
      .trim()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .substring(0, 100);
  }

  /**
   * Extract meta title from record (City Location Page Name field)
   */
  private extractMetaTitle(record: RawFacilityRecord): string | undefined {
    // For Florida CSV: Use "City Location Page Name" field as meta title
    if (record['City Location Page Name']) {
      return record['City Location Page Name'].trim();
    }
    
    return undefined;
  }

  /**
   * Extract SEO keyword from record (same as meta title but can be processed differently)
   */
  private extractSEOKeyword(record: RawFacilityRecord): string | undefined {
    // For Florida CSV: Use "City Location Page Name" field as SEO keyword
    if (record['City Location Page Name']) {
      // Remove "asbestos exposure" suffix to get base keyword
      const fullKeyword = record['City Location Page Name'].trim();
      return fullKeyword.replace(/\s+asbestos exposure$/i, '').trim();
    }
    
    return undefined;
  }

  /**
   * Generate a summary report
   */
  public generateReport(result: CSVParseResult): string {
    const report = [
      '📊 CSV PARSING REPORT',
      '=====================',
      `Total Records: ${result.totalRecords}`,
      `Valid Records: ${result.validRecords.length}`,
      `Invalid Records: ${result.invalidRecords.length}`,
      `Success Rate: ${((result.validRecords.length / result.totalRecords) * 100).toFixed(1)}%`,
      '',
      `Cities Found: ${result.cityCount}`,
      `Column Headers: ${result.columnHeaders.join(', ')}`,
      '',
      'TOP 10 CITIES BY FACILITY COUNT:',
      ...this.getCityStats(result.validRecords).slice(0, 10),
      '',
      'VALIDATION ISSUES:',
      ...result.invalidRecords.slice(0, 5).map(r => `❌ ${r.errors.join(', ')}`),
      '',
      'WARNINGS:',
      ...result.warnings.slice(0, 10).map(w => `⚠️  ${w}`),
    ];

    return report.join('\n');
  }

  /**
   * Get city statistics
   */
  private getCityStats(records: ParsedFacilityData[]): string[] {
    const cityCount: { [key: string]: number } = {};
    
    records.forEach(record => {
      cityCount[record.city] = (cityCount[record.city] || 0) + 1;
    });

    return Object.entries(cityCount)
      .sort(([,a], [,b]) => b - a)
      .map(([city, count]) => `  ${city}: ${count} facilities`);
  }
}