'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { MenuItem, TopMenuItem } from '@/graphql/menus';
import NavMenu from './NavMenu';
import TopMenu from './TopMenu';
import MobileNav from './MobileNav';

interface HeaderShellProps {
  mainItems: MenuItem[];
  topItems: TopMenuItem[];
  socialItems: TopMenuItem[];
  logo: { sourceUrl: string; altText: string } | null;
  logoInterne: { sourceUrl: string; altText: string } | null;
}

export default function HeaderShell({ mainItems, topItems, socialItems, logo, logoInterne }: HeaderShellProps) {
  const pathname = usePathname();
  const isInternal = pathname !== '/';

  const activeLogo = isInternal ? (logoInterne ?? logo) : logo;

  return (
    <header className={`z-40 ${isInternal ? 'relative' : 'absolute'} top-0 left-0 right-0 w-full px-4 md:px-8 py-4 flex flex-col gap-[20px]${isInternal ? ' bg-white' : ''}`}>

      {/* Mobile / tablette portrait (< 1139px) */}
      <div className="min-[1139px]:hidden">
        <MobileNav
          items={mainItems}
          socialItems={socialItems}
          logoSrc={logo?.sourceUrl}
          logoAlt={logo?.altText ?? undefined}
          logoInterneSrc={logoInterne?.sourceUrl}
          isInternal={isInternal}
        />
      </div>

      {/* Desktop (>= 1139px) */}
      <div className="hidden min-[1139px]:flex items-center gap-8">
        <Link href="/" className="shrink-0">
          {activeLogo?.sourceUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeLogo.sourceUrl}
              alt={activeLogo.altText || 'Hope Radio'}
              width={131}
              height={89}
              className="w-[131px] h-[88.862px] shrink-0"
            />
          ) : (
            <span className={`font-nav font-[900] text-[18px] ${isInternal ? 'text-black' : 'text-white'}`}>
              Hope Radio
            </span>
          )}
        </Link>
        <div id="nav-menu-container" className="flex flex-col flex-1 gap-6">
          <TopMenu items={topItems} socialItems={socialItems} isInternal={isInternal} />
          <NavMenu items={mainItems} isInternal={isInternal} />
        </div>
      </div>
    </header>
  );
}
