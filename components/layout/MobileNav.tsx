'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { MenuItem } from '@/graphql/menus';
import { normalizeMenuUrl } from '@/lib/wordpress';

interface MobileNavProps {
  items: MenuItem[];
  logoSrc?: string;
  logoAlt?: string;
}

export default function MobileNav({ items, logoSrc, logoAlt }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const radioItem = items.find(item => item.label === 'La radio');
  const radioHref = radioItem ? normalizeMenuUrl(radioItem.url) : '/la-radio';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  return (
    <>
      {/* Barre mobile */}
      <div className="grid grid-cols-3 items-center">
        <button
          type="button"
          aria-label="Ouvrir le menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu-drawer"
          onClick={() => setIsOpen(true)}
          className="cursor-pointer shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="31" height="20" viewBox="0 0 31 20" fill="none" aria-hidden="true">
            <line y1="1" x2="31" y2="1" stroke="white" strokeWidth="2"/>
            <line y1="9" x2="31" y2="9" stroke="white" strokeWidth="2"/>
            <line y1="19" x2="31" y2="19" stroke="white" strokeWidth="2"/>
          </svg>
        </button>

        <Link href="/" className="shrink-0">
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoSrc}
              alt={logoAlt || 'Hope Radio'}
              width={90}
              height={61}
              className="w-[90px] h-auto"
            />
          ) : (
            <span className="text-white font-nav font-[900] text-[16px]">Hope Radio</span>
          )}
        </Link>

        <Link
          href={radioHref}
          className="shrink-0 flex justify-between rounded-[30px] bg-secondary text-white font-button text-[16px] font-semibold px-[20px] py-[10px] inline-flex items-center gap-[8px] cursor-pointer"
        >
          La radio
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="14" viewBox="0 0 11 14" fill="none" aria-hidden="true">
            <path d="M10.5 6.92821L3.01142e-07 13.8564L9.06825e-07 3.83256e-06L10.5 6.92821Z" fill="white"/>
          </svg>
        </Link>
      </div>

      {/* Drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            aria-hidden="true"
            onClick={() => setIsOpen(false)}
          />

          <nav
            id="mobile-menu-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
            className="fixed top-0 left-0 h-full w-[280px] bg-brand-violet z-50 flex flex-col py-8 px-6 overflow-y-auto"
          >
            <button
              type="button"
              aria-label="Fermer le menu"
              onClick={() => setIsOpen(false)}
              className="self-end mb-8 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <ul className="flex flex-col gap-2">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={normalizeMenuUrl(item.url)}
                    onClick={() => setIsOpen(false)}
                    className="block text-white font-nav font-[900] text-[18px] py-3 border-b border-white/20 leading-normal"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8 flex flex-col gap-4">
              <button
                type="button"
                className="rounded-[30px] bg-white text-primary font-button text-[16px] font-semibold h-[50px] px-[30px] py-[10px] cursor-pointer w-full"
              >
                Faire un don
              </button>
              <button
                type="button"
                className="rounded-[30px] bg-secondary text-white font-button text-[16px] font-semibold h-[50px] px-[30px] py-[10px] cursor-pointer w-full"
              >
                Écouter le direct
              </button>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
