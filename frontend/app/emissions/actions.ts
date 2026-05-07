'use server';

import { fetchGraphQL }                                                from '@/lib/wordpress';
import { GET_EMISSIONS_ALL, GET_EMISSIONS_BY_CATEGORY }               from '@/graphql/emissions';
import type { GetEmissionsData, GetEmissionsByCategoryData }          from '@/graphql/emissions';
import { transformEmissions }                                         from '@/app/data/emissions/transformer';
import type { EmissionCard, EmissionPageInfo }                        from '@/app/data/emissions/transformer';

const PAGE_SIZE = 4;

export async function loadMoreEmissions(
  cursor:       string | null,
  categorySlug: string | null,
): Promise<{ cards: EmissionCard[]; pageInfo: EmissionPageInfo }> {
  const variables: Record<string, unknown> = {
    first: PAGE_SIZE,
    after: cursor ?? null,
  };

  if (!categorySlug) {
    const data = await fetchGraphQL<GetEmissionsData>(GET_EMISSIONS_ALL, variables, {
      cache: 'no-store',
    });
    return transformEmissions(data);
  }

  variables.categorySlug = categorySlug;
  const data = await fetchGraphQL<GetEmissionsByCategoryData>(GET_EMISSIONS_BY_CATEGORY, variables, {
    cache: 'no-store',
  });

  const connection = data.emissionCategory?.emissions;
  if (!connection) return { cards: [], pageInfo: { hasNextPage: false, endCursor: null } };

  return transformEmissions({ emissions: connection });
}
