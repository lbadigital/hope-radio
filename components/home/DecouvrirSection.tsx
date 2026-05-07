import Link from 'next/link';

import { fetchGraphQL }                              from '@/lib/wordpress';
import { MOCK_GRILLE_SLOTS, transformGrilleSlots }   from '@/app/data';
import type { EmissionSlot }                         from '@/app/data';
import { GET_GRILLE_SLOTS }                          from '@/graphql/grille';
import type { GetGrilleSlotsData }                   from '@/graphql/grille';
import DecouvrirSlider                               from './DecouvrirSlider';

// ─── Props ────────────────────────────────────────────────────────────────────

interface DecouvrirSectionProps {
  title?: string;
}

// ─── Composant principal (Server Component async) ─────────────────────────────

export default async function DecouvrirSection({
  title = 'À découvrir aujourd\'hui',
}: DecouvrirSectionProps) {

  const today = new Date().toISOString().split('T')[0];

  let slots: EmissionSlot[] = [];
  try {
    const data = await fetchGraphQL<GetGrilleSlotsData>(
      GET_GRILLE_SLOTS,
      { dateDebut: today, dateFin: today },
      { next: { revalidate: 3600 } },
    );
    slots = transformGrilleSlots(data);
  } catch {
    slots = transformGrilleSlots(MOCK_GRILLE_SLOTS);
  }

  if (slots.length === 0) return null;

  return (
    <section className="w-full py-12 bg-secondary overflow-hidden">
      <style>{`
        /* Aligne le bord gauche du slider sur le contenu du container,
           sans contraindre le bord droit — le slider déborde jusqu'au viewport. */
        .decouvrir-slider-outer {
          padding-left: max(32px, calc((100vw - 1139px) / 2 + 32px));
        }

        /* Pagination — pilules blanches */
        .decouvrir-slider .swiper-pagination {
          position:        relative;
          bottom:          auto;
          display:         flex;
          align-items:     center;
          justify-content: center;
          gap:             6px;
          margin-top:      20px;
        }
        .decouvrir-slider .swiper-pagination-bullet {
          width:         8px;
          height:        8px;
          background:    rgba(255, 255, 255, 0.4);
          opacity:       1;
          border-radius: 100px;
          transition:    width 0.3s ease, background 0.3s ease;
        }
        .decouvrir-slider .swiper-pagination-bullet-active {
          width:         24px;
          background:    #FFF;
          border-radius: 100px;
        }
      `}</style>

      <div className="container">

        {/* ── En-tête du bloc ── */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="flex w-[625px] h-[59px] flex-col justify-center font-nav font-[900] text-[48px] leading-none uppercase m-0 text-white grow">
            {title}
          </h2>

          <Link
            href="/grille"
            className="flex w-[205px] h-[31px] flex-col justify-center text-right font-heading text-sm font-bold uppercase underline text-white"
          >
            Grille des programmes
          </Link>
        </div>

      </div>

      {/* ── Slider — déborde jusqu'au bord droit du viewport ── */}
      <div className="decouvrir-slider-outer">
        <DecouvrirSlider slots={slots} />
      </div>

    </section>
  );
}
