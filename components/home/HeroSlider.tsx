'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import Link from 'next/link';

import { MOCK_FEATURED_CONTENT, transformFeaturedContent } from '@/app/data';
import type { FeaturedSlide, PostType } from '@/app/data';

// ─── CTA labels par post type ─────────────────────────────────────────────────

const CTA_LABELS: Record<PostType, string> = {
  emission: "L'émission",
  podcast:  'Le podcast',
  post:     "L'article",
  agenda:   "L'événement",
};

// ─── Données mock centralisées ────────────────────────────────────────────────
// Remplacer MOCK_FEATURED_CONTENT par fetchGraphQL<GetFeaturedContentData>(GET_FEATURED_CONTENT)
// une fois WordPress en place.

const SLIDES: FeaturedSlide[] = transformFeaturedContent(MOCK_FEATURED_CONTENT);

// ─── Composant ────────────────────────────────────────────────────────────────

export default function HeroSlider() {
  return (
    <section
      className="relative w-full overflow-hidden pt-48 max-w-[980px]:pt-32"
      style={{
        backgroundColor: 'var(--color-primary)',
        backgroundImage: "url('/images/slider-bg.png')",
        backgroundRepeat: 'repeat',
      }}
    >
      <Swiper
        modules={[EffectFade, Pagination, Autoplay]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        slidesPerView={1}
        loop
        /* autoplay={{ delay: 6000, disableOnInteraction: false }} */
        pagination={{ clickable: true }}
        className="hero-slider \!h-[600px] max-[980px]:\!h-auto"
      >
        {SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            {/*
              Desktop  : flex-row  — texte à gauche, image à droite, 1139px centré
              Mobile   : flex-col  — image en haut (order-1), texte en bas (order-2)
            */}
            <div className="max-w-[1139px] mx-auto h-full flex items-stretch px-8 max-[980px]:flex-col max-[980px]:px-0 max-[980px]:max-w-none">

              {/* ── Colonne texte (gauche desktop / bas mobile) ── */}
              <div className="flex flex-col justify-start gap-6 flex-1 min-w-0 pr-8 pb-12 max-[980px]:order-2 max-[980px]:px-5 max-[980px]:py-8 max-[980px]:bg-[#720049]">
                {/*
                  Tag — desktop uniquement.
                  Sur mobile il est repositionné sur l'image (voir ci-dessous).
                */}
                <span
                  className="font-heading font-bold uppercase max-[768px]:hidden"
                  style={{
                    width:        'fit-content',
                    padding:      '15px 30px',
                    color:        '#FFF',
                    fontSize:     '16px',
                    lineHeight:   '20px',
                    border:       '1px solid #FFF',
                    borderRadius: '100px',
                    background:   'transparent',
                  }}
                >
                  À la une
                </span>

                {/* Titre */}
                <h2
                  className="font-nav uppercase whitespace-pre-line max-[768px]:text-[32px]"
                  style={{
                    color:      '#FFF',
                    fontSize:   '48px',
                    fontWeight: 900,
                    lineHeight: '83%',
                  }}
                >
                  {slide.title}
                </h2>

                {/* Description */}
                <p
                  className="font-heading font-bold uppercase max-[768px]:text-[18px]"
                  style={{
                    color:      '#BCBCBC',
                    fontSize:   '32px',
                    lineHeight: '100%',
                  }}
                >
                  {slide.description}
                </p>

                {/* Boutons */}
                <div className="flex flex-col items-start gap-3 min-[769px]:flex-row min-[769px]:items-center min-[769px]:flex-wrap">

                  {/* Bouton 1 — vers le contenu */}
                  <Link
                    href={slide.link}
                    className="font-button font-semibold inline-flex items-center shrink-0 cursor-pointer max-[768px]:w-full max-[768px]:justify-center"
                    style={{
                      borderRadius:    '30px',
                      backgroundColor: '#FFF',
                      color:           'var(--color-primary)',
                      fontSize:        '16px',
                      height:          '50px',
                      padding:         '10px 30px',
                      whiteSpace:      'nowrap',
                    }}
                  >
                    {CTA_LABELS[slide.type]}
                  </Link>

                  {/* Bouton 2 — Message en direct */}
                  <button
                    type="button"
                    className="font-button font-semibold flex items-center gap-3 shrink-0 cursor-pointer max-[768px]:w-full max-[768px]:justify-center"
                    style={{
                      borderRadius:    '30px',
                      backgroundColor: '#5A3D75',
                      color:           '#FFF',
                      fontSize:        '14px',
                      height:          '50px',
                      padding:         '0 24px',
                      whiteSpace:      'nowrap',
                    }}
                  >
                    Message en direct
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="19"
                      viewBox="0 0 26 19"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M19 0C22.866 1.93277e-07 26 3.13401 26 7C26 10.866 22.866 14 19 14H8.16504L6 19L3.4043 13.0059C1.3652 11.7824 0 9.55105 0 7C0 3.13401 3.13401 1.93277e-07 7 0H19Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* ── Colonne image (droite desktop / haut mobile) ── */}
              <div
                className="
                  shrink-0 self-end
                  w-[512px] h-[546px]
                  max-[980px]:order-1
                  max-[980px]:w-10/12
                  max-[980px]:mx-auto
                  max-[980px]:min-h-[400px]
                  max-[980px]:self-auto
                  relative
                "
              >
                {/* Tag mobile — positionné en bas à gauche de l'image */}
                <span
                  className="hidden max-[980px]:inline-flex font-heading font-bold uppercase absolute bottom-4 left-5 z-10"
                  style={{
                    padding:      '10px 20px',
                    color:        '#FFF',
                    fontSize:     '14px',
                    lineHeight:   '20px',
                    border:       '1px solid #FFF',
                    borderRadius: '100px',
                    background:   'transparent',
                  }}
                >
                  À la une
                </span>

                {slide.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  /* Placeholder en attente de l'image WordPress */
                  <div
                    className="w-full h-full flex items-end justify-center pb-8"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.07)',
                      borderRadius:    '8px 8px 0 0',
                    }}
                  >
                    <span
                      className="font-heading uppercase"
                      style={{
                        color:         'rgba(255,255,255,0.3)',
                        fontSize:      '12px',
                        letterSpacing: '0.15em',
                      }}
                    >
                      Image à la une
                    </span>
                  </div>
                )}
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
