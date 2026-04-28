import Link from 'next/link';
import type { MenuItem } from '@/graphql/menus';
import { normalizeMenuUrl } from '@/lib/wordpress';

interface NavMenuProps {
  items: MenuItem[];
}

export default function NavMenu({ items }: NavMenuProps) {
  return (
    <nav id="menu-container" className="flex flex-grow justify-end gap-8 items-center justify-between">
      <ul className="flex gap-8">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={normalizeMenuUrl(item.url)}
              className="text-white text-center text-[18px] font-[900] leading-[60px] font-nav"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        <button type="button" aria-label="Rechercher" className="cursor-pointer">
          <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.625 0C14.9408 0 19.25 4.13663 19.25 9.23926L19.2373 9.71484C19.1204 11.9269 18.1908 13.9315 16.7324 15.4648L25.2217 23.6152L23.7793 25L15.2031 16.7686C13.6295 17.8448 11.7045 18.4785 9.625 18.4785L9.12988 18.4658C4.20839 18.2264 0.262315 14.439 0.0126953 9.71484L0 9.23926C0 4.13664 4.30926 1.58321e-05 9.625 0ZM9.625 2C5.3359 2.00002 2 5.31755 2 9.23926C2.00008 13.1609 5.33595 16.4785 9.625 16.4785C13.9141 16.4785 17.2499 13.1609 17.25 9.23926C17.25 5.31755 13.9141 2 9.625 2Z" fill="white"/>
          </svg>
        </button>

        <button
          type="button"
          className="rounded-[30px] bg-white text-primary font-button text-[16px] font-semibold w-[203px] h-[50px] px-[30px] py-[10px] cursor-pointer"
        >
          Faire un don
        </button>

        <button
          type="button"
          className="rounded-[30px] bg-secondary text-white font-button text-[16px] font-semibold w-[203px] h-[50px] px-[30px] py-[10px] cursor-pointer"
        >
          Écouter le direct
        </button>
      </div>
      
    </nav>
  );
}
