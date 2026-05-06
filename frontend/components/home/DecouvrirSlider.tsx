'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';
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
      className="flex flex-col no-underline text-inherit cursor-pointer rounded-lg overflow-hidden"
    >
      {/* Image + overlay */}
      <div className="relative w-full h-[234px] shrink-0">
        {slot.image.url ? (
          <Image
            src={slot.image.url}
            alt={slot.image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 767px) 100vw, (max-width: 986px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-[#4a0030]" />
        )}

        {/* Dégradé sombre bas → haut pour lisibilité du texte */}
        <div className="absolute inset-0 bg-black" />

        {/* Bloc horaires — haut droite */}
        <div className="absolute top-0 right-[18px] flex py-[15px] px-5 items-start gap-[10px] flex-[1_0_0] bg-primary rounded-b-lg">
          <span className="text-white text-center font-nav text-[28px] not-italic font-[900] leading-[110%] whitespace-pre-line">
            {slot.heureDebut}{'\n'}{slot.heureFin}
          </span>
        </div>

        {/* Titre + catégorie — bas gauche */}
        <div className="absolute bottom-0 left-0 right-0 pt-0 pr-[18px] pb-[19px] pl-[30px] flex flex-col items-end gap-px">
          <p className="self-start text-white font-heading text-xl not-italic font-bold leading-[110%] m-0 uppercase">
            {slot.title}
          </p>
          {slot.category && (
            <span className="self-start text-secondary font-heading text-sm not-italic font-bold leading-[124%] uppercase">
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
