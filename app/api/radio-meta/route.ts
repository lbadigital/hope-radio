export async function GET(request: Request) {
  const res = await fetch('http://hoperadiofrance.fr/meta/', { next: { revalidate: 0 } });
  let text = await res.text();

  // Le serveur source est HTTP uniquement — on réécrit les URLs de cover
  // pour les faire transiter par notre proxy HTTPS et éviter le mixed-content.
  const base = new URL(request.url).origin;
  text = text.replace(
    /<cover_url>(https?:\/\/[^<]+)<\/cover_url>/g,
    (_, url) => `<cover_url>${base}/api/cover?url=${encodeURIComponent(url)}</cover_url>`,
  );

  return new Response(text, {
    headers: { 'Content-Type': 'text/xml' },
  });
}
