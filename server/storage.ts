import { 
  states, 
  cities, 
  categories, 
  facilities, 
  contactSubmissions,
  contentTemplates,
  facilityProximity,
  type State, 
  type InsertState,
  type City,
  type InsertCity,
  type Category,
  type InsertCategory,
  type Facility,
  type InsertFacility,
  type ContactSubmission,
  type InsertContactSubmission,
  type ContentTemplate,
  type InsertContentTemplate,
  type FacilityProximity,
  type InsertFacilityProximity,
  type FacilityWithRelations,
  type StateWithCities,
  type CityWithState
} from "@shared/schema";
import { db } from "./db";
import { eq, like, and, desc, asc, sql } from "drizzle-orm";

export interface IStorage {
  // States
  getStates(): Promise<State[]>;
  getStateBySlug(slug: string): Promise<StateWithCities | undefined>;
  createState(state: InsertState): Promise<State>;

  // Cities
  getCitiesByStateId(stateId: number): Promise<City[]>;
  getCitiesByState(stateId: number): Promise<City[]>;
  getCityBySlug(stateSlug: string, citySlug: string): Promise<CityWithState | undefined>;
  createCity(city: InsertCity): Promise<City>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Facilities
  getFacilities(limit?: number, offset?: number): Promise<FacilityWithRelations[]>;
  getFacilitiesByStateId(stateId: number, limit?: number, offset?: number): Promise<FacilityWithRelations[]>;
  getFacilitiesByState(stateId: number, limit?: number): Promise<FacilityWithRelations[]>;
  getFacilitiesByCity(cityId: number, limit?: number): Promise<FacilityWithRelations[]>;
  getFacilitiesByCityId(cityId: number, limit?: number, offset?: number): Promise<FacilityWithRelations[]>;
  getFacilitiesByCategoryId(categoryId: number, limit?: number, offset?: number): Promise<FacilityWithRelations[]>;
  getFacilitiesByStateAndCategory(stateId: number, categoryId: number, limit?: number, offset?: number): Promise<FacilityWithRelations[]>;
  getFacilityBySlug(stateSlug: string, citySlug: string, facilitySlug: string): Promise<FacilityWithRelations | undefined>;
  searchFacilities(query: string, limit?: number): Promise<FacilityWithRelations[]>;
  getNearbyFacilities(facilityId: number, limit?: number): Promise<FacilityWithRelations[]>;
  getRelatedFacilities(facilityId: number, limit?: number): Promise<FacilityWithRelations[]>;
  createFacility(facility: InsertFacility): Promise<Facility>;

  // Contact submissions
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(filters: {
    page?: number;
    limit?: number;
    status?: string;
    qualificationLevel?: string;
    assignedToFirm?: string;
  }): Promise<{ submissions: ContactSubmission[]; total: number; }>;
  updateContactSubmission(id: number, updates: Partial<ContactSubmission>): Promise<ContactSubmission | null>;
  
  // Lead qualification methods
  qualifyLead(submissionId: number, qualificationData: {
    qualityScore: number;
    qualificationLevel: string;
    highValueKeywords: string;
    contactQuality: string;
    wordCount: number;
  }): Promise<ContactSubmission>;
  assignToFirm(submissionId: number, firmName: string): Promise<ContactSubmission>;
  recordFirmResponse(submissionId: number, response: string): Promise<ContactSubmission>;

  // Content Templates
  getContentTemplates(templateType?: string): Promise<ContentTemplate[]>;
  getContentTemplateByName(templateName: string): Promise<ContentTemplate | undefined>;
  getContentTemplate(templateType: string, templateName: string): Promise<ContentTemplate | undefined>;
  createContentTemplate(template: InsertContentTemplate): Promise<ContentTemplate>;
  updateContentTemplate(id: number, template: Partial<InsertContentTemplate>): Promise<ContentTemplate>;

  // Facility Proximity
  getFacilityProximity(facilityId: number, limit?: number): Promise<FacilityProximity[]>;
  getNearbyFacilitiesWithDistance(facilityId: number, limit?: number): Promise<FacilityWithRelations[]>;
  createFacilityProximity(proximity: InsertFacilityProximity): Promise<FacilityProximity>;
  calculateAndStoreProximity(facilityId: number): Promise<void>;

  // City Proximity
  getNearestCities(cityId: number, limit?: number): Promise<Array<{id: number, name: string, slug: string, distance: number, facilityCount: number}>>;
}

export class DatabaseStorage implements IStorage {
  // States
  async getStates(): Promise<State[]> {
    return await db.select().from(states).orderBy(asc(states.name));
  }

  async getStateBySlug(slug: string): Promise<StateWithCities | undefined> {
    const [state] = await db.select().from(states).where(eq(states.slug, slug));
    if (!state) return undefined;

    const stateCities = await db.select().from(cities).where(eq(cities.stateId, state.id)).orderBy(desc(cities.facilityCount));
    
    return {
      ...state,
      cities: stateCities,
    };
  }

  async createState(insertState: InsertState): Promise<State> {
    const [state] = await db.insert(states).values(insertState).returning();
    return state;
  }

  // Cities
  async getCitiesByStateId(stateId: number): Promise<City[]> {
    return await db.select().from(cities).where(eq(cities.stateId, stateId)).orderBy(desc(cities.facilityCount));
  }

  async getCitiesByState(stateId: number): Promise<City[]> {
    return await db.select().from(cities).where(eq(cities.stateId, stateId)).orderBy(desc(cities.facilityCount));
  }

  async getCityBySlug(stateSlug: string, citySlug: string): Promise<CityWithState | undefined> {
    const [result] = await db
      .select({
        city: cities,
        state: states,
      })
      .from(cities)
      .innerJoin(states, eq(cities.stateId, states.id))
      .where(and(eq(states.slug, stateSlug), eq(cities.slug, citySlug)));

    if (!result) return undefined;

    return {
      ...result.city,
      state: result.state,
    };
  }

  async createCity(insertCity: InsertCity): Promise<City> {
    const [city] = await db.insert(cities).values(insertCity).returning();
    return city;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(desc(categories.facilityCount));
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  // Facilities
  async getFacilities(limit: number = 20, offset: number = 0): Promise<FacilityWithRelations[]> {
    const results = await db
      .select({
        facility: facilities,
        state: states,
        city: cities,
        category: categories,
      })
      .from(facilities)
      .innerJoin(states, eq(facilities.stateId, states.id))
      .innerJoin(cities, eq(facilities.cityId, cities.id))
      .leftJoin(categories, eq(facilities.categoryId, categories.id))
      .where(eq(facilities.isActive, true))
      .orderBy(asc(facilities.name))
      .limit(limit)
      .offset(offset);

    return results.map(result => ({
      ...result.facility,
      state: result.state,
      city: result.city,
      category: result.category || undefined,
    }));
  }

  async getFacilitiesByStateId(stateId: number, limit: number = 20, offset: number = 0): Promise<FacilityWithRelations[]> {
    const results = await db
      .select({
        facility: facilities,
        state: states,
        city: cities,
        category: categories,
      })
      .from(facilities)
      .innerJoin(states, eq(facilities.stateId, states.id))
      .innerJoin(cities, eq(facilities.cityId, cities.id))
      .leftJoin(categories, eq(facilities.categoryId, categories.id))
      .where(and(eq(facilities.stateId, stateId), eq(facilities.isActive, true)))
      .orderBy(asc(facilities.name))
      .limit(limit)
      .offset(offset);

    return results.map(result => ({
      ...result.facility,
      state: result.state,
      city: result.city,
      category: result.category || undefined,
    }));
  }

  async getFacilitiesByState(stateId: number, limit: number = 10): Promise<FacilityWithRelations[]> {
    const results = await db
      .select({
        facility: facilities,
        state: states,
        city: cities,
        category: categories,
      })
      .from(facilities)
      .innerJoin(states, eq(facilities.stateId, states.id))
      .innerJoin(cities, eq(facilities.cityId, cities.id))
      .leftJoin(categories, eq(facilities.categoryId, categories.id))
      .where(and(eq(facilities.stateId, stateId), eq(facilities.isActive, true)))
      .orderBy(asc(facilities.name))
      .limit(limit);

    return results.map(result => ({
      ...result.facility,
      state: result.state,
      city: result.city,
      category: result.category || undefined,
    }));
  }

  async getFacilitiesByCity(cityId: number, limit: number = 50): Promise<FacilityWithRelations[]> {
    const results = await db
      .select({
        facility: facilities,
        state: states,
        city: cities,
        category: categories,
      })
      .from(facilities)
      .innerJoin(states, eq(facilities.stateId, states.id))
      .innerJoin(cities, eq(facilities.cityId, cities.id))
      .leftJoin(categories, eq(facilities.categoryId, categories.id))
      .where(and(eq(facilities.cityId, cityId), eq(facilities.isActive, true)))
      .orderBy(asc(facilities.name))
      .limit(limit);

    return results.map(result => ({
      ...result.facility,
      state: result.state,
      city: result.city,
      category: result.category || undefined,
    }));
  }

  async getFacilitiesByCityId(cityId: number, limit: number = 20, offset: number = 0): Promise<FacilityWithRelations[]> {
    const results = await db
      .select({
        facility: facilities,
        state: states,
        city: cities,
        category: categories,
      })
      .from(facilities)
      .innerJoin(states, eq(facilities.stateId, states.id))
      .innerJoin(cities, eq(facilities.cityId, cities.id))
      .leftJoin(categories, eq(facilities.categoryId, categories.id))
      .where(and(eq(facilities.cityId, cityId), eq(facilities.isActive, true)))
      .orderBy(asc(facilities.name))
      .limit(limit)
      .offset(offset);

    return results.map(result => ({
      ...result.facility,
      state: result.state,
      city: result.city,
      category: result.category || undefined,
    }));
  }

  async getFacilitiesByCategoryId(categoryId: number, limit: number = 20, offset: number = 0): Promise<FacilityWithRelations[]> {
    const results = await db
      .select({
        facility: facilities,
        state: states,
        city: cities,
        category: categories,
      })
      .from(facilities)
      .innerJoin(states, eq(facilities.stateId, states.id))
      .innerJoin(cities, eq(facilities.cityId, cities.id))
      .leftJoin(categories, eq(facilities.categoryId, categories.id))
      .where(and(eq(facilities.categoryId, categoryId), eq(facilities.isActive, true)))
      .orderBy(asc(facilities.name))
      .limit(limit)
      .offset(offset);

    return results.map(result => ({
      ...result.facility,
      state: result.state,
      city: result.city,
      category: result.category || undefined,
    }));
  }

  async getFacilitiesByStateAndCategory(stateId: number, categoryId: number, limit: number = 20, offset: number = 0): Promise<FacilityWithRelations[]> {
    const results = await db
      .select({
        facility: facilities,
        state: states,
        city: cities,
        category: categories,
      })
      .from(facilities)
      .innerJoin(states, eq(facilities.stateId, states.id))
      .innerJoin(cities, eq(facilities.cityId, cities.id))
      .leftJoin(categories, eq(facilities.categoryId, categories.id))
      .where(and(
        eq(facilities.stateId, stateId),
        eq(facilities.categoryId, categoryId),
        eq(facilities.isActive, true)
      ))
      .orderBy(asc(facilities.name))
      .limit(limit)
      .offset(offset);

    return results.map(result => ({
      ...result.facility,
      state: result.state,
      city: result.city,
      category: result.category || undefined,
    }));
  }

  async getFacilityBySlug(stateSlug: string, citySlug: string, facilitySlug: string): Promise<FacilityWithRelations | undefined> {
    const [result] = await db
      .select({
        facility: facilities,
        state: states,
        city: cities,
        category: categories,
      })
      .from(facilities)
      .innerJoin(states, eq(facilities.stateId, states.id))
      .innerJoin(cities, eq(facilities.cityId, cities.id))
      .leftJoin(categories, eq(facilities.categoryId, categories.id))
      .where(and(
        eq(states.slug, stateSlug),
        eq(cities.slug, citySlug),
        eq(facilities.slug, facilitySlug),
        eq(facilities.isActive, true)
      ));

    if (!result) return undefined;

    return {
      ...result.facility,
      state: result.state,
      city: result.city,
      category: result.category || undefined,
    };
  }

  async searchFacilities(query: string, limit: number = 10): Promise<FacilityWithRelations[]> {
    const searchPattern = `%${query.toLowerCase()}%`;
    
    const results = await db
      .select({
        facility: facilities,
        state: states,
        city: cities,
        category: categories,
      })
      .from(facilities)
      .innerJoin(states, eq(facilities.stateId, states.id))
      .innerJoin(cities, eq(facilities.cityId, cities.id))
      .leftJoin(categories, eq(facilities.categoryId, categories.id))
      .where(and(
        eq(facilities.isActive, true),
        sql`(LOWER(${facilities.name}) LIKE ${searchPattern} OR LOWER(${facilities.companyName}) LIKE ${searchPattern} OR LOWER(${cities.name}) LIKE ${searchPattern} OR LOWER(${states.name}) LIKE ${searchPattern})`
      ))
      .orderBy(asc(facilities.name))
      .limit(limit);

    return results.map(result => ({
      ...result.facility,
      state: result.state,
      city: result.city,
      category: result.category || undefined,
    }));
  }

  async getNearbyFacilities(facilityId: number, limit: number = 5): Promise<FacilityWithRelations[]> {
    // Get the facility's city to find others in the same city
    const [currentFacility] = await db.select().from(facilities).where(eq(facilities.id, facilityId));
    if (!currentFacility) return [];

    const results = await db
      .select({
        facility: facilities,
        state: states,
        city: cities,
        category: categories,
      })
      .from(facilities)
      .innerJoin(states, eq(facilities.stateId, states.id))
      .innerJoin(cities, eq(facilities.cityId, cities.id))
      .leftJoin(categories, eq(facilities.categoryId, categories.id))
      .where(and(
        eq(facilities.cityId, currentFacility.cityId),
        eq(facilities.isActive, true),
        sql`${facilities.id} != ${facilityId}`
      ))
      .orderBy(asc(facilities.name))
      .limit(limit);

    return results.map(result => ({
      ...result.facility,
      state: result.state,
      city: result.city,
      category: result.category || undefined,
    }));
  }

  async getRelatedFacilities(facilityId: number, limit: number = 5): Promise<FacilityWithRelations[]> {
    // Get facilities from the same company or category
    const [currentFacility] = await db.select().from(facilities).where(eq(facilities.id, facilityId));
    if (!currentFacility) return [];

    const results = await db
      .select({
        facility: facilities,
        state: states,
        city: cities,
        category: categories,
      })
      .from(facilities)
      .innerJoin(states, eq(facilities.stateId, states.id))
      .innerJoin(cities, eq(facilities.cityId, cities.id))
      .leftJoin(categories, eq(facilities.categoryId, categories.id))
      .where(and(
        eq(facilities.isActive, true),
        sql`${facilities.id} != ${facilityId}`,
        sql`(${facilities.companyName} = ${currentFacility.companyName} OR ${facilities.categoryId} = ${currentFacility.categoryId})`
      ))
      .orderBy(asc(facilities.name))
      .limit(limit);

    return results.map(result => ({
      ...result.facility,
      state: result.state,
      city: result.city,
      category: result.category || undefined,
    }));
  }

  async createFacility(insertFacility: InsertFacility): Promise<Facility> {
    const [facility] = await db.insert(facilities).values(insertFacility).returning();
    return facility;
  }

  // Contact submissions
  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const [submission] = await db.insert(contactSubmissions).values(insertSubmission).returning();
    return submission;
  }

  async getContactSubmissions(filters: {
    page?: number;
    limit?: number;
    status?: string;
    qualificationLevel?: string;
    assignedToFirm?: string;
  }): Promise<{ submissions: ContactSubmission[]; total: number; }> {
    const { page = 1, limit = 50, status, qualificationLevel, assignedToFirm } = filters;
    const offset = (page - 1) * limit;

    let query = db.select().from(contactSubmissions);
    let conditions: any[] = [];
    
    if (status) {
      conditions.push(eq(contactSubmissions.status, status));
    }
    
    if (qualificationLevel) {
      conditions.push(eq(contactSubmissions.qualificationLevel, qualificationLevel));
    }
    
    if (assignedToFirm) {
      conditions.push(eq(contactSubmissions.assignedToFirm, assignedToFirm));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const submissions = await query
      .orderBy(desc(contactSubmissions.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalResult = await db.select({ count: sql`count(*)` }).from(contactSubmissions);
    const total = parseInt(totalResult[0].count as string);

    return { submissions, total };
  }

  async updateContactSubmission(id: number, updates: Partial<ContactSubmission>): Promise<ContactSubmission | null> {
    const [updatedSubmission] = await db
      .update(contactSubmissions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(contactSubmissions.id, id))
      .returning();
    
    return updatedSubmission || null;
  }

  // Lead qualification methods
  async qualifyLead(submissionId: number, qualificationData: {
    qualityScore: number;
    qualificationLevel: string;
    highValueKeywords: string;
    contactQuality: string;
    wordCount: number;
  }): Promise<ContactSubmission> {
    const [updatedSubmission] = await db
      .update(contactSubmissions)
      .set({
        qualityScore: qualificationData.qualityScore,
        qualificationLevel: qualificationData.qualificationLevel,
        highValueKeywords: qualificationData.highValueKeywords,
        contactQuality: qualificationData.contactQuality,
        wordCount: qualificationData.wordCount,
        updatedAt: new Date()
      })
      .where(eq(contactSubmissions.id, submissionId))
      .returning();
    
    return updatedSubmission;
  }

  async assignToFirm(submissionId: number, firmName: string): Promise<ContactSubmission> {
    const [updatedSubmission] = await db
      .update(contactSubmissions)
      .set({
        assignedToFirm: firmName,
        dateSentToFirm: new Date(),
        updatedAt: new Date()
      })
      .where(eq(contactSubmissions.id, submissionId))
      .returning();
    
    return updatedSubmission;
  }

  async recordFirmResponse(submissionId: number, response: string): Promise<ContactSubmission> {
    const [updatedSubmission] = await db
      .update(contactSubmissions)
      .set({
        firmResponse: response,
        updatedAt: new Date()
      })
      .where(eq(contactSubmissions.id, submissionId))
      .returning();
    
    return updatedSubmission;
  }

  // Content Templates
  async getContentTemplates(templateType?: string): Promise<ContentTemplate[]> {
    if (templateType) {
      return await db
        .select()
        .from(contentTemplates)
        .where(and(eq(contentTemplates.isActive, true), eq(contentTemplates.templateType, templateType)))
        .orderBy(asc(contentTemplates.templateName));
    }
    
    return await db
      .select()
      .from(contentTemplates)
      .where(eq(contentTemplates.isActive, true))
      .orderBy(asc(contentTemplates.templateType), asc(contentTemplates.templateName));
  }

  async getContentTemplateByName(templateName: string): Promise<ContentTemplate | undefined> {
    const [template] = await db
      .select()
      .from(contentTemplates)
      .where(and(eq(contentTemplates.templateName, templateName), eq(contentTemplates.isActive, true)));
    return template;
  }

  async getContentTemplate(templateType: string, templateName: string): Promise<ContentTemplate | undefined> {
    const [template] = await db
      .select()
      .from(contentTemplates)
      .where(and(
        eq(contentTemplates.templateType, templateType),
        eq(contentTemplates.templateName, templateName),
        eq(contentTemplates.isActive, true)
      ));
    return template;
  }

  async createContentTemplate(insertTemplate: InsertContentTemplate): Promise<ContentTemplate> {
    const [template] = await db
      .insert(contentTemplates)
      .values(insertTemplate)
      .returning();
    return template;
  }

  async updateContentTemplate(id: number, updateTemplate: Partial<InsertContentTemplate>): Promise<ContentTemplate> {
    const [template] = await db
      .update(contentTemplates)
      .set({ ...updateTemplate, updatedAt: new Date() })
      .where(eq(contentTemplates.id, id))
      .returning();
    return template;
  }

  // Facility Proximity
  async getFacilityProximity(facilityId: number, limit: number = 10): Promise<FacilityProximity[]> {
    return await db
      .select()
      .from(facilityProximity)
      .where(eq(facilityProximity.facilityId, facilityId))
      .orderBy(asc(facilityProximity.distance))
      .limit(limit);
  }

  async getNearbyFacilitiesWithDistance(facilityId: number, limit: number = 5): Promise<FacilityWithRelations[]> {
    const proximityData = await db
      .select({
        facility: facilities,
        state: states,
        city: cities,
        category: categories,
        distance: facilityProximity.distance,
      })
      .from(facilityProximity)
      .innerJoin(facilities, eq(facilityProximity.nearbyFacilityId, facilities.id))
      .innerJoin(states, eq(facilities.stateId, states.id))
      .innerJoin(cities, eq(facilities.cityId, cities.id))
      .leftJoin(categories, eq(facilities.categoryId, categories.id))
      .where(eq(facilityProximity.facilityId, facilityId))
      .orderBy(asc(facilityProximity.distance))
      .limit(limit);

    return proximityData.map(row => ({
      ...row.facility,
      state: row.state,
      city: row.city,
      category: row.category || undefined,
    }));
  }

  async createFacilityProximity(insertProximity: InsertFacilityProximity): Promise<FacilityProximity> {
    const [proximity] = await db
      .insert(facilityProximity)
      .values(insertProximity)
      .returning();
    return proximity;
  }

  async calculateAndStoreProximity(facilityId: number): Promise<void> {
    // Get the facility for which we're calculating proximity
    const [facility] = await db
      .select()
      .from(facilities)
      .where(eq(facilities.id, facilityId));
    
    if (!facility || !facility.latitude || !facility.longitude) {
      return;
    }

    // Get all other facilities in the same state with coordinates
    const otherFacilities = await db
      .select()
      .from(facilities)
      .where(and(
        eq(facilities.stateId, facility.stateId),
        sql`${facilities.id} != ${facilityId}`,
        sql`${facilities.latitude} IS NOT NULL`,
        sql`${facilities.longitude} IS NOT NULL`
      ));

    // Calculate distances and store proximity data
    const proximityData: InsertFacilityProximity[] = [];
    
    for (const otherFacility of otherFacilities) {
      if (!otherFacility.latitude || !otherFacility.longitude) continue;
      
      const distance = this.calculateHaversineDistance(
        parseFloat(facility.latitude!),
        parseFloat(facility.longitude!),
        parseFloat(otherFacility.latitude!),
        parseFloat(otherFacility.longitude!)
      );

      proximityData.push({
        facilityId: facility.id,
        nearbyFacilityId: otherFacility.id,
        distance: distance.toString(),
        isWithinState: true,
        isWithinCity: facility.cityId === otherFacility.cityId,
      });
    }

    // Sort by distance and keep only the closest 20
    proximityData.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    const topProximity = proximityData.slice(0, 20);

    // Clear existing proximity data for this facility
    await db
      .delete(facilityProximity)
      .where(eq(facilityProximity.facilityId, facilityId));

    // Insert new proximity data
    if (topProximity.length > 0) {
      await db.insert(facilityProximity).values(topProximity);
    }
  }

  async getNearestCities(cityId: number, limit: number = 10): Promise<Array<{id: number, name: string, slug: string, distance: number, facilityCount: number}>> {
    console.log(`Getting nearest cities for city ID: ${cityId}`);
    
    // Get the target city
    const [targetCity] = await db
      .select()
      .from(cities)
      .where(eq(cities.id, cityId))
      .limit(1);

    console.log(`Target city found:`, targetCity);

    if (!targetCity) {
      console.log('No target city found');
      return [];
    }

    // For now, just get other cities in the same state with facilities
    const allCities = await db
      .select()
      .from(cities)
      .where(and(
        eq(cities.stateId, targetCity.stateId),
        sql`${cities.facilityCount} > 0`
      ));

    console.log(`Found ${allCities.length} cities in same state`);

    // Return cities with estimated distances (placeholder)
    const citiesWithDistance = allCities
      .filter(city => city.id !== cityId)
      .slice(0, limit)
      .map((city, index) => ({
        id: city.id,
        name: city.name,
        slug: city.slug,
        facilityCount: city.facilityCount || 0,
        distance: Math.round((index + 1) * 15.5 * 10) / 10 // Estimated distances
      }));

    console.log(`Returning ${citiesWithDistance.length} cities`);
    return citiesWithDistance;
  }

  // Helper function for distance calculation
  private calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}

export const storage = new DatabaseStorage();
