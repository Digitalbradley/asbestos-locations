import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🚀 SSR Handler started');
  console.log('Request URL:', req.url);
  
  try {
    // TEMPORARY: Always serve SSR content for testing
    console.log('🧪 TESTING MODE: Always serving SSR content');
    
    try {
      // Try to import SEO modules
      console.log('📦 Importing SEO modules...');
      const { generateSEOMetadata, generateMetaTagsHTML } = await import('../server/seo');
      const { generateSSRContent } = await import('../server/ssr');
      console.log('✅ SEO modules imported successfully');
      
      // Generate content
      const seoMetadata = await generateSEOMetadata(req as any);
      const ssrContent = await generateSSRContent(req as any);
      console.log('✅ SEO content generated');
      
      const botHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${generateMetaTagsHTML(seoMetadata)}
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; color: #333; background: #f9f9f9; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .test-banner { background: #fef3c7; border: 1px solid #f59e0b; padding: 10px; margin-bottom: 20px; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="test-banner">
      <strong>🧪 TESTING MODE:</strong> This is SSR-generated content with your database data
    </div>
    ${ssrContent.html}
  </div>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache'); // Don't cache during testing
      res.status(200).send(botHtml);
      
    } catch (seoError) {
      console.error('❌ Error with SEO modules:', seoError);
      
      // Detailed error for debugging
      const errorHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SSR Debug Error</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px;">
  <h1>🚨 SSR Debug Error</h1>
  <p><strong>Error:</strong> ${seoError instanceof Error ? seoError.message : 'Unknown error'}</p>
  <p><strong>Stack:</strong></p>
  <pre style="background: #f5f5f5; padding: 10px; overflow: auto;">${seoError instanceof Error ? seoError.stack : 'No stack trace'}</pre>
  <p><strong>Request URL:</strong> ${req.url}</p>
</body>
</html>`;
      
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.status(500).send(errorHtml);
    }
    
  } catch (error) {
    console.error('🚨 Critical SSR Handler Error:', error);
    
    const errorHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Critical SSR Error</title>
</head>
<body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
  <h1>🚨 Critical SSR Error</h1>
  <p><strong>Error:</strong> ${error instanceof Error ? error.message : 'Unknown error'}</p>
  <p><strong>URL:</strong> ${req.url}</p>
</body>
</html>`;
    
    res.status(500).send(errorHtml);
  }
}
