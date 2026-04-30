'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
type PostType = 'emission' | 'podcast' | 'post';

interface FeaturedSlide {
  id: string;
  type: PostType;
  title: string;
  description: string;
  imageUrl: string | null;
  link: string;
}

const CTA_LABELS: Record<PostType, string> = {
  emission: "L'émission",
  podcast: 'Le podcast',
  post: "L'article",
};

// ─── Mock data ────────────────────────────────────────────────────────────────
// TODO: remplacer par la vraie requête WPGraphQL :
//
// query GetFeaturedPosts {
//   emissions(where: { isFeatured: true }, first: 5) {
//     nodes { id title excerpt featuredImage { node { sourceUrl } } slug }
//   }
//   podcasts(where: { isFeatured: true }, first: 5) {
//     nodes { id title excerpt featuredImage { node { sourceUrl } } slug }
//   }
//   posts(where: { isFeatured: true }, first: 5) {
//     nodes { id title excerpt featuredImage { node { sourceUrl } } slug }
//   }
// }

const MOCK_SLIDES: FeaturedSlide[] = [
  {
    id: '1',
    type: 'emission',
    title: "Découvrez\nTitre de l'Émission",
    description: "Avec nom de l'animateur et des chroniqueurs de 18h à 20h",
    imageUrl: null,
    link: '/emissions/titre-emission',
  },
  {
    id: '2',
    type: 'podcast',
    title: "Nom du\nPodcast Featured",
    description: 'Description courte du podcast — saison 2',
    imageUrl: null,
    link: '/podcasts/nom-podcast',
  },
  {
    id: '3',
    type: 'post',
    title: "Titre de\nl'Article à la Une",
    description: "Un court résumé de l'actualité mise à la une",
    imageUrl: null,
    link: '/actualites/titre-article',
  },
];

// ─── Composant ────────────────────────────────────────────────────────────────
export default function HeroSlider() {
  return (
    <section
      className="relative w-full overflow-hidden pt-32"
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
        className="hero-slider !h-[600px] max-[980px]:!h-auto"
      >
        {MOCK_SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            {/*
              Desktop  : flex-row  — texte à gauche, image à droite, 1139px centré
              Mobile   : flex-col  — image en haut (order-1), texte en bas (order-2)
            */}
            <div className="max-w-[1139px] mx-auto h-full flex items-stretch px-8 max-[980px]:flex-col max-[980px]:px-0 max-[980px]:max-w-none">

              {/* ── Colonne texte (gauche desktop / bas mobile) ── */}
              {/* bg-[#720049] sur mobile = fond solide qui couvre le pattern background */}
              <div className="flex flex-col justify-center gap-6 flex-1 min-w-0 pr-8 py-12 max-[980px]:order-2  max-[980px]:px-5 max-[980px]:py-8 max-[980px]:bg-[#720049]">
                {/*
                  Tag — desktop uniquement.
                  Sur mobile il est repositionné sur l'image (voir ci-dessous).
                */}
                <span
                  className="font-heading font-bold uppercase max-[768px]:hidden"
                  style={{
                    width: 'fit-content',
                    padding: '15px 30px',
                    color: '#FFF',
                    fontSize: '16px',
                    lineHeight: '20px',
                    border: '1px solid #FFF',
                    borderRadius: '100px',
                    background: 'transparent',
                  }}
                >
                  À la une
                </span>

                {/* Titre */}
                <h2
                  className="font-nav uppercase whitespace-pre-line max-[768px]:text-[32px]"
                  style={{
                    color: '#FFF',
                    fontSize: '48px',
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
                    color: '#BCBCBC',
                    fontSize: '32px',
                    lineHeight: '100%',
                  }}
                >
                  {slide.description}
                </p>

                {/* Boutons */}
                <div className="flex flex-col items-start gap-3 min-[769px]:flex-row min-[769px]:items-center min-[769px]:flex-wrap">

                  {/* Bouton 1 — vers le contenu (style "Faire un don") */}
                  <Link
                    href={slide.link}
                    className="font-button font-semibold inline-flex items-center shrink-0 cursor-pointer max-[768px]:w-full max-[768px]:justify-center"
                    style={{
                      borderRadius: '30px',
                      backgroundColor: '#FFF',
                      color: 'var(--color-primary)',
                      fontSize: '16px',
                      height: '50px',
                      padding: '10px 30px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {CTA_LABELS[slide.type]}
                  </Link>

                  {/* Bouton 2 — Message en direct (style "Réagissez en direct") */}
                  <button
                    type="button"
                    className="font-button font-semibold flex items-center gap-3 shrink-0 cursor-pointer max-[768px]:w-full max-[768px]:justify-center"
                    style={{
                      borderRadius: '30px',
                      backgroundColor: '#5A3D75',
                      color: '#FFF',
                      fontSize: '14px',
                      height: '50px',
                      padding: '0 24px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Message en direct
                    {/* Icône bulle — identique à RadioPlayer */}
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
                    padding: '10px 20px',
                    color: '#FFF',
                    fontSize: '14px',
                    lineHeight: '20px',
                    border: '1px solid #FFF',
                    borderRadius: '100px',
                    background: 'transparent',
                  }}
                >
                  À la une
                </span>

                {slide.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slide.imageUrl}
                    alt={slide.title.replace('\n', ' ')}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  /* Placeholder en attente de l'image WordPress */
                  <div
                    className="w-full h-full flex items-end justify-center pb-8"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.07)',
                      borderRadius: '8px 8px 0 0',
                    }}
                  >
                    <span
                      className="font-heading uppercase"
                      style={{
                        color: 'rgba(255,255,255,0.3)',
                        fontSize: '12px',
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
