const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const { pathname } = new URL(request.url);
    // @ts-ignore — Cloudflare-specific cf object
    const country: string = (request as any).cf?.country ?? 'FR';

    if (pathname === '/stream-config') {
      return new Response(JSON.stringify({ country }), {
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    const streamUrl =
      country === 'CH'
        ? 'https://stream.hoperadio.fr/hoperadio-suisse'
        : 'https://stream.hoperadio.fr/hoperadio';

    const upstream = await fetch(streamUrl, {
      headers: {
        'User-Agent': request.headers.get('User-Agent') ?? 'Mozilla/5.0',
        'Icy-MetaData': '0',
      },
      // @ts-ignore — Cloudflare-specific option, disables edge caching
      cf: { cacheEverything: false },
    });

    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': upstream.headers.get('Content-Type') ?? 'audio/mpeg',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  },
};
