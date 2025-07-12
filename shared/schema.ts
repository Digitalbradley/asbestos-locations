import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const states = pgTable("states", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  facilityCount: integer("facility_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  stateId: integer("state_id").references(() => states.id).notNull(),
  facilityCount: integer("facility_count").default(0),
  latitude: text("latitude"),
  longitude: text("longitude"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  facilityCount: integer("facility_count").default(0),
});

export const facilities = pgTable("facilities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  cityId: integer("city_id").references(() => cities.id).notNull(),
  stateId: integer("state_id").references(() => states.id).notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  
  // Content fields
  description: text("description"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  seoKeyword: text("seo_keyword"),
  pageTitleTemplate: text("page_title_template"),
  
  // Enhanced content fields for templated content
  historicalDescription: text("historical_description"),
  operationalPeriod: text("operational_period"), // e.g., "1940-1985"
  exposureRisk: text("exposure_risk"), // High, Medium, Low
  workforceSize: text("workforce_size"), // e.g., "500-1000 employees"
  exposureMaterials: text("exposure_materials").array(), // Array of materials
  safetyRecords: text("safety_records"),
  
  // Business data
  companyName: text("company_name"),
  facilityType: text("facility_type"),
  operationalYears: text("operational_years"),
  
  // Industry classification enhancements
  industryCode: text("industry_code"), // SIC/NAICS codes
  facilitySubtype: text("facility_subtype"), // Power Plant -> Coal-fired, etc.
  parentCompany: text("parent_company"),
  subsidiaries: text("subsidiaries").array(),
  
  // Geographic data
  address: text("address"),
  county: text("county"),
  zipCode: text("zip_code"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  
  // Template and content management
  templateContentGenerated: boolean("template_content_generated").default(false),
  lastContentUpdate: timestamp("last_content_update"),
  
  // Management
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content Templates for managing templated content across states/cities/facilities
export const contentTemplates = pgTable("content_templates", {
  id: serial("id").primaryKey(),
  templateType: text("template_type").notNull(), // 'state', 'city', 'facility'
  templateName: text("template_name").notNull(),
  contentBlocks: text("content_blocks").array(),
  placeholders: text("placeholders").array(), // [state_name], [city_name], [facility_count]
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Geographic Proximity Cache for efficient nearby facility queries
export const facilityProximity = pgTable("facility_proximity", {
  id: serial("id").primaryKey(),
  facilityId: integer("facility_id").references(() => facilities.id).notNull(),
  nearbyFacilityId: integer("nearby_facility_id").references(() => facilities.id).notNull(),
  distance: decimal("distance", { precision: 8, scale: 2 }), // in miles
  isWithinState: boolean("is_within_state").default(true),
  isWithinCity: boolean("is_within_city").default(false),
  calculatedAt: timestamp("calculated_at").defaultNow(),
});

// Contact Submissions for lead management
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  inquiryType: text("inquiry_type").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  
  // Additional fields for legal referrals
  exposure: text("exposure"), // Potential exposure details
  diagnosis: text("diagnosis"), // Medical diagnosis information
  pathologyReport: text("pathology_report"), // Yes/No for pathology report availability
  diagnosisTimeline: text("diagnosis_timeline"), // When was diagnosis: within_2_years, more_than_2_years
  
  // Lead tracking
  status: text("status").default("new"), // new, contacted, qualified, converted, closed
  priority: text("priority").default("normal"), // low, normal, high, urgent
  assignedTo: text("assigned_to"), // Staff member handling the lead
  
  // Source tracking
  referralSource: text("referral_source"), // How they found us
  pageUrl: text("page_url"), // What page they were on when they submitted
  userAgent: text("user_agent"), // Browser information
  ipAddress: text("ip_address"), // For geographic tracking
  
  // Follow-up tracking
  contacted: boolean("contacted").default(false),
  contactedAt: timestamp("contacted_at"),
  followUpDate: timestamp("follow_up_date"),
  notes: text("notes"), // Internal notes about the lead
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const statesRelations = relations(states, ({ many }) => ({
  cities: many(cities),
  facilities: many(facilities),
}));

export const citiesRelations = relations(cities, ({ one, many }) => ({
  state: one(states, {
    fields: [cities.stateId],
    references: [states.id],
  }),
  facilities: many(facilities),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  facilities: many(facilities),
}));

export const contentTemplatesRelations = relations(contentTemplates, ({ many }) => ({
  // No direct relations, used for template storage
}));

export const facilityProximityRelations = relations(facilityProximity, ({ one }) => ({
  facility: one(facilities, {
    fields: [facilityProximity.facilityId],
    references: [facilities.id],
  }),
  nearbyFacility: one(facilities, {
    fields: [facilityProximity.nearbyFacilityId],
    references: [facilities.id],
  }),
}));

export const facilitiesRelations = relations(facilities, ({ one, many }) => ({
  state: one(states, {
    fields: [facilities.stateId],
    references: [states.id],
  }),
  city: one(cities, {
    fields: [facilities.cityId],
    references: [cities.id],
  }),
  category: one(categories, {
    fields: [facilities.categoryId],
    references: [categories.id],
  }),
  contactSubmissions: many(contactSubmissions),
  proximityRelations: many(facilityProximity, {
    relationName: "facilityProximity",
  }),
  nearbyFacilities: many(facilityProximity, {
    relationName: "nearbyFacilityProximity",
  }),
}));

export const contactSubmissionsRelations = relations(contactSubmissions, ({ one }) => ({
  // No direct relations for now since facilityId is optional
}));

// Insert schemas
export const insertStateSchema = createInsertSchema(states).omit({
  id: true,
  createdAt: true,
});

export const insertCitySchema = createInsertSchema(cities).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertFacilitySchema = createInsertSchema(facilities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentTemplateSchema = createInsertSchema(contentTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFacilityProximitySchema = createInsertSchema(facilityProximity).omit({
  id: true,
  calculatedAt: true,
});

// Types
export type State = typeof states.$inferSelect;
export type InsertState = z.infer<typeof insertStateSchema>;

export type City = typeof cities.$inferSelect;
export type InsertCity = z.infer<typeof insertCitySchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Facility = typeof facilities.$inferSelect;
export type InsertFacility = z.infer<typeof insertFacilitySchema>;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;

export type ContentTemplate = typeof contentTemplates.$inferSelect;
export type InsertContentTemplate = z.infer<typeof insertContentTemplateSchema>;

export type FacilityProximity = typeof facilityProximity.$inferSelect;
export type InsertFacilityProximity = z.infer<typeof insertFacilityProximitySchema>;

// Extended types for API responses
export type FacilityWithRelations = Facility & {
  state: State;
  city: City;
  category?: Category;
};

export type StateWithCities = State & {
  cities: City[];
};

export type CityWithState = City & {
  state: State;
};
