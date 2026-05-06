import Link from 'next/link';
import type { TopMenuItem } from '@/graphql/menus';
import { normalizeMenuUrl, isExternalUrl } from '@/lib/wordpress';
import Image from 'next/image';

interface TopMenuProps {
  items: TopMenuItem[];
  socialItems?: TopMenuItem[];
  isInternal?: boolean;
}

export default function TopMenu({ items, socialItems = [], isInternal = false }: TopMenuProps) {
  return (
    <nav>
      <ul className="flex items-center justify-end gap-[18px]">
        {items.map((item) => {
          const icone = (isInternal ? item.topMenuIconInterne ?? item.topMenuIcon : item.topMenuIcon) ?? null;
          return (
            <li key={item.id}>
              <Link
                href={normalizeMenuUrl(item.url)}
                className={`flex items-center gap-[10px] text-[clamp(10px,0.9vw,12px)] font-bold leading-[20px] font-heading ${isInternal ? 'text-black' : 'text-white'}`}
              >
                {icone?.sourceUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <Image
                    src={icone.sourceUrl}
                    alt={icone.altText || item.label}
                    width={24}
                    height={24}
                    className="w-[24px] h-[24px] shrink-0"
                  />
                )}
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}

        {socialItems.map((item, index) => {
          const icone = (isInternal ? item.topMenuIconInterne ?? item.topMenuIcon : item.topMenuIcon) ?? null;
          if (!icone?.sourceUrl) return null;
          const external = isExternalUrl(item.url);
          return (
            <li key={item.id} className={index === 0 ? 'ml-8' : undefined}>
              <Link
                href={normalizeMenuUrl(item.url)}
                aria-label={item.label}
                className="flex items-center"
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <Image
                  src={icone.sourceUrl}
                  alt={icone.altText || item.label}
                  width={24}
                  height={24}
                  className="w-[24px] h-[24px] shrink-0"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
