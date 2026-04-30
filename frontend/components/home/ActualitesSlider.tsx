'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Link from 'next/link';

import type { ActualiteCard } from '@/app/data';

interface ActualitesSliderProps {
  cards: ActualiteCard[];
}

// ─── Card individuelle ────────────────────────────────────────────────────────

function ActualiteCardItem({ card }: { card: ActualiteCard }) {
  return (
    <Link
      href={card.uri}
      className="actualite-card"
      style={{
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
          width:        '100%',
          aspectRatio:  '186/95',
          overflow:     'hidden',
          borderRadius: '1rem',
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
    </Link>
  );
}

// ─── Slider (mobile + tablette) ───────────────────────────────────────────────

export default function ActualitesSlider({ cards }: ActualitesSliderProps) {
  return (
    <>
      <Swiper
        modules={[Pagination]}
        slidesPerView={1}
        spaceBetween={30}
        pagination={{ clickable: true }}
        breakpoints={{
          768: {
            slidesPerView: 2,
            spaceBetween:  30,
          },
        }}
        className="actualites-slider"
        style={{ paddingBottom: '40px' }}
      >
        {cards.map((card) => (
          <SwiperSlide key={card.uri}>
            <ActualiteCardItem card={card} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Lien "Toutes les actualités" — centré sous le slider */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <Link
          href="/actualites"
          style={{
            display:        'inline-flex',
            width:          '205px',
            height:         '31px',
            flexDirection:  'column',
            justifyContent: 'center',
            textAlign:      'center',
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
    </>
  );
}
