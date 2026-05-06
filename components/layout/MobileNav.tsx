'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { MenuItem, TopMenuItem } from '@/graphql/menus';
import { normalizeMenuUrl, isExternalUrl } from '@/lib/wordpress';
import { usePlayerStore } from '@/store/playerStore';

interface MobileNavProps {
  items: MenuItem[];
  socialItems?: TopMenuItem[];
  logoSrc?: string;
  logoAlt?: string;
  logoInterneSrc?: string;
  isInternal?: boolean;
}

export default function MobileNav({ items, socialItems = [], logoSrc, logoAlt, logoInterneSrc, isInternal = false }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = usePlayerStore((s) => s.toggle);
  const isVisible = usePlayerStore((s) => s.isVisible);

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
      {/* Barre mobile — grille 12 colonnes
          Burger : col-span-2 (≈ 48px)
          Logo   : col-span-6 (espace restant, centré)
          Bouton : col-span-4 (≈ 120px)
      */}
      <div id="mobile-navbar" className="grid grid-cols-12 items-center">

        {/* Burger — col-span-2 */}
        <button
          type="button"
          aria-label="Ouvrir le menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu-drawer"
          onClick={() => setIsOpen(true)}
          className="col-span-2 justify-self-start cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="31" height="20" viewBox="0 0 31 20" fill="none" aria-hidden="true">
            <line y1="1" x2="31" y2="1" stroke={isInternal ? 'black' : 'white'} strokeWidth="2"/>
            <line y1="9" x2="31" y2="9" stroke={isInternal ? 'black' : 'white'} strokeWidth="2"/>
            <line y1="19" x2="31" y2="19" stroke={isInternal ? 'black' : 'white'} strokeWidth="2"/>
          </svg>
        </button>

        {/* Logo — col-span-6, centré */}
        <Link href="/" className="col-span-6 flex justify-center">
          {(isInternal ? logoInterneSrc ?? logoSrc : logoSrc) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={(isInternal ? logoInterneSrc ?? logoSrc : logoSrc) as string}
              alt={logoAlt || 'Hope Radio'}
              width={90}
              height={61}
              className="w-[90px] h-auto"
            />
          ) : (
            <span className={`font-nav font-[900] text-[16px] ${isInternal ? 'text-black' : 'text-white'}`}>Hope Radio</span>
          )}
        </Link>

        {/* Bouton La radio — col-span-4, aligné à droite */}
        <button
          type="button"
          onClick={toggle}
          aria-pressed={isVisible}
          className={`col-span-4 justify-self-end flex items-center gap-[8px] rounded-[30px] text-white font-button text-[14px] font-semibold px-[14px] py-[10px] cursor-pointer ${isInternal ? 'bg-primary' : 'bg-secondary'}`}
        >
          {isVisible ? 'Fermer' : 'La radio'}
          {!isVisible && (
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="14" viewBox="0 0 11 14" fill="none" aria-hidden="true">
              <path d="M10.5 6.92821L3.01142e-07 13.8564L9.06825e-07 3.83256e-06L10.5 6.92821Z" fill="white"/>
            </svg>
          )}
        </button>

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
              {socialItems.filter((item) => item.topMenuIcon?.sourceUrl).length > 0 && (
                <div className="flex gap-4">
                  {socialItems.map((item) => {
                    const icone = (isInternal ? item.topMenuIconInterne ?? item.topMenuIcon : item.topMenuIcon);
                    if (!icone?.sourceUrl) return null;
                    const external = isExternalUrl(item.url);
                    return (
                      <Link
                        key={item.id}
                        href={normalizeMenuUrl(item.url)}
                        aria-label={item.label}
                        onClick={() => setIsOpen(false)}
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
                    );
                  })}
                </div>
              )}
              <button
                type="button"
                className={`rounded-[30px] font-button text-[16px] font-semibold h-[50px] px-[30px] py-[10px] cursor-pointer w-full ${isInternal ? 'bg-secondary text-white' : 'bg-white text-primary'}`}
              >
                Faire un don
              </button>
              <button
                type="button"
                onClick={() => { toggle(); setIsOpen(false); }}
                aria-pressed={isVisible}
                className={`rounded-[30px] text-white font-button text-[16px] font-semibold h-[50px] px-[30px] py-[10px] cursor-pointer w-full ${isInternal ? 'bg-primary' : 'bg-secondary'}`}
              >
                {isVisible ? 'Fermer le lecteur' : 'Écouter le direct'}
              </button>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
