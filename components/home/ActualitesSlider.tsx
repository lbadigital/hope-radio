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
      className="actualite-card group flex flex-col gap-2 no-underline text-inherit cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="w-full aspect-[186/95] overflow-hidden rounded-2xl">
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
        className="actualites-slider pb-0"
      >
        {cards.map((card) => (
          <SwiperSlide key={card.uri}>
            <ActualiteCardItem card={card} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Lien "Toutes les actualités" — centré sous le slider */}
      <div className="text-center mt-4">
        <Link
          href="/actualites"
          className="inline-flex w-[205px] h-[31px] flex-col justify-center text-center font-heading text-sm font-bold uppercase underline text-black"
        >
          Toutes les actualités
        </Link>
      </div>
    </>
  );
}
