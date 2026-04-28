/**
 * Normalise une URL de menu item en path relatif.
 * Gère les URLs WordPress absolues et les paths relatifs saisis manuellement.
 */
export function normalizeMenuUrl(url: string): string {
  if (!url) return '/';

  // Déjà un path relatif (liens personnalisés saisis dans WP)
  if (url.startsWith('/')) return url;

  // Ancre seule
  if (url.startsWith('#')) return url;

  try {
    const parsed = new URL(url);
    // Retourne path + query + hash, sans le domaine
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return url;
  }
}

export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
  fetchOptions?: RequestInit
): Promise<T> {

  const endpoint =
    process.env.WORDPRESS_API_URL ?? process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
  if (!endpoint) throw new Error('No GraphQL endpoint configured');

  const fetchPromise = fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
    ...fetchOptions,
  }).then(async (res) => {
    if (!res.ok) throw new Error(`GraphQL request failed: ${res.status}`);
    const json = await res.json();
    if (json.errors) throw new Error(json.errors[0].message);
    return json.data as T;
  });

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('GraphQL timeout')), 5000)
  );

  return Promise.race([fetchPromise, timeoutPromise]);
}
