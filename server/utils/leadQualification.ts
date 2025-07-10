export interface LeadQualificationResult {
  qualityScore: number;
  qualificationLevel: 'high' | 'medium' | 'low' | 'rejected';
  qualificationReasons: string[];
  contactQuality: {
    emailValid: boolean;
    phoneValid: boolean;
    nameComplete: boolean;
  };
  contentAnalysis: {
    highValueKeywords: string[];
    mediumValueKeywords: string[];
    redFlags: string[];
    wordCount: number;
    containsSpecificDetails: boolean;
  };
}

// High-value keywords for mesothelioma cases
const HIGH_VALUE_KEYWORDS = [
  'mesothelioma', 'asbestos', 'diagnosed', 'cancer', 'lung disease',
  'pleural', 'peritoneal', 'malignant', 'tumor', 'oncology',
  'shipyard', 'navy', 'construction', 'insulation', 'pipe fitter',
  'boiler', 'brake', 'clutch', 'tile', 'cement', 'power plant',
  'steel mill', 'refinement', 'demolition'
];

// Medium-value keywords
const MEDIUM_VALUE_KEYWORDS = [
  'lawyer', 'attorney', 'legal help', 'lawsuit', 'compensation',
  'exposure', 'worked at', 'my father', 'my husband', 'my wife',
  'family member', 'deceased', 'died', 'death', 'breathing problems',
  'lung problems', 'chest pain', 'shortness of breath', 'cough',
  '1960s', '1970s', '1980s', '1990s', 'years ago', 'decades ago'
];

// Red flag keywords that might indicate low-quality leads
const RED_FLAG_KEYWORDS = [
  'just curious', 'school project', 'research paper', 'student',
  'homework', 'assignment', 'test', 'spam', 'advertisement'
];

export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const valid = emailRegex.test(email);
  
  // Additional checks for common invalid patterns
  const invalidPatterns = [
    /^test@/i,
    /^fake@/i,
    /^example@/i,
    /@test\./i,
    /@fake\./i,
    /@example\./i,
    /^\d+@\d+\./,  // Numbers only
    /^.{1}@/,      // Single character before @
  ];
  
  return valid && !invalidPatterns.some(pattern => pattern.test(email));
}

export function validatePhone(phone: string): boolean {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Check for valid US phone number patterns
  if (digitsOnly.length === 10) {
    // Standard 10-digit US number
    return !/^[01]/.test(digitsOnly); // Can't start with 0 or 1
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    // 11-digit with country code
    return !/^1[01]/.test(digitsOnly); // Second digit can't be 0 or 1
  }
  
  // Check for obviously fake patterns
  const fakePatterns = [
    /^(\d)\1{9,}$/, // All same digits (1111111111)
    /^123456789/,   // Sequential numbers
    /^555555555/,   // Too many 5s
    /^000000000/,   // All zeros
  ];
  
  return digitsOnly.length >= 10 && !fakePatterns.some(pattern => pattern.test(digitsOnly));
}

export function validateName(name: string): boolean {
  if (!name || name.trim().length < 2) return false;
  
  const trimmedName = name.trim();
  
  // Check for at least two words (first and last name)
  const words = trimmedName.split(/\s+/).filter(word => word.length > 0);
  if (words.length < 2) return false;
  
  // Check for fake names
  const fakePatterns = [
    /^test/i,
    /^fake/i,
    /^john doe$/i,
    /^jane doe$/i,
    /^first last$/i,
    /^name$/i,
    /^asdf/i,
    /^qwerty/i,
    /^\d+/,  // Starts with numbers
  ];
  
  return !fakePatterns.some(pattern => pattern.test(trimmedName));
}

export function analyzeMessageContent(message: string, exposure?: string, diagnosis?: string): {
  highValueKeywords: string[];
  mediumValueKeywords: string[];
  redFlags: string[];
  wordCount: number;
  containsSpecificDetails: boolean;
} {
  const fullContent = [message, exposure, diagnosis].filter(Boolean).join(' ').toLowerCase();
  
  const highValueKeywords = HIGH_VALUE_KEYWORDS.filter(keyword => 
    fullContent.includes(keyword.toLowerCase())
  );
  
  const mediumValueKeywords = MEDIUM_VALUE_KEYWORDS.filter(keyword => 
    fullContent.includes(keyword.toLowerCase())
  );
  
  const redFlags = RED_FLAG_KEYWORDS.filter(keyword => 
    fullContent.includes(keyword.toLowerCase())
  );
  
  const wordCount = fullContent.split(/\s+/).filter(word => word.length > 0).length;
  
  // Check for specific details that indicate a serious inquiry
  const specificDetailPatterns = [
    /\d{4}s?/,                    // Years (1970s, 1980)
    /\d+ years? ago/,             // Time references
    /worked (at|for|in)/,         // Work history
    /diagnosed (with|in)/,        // Medical diagnosis
    /my (father|husband|wife)/,   // Family references
    /\b\w+\s+(shipyard|plant|mill|company|corporation)\b/, // Specific facilities
  ];
  
  const containsSpecificDetails = specificDetailPatterns.some(pattern => 
    pattern.test(fullContent)
  );
  
  return {
    highValueKeywords,
    mediumValueKeywords,
    redFlags,
    wordCount,
    containsSpecificDetails
  };
}

export function qualifyLead(
  name: string,
  email: string,
  phone: string,
  inquiryType: string,
  message: string,
  exposure?: string,
  diagnosis?: string
): LeadQualificationResult {
  const contactQuality = {
    emailValid: validateEmail(email),
    phoneValid: validatePhone(phone),
    nameComplete: validateName(name)
  };
  
  const contentAnalysis = analyzeMessageContent(message, exposure, diagnosis);
  
  let qualityScore = 0;
  const qualificationReasons: string[] = [];
  
  // Contact quality scoring (40 points max)
  if (contactQuality.emailValid) {
    qualityScore += 15;
    qualificationReasons.push('Valid email address');
  } else {
    qualificationReasons.push('Invalid or suspicious email address');
  }
  
  if (contactQuality.phoneValid) {
    qualityScore += 15;
    qualificationReasons.push('Valid phone number');
  } else {
    qualificationReasons.push('Invalid or suspicious phone number');
  }
  
  if (contactQuality.nameComplete) {
    qualityScore += 10;
    qualificationReasons.push('Complete name provided');
  } else {
    qualificationReasons.push('Incomplete or suspicious name');
  }
  
  // Inquiry type scoring (20 points max)
  if (inquiryType === 'legal-referral') {
    qualityScore += 20;
    qualificationReasons.push('Legal referral request (highest priority)');
  } else if (inquiryType === 'exposure-question') {
    qualityScore += 15;
    qualificationReasons.push('Asbestos exposure question');
  } else if (inquiryType === 'general') {
    qualityScore += 5;
    qualificationReasons.push('General inquiry');
  }
  
  // Content analysis scoring (40 points max)
  if (contentAnalysis.highValueKeywords.length > 0) {
    const points = Math.min(contentAnalysis.highValueKeywords.length * 8, 24);
    qualityScore += points;
    qualificationReasons.push(`High-value keywords found: ${contentAnalysis.highValueKeywords.join(', ')}`);
  }
  
  if (contentAnalysis.mediumValueKeywords.length > 0) {
    const points = Math.min(contentAnalysis.mediumValueKeywords.length * 3, 12);
    qualityScore += points;
    qualificationReasons.push(`Relevant keywords found: ${contentAnalysis.mediumValueKeywords.join(', ')}`);
  }
  
  if (contentAnalysis.containsSpecificDetails) {
    qualityScore += 8;
    qualificationReasons.push('Contains specific details about exposure or timeline');
  }
  
  if (contentAnalysis.wordCount >= 50) {
    qualityScore += 4;
    qualificationReasons.push('Detailed description provided');
  } else if (contentAnalysis.wordCount < 10) {
    qualityScore -= 10;
    qualificationReasons.push('Very brief description (potential low-quality lead)');
  }
  
  // Red flag penalties
  if (contentAnalysis.redFlags.length > 0) {
    qualityScore -= contentAnalysis.redFlags.length * 15;
    qualificationReasons.push(`Red flags detected: ${contentAnalysis.redFlags.join(', ')}`);
  }
  
  // Determine qualification level
  let qualificationLevel: 'high' | 'medium' | 'low' | 'rejected';
  
  if (qualityScore >= 80) {
    qualificationLevel = 'high';
  } else if (qualityScore >= 60) {
    qualificationLevel = 'medium';
  } else if (qualityScore >= 40) {
    qualificationLevel = 'low';
  } else {
    qualificationLevel = 'rejected';
  }
  
  // Override: If contact info is invalid, cap at 'low'
  if (!contactQuality.emailValid || !contactQuality.phoneValid || !contactQuality.nameComplete) {
    if (qualificationLevel === 'high') qualificationLevel = 'medium';
    if (qualificationLevel === 'medium' && (!contactQuality.emailValid || !contactQuality.phoneValid)) {
      qualificationLevel = 'low';
    }
  }
  
  return {
    qualityScore: Math.max(0, qualityScore), // Ensure non-negative
    qualificationLevel,
    qualificationReasons,
    contactQuality,
    contentAnalysis
  };
}