import Link from 'next/link';
import type { MenuItem } from '@/graphql/menus';

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
              href={item.url}
              className="text-white text-center text-[18px] font-[900] leading-[60px] font-nav"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
