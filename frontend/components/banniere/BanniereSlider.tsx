'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Pagination } from 'swiper/modules';

import { isExternalUrl } from '@/lib/wordpress';
import type { BanniereCard } from '@/app/data';

interface BanniereSliderProps {
  bannieres: BanniereCard[];
}

const BUTTON_STYLE: React.CSSProperties = {
  display:         'inline-flex',
  alignItems:      'center',
  justifyContent:  'center',
  borderRadius:    '30px',
  backgroundColor: '#FFF',
  color:           'var(--color-primary)',
  fontSize:        '16px',
  fontWeight:      600,
  height:          '50px',
  padding:         '10px 30px',
  whiteSpace:      'nowrap',
  textDecoration:  'none',
};

export default function BanniereSlider({ bannieres }: BanniereSliderProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (!bannieres.length) return null;

  return (
    <section className="container relative w-full overflow-hidden  rounded-2xl lg:!my-24">
      <style>{`
        .banniere-slider {
          width: 100%;
          height: 100%;
        
        }
        .banniere-slider .swiper-pagination {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          position: absolute;
          bottom: 40px;
          right: 60px;
          left: auto;
          width: auto;
          transform: none;
          z-index: 10;
        }
        .banniere-slider .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.4);
          opacity: 1;
          margin: 0;
          transition: width 0.3s ease, background 0.3s ease;
        }
        .banniere-slider .swiper-pagination-bullet-active {
          width: 24px;
          background: #FFF;
        }
        @media (max-width: 768px) {
          .banniere-slider .swiper-pagination {
            justify-content: center;
            right: 0;
            left: 0;
            bottom: 20px;
            width: 100%;
          }
        }
      `}</style>

      <Swiper
        modules={[EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        slidesPerView={1}
        loop
        pagination={{ clickable: true }}
        className="banniere-slider"
      >
        {bannieres.map((banniere, index) => {
          const img = (isMobile && banniere.imageMobile) ? banniere.imageMobile : banniere.imageDesktop;
          const isExternal = banniere.lien ? isExternalUrl(banniere.lien) : false;

          return (
            <SwiperSlide key={index}>
              <div className="relative w-full h-[379px] lg:h-[334px] rounded-2xl overflow-hidden p-6">
                {/* Image de fond desktop */}
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  priority={index === 0}
                  className="hidden lg:block absolute top-0 left-0 w-full h-full"
                />


                {/* Contenu */}
                <div className="z-50 relative inset-0 flex flex-col h-full gap-4 px-[60px] pb-8 justify-between max-[768px]:px-5 max-[768px]:pb-8">
                  {/* Sous-titre */}
                  <div>
                    <span
                        className="font-heading max-[768px]:text-center"
                        style={{ color: '#FFF', fontSize: '14px', fontWeight: 700, lineHeight: '124%' }}
                    >
                    {banniere.sousTitre}
                  </span>

                    {/* Titre */}
                    <h2
                        className="font-nav text-[88px] max-[768px]:text-[48px] max-[768px]:text-center"
                        style={{ color: '#FFF', fontWeight: 900 }}
                    >
                      {banniere.titre}
                    </h2>
                  </div>


                  {/* Bouton — affiché uniquement si un lien est défini */}
                  {banniere.lien && (
                    <div className="flex justify-center self-end w-full">
                      {isExternal ? (
                        <a
                          href={banniere.lien}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-button font-semibold"
                          style={BUTTON_STYLE}
                        >
                          Découvrir
                        </a>
                      ) : (
                        <Link
                          href={banniere.lien}
                          className="font-button font-semibold"
                          style={BUTTON_STYLE}
                        >
                          Découvrir
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
