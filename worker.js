export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS headers for browser access
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Path pattern: /file/<file_path>
    const filePath = url.pathname.replace(/^\/file\//, '');
    if (!filePath) {
      return new Response('Missing file path', { status: 400, headers: corsHeaders });
    }

    const tgUrl = `https://api.telegram.org/file/bot${env.BOT_TOKEN}/${filePath}`;
    const response = await fetch(tgUrl);

    if (!response.ok) {
      return new Response('File not found', { status: response.status, headers: corsHeaders });
    }

    // Forward the response with CORS headers
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  },
};
