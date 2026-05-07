import { fetchGraphQL }                             from '@/lib/wordpress';
import { GET_GRILLE_SLOTS }                          from '@/graphql/grille';
import type { GetGrilleSlotsData }                   from '@/graphql/grille';
import { MOCK_GRILLE_SLOTS, MOCK_WEEK_DATES, transformGrilleSlots } from '@/app/data';
import GrilleClient                                  from '@/components/grille/GrilleClient';

function getMondayOfCurrentWeek(): Date {
  const now  = new Date();
  const day  = now.getDay(); // 0 = dimanche
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export default async function GrillePage() {
  const monday = getMondayOfCurrentWeek();

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  let slots     = transformGrilleSlots(MOCK_GRILLE_SLOTS);
  let usedDates = MOCK_WEEK_DATES;

  try {
    const data = await fetchGraphQL<GetGrilleSlotsData>(
      GET_GRILLE_SLOTS,
      { dateDebut: weekDates[0], dateFin: weekDates[6] },
      { cache: 'no-store' },
    );
    slots     = transformGrilleSlots(data);
    usedDates = weekDates;
  } catch {
    // fallback mock — usedDates reste MOCK_WEEK_DATES
  }

  const todayStr    = new Date().toISOString().split('T')[0];
  const defaultDate = usedDates.includes(todayStr) ? todayStr : usedDates[0];

  return (
    <main className="bg-brand-violet min-h-screen py-16">
      <div className="container lg:max-w-[1139px] mx-auto">

        <h1 className="font-nav font-[900] text-[88px] leading-[90%] text-white text-center mb-10 uppercase">
          Grille des programmes
        </h1>

        <GrilleClient slots={slots} weekDates={usedDates} defaultDate={defaultDate} />

      </div>
    </main>
  );
}
