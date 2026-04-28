import Link from 'next/link';
import type { MenuItem } from '@/graphql/menus';
import { normalizeMenuUrl } from '@/lib/wordpress';

interface NavMenuProps {
  items: MenuItem[];
}

export default function NavMenu({ items }: NavMenuProps) {
  return (
    <nav>
      <ul className="flex gap-[18px]">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={normalizeMenuUrl(item.url)}
              className="text-white text-center text-[18px] font-[900] leading-[60px] font-nav px-6"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
