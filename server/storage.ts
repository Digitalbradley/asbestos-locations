import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { eq, like, and, desc, asc, sql, ne, or, ilike } from 'drizzle-orm';
import * as schema from '../shared/schema';
import { 
  State, 
  City, 
  Category, 
  Facility, 
  ContactSubmission,
  ContentTemplate,
  FacilityProximity,
  InsertState,
  InsertCity,
  InsertCategory,
  InsertFacility,
  InsertContactSubmission,
  InsertContentTemplate,
  InsertFacilityProximity,
  StateWithCities,
  CityWithState,
  FacilityWithRelations
} from '../shared/schema';

const { 
  states, 
  cities, 
  categories, 
  facilities, 
  contactSubmissions,
  contentTemplates,
  facilityProximity
} = schema;

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const db = drizzle({ client: pool, schema });

export interface IStorage {
  // States
  getStates(): Promise<State[]>;
  getStateById(id: number): Promise<State | undefined>;
  getStateBySlug(slug: string): Promise<StateWithCities | undefined>;
  createState(state: InsertState): Promise<State>;
  updateState(id: number, updates: Partial<InsertState>): Promise<State | null>;
  deleteState(id: number): Promise<boolean>;

  // Cities
  getCities(stateId?: number): Promise<City[]>;
  getCityById(id: number): Promise<City | undefined>;
  getCityBySlug(stateSlug: string, citySlug: string): Promise<CityWithState | undefined>;
  createCity(city: InsertCity): Promise<City>;
  updateCity(id: number, updates: Partial<InsertCity>): Promise<City | null>;
  deleteCity(id: number): Promise<boolean>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category | null>;
  deleteCategory(id: number): Promise<boolean>;

  // Facilities
  getFacilities(cityId?: number, limit?: number): Promise<Facility[]>;
  getFacilityById(id: number): Promise<Facility | undefined>;
  getFacilityBySlug(stateSlug: string, citySlug: string, facilitySlug: string): Promise<FacilityWithRelations | undefined>;
  searchFacilities(query: string, limit?: number): Promise<FacilityWithRelations[]>;
  createFacility(facility: InsertFacility): Promise<Facility>;
  updateFacility(id: number, updates: Partial<InsertFacility>): Promise<Facility | null>;
  deleteFacility(id: number): Promise<boolean>;

  // Contact Submissions
  getContactSubmissions(facilityId?: number, limit?: number): Promise<ContactSubmission[]>;
  getContactSubmissionById(id: number): Promise<ContactSubmission | undefined>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  updateContactSubmission(id: number, updates: Partial<ContactSubmission>): Promise<ContactSubmission | null>;
  deleteContactSubmission(id: number): Promise<boolean>;

  // Content Templates
  getContentTemplates(templateType?: string): Promise<ContentTemplate[]>;
  getContentTemplateByName(templateName: string): Promise<ContentTemplate | undefined>;
  createContentTemplate(template: InsertContentTemplate): Promise<ContentTemplate>;
  updateContentTemplate(id: number, updates: Partial<InsertContentTemplate>): Promise<ContentTemplate | null>;
  deleteContentTemplate(id: number): Promise<boolean>;

  // Facility Proximity
  getFacilityProximity(facilityId: number, limit?: number): Promise<FacilityProximity[]>;
  getNearbyFacilitiesWithDistance(facilityId: number, limit?: number): Promise<FacilityWithRelations[]>;
  createFacilityProximity(insertProximity: InsertFacilityProximity): Promise<FacilityProximity>;
  calculateAndStoreProximity(facilityId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // States
  async getStates(): Promise<State[]> {
    return await db.select().from(states);
  }

  async getStateById(id: number): Promise<State | undefined> {
    const result = await db.select().from(states).where(eq(states.id, id));
    return result[0];
  }

  async getStateBySlug(slug: string): Promise<StateWithCities | undefined> {
    const stateResult = await db.select().from(states).where(eq(states.slug, slug));
    if (stateResult.length === 0) return undefined;
    
    const state = stateResult[0];
    const citiesResult = await db.select().from(cities).where(eq(cities.stateId, state.id));
    
    return {
      ...state,
      cities: citiesResult
    };
  }

  async createState(state: InsertState): Promise<State> {
    const result = await db.insert(states).values(state).returning();
    return result[0];
  }

  async updateState(id: number, updates: Partial<InsertState>): Promise<State | null> {
    const result = await db.update(states)
      .set(updates)
      .where(eq(states.id, id))
      .returning();
    return result[0] || null;
  }

  async deleteState(id: number): Promise<boolean> {
    const result = await db.delete(states).where(eq(states.id, id)).returning();
    return result.length > 0;
  }

  // Cities
  async getCities(stateId?: number): Promise<City[]> {
    if (stateId) {
      return await db.select().from(cities).where(eq(cities.stateId, stateId));
    }
    return await db.select().from(cities);
  }

  async getCityById(id: number): Promise<City | undefined> {
    const result = await db.select().from(cities).where(eq(cities.id, id));
    return result[0];
  }

  async getCityBySlug(stateSlug: string, citySlug: string): Promise<CityWithState | undefined> {
    const result = await db.select({
      id: cities.id,
      name: cities.name,
      slug: cities.slug,
      stateId: cities.stateId,
      facilityCount: cities.facilityCount,
      createdAt: cities.createdAt,
      state: {
        id: states.id,
        name: states.name,
        slug: states.slug,
        facilityCount: states.facilityCount,
        createdAt: states.createdAt
      }
    })
    .from(cities)
    .leftJoin(states, eq(cities.stateId, states.id))
    .where(and(
      eq(cities.slug, citySlug),
      eq(states.slug, stateSlug)
    ));
    
    return result[0];
  }

  async createCity(city: InsertCity): Promise<City> {
    const result = await db.insert(cities).values(city).returning();
    return result[0];
  }

  async updateCity(id: number, updates: Partial<InsertCity>): Promise<City | null> {
    const result = await db.update(cities)
      .set(updates)
      .where(eq(cities.id, id))
      .returning();
    return result[0] || null;
  }

  async deleteCity(id: number): Promise<boolean> {
    const result = await db.delete(cities).where(eq(cities.id, id)).returning();
    return result.length > 0;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    return result[0];
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.slug, slug));
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  async updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category | null> {
    const result = await db.update(categories)
      .set(updates)
      .where(eq(categories.id, id))
      .returning();
    return result[0] || null;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id)).returning();
    return result.length > 0;
  }

  // Facilities
  async getFacilities(cityId?: number, limit: number = 100): Promise<Facility[]> {
    let query = db.select().from(facilities);
    
    if (cityId) {
      query = query.where(eq(facilities.cityId, cityId));
    }
    
    return await query.limit(limit);
  }

  async getFacilityById(id: number): Promise<Facility | undefined> {
    const result = await db.select().from(facilities).where(eq(facilities.id, id));
    return result[0];
  }

  async getFacilityBySlug(stateSlug: string, citySlug: string, facilitySlug: string): Promise<FacilityWithRelations | undefined> {
    const result = await db.select({
      id: facilities.id,
      name: facilities.name,
      slug: facilities.slug,
      address: facilities.address,
      cityId: facilities.cityId,
      stateId: facilities.stateId,
      categoryId: facilities.categoryId,
      companyName: facilities.companyName,
      description: facilities.description,
      metaTitle: facilities.metaTitle,
      metaDescription: facilities.metaDescription,
      seoKeyword: facilities.seoKeyword,
      operationalYears: facilities.operationalYears,
      facilityType: facilities.facilityType,
      latitude: facilities.latitude,
      longitude: facilities.longitude,
      createdAt: facilities.createdAt,
      state: {
        id: states.id,
        name: states.name,
        slug: states.slug,
        facilityCount: states.facilityCount,
        createdAt: states.createdAt
      },
      city: {
        id: cities.id,
        name: cities.name,
        slug: cities.slug,
        stateId: cities.stateId,
        facilityCount: cities.facilityCount,
        createdAt: cities.createdAt
      },
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        facilityCount: categories.facilityCount,
        createdAt: categories.createdAt
      }
    })
    .from(facilities)
    .leftJoin(states, eq(facilities.stateId, states.id))
    .leftJoin(cities, eq(facilities.cityId, cities.id))
    .leftJoin(categories, eq(facilities.categoryId, categories.id))
    .where(and(
      eq(facilities.slug, facilitySlug),
      eq(cities.slug, citySlug),
      eq(states.slug, stateSlug)
    ));
    
    return result[0];
  }

  async searchFacilities(query: string, limit: number = 10): Promise<FacilityWithRelations[]> {
    const result = await db.select({
      id: facilities.id,
      name: facilities.name,
      slug: facilities.slug,
      address: facilities.address,
      cityId: facilities.cityId,
      stateId: facilities.stateId,
      categoryId: facilities.categoryId,
      companyName: facilities.companyName,
      description: facilities.description,
      metaTitle: facilities.metaTitle,
      metaDescription: facilities.metaDescription,
      seoKeyword: facilities.seoKeyword,
      operationalYears: facilities.operationalYears,
      facilityType: facilities.facilityType,
      latitude: facilities.latitude,
      longitude: facilities.longitude,
      createdAt: facilities.createdAt,
      state: {
        id: states.id,
        name: states.name,
        slug: states.slug,
        facilityCount: states.facilityCount,
        createdAt: states.createdAt
      },
      city: {
        id: cities.id,
        name: cities.name,
        slug: cities.slug,
        stateId: cities.stateId,
        facilityCount: cities.facilityCount,
        createdAt: cities.createdAt
      },
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        facilityCount: categories.facilityCount,
        createdAt: categories.createdAt
      }
    })
    .from(facilities)
    .leftJoin(states, eq(facilities.stateId, states.id))
    .leftJoin(cities, eq(facilities.cityId, cities.id))
    .leftJoin(categories, eq(facilities.categoryId, categories.id))
    .where(like(facilities.name, \`%\${query}%\`))
    .limit(limit);
    
    return result;
  }

  async createFacility(facility: InsertFacility): Promise<Facility> {
    const result = await db.insert(facilities).values(facility).returning();
    return result[0];
  }

  async updateFacility(id: number, updates: Partial<InsertFacility>): Promise<Facility | null> {
    const result = await db.update(facilities)
      .set(updates)
      .where(eq(facilities.id, id))
      .returning();
    return result[0] || null;
  }

  async deleteFacility(id: number): Promise<boolean> {
    const result = await db.delete(facilities).where(eq(facilities.id, id)).returning();
    return result.length > 0;
  }

  // Contact Submissions
  async getContactSubmissions(facilityId?: number, limit: number = 50): Promise<ContactSubmission[]> {
    let query = db.select().from(contactSubmissions);
    
    if (facilityId) {
      query = query.where(eq(contactSubmissions.facilityId, facilityId));
    }
    
    return await query.limit(limit);
  }

  async getContactSubmissionById(id: number): Promise<ContactSubmission | undefined> {
    const result = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id));
    return result[0];
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const result = await db.insert(contactSubmissions).values(submission).returning();
    return result[0];
  }

  async updateContactSubmission(id: number, updates: Partial<ContactSubmission>): Promise<ContactSubmission | null> {
    const result = await db.update(contactSubmissions)
      .set(updates)
      .where(eq(contactSubmissions.id, id))
      .returning();
    return result[0] || null;
  }

  async deleteContactSubmission(id: number): Promise<boolean> {
    const result = await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id)).returning();
    return result.length > 0;
  }

  // Content Templates
  async getContentTemplates(templateType?: string): Promise<ContentTemplate[]> {
    let query = db.select().from(contentTemplates);
    
    if (templateType) {
      query = query.where(eq(contentTemplates.templateType, templateType));
    }
    
    return await query;
  }

  async getContentTemplateByName(templateName: string): Promise<ContentTemplate | undefined> {
    const result = await db.select().from(contentTemplates).where(eq(contentTemplates.templateName, templateName));
    return result[0];
  }

  async createContentTemplate(template: InsertContentTemplate): Promise<ContentTemplate> {
    const result = await db.insert(contentTemplates).values(template).returning();
    return result[0];
  }

  async updateContentTemplate(id: number, updates: Partial<InsertContentTemplate>): Promise<ContentTemplate | null> {
    const result = await db.update(contentTemplates)
      .set(updates)
      .where(eq(contentTemplates.id, id))
      .returning();
    return result[0] || null;
  }

  async deleteContentTemplate(id: number): Promise<boolean> {
    const result = await db.delete(contentTemplates).where(eq(contentTemplates.id, id)).returning();
    return result.length > 0;
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
      category: row.category ? row.category : undefined,
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
        sql\`\${facilities.id} != \${facilityId}\`,
        sql\`\${facilities.latitude} IS NOT NULL\`,
        sql\`\${facilities.longitude} IS NOT NULL\`
      ));

    // Calculate distances and store proximity data
    const proximityData: InsertFacilityProximity[] = [];
    
    for (const otherFacility of otherFacilities) {
      if (otherFacility.latitude && otherFacility.longitude) {
        const distance = this.calculateDistance(
          parseFloat(facility.latitude),
          parseFloat(facility.longitude),
          parseFloat(otherFacility.latitude),
          parseFloat(otherFacility.longitude)
        );
        
        proximityData.push({
          facilityId: facilityId,
          nearbyFacilityId: otherFacility.id,
          distance: distance
        });
      }
    }

    // Sort by distance and take only the closest 20
    proximityData.sort((a, b) => a.distance - b.distance);
    const closestFacilities = proximityData.slice(0, 20);

    // Delete existing proximity data for this facility
    await db
      .delete(facilityProximity)
      .where(eq(facilityProximity.facilityId, facilityId));

    // Insert new proximity data
    if (closestFacilities.length > 0) {
      await db
        .insert(facilityProximity)
        .values(closestFacilities);
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
}

export const storage = new DatabaseStorage();
