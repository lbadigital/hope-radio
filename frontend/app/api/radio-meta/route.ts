export async function GET() {
  const res = await fetch('http://hoperadiofrance.fr/meta/', { next: { revalidate: 0 } });
  const text = await res.text();
  return new Response(text, {
    headers: { 'Content-Type': 'text/xml' },
  });
}
