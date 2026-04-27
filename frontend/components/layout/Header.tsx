import Link from 'next/link';
import { fetchGraphQL } from '@/lib/wordpress';
import {
  GET_MAIN_MENU,
  GET_TOP_MENU,
  type GetMainMenuData,
  type GetTopMenuData,
} from '@/graphql/menus';
import NavMenu from './NavMenu';
import TopMenu from './TopMenu';

const GET_SITE_LOGO = /* GraphQL */ `
  query GetSiteLogo {
    customLogo {
      sourceUrl
      altText
    }
  }
`;

interface SiteLogoData {
  customLogo: { sourceUrl: string; altText: string } | null;
}

export default async function Header() {
  const [mainMenuData, topMenuData, logoData] = await Promise.all([
    fetchGraphQL<GetMainMenuData>(GET_MAIN_MENU).catch(() => null),
    fetchGraphQL<GetTopMenuData>(GET_TOP_MENU).catch(() => null),
    fetchGraphQL<SiteLogoData>(GET_SITE_LOGO, undefined, { cache: 'no-store' }).catch(() => null),
  ]);

  const mainItems = mainMenuData?.menuItems.nodes ?? [];
  const topItems = topMenuData?.menuItems.nodes ?? [];
  const logo = logoData?.customLogo ?? null;

  return (
    <header className="bg-brand-violet px-8 py-4 flex flex-col gap-[20px]">
      <TopMenu items={topItems} />
      <div className="flex items-center gap-8">
        <Link href="/" className="shrink-0">
          {logo?.sourceUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo.sourceUrl}
              alt={logo.altText || 'Hope Radio'}
              width={131}
              height={89}
              className="w-[131px] h-[88.862px] shrink-0"
            />
          ) : (
            <span className="text-white font-nav font-[900] text-[18px]">
              Hope Radio
            </span>
          )}
        </Link>
        <NavMenu items={mainItems} />
      </div>
    </header>
  );
}
