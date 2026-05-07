import Image from 'next/image';
import Link  from 'next/link';

export interface CardData {
  id:         string;
  title:      string;
  category:   string | null;
  image:      { url: string; alt: string };
  uri:        string;
  excerpt:    string | null;
  animateur:  string | null;
  heureDebut?: string;
  heureFin?:   string;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  return m === '00' ? `${hour}h` : `${hour}h${m}`;
}

export default function GrilleCard({ slot }: { slot: CardData }) {
  const horaire = slot.heureDebut && slot.heureFin
    ? `${formatTime(slot.heureDebut)} > ${formatTime(slot.heureFin)}`
    : null;
  const excerpt  = slot.excerpt ? slot.excerpt.replace(/<[^>]+>/g, '') : null;

  return (
    <article className="flex flex-col md:flex-row gap-4   overflow-hidden">

      {/* Image */}
      <div className="relative rounded-[20px] overflow-hidden w-full h-[260px] md:w-[399px] md:h-[399px] md:aspect-square    md:shrink-0">
        {slot.image.url ? (
          <Image
            src={slot.image.url}
            alt={slot.image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 767px) 100vw, 370px"
          />
        ) : (
          <div className="w-full h-full bg-primary" />
        )}
      </div>

      {/* Contenu */}
      <div className="flex flex-col rounded-[20px] bg-white flex-grow justify-between items-start p-8 md:w-[649px] md:h-[399px] md:p-[60px]">
        <div className="flex flex-col gap-5">
            {/* Horaire */}
            {horaire && (
              <p className="font-nav font-[900] text-[28px] leading-[110%] text-primary m-0">
                {horaire}
              </p>
            )}

            {/* Titre */}
            <h2 className="font-nav font-[900] text-[48px] leading-[83%] text-[#31251A] m-0">
                {slot.title}
            </h2>

            {/* Animateur */}
            {slot.animateur && (
                <p className="font-heading text-[14px] font-bold leading-[124%] text-[#31251A] uppercase m-0">
                    Avec {slot.animateur}
                </p>
            )}

            {/* Extrait */}
            {excerpt && (
                <p className="text-[12px] font-normal leading-[25px] text-[#31251A] capitalize m-0 line-clamp-3">
                    {excerpt}
                </p>
            )}
        </div>


        {/* Bouton */}
        <Link
          href={slot.uri}
          className="bg-white border border-[#31251A]/30 px-6 py-2 rounded-full font-heading text-sm font-bold text-[#31251A] no-underline hover:bg-gray-50 transition-colors"
        >
          Plus de détails
        </Link>

      </div>
    </article>
  );
}
