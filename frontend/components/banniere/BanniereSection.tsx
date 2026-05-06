import dynamic from 'next/dynamic';
import { fetchGraphQL } from '@/lib/wordpress';
import { GET_BANNIERES, type GetBannièresData } from '@/graphql/bannieres';
import { MOCK_BANNIERES, transformBannieres } from '@/app/data';

const BanniereSlider = dynamic(() => import('./BanniereSlider'));

export default async function BanniereSection() {
  let data: GetBannièresData;
  try {
    data = await fetchGraphQL<GetBannièresData>(GET_BANNIERES, {}, { next: { revalidate: 3600 } });
  } catch {
    data = MOCK_BANNIERES;
  }

  const bannieres = transformBannieres(data);
  console.log(bannieres)
  if (!bannieres.length) return null;

  return <BanniereSlider bannieres={bannieres} />;
}
