import Link from 'next/link';
import { fetchGraphQL } from '@/lib/wordpress';
import {
  GET_MAIN_MENU,
  GET_TOP_MENU,
  GET_SOCIAL_MENU,
  type GetMainMenuData,
  type GetTopMenuData,
  type GetSocialMenuData,
} from '@/graphql/menus';
import { GET_SITE_LOGO, type SiteLogoData } from '@/graphql/layout';
import NavMenu from './NavMenu';
import TopMenu from './TopMenu';
import MobileNav from './MobileNav';

export default async function Header() {
  const [mainMenuData, topMenuData, logoData, socialMenuData] = await Promise.all([
    fetchGraphQL<GetMainMenuData>(GET_MAIN_MENU).catch(() => null),
    fetchGraphQL<GetTopMenuData>(GET_TOP_MENU).catch(() => null),
    fetchGraphQL<SiteLogoData>(GET_SITE_LOGO, undefined, { next: { revalidate: 3600 } }).catch(() => null),
    fetchGraphQL<GetSocialMenuData>(GET_SOCIAL_MENU).catch(() => null),
  ]);

  const mainItems   = mainMenuData?.menuItems.nodes   ?? [];
  const topItems    = topMenuData?.menuItems.nodes    ?? [];
  const logo        = logoData?.customLogo            ?? null;
  const socialItems = socialMenuData?.menuItems.nodes ?? [];

  return (
    <header className="z-40 absolute top-0 left-0 right-0 w-full px-4 md:px-8 py-4 flex flex-col gap-[20px]">

      {/* Mobile / tablette portrait (< 1139px) */}
      <div className="min-[1139px]:hidden">
        <MobileNav
          items={mainItems}
          socialItems={socialItems}
          logoSrc={logo?.sourceUrl}
          logoAlt={logo?.altText ?? undefined}
        />
      </div>

      {/* Desktop (>= 1139px) */}
      <div className="hidden min-[1139px]:flex items-center gap-8">
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
        <div id="nav-menu-container" className="flex flex-col flex-1 gap-6">
          <TopMenu items={topItems} socialItems={socialItems} />
          <NavMenu items={mainItems} />
        </div>
      </div>
    </header>
  );
}
