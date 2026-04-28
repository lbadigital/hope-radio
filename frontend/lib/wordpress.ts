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
  // WORDPRESS_API_URL = URL interne Docker (http://wordpress/graphql)
  // NEXT_PUBLIC_GRAPHQL_ENDPOINT = fallback pour dev hors Docker
  const endpoint =
    process.env.WORDPRESS_API_URL ?? process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
  if (!endpoint) throw new Error('No GraphQL endpoint configured');

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
    ...fetchOptions,
  });

  if (!res.ok) throw new Error(`GraphQL request failed: ${res.status}`);

  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);

  return json.data as T;
}
