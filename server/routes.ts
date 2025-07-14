import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema } from "@shared/schema";
import { qualifyLead } from "./utils/leadQualification";
import { createGoogleSheetsService } from "./utils/googleSheets";
import { generateSEOMetadata, generateMetaTagsHTML } from "./seo";
import { z } from "zod";
import fs from "fs";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Import SSR function
  const { generateSSRContent } = await import("./ssr");
  
  // Add a simple test route
  app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
  });

  app.get('/debug-ssr', (req, res) => {
    console.log('Debug SSR called');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Host:', req.get('host'));
    res.json({
      nodeEnv: process.env.NODE_ENV,
      host: req.get('host'),
      ssrShouldRun: process.env.NODE_ENV === "production"
    });
  });

  // Add SSR routes for production
  if (process.env.NODE_ENV === "production") {
    // Main SSR route handler for all non-API routes
    app.get('*', async (req: Request, res: Response, next: NextFunction) => {
      // Skip API routes and static files
      if (req.path.startsWith('/api/') || 
          req.path.startsWith('/assets/') || 
          req.path.startsWith('/public/') ||
          req.path.includes('.')) {
        return next();
      }

      try {
        const { html, meta } = await generateSSRContent(req);
        const seoTags = generateMetaTagsHTML(await generateSEOMetadata(req));
        
        const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${seoTags}
  <link rel="stylesheet" href="/assets/index-BmCV3NCo.css">
</head>
<body>
  <div id="root">${html}</div>
  <script src="/assets/index--1n4U5wd.js"></script>
</body>
</html>
        `;
        
        res.setHeader('Content-Type', 'text/html');
        res.send(fullHtml);
      } catch (error) {
        console.error('SSR Error:', error);
        next();
      }
    });
  }

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

  // Nearest cities
  app.get("/api/cities/:cityId/nearest", async (req, res) => {
    const cityId = parseInt(req.params.cityId);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    
    if (isNaN(cityId)) {
      return res.status(400).json({ message: "Invalid city ID" });
    }
    
    try {
      const nearestCities = await storage.getNearestCities(cityId, limit);
      res.json(nearestCities);
    } catch (error) {
      console.error("Error fetching nearest cities:", error);
      res.status(500).json({ message: "Failed to fetch nearest cities" });
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

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Facilities count route
  app.get("/api/facilities/count", async (req, res) => {
    try {
      const stateId = req.query.stateId ? parseInt(req.query.stateId as string) : undefined;
      const cityId = req.query.cityId ? parseInt(req.query.cityId as string) : undefined;
      const categorySlug = req.query.categorySlug as string;

      if (!stateId && !cityId) {
        return res.status(400).json({ message: "State ID or City ID is required" });
      }

      let count = 0;
      if (stateId && categorySlug) {
        const category = await storage.getCategoryBySlug(categorySlug);
        if (category) {
          const facilities = await storage.getFacilitiesByStateAndCategory(stateId, category.id, 10000);
          count = facilities.length;
        }
      } else if (cityId && categorySlug) {
        const category = await storage.getCategoryBySlug(categorySlug);
        if (category) {
          const facilities = await storage.getFacilitiesByCityId(cityId, 10000);
          count = facilities.filter(f => f.category?.slug === categorySlug).length;
        }
      }

      res.json({ count });
    } catch (error) {
      console.error("Error fetching facilities count:", error);
      res.status(500).json({ message: "Failed to fetch facilities count" });
    }
  });

  // Facilities routes
  app.get("/api/facilities", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const stateId = req.query.stateId ? parseInt(req.query.stateId as string) : undefined;
      const cityId = req.query.cityId ? parseInt(req.query.cityId as string) : undefined;
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const categorySlug = req.query.categorySlug as string;

      let facilities: any[] = [];
      if (stateId && categorySlug) {
        // Get facilities by state and category slug
        const category = await storage.getCategoryBySlug(categorySlug);
        if (category) {
          facilities = await storage.getFacilitiesByStateAndCategory(stateId, category.id, limit, offset);
        } else {
          facilities = [];
        }
      } else if (stateId) {
        facilities = await storage.getFacilitiesByStateId(stateId, limit, offset);
      } else if (cityId) {
        facilities = await storage.getFacilitiesByCityId(cityId, limit, offset);
      } else if (categoryId) {
        facilities = await storage.getFacilitiesByCategoryId(categoryId, limit, offset);
      } else {
        facilities = await storage.getFacilities(limit, offset);
      }

      res.json(facilities);
    } catch (error) {
      console.error("Error fetching facilities:", error);
      res.status(500).json({ message: "Failed to fetch facilities" });
    }
  });

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

  app.get("/api/facilities/:id/nearby", async (req, res) => {
    try {
      const facilityId = parseInt(req.params.id);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const facilities = await storage.getNearbyFacilities(facilityId, limit);
      res.json(facilities);
    } catch (error) {
      console.error("Error fetching nearby facilities:", error);
      res.status(500).json({ message: "Failed to fetch nearby facilities" });
    }
  });

  app.get("/api/facilities/:id/related", async (req, res) => {
    try {
      const facilityId = parseInt(req.params.id);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const facilities = await storage.getRelatedFacilities(facilityId, limit);
      res.json(facilities);
    } catch (error) {
      console.error("Error fetching related facilities:", error);
      res.status(500).json({ message: "Failed to fetch related facilities" });
    }
  });

  // Search route
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.trim().length < 2) {
        return res.json([]);
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const facilities = await storage.searchFacilities(query.trim(), limit);
      res.json(facilities);
    } catch (error) {
      console.error("Error searching facilities:", error);
      res.status(500).json({ message: "Failed to search facilities" });
    }
  });

  // Contact submission route
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate the request body
      const validationResult = insertContactSubmissionSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid form data", 
          errors: validationResult.error.issues 
        });
      }

// Qualify the lead using our scoring system
const validatedData = validationResult.data;

const qualification = qualifyLead(
  validatedData.name,
  validatedData.email,
  validatedData.phone || '',
  validatedData.inquiryType,
  validatedData.message,
  null, // exposure field doesn't exist
  validatedData.diagnosis || null,
  validatedData.pathologyReport || null,
  validatedData.diagnosisTimeline || null
); 
// Generate dynamic subject based on diagnosis type
const generateSubject = (originalSubject: string | undefined, diagnosis: string | null | undefined) => {
  let diagnosisType = 'Asbestos Exposure';
  
  if (diagnosis) {
    switch (diagnosis.toLowerCase()) {
      case 'mesothelioma':
        diagnosisType = 'Mesothelioma';
        break;
      case 'lung-cancer':
        diagnosisType = 'Lung Cancer';
        break;
      case 'asbestosis':
        diagnosisType = 'Asbestosis';
        break;
      default:
        diagnosisType = 'Asbestos Exposure';
    }
  }
  
  return `${diagnosisType} Lead`;
};

      // Add additional tracking data and qualification results
const submissionData = {
  name: validatedData.name,
  email: validatedData.email,
  phone: validatedData.phone,
  inquiryType: validatedData.inquiryType,
  subject: generateSubject(validatedData.subject, validatedData.diagnosis),
  message: validatedData.message,
  diagnosis: validatedData.diagnosis,
  pathologyReport: validatedData.pathologyReport,
  diagnosisTimeline: validatedData.diagnosisTimeline,
  status: 'new',
  pageUrl: req.headers.referer || '',
  notes: `Quality Score: ${qualification.qualityScore}/100 | Level: ${qualification.qualificationLevel}\nReasons: ${qualification.qualificationReasons.join('; ')}\nUser Agent: ${req.headers['user-agent'] || 'Unknown'}\nIP Address: ${Array.isArray(req.headers['x-forwarded-for']) ? req.headers['x-forwarded-for'][0] : req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown'}`
};
        // Add qualification data to notes
        notes: `Quality Score: ${qualification.qualityScore}/100 | Level: ${qualification.qualificationLevel}\n` +
               `Reasons: ${qualification.qualificationReasons.join('; ')}\n` +
               `Contact Quality - Email: ${qualification.contactQuality.emailValid ? 'Valid' : 'Invalid'}, ` +
               `Phone: ${qualification.contactQuality.phoneValid ? 'Valid' : 'Invalid'}, ` +
               `Name: ${qualification.contactQuality.nameComplete ? 'Complete' : 'Incomplete'}\n` +
               `Content Analysis - High-value keywords: ${qualification.contentAnalysis.highValueKeywords.length}, ` +
               `Medium-value keywords: ${qualification.contentAnalysis.mediumValueKeywords.length}, ` +
               `Word count: ${qualification.contentAnalysis.wordCount}, ` +
               `Specific details: ${qualification.contentAnalysis.containsSpecificDetails ? 'Yes' : 'No'}` +
               (qualification.contentAnalysis.redFlags.length > 0 ? `\nRed flags: ${qualification.contentAnalysis.redFlags.join(', ')}` : ''),
      };

      // Save to database
      const submission = await storage.createContactSubmission(submissionData);
      
      // Send to Google Sheets if configured
      const googleSheetsService = createGoogleSheetsService();
      if (googleSheetsService) {
        try {
          console.log('Submission data:', {
            id: submission.id,
            createdAt: submission.createdAt,
            createdAtType: typeof submission.createdAt
          });
          
          const leadData = {
            id: submission.id,
            name: submission.name,
            email: submission.email,
            phone: submission.phone || '',
            inquiryType: submission.inquiryType,
            subject: submission.subject,
            message: submission.message,
            diagnosis: submission.diagnosis || undefined,
            pathologyReport: submission.pathologyReport || undefined,
            diagnosisTimeline: submission.diagnosisTimeline || undefined,
            submittedAt: submission.createdAt || new Date(),
            pageUrl: submission.pageUrl || undefined,
            qualification
          };
          
          // All leads go to "All Leads" tab
          await googleSheetsService.addAllLeadsToSheet(leadData);
          console.log(`Lead ${submission.id} added to All Leads tab`);
          
          // Qualified leads also go to "Qualified Leads" tab
          if (qualification.qualificationLevel !== 'rejected') {
            await googleSheetsService.addLeadToSheet(leadData);
            console.log(`Lead ${submission.id} added to Qualified Leads tab`);
          }
        } catch (error) {
          console.error('Failed to add lead to Google Sheets:', error);
          // Continue processing even if Google Sheets fails
        }
      }
      
      // TODO: Send email notifications here
      // await sendEmailNotification(submission);

      res.status(201).json({ 
        message: "Contact form submitted successfully",
        id: submission.id,
        qualification: {
          level: qualification.qualificationLevel,
          score: qualification.qualityScore
        }
      });
    } catch (error) {
      console.error("Error saving contact submission:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // Contact submissions admin routes (for lead management)
  app.get("/api/admin/contacts", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const status = req.query.status as string;
      const priority = req.query.priority as string;

      const submissions = await storage.getContactSubmissions({
        page,
        limit,
        status,
        priority
      });
      
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ message: "Failed to fetch contact submissions" });
    }
  });

  app.patch("/api/admin/contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;

      const updatedSubmission = await storage.updateContactSubmission(id, updates);
      
      if (!updatedSubmission) {
        return res.status(404).json({ message: "Contact submission not found" });
      }

      res.json(updatedSubmission);
    } catch (error) {
      console.error("Error updating contact submission:", error);
      res.status(500).json({ message: "Failed to update contact submission" });
    }
  });

  // Content templates endpoints
  app.get("/api/content-templates/:type/:name", async (req, res) => {
    try {
      const { type, name } = req.params;
      const template = await storage.getContentTemplate(type, name);
      if (!template) {
        return res.status(404).json({ message: "Content template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching content template:", error);
      res.status(500).json({ message: "Failed to fetch content template" });
    }
  });

  // Additional content template routes for your database content
  app.get("/api/content-templates", async (req, res) => {
    try {
      const templateType = req.query.type as string;
      const templates = await storage.getContentTemplates(templateType);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching content templates:", error);
      res.status(500).json({ message: "Failed to fetch content templates" });
    }
  });

  app.get("/api/content-templates/by-name/:name", async (req, res) => {
    try {
      const { name } = req.params;
      const template = await storage.getContentTemplateByName(name);
      if (!template) {
        return res.status(404).json({ message: "Content template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching content template:", error);
      res.status(500).json({ message: "Failed to fetch content template" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
