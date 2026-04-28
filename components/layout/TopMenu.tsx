import Link from 'next/link';
import type { TopMenuItem } from '@/graphql/menus';
import { normalizeMenuUrl } from '@/lib/wordpress';
import Image from 'next/image';

interface TopMenuProps {
  items: TopMenuItem[];
}

export default function TopMenu({ items }: TopMenuProps) {
  return (
    <nav>
      <ul className="flex items-center justify-end gap-[18px]">
        {items.map((item) => {
          const icone = item.topMenuIcon ?? null;
          return (
            <li key={item.id}>
              <Link
                href={normalizeMenuUrl(item.url)}
                className="flex items-center gap-[10px] text-white text-[12px] font-bold leading-[20px] font-heading"
              >
                {icone && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <Image
                    src={icone.sourceUrl as string}
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
      </ul>
    </nav>
  );
}
