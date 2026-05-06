/**
 * Normalise une URL de menu item.
 * - URLs internes WordPress (même domaine) → path relatif
 * - URLs externes (réseaux sociaux, etc.) → URL complète conservée
 */
export function normalizeMenuUrl(url: string): string {
  if (!url) return '/';

  if (url.startsWith('/')) return url;
  if (url.startsWith('#')) return url;

  try {
    const parsed = new URL(url);
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? '';
    if (wpUrl) {
      const wpHost = new URL(wpUrl).hostname;
      if (parsed.hostname !== wpHost) return url;
    }
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return url;
  }
}

/**
 * Remplace le host de l'URL WordPress par le host interne Docker défini dans
 * NEXT_PUBLIC_WORDPRESS_URL. Nécessaire pour que /_next/image puisse fetcher
 * les images depuis le container Next.js (localhost:8080 n'est pas joignable
 * depuis l'intérieur du réseau Docker).
 *
 * En production, si l'URL WordPress est déjà sur le bon host, elle reste inchangée.
 */
export function normalizeWpImageUrl(url: string): string {
  if (!url) return url;
  const internalUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? '';
  if (!internalUrl) return url;
  try {
    const parsed   = new URL(url);
    const internal = new URL(internalUrl);
    if (parsed.hostname === internal.hostname) return url;
    parsed.protocol = internal.protocol;
    parsed.hostname = internal.hostname;
    parsed.port     = internal.port;
    return parsed.toString();
  } catch {
    return url;
  }
}

export function isExternalUrl(url: string): boolean {
  if (!url || url.startsWith('/') || url.startsWith('#')) return false;
  try {
    const parsed = new URL(url);
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? '';
    if (!wpUrl) return true;
    return parsed.hostname !== new URL(wpUrl).hostname;
  } catch {
    return false;
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

  // next.revalidate et cache: 'no-store' sont incompatibles dans Next.js.
  // On n'applique le revalidate par défaut que si le caller ne spécifie pas cache.
  const defaultCache: RequestInit = fetchOptions?.cache
    ? {}
    : { next: { revalidate: 3600 } };

  const fetchPromise = fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    ...defaultCache,
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
