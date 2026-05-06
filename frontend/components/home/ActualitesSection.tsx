import Link from 'next/link';

import { fetchGraphQL }                        from '@/lib/wordpress';
import { MOCK_ACTUALITES, transformActualites } from '@/app/data';
import type { ActualiteCard }                   from '@/app/data';
import { GET_ACTUALITES }                       from '@/graphql/actualites';
import type { GetActualitesData }               from '@/graphql/actualites';
import ActualitesSlider                         from './ActualitesSlider';

// ─── Card desktop ─────────────────────────────────────────────────────────────

function ActualiteCardDesktop({
  card,
  isSingle,
}: {
  card:     ActualiteCard;
  isSingle: boolean;
}) {
  return (
    <Link
      href={card.uri}
      className={`actualite-card group flex flex-col gap-2 no-underline text-inherit${isSingle ? ' w-[372px] shrink-0' : ' flex-[1_1_0]'}`}
    >
      {/* Thumbnail */}
      <div
        className={`aspect-[186/95] overflow-hidden shrink-0 rounded-2xl${isSingle ? ' w-[372px] h-[190px]' : ' w-full h-auto'}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.image.url}
          alt={card.image.alt}
          className="actualite-card__image w-full h-full object-cover block scale-105 transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-100"
        />
      </div>

      {/* Catégorie */}
      {card.category && (
        <span className="text-[#E85B21] font-heading text-xs font-bold leading-[22px] uppercase">
          {card.category}
        </span>
      )}

      {/* Excerpt */}
      <p className="text-black font-heading text-base font-bold leading-[22px] uppercase m-0">
        {card.excerpt || card.title}
      </p>
    </Link>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ActualitesSectionProps {
  count?: number;  // nombre de cards à afficher, défaut 3
  title?: string;  // défaut "Actualités"
}

// ─── Composant principal (Server Component async) ─────────────────────────────

export default async function ActualitesSection({
  count = 3,
  title = 'Actualités',
}: ActualitesSectionProps) {

  // Fetch GraphQL — fallback sur mock si erreur
  let cards: ActualiteCard[] = [];
  try {
    const data = await fetchGraphQL<GetActualitesData>(
      GET_ACTUALITES,
      { first: count },
      { next: { revalidate: 60 } },
    );
    cards = transformActualites(data).slice(0, count);
  } catch {
    cards = transformActualites(MOCK_ACTUALITES).slice(0, count);
  }

  if (cards.length === 0) return null;

  const isSingle = cards.length === 1;

  return (
    <section className="actualites-section w-full py-12">
      {/*
        Styles hover (image scale) + pagination Swiper custom
        injectés une seule fois dans la section.
      */}
      <style>{`
        /* Pagination — même style pill que HeroSlider, couleur primaire */
        .actualites-slider .swiper-pagination {
          position:        relative;
          bottom:          auto;
          display:         flex;
          align-items:     center;
          justify-content: center;
          gap:             6px;
          margin-top:      20px;
        }
        .actualites-slider .swiper-pagination-bullet {
          width:         8px;
          height:        8px;
          background:    rgba(114, 0, 74, 0.4);
          opacity:       1;
          border-radius: 100px;
          transition:    width 0.3s ease, background 0.3s ease;
        }
        .actualites-slider .swiper-pagination-bullet-active {
          width:         24px;
          background:    #72004A;
          border-radius: 100px;
        }
      `}</style>

      <div className="container">

        {/* ── En-tête du bloc ── */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="flex w-[625px] h-[59px] flex-col justify-center font-nav font-[900] text-[48px] leading-none uppercase m-0">
            {title}
          </h2>

          {/* Lien desktop — masqué en dessous de 986px */}
          <Link
            href="/actualites"
            className="hidden min-[987px]:flex w-[205px] h-[31px] flex-col justify-center text-right font-heading text-sm font-bold uppercase underline text-black"
          >
            Toutes les actualités
          </Link>
        </div>

        {/* ── Grille desktop (> 986px) ── */}
        <div className="hidden min-[987px]:flex gap-[30px] items-start">
          {cards.map((card) => (
            <ActualiteCardDesktop key={card.uri} card={card} isSingle={isSingle} />
          ))}
        </div>

        {/* ── Slider mobile + tablette (≤ 986px) ── */}
        <div className="block min-[987px]:hidden">
          <ActualitesSlider cards={cards} />
        </div>

      </div>
    </section>
  );
}
