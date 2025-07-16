import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🚀 SSR Handler started');
  console.log('Request URL:', req.url);
  console.log('User Agent:', req.headers['user-agent']?.substring(0, 100));
  console.log('Process CWD:', process.cwd());
  
  try {
    const userAgent = req.headers['user-agent'] || '';
    const isBot = /bot|crawler|spider|crawling|facebook|twitter|linkedinbot|whatsapp|telegram/i.test(userAgent);
    
    console.log('🤖 Is Bot:', isBot);
    
    // For human users, try to serve React app
    if (!isBot) {
      console.log('👤 Serving human user - looking for React app...');
      
      try {
        const fs = await import('fs');
        const path = await import('path');
        console.log('✅ FS and Path modules imported');
        
        // Try multiple possible paths
        const possiblePaths = [
          path.resolve(process.cwd(), 'dist/public/index.html'),
          path.resolve(process.cwd(), 'dist/index.html'),
          path.resolve(process.cwd(), 'index.html')
        ];
        
        console.log('🔍 Checking paths:', possiblePaths);
        
        let htmlContent = '';
        let foundPath = '';
        
        for (const attemptPath of possiblePaths) {
          console.log(`Checking: ${attemptPath}`);
          try {
            if (fs.existsSync(attemptPath)) {
              htmlContent = fs.readFileSync(attemptPath, 'utf-8');
              foundPath = attemptPath;
              console.log(`✅ Found React app at: ${foundPath}`);
              break;
            } else {
              console.log(`❌ Not found: ${attemptPath}`);
            }
          } catch (pathError) {
            console.log(`❌ Error reading ${attemptPath}:`, pathError);
          }
        }
        
        if (htmlContent) {
          console.log('✅ Serving React app with basic SEO');
          
          // Basic SEO injection without external dependencies
          const url = req.url || '/';
          const title = url === '/' 
            ? 'Asbestos Exposure Sites Directory - 87,000+ Documented Locations'
            : `Asbestos Exposure Sites${url}`;
          
          const description = 'Comprehensive database of asbestos exposure sites across all states.';
          
          // Simple meta tag injection
          htmlContent = htmlContent.replace(
            /<title>.*?<\/title>/i,
            `<title>${title}</title>`
          );
          
          if (!htmlContent.includes('<meta name="description"')) {
            htmlContent = htmlContent.replace(
              '</head>',
              `  <meta name="description" content="${description}">\n  </head>`
            );
          }
          
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
          res.status(200).send(htmlContent);
          return;
        } else {
          console.log('❌ No React app found at any path');
          throw new Error('React app not found');
        }
        
      } catch (reactError) {
        console.error('❌ Error serving React app:', reactError);
        
        // Fallback HTML for humans
        const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Asbestos Exposure Sites Directory</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Asbestos Exposure Sites Directory</h1>
      <p class="text-gray-600 mb-4">Loading application...</p>
      <p class="text-sm text-gray-500">Debug: React app not found, serving fallback</p>
    </div>
  </div>
</body>
</html>`;
        
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.status(200).send(fallbackHtml);
        return;
      }
    }
    
    // For bots, try to serve SEO content
    console.log('🤖 Serving bot - attempting SEO content...');
    
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
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; color: #333; }
    .container { max-width: 1200px; margin: 0 auto; }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    ${ssrContent.html}
  </div>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
      res.status(200).send(botHtml);
      
    } catch (seoError) {
      console.error('❌ Error with SEO modules:', seoError);
      
      // Fallback for bots without SEO modules
      const basicBotHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Asbestos Exposure Sites Directory</title>
  <meta name="description" content="Comprehensive database of asbestos exposure sites across all states.">
</head>
<body style="font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px;">
  <h1>Asbestos Exposure Sites Directory</h1>
  <p>Comprehensive database of 87,000+ documented asbestos exposure locations across all 50 states.</p>
  <p><strong>Debug Info:</strong> SEO modules failed to load, serving basic content</p>
</body>
</html>`;
      
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.status(200).send(basicBotHtml);
    }
    
  } catch (error) {
    console.error('🚨 Critical SSR Handler Error:', error);
    
    // Ultimate fallback
    const errorHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Asbestos Exposure Sites Directory</title>
</head>
<body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
  <h1>Asbestos Exposure Sites Directory</h1>
  <p>Service temporarily unavailable. Please try again later.</p>
  <p><small>Error: ${error instanceof Error ? error.message : 'Unknown error'}</small></p>
</body>
</html>`;
    
    res.status(500).send(errorHtml);
  }
}

