'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Link from 'next/link';

import type { EmissionSlot } from '@/app/data';

interface DecouvrirSliderProps {
  slots: EmissionSlot[];
}

// ─── Card individuelle ────────────────────────────────────────────────────────

function EmissionCard({ slot }: { slot: EmissionSlot }) {
  return (
    <Link
      href={slot.uri}
      style={{
        display:         'flex',
        flexDirection:   'column',
        textDecoration:  'none',
        color:           'inherit',
        cursor:          'pointer',
        borderRadius:    '8px',
        overflow:        'hidden',
      }}
    >
      {/* Image + overlay */}
      <div
        style={{
          position:      'relative',
          width:         '100%',
          height:        '234px',
          flexShrink:    0,
        }}
      >
        {slot.image.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={slot.image.url}
            alt={slot.image.alt}
            style={{
              width:      '100%',
              height:     '100%',
              objectFit:  'cover',
              display:    'block',
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#4a0030' }} />
        )}

        {/* Dégradé sombre bas → haut pour lisibilité du texte */}
        <div
          style={{
            position:   'absolute',
            inset:      0,
            background: '#000000',
          }}
        />

        {/* Bloc horaires — haut gauche */}
        <div
          style={{
            position:      'absolute',
            top:           0,
            right:          18,
            display:       'flex',
            padding:       '15px 20px',
            alignItems:    'flex-start',
            gap:           '10px',
            flex:          '1 0 0',
            background:    '#720049',
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '8px',
          }}
        >
          <span
            style={{
              color:      '#FFF',
              textAlign:  'center',
              fontFamily: 'var(--font-nav)',
              fontSize:   '28px',
              fontStyle:  'normal',
              fontWeight: 900,
              lineHeight: '110%',
              whiteSpace: 'pre-line',
            }}
          >
            {slot.heureDebut}{'\n'}{slot.heureFin}
          </span>
        </div>

        {/* Titre + catégorie — bas gauche */}
        <div
          style={{
            position:      'absolute',
            bottom:        0,
            left:          0,
            right:         0,
            padding:       '0 18px 19px 30px',
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'flex-end',
            gap:           '1px',
          }}
        >
          
          <p
            style={{
              alignSelf:     'flex-start',
              color:         '#FFF',
              fontFamily:    'var(--font-heading)',
              fontSize:      '20px',
              fontStyle:     'normal',
              fontWeight:    700,
              lineHeight:    '110%',
              margin:        0,
              textTransform: 'uppercase',
            }}
          >
            {slot.title}
          </p>
          {slot.category && (
            <span
              style={{
                alignSelf:     'flex-start',
                color:         '#E45612',
                fontFamily:    'var(--font-heading)',
                fontSize:      '14px',
                fontStyle:     'normal',
                fontWeight:    700,
                lineHeight:    '124%',
                textTransform: 'uppercase',
              }}
            >
              {slot.category}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Slider ───────────────────────────────────────────────────────────────────

export default function DecouvrirSlider({ slots }: DecouvrirSliderProps) {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 4000, pauseOnMouseEnter: true, disableOnInteraction: false }}
      spaceBetween={20}
      slidesPerView={1}
      pagination={{ clickable: true }}
      breakpoints={{
        768: {
          slidesPerView: 2,
          spaceBetween:  20,
        },
        987: {
          slidesPerView: 3.2,
          spaceBetween:  20,
        },
      }}
      className="decouvrir-slider"
    >
      {slots.map((slot) => (
        <SwiperSlide key={slot.id}>
          <EmissionCard slot={slot} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
