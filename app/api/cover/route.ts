const ALLOWED_HOST = 'hoperadiofrance.fr';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) return new Response('Missing url', { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return new Response('Invalid url', { status: 400 });
  }

  if (parsed.hostname !== ALLOWED_HOST) {
    return new Response('Forbidden', { status: 403 });
  }

  const res = await fetch(url);
  if (!res.ok) return new Response('Upstream error', { status: 502 });

  const buffer = await res.arrayBuffer();
  const contentType = res.headers.get('Content-Type') ?? 'image/jpeg';

  return new Response(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=300',
    },
  });
}
