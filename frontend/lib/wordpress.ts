export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
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
  });

  if (!res.ok) throw new Error(`GraphQL request failed: ${res.status}`);

  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);

  return json.data as T;
}
