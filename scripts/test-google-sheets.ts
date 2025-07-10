import { createGoogleSheetsService } from '../server/utils/googleSheets';
import { qualifyLead } from '../server/utils/leadQualification';

async function testGoogleSheetsIntegration() {
  console.log('Testing Google Sheets integration...');
  
  const googleSheetsService = createGoogleSheetsService();
  
  if (!googleSheetsService) {
    console.error('Google Sheets service not configured. Check environment variables.');
    return;
  }

  try {
    // Initialize the sheet (create headers if needed)
    console.log('Initializing Google Sheets...');
    await googleSheetsService.initializeSheet();
    console.log('✅ Google Sheets initialized successfully');

    // Create a test lead
    const testLead = {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      inquiryType: 'legal-referral',
      subject: 'Mesothelioma diagnosis - need legal help',
      message: 'My father worked at Norfolk Naval Shipyard from 1965-1985 as a pipe fitter. He was diagnosed with mesothelioma in 2019 and we are looking for legal representation.',
      exposure: 'Norfolk Naval Shipyard, pipe fitting work, 1965-1985',
      diagnosis: 'Mesothelioma diagnosed in 2019'
    };

    // Qualify the test lead
    const qualification = qualifyLead(
      testLead.name,
      testLead.email,
      testLead.phone,
      testLead.inquiryType,
      testLead.message,
      testLead.exposure,
      testLead.diagnosis
    );

    console.log('Test lead qualification:');
    console.log(`Score: ${qualification.qualityScore}/100`);
    console.log(`Level: ${qualification.qualificationLevel}`);
    console.log(`Keywords found: ${qualification.contentAnalysis.highValueKeywords.join(', ')}`);

    // Add test lead to Google Sheets
    console.log('Adding test lead to Google Sheets...');
    await googleSheetsService.addLeadToSheet({
      id: 999, // Test ID
      name: testLead.name,
      email: testLead.email,
      phone: testLead.phone,
      inquiryType: testLead.inquiryType,
      subject: testLead.subject,
      message: testLead.message,
      exposure: testLead.exposure,
      diagnosis: testLead.diagnosis,
      submittedAt: new Date(),
      pageUrl: 'https://asbestosexposuresites.com/contact',
      qualification
    });

    console.log('✅ Test lead added to Google Sheets successfully!');
    console.log('Check your Google Sheets document to see the test lead.');

  } catch (error) {
    console.error('❌ Error testing Google Sheets integration:', error);
  }
}

testGoogleSheetsIntegration();