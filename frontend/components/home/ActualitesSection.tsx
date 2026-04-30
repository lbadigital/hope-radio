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
    <a
      href={card.uri}
      className="actualite-card"
      style={{
        // Card unique : dimensions fixes. Plusieurs cards : flex égal.
        ...(isSingle
          ? { width: '372px', flexShrink: 0 }
          : { flex: '1 1 0' }),
        display:        'flex',
        flexDirection:  'column',
        gap:            '8px',
        textDecoration: 'none',
        color:          'inherit',
        cursor:         'pointer',
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width:       isSingle ? '372px' : '100%',
          height:      isSingle ? '190px' : 'auto',
          aspectRatio: '186/95',
          overflow:    'hidden',
          flexShrink:  0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.image.url}
          alt={card.image.alt}
          className="actualite-card__image"
          style={{
            width:      '100%',
            height:     '100%',
            objectFit:  'cover',
            display:    'block',
            transform:  'scale(1.05)',
            transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
      </div>

      {/* Catégorie */}
      {card.category && (
        <span
          style={{
            color:         '#E85B21',
            fontFamily:    'var(--font-heading)',
            fontSize:      '12px',
            fontWeight:    700,
            lineHeight:    '22px',
            textTransform: 'uppercase',
          }}
        >
          {card.category}
        </span>
      )}

      {/* Excerpt */}
      <p
        style={{
          color:         '#000',
          fontFamily:    'var(--font-heading)',
          fontSize:      '16px',
          fontWeight:    700,
          lineHeight:    '22px',
          textTransform: 'uppercase',
          margin:        0,
        }}
      >
        {card.excerpt || card.title}
      </p>
    </a>
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
    <section className="actualites-section">
      {/*
        Styles hover (image scale) + pagination Swiper custom
        injectés une seule fois dans la section.
      */}
      <style>{`
        .actualites-section {
          width: 100%;
          padding: 48px 0;
        }

        .container {
          max-width: 1139px;
          margin: 0 auto;
          padding: 0 32px;
          width: 100%;
        }

        .actualite-card:hover .actualite-card__image {
          transform: scale(1) !important;
        }

        /* Pagination dots — même style que HeroSlider */
        .actualites-slider .swiper-pagination-bullet {
          background:    #72004A;
          opacity:       0.3;
          width:         8px;
          height:        8px;
          border-radius: 50%;
          transition:    opacity 0.2s, transform 0.2s;
        }
        .actualites-slider .swiper-pagination-bullet-active {
          opacity:   1;
          transform: scale(1.3);
        }

        /* Desktop : grille visible, slider caché, lien dans le header */
        @media (min-width: 987px) {
          .actualites-grid-desktop   { display: flex  !important; }
          .actualites-slider-wrapper { display: none  !important; }
          .actualites-link-desktop   { display: flex  !important; }
        }
        /* Mobile + tablette : grille cachée, slider visible, lien caché du header */
        @media (max-width: 986px) {
          .actualites-grid-desktop   { display: none  !important; }
          .actualites-slider-wrapper { display: block !important; }
          .actualites-link-desktop   { display: none  !important; }
        }
      `}</style>

      <div className="container">

        {/* ── En-tête du bloc ── */}
        <div
          style={{
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            marginBottom:   '32px',
          }}
        >
          <h2
            style={{
              display:        'flex',
              width:          '625px',
              height:         '59px',
              flexDirection:  'column',
              justifyContent: 'center',
              fontFamily:     'var(--font-nav)',
              fontWeight:     900,
              fontSize:       '48px',
              lineHeight:     '1',
              textTransform:  'uppercase',
              margin:         0,
            }}
          >
            {title}
          </h2>

          {/* Lien desktop — masqué en dessous de 986px */}
          <Link
            href="/actualites"
            className="actualites-link-desktop"
            style={{
              display:        'flex',
              width:          '205px',
              height:         '31px',
              flexDirection:  'column',
              justifyContent: 'center',
              textAlign:      'right',
              fontFamily:     'var(--font-heading)',
              fontSize:       '14px',
              fontWeight:     700,
              textTransform:  'uppercase',
              textDecoration: 'underline',
              color:          '#000',
            }}
          >
            Toutes les actualités
          </Link>
        </div>

        {/* ── Grille desktop (> 986px) ── */}
        <div
          className="actualites-grid-desktop"
          style={{
            display:   'flex',
            gap:       '30px',
            alignItems: 'flex-start',
          }}
        >
          {cards.map((card) => (
            <ActualiteCardDesktop key={card.uri} card={card} isSingle={isSingle} />
          ))}
        </div>

        {/* ── Slider mobile + tablette (≤ 986px) ── */}
        <div className="actualites-slider-wrapper">
          <ActualitesSlider cards={cards} />
        </div>

      </div>
    </section>
  );
}
