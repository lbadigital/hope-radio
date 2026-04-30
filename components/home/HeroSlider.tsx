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
      className="relative w-full overflow-hidden"
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
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="hero-slider !h-[600px] max-[768px]:!h-auto"
      >
        {MOCK_SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            {/* Conteneur principal centré à 1139px */}
            <div className="max-w-[1139px] mx-auto h-full flex items-stretch px-8 max-[768px]:flex-col max-[768px]:px-5 max-[768px]:py-10 max-[768px]:gap-8">

              {/* ── Colonne gauche : texte ── */}
              <div className="flex flex-col justify-center gap-6 flex-1 min-w-0 pr-8 py-12 max-[768px]:pr-0 max-[768px]:py-0">

                {/* Tag "À la une" */}
                <span
                  className="font-heading font-bold uppercase"
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
                  className="font-nav uppercase whitespace-pre-line"
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
                  className="font-heading font-bold uppercase"
                  style={{
                    color: '#BCBCBC',
                    fontSize: '32px',
                    lineHeight: '100%',
                  }}
                >
                  {slide.description}
                </p>

                {/* Boutons */}
                <div className="flex items-center gap-4 flex-wrap">

                  {/* Bouton 1 — vers le contenu (style "Faire un don") */}
                  <Link
                    href={slide.link}
                    className="font-button font-semibold inline-flex items-center shrink-0 cursor-pointer"
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
                    className="font-button font-semibold flex items-center gap-3 shrink-0 cursor-pointer"
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

              {/* ── Colonne droite : image ── */}
              <div
                className="shrink-0 self-end max-[768px]:self-center max-[768px]:w-full"
                style={{ width: '512px', height: '546px' }}
              >
                {slide.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slide.imageUrl}
                    alt={slide.title.replace('\n', ' ')}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  /* Placeholder en attente de l'image WordPress */
                  <div
                    className="w-full h-full flex items-end justify-center pb-8"
                    style={{ backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: '8px 8px 0 0' }}
                  >
                    <span
                      className="font-heading uppercase"
                      style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', letterSpacing: '0.15em' }}
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
