// Albumizr Migration Edge Function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { albumKey, method } = await req.json();
    
    if (!albumKey) {
      throw new Error('Missing albumKey parameter');
    }

    // Construct Albumizr URL
    const albumUrl = `https://albumizr.com/${albumKey}`;
    
    console.log(`Fetching Albumizr album: ${albumUrl}`);

    // Fetch the Albumizr page with proper headers
    const response = await fetch(albumUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Albumizr page: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    
    console.log(`Fetched HTML, length: ${html.length}`);
    
    // Extract images using regex instead of DOMParser
    const images: Array<{ url: string; caption?: string }> = [];
    
    // Match pattern: <div class="th" data-url="..." data-caption="...">
    const thumbRegex = /<div\s+class="th"\s+data-url="([^"]+)"(?:\s+data-caption="([^"]*)")?/gi;
    let match;
    
    while ((match = thumbRegex.exec(html)) !== null) {
      const url = match[1];
      const caption = match[2] || '';
      
      if (url) {
        images.push({
          url: url,
          caption: caption,
        });
      }
    }

    console.log(`Extracted ${images.length} images from ${albumUrl}`);

    return new Response(
      JSON.stringify({
        success: true,
        images,
        albumKey,
        count: images.length,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error in migrate-albumizr function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || String(error),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
})
