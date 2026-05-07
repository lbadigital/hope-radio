import { fetchGraphQL }                                           from '@/lib/wordpress';
import { GET_EMISSION_CATEGORIES, GET_EMISSIONS_ALL }             from '@/graphql/emissions';
import type { GetEmissionCategoriesData, GetEmissionsData }       from '@/graphql/emissions';
import { transformEmissions }                                     from '@/app/data/emissions/transformer';
import { MOCK_EMISSIONS, MOCK_EMISSION_CATEGORIES }               from '@/app/data/emissions/mock-emissions';
import { loadMoreEmissions }                                      from './actions';
import EmissionsClient                                            from '@/components/emissions/EmissionsClient';

export default async function EmissionsPage() {
  const [categoriesResult, emissionsResult] = await Promise.allSettled([
    fetchGraphQL<GetEmissionCategoriesData>(
      GET_EMISSION_CATEGORIES,
      {},
      { next: { revalidate: 3600 } },
    ),
    fetchGraphQL<GetEmissionsData>(
      GET_EMISSIONS_ALL,
      { first: 4, after: null },
      { next: { revalidate: 3600 } },
    ),
  ]);

  const categories =
    categoriesResult.status === 'fulfilled'
      ? categoriesResult.value.emissionCategories.nodes
      : MOCK_EMISSION_CATEGORIES;


  const { cards: initialCards, pageInfo: initialPageInfo } =
    emissionsResult.status === 'fulfilled'
      ? transformEmissions(emissionsResult.value)
      : transformEmissions(MOCK_EMISSIONS);

  return (
    <main className="bg-secondary min-h-screen py-16">
      <div className="container mx-auto px-6 lg:px-0">
        <h1 className="font-nav font-[900] text-[64px] md:text-[88px] leading-[90%] text-white text-center uppercase mb-10">
          Émissions
        </h1>

        <EmissionsClient
          initialCards={initialCards}
          initialPageInfo={initialPageInfo}
          categories={categories}
          loadMore={loadMoreEmissions}
        />
      </div>
    </main>
  );
}
