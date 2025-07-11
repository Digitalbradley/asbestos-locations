import express, { type Request, Response, NextFunction } from "express";
import { storage } from "../server/storage";
import { insertContactSubmissionSchema } from "../shared/schema";
import { qualifyLead } from "../server/utils/leadQualification";
import { createGoogleSheetsService } from "../server/utils/googleSheets";
import { z } from "zod";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// States routes
app.get("/api/states", async (req, res) => {
  try {
    const states = await storage.getStates();
    res.json(states);
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({ message: "Failed to fetch states" });
  }
});

app.get("/api/states/:slug", async (req, res) => {
  try {
    const state = await storage.getStateBySlug(req.params.slug);
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }
    res.json(state);
  } catch (error) {
    console.error("Error fetching state:", error);
    res.status(500).json({ message: "Failed to fetch state" });
  }
});

// Cities routes
app.get("/api/cities/:stateSlug/:citySlug", async (req, res) => {
  try {
    const city = await storage.getCityBySlug(req.params.stateSlug, req.params.citySlug);
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    res.json(city);
  } catch (error) {
    console.error("Error fetching city:", error);
    res.status(500).json({ message: "Failed to fetch city" });
  }
});

// Facilities routes
app.get("/api/facilities/:stateSlug/:citySlug/:facilitySlug", async (req, res) => {
  try {
    const facility = await storage.getFacilityBySlug(
      req.params.stateSlug,
      req.params.citySlug,
      req.params.facilitySlug
    );
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }
    res.json(facility);
  } catch (error) {
    console.error("Error fetching facility:", error);
    res.status(500).json({ message: "Failed to fetch facility" });
  }
});

// Categories routes
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await storage.getCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

// Search routes
app.get("/api/search", async (req, res) => {
  try {
    const query = req.query.q as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const results = await storage.searchFacilities(query, limit);
    res.json(results);
  } catch (error) {
    console.error("Error searching facilities:", error);
    res.status(500).json({ message: "Failed to search facilities" });
  }
});

// Contact submission
app.post("/api/contact", async (req, res) => {
  try {
    const validatedData = insertContactSubmissionSchema.parse(req.body);
    
    // Qualify the lead
    const qualification = await qualifyLead(validatedData);
    
    // Create contact submission with qualification
    const contactSubmission = await storage.createContactSubmission({
      ...validatedData,
      qualificationScore: qualification.score,
      qualificationLevel: qualification.level,
      qualificationNotes: qualification.notes
    });

    // Submit to Google Sheets if qualified
    if (qualification.score >= 60) {
      try {
        const googleSheets = await createGoogleSheetsService();
        await googleSheets.submitLead({
          ...validatedData,
          qualification
        });
      } catch (sheetsError) {
        console.error("Error submitting to Google Sheets:", sheetsError);
      }
    }

    res.json({ 
      success: true, 
      id: contactSubmission.id,
      qualification: qualification
    });
  } catch (error) {
    console.error("Error creating contact submission:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Invalid form data", 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: "Failed to submit contact form" });
  }
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Export for Vercel
export default app;
