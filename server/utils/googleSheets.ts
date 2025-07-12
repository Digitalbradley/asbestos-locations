import { google } from 'googleapis';
import type { LeadQualificationResult } from './leadQualification';

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  worksheetName: string;
  credentials: {
    client_email: string;
    private_key: string;
  };
}

export interface LeadData {
  id: number;
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  subject: string;
  message: string;
  diagnosis?: string;
  pathologyReport?: string;
  diagnosisTimeline?: string;
  submittedAt: Date;
  pageUrl?: string;
  qualification: LeadQualificationResult;
}

export class GoogleSheetsService {
  private sheets: any;
  private spreadsheetId: string;
  private worksheetName: string;

  constructor(config: GoogleSheetsConfig) {
    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: config.credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = config.spreadsheetId;
    this.worksheetName = config.worksheetName;
  }

  async addLeadToSheet(leadData: LeadData): Promise<void> {
    // Add to qualified leads tab
    await this.addLeadToTab(leadData, 'Qualified Leads');
  }

  async addAllLeadsToSheet(leadData: LeadData): Promise<void> {
    // Add to all leads tab
    await this.addLeadToTab(leadData, 'All Leads');
  }

  private async addLeadToTab(leadData: LeadData, tabName: string): Promise<void> {
    try {
      // Debug the leadData structure
      console.log('Lead data for Google Sheets:', {
        id: leadData.id,
        submittedAt: leadData.submittedAt,
        submittedAtType: typeof leadData.submittedAt,
        isDate: leadData.submittedAt instanceof Date
      });
      
      const submittedAtString = leadData.submittedAt ? 
        (leadData.submittedAt instanceof Date ? 
          leadData.submittedAt.toISOString() : 
          new Date(leadData.submittedAt).toISOString()) : 
        new Date().toISOString();
      
      const values = [
        [
          leadData.id.toString(),                                              // Lead ID
          submittedAtString,                                                   // Date/Time Submitted
          leadData.name,                                                       // Name
          leadData.email,                                                      // Email
          leadData.phone,                                                      // Phone
          leadData.inquiryType,                                               // Inquiry Type
          leadData.subject,                                                   // Subject
          leadData.message,                                                   // Message
          leadData.diagnosis || '',                                           // Diagnosis Info
          leadData.pathologyReport || '',                                     // Pathology Report
          leadData.diagnosisTimeline || '',                                   // Diagnosis Timeline
          leadData.qualification.qualityScore.toString(),                     // Quality Score
          leadData.qualification.qualificationLevel,                          // Qualification Level
          leadData.qualification.contentAnalysis.highValueKeywords.join(', '), // High-Value Keywords
          `Email: ${leadData.qualification.contactQuality.emailValid ? 'Valid' : 'Invalid'}, Phone: ${leadData.qualification.contactQuality.phoneValid ? 'Valid' : 'Invalid'}, Name: ${leadData.qualification.contactQuality.nameComplete ? 'Complete' : 'Incomplete'}`, // Contact Quality
          leadData.qualification.contentAnalysis.wordCount.toString(),        // Word Count
          'New',                                                              // Status
          '',                                                                 // Assigned to Firm
          '',                                                                 // Date Sent to Firm
          '',                                                                 // Firm Response
          leadData.qualification.qualificationReasons.join('; '),            // Notes
          leadData.pageUrl || '',                                             // Source Page
        ],
      ];

      // Debug log the values array
      console.log('Google Sheets Values Array:', values[0].map((val, idx) => `${idx}: ${val}`));
      console.log('Values array length:', values[0].length);

      const result = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${tabName}!A:V`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values,
        },
      });
      
      console.log('Google Sheets API Response:', {
        updatedRange: result.data.updates?.updatedRange,
        updatedRows: result.data.updates?.updatedRows,
        updatedColumns: result.data.updates?.updatedColumns
      });

      console.log(`Lead ${leadData.id} added to ${tabName} tab successfully`);
    } catch (error) {
      console.error('Error adding lead to Google Sheets:', error);
      throw new Error('Failed to add lead to Google Sheets');
    }
  }

  async initializeSheet(): Promise<void> {
    try {
      // Check if the worksheets exist, if not create them
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      const existingSheets = response.data.sheets.map((sheet: any) => sheet.properties.title);
      const requiredSheets = ['Qualified Leads', 'All Leads'];

      for (const sheetName of requiredSheets) {
        if (!existingSheets.includes(sheetName)) {
          // Create the worksheet
          await this.sheets.spreadsheets.batchUpdate({
            spreadsheetId: this.spreadsheetId,
            resource: {
              requests: [
                {
                  addSheet: {
                    properties: {
                      title: sheetName,
                    },
                  },
                },
              ],
            },
          });
        }
      }

      // Add headers to both sheets if they don't exist
      await this.addHeadersIfNeeded('Qualified Leads');
      await this.addHeadersIfNeeded('All Leads');
    } catch (error) {
      console.error('Error initializing Google Sheets:', error);
      throw new Error('Failed to initialize Google Sheets');
    }
  }

  private async addHeadersIfNeeded(tabName: string): Promise<void> {
    try {
      // Check if headers exist
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${tabName}!A1:V1`,
      });

      if (!response.data.values || response.data.values.length === 0) {
        // Add headers
        const headers = [
          [
            'Lead ID',
            'Date/Time Submitted',
            'Name',
            'Email',
            'Phone',
            'Inquiry Type',
            'Subject',
            'Message',
            'Diagnosis Info',
            'Pathology Report',
            'Diagnosis Timeline',
            'Quality Score',
            'Qualification Level',
            'High-Value Keywords',
            'Contact Quality',
            'Word Count',
            'Status',
            'Assigned to Firm',
            'Date Sent to Firm',
            'Firm Response',
            'Notes',
            'Source Page',
          ],
        ];

        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: `${tabName}!A1:V1`,
          valueInputOption: 'RAW',
          resource: {
            values: headers,
          },
        });

        // Format headers (bold, background color)
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: this.spreadsheetId,
          resource: {
            requests: [
              {
                repeatCell: {
                  range: {
                    sheetId: 0, // Assuming first sheet
                    startRowIndex: 0,
                    endRowIndex: 1,
                    startColumnIndex: 0,
                    endColumnIndex: 21,
                  },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: {
                        red: 0.8,
                        green: 0.8,
                        blue: 0.8,
                      },
                      textFormat: {
                        bold: true,
                      },
                    },
                  },
                  fields: 'userEnteredFormat(backgroundColor,textFormat)',
                },
              },
            ],
          },
        });
      }
    } catch (error) {
      console.error('Error adding headers:', error);
    }
  }

  async updateLeadStatus(leadId: number, status: string, assignedFirm?: string): Promise<void> {
    try {
      // Find the row with this lead ID
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.worksheetName}!A:A`,
      });

      const rowIndex = response.data.values?.findIndex(
        (row: any) => row[0] === leadId.toString()
      );

      if (rowIndex !== undefined && rowIndex >= 0) {
        const actualRowIndex = rowIndex + 1; // Sheets are 1-indexed
        
        // Update status
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: `${this.worksheetName}!P${actualRowIndex}`,
          valueInputOption: 'RAW',
          resource: {
            values: [[status]],
          },
        });

        // Update assigned firm if provided
        if (assignedFirm) {
          await this.sheets.spreadsheets.values.update({
            spreadsheetId: this.spreadsheetId,
            range: `${this.worksheetName}!Q${actualRowIndex}`,
            valueInputOption: 'RAW',
            resource: {
              values: [[assignedFirm]],
            },
          });

          // Update date sent to firm
          await this.sheets.spreadsheets.values.update({
            spreadsheetId: this.spreadsheetId,
            range: `${this.worksheetName}!R${actualRowIndex}`,
            valueInputOption: 'RAW',
            resource: {
              values: [[new Date().toISOString()]],
            },
          });
        }
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
      throw new Error('Failed to update lead status in Google Sheets');
    }
  }
}

// Helper function to create Google Sheets service instance
export function createGoogleSheetsService(): GoogleSheetsService | null {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '1nIBlcGbxaXw_2LxlOSb9BW8G1xmboAktAAgBaVtmsBQ';
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

  console.log('Google Sheets Config Check:', {
    hasSpreadsheetId: !!spreadsheetId,
    hasClientEmail: !!clientEmail, 
    hasPrivateKey: !!privateKey,
    spreadsheetId: spreadsheetId
  });

  if (!spreadsheetId || !clientEmail || !privateKey) {
    console.log('Google Sheets configuration not found in environment variables');
    return null;
  }

  return new GoogleSheetsService({
    spreadsheetId,
    worksheetName: 'Qualified Leads',
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, '\n'),
    },
  });
}
