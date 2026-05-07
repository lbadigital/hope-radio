'use client';

import { useState } from 'react';

import type { EmissionSlot } from '@/app/data';
import GrilleCard from './GrilleCard';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

interface GrilleClientProps {
  slots:       EmissionSlot[];
  weekDates:   string[];
  defaultDate: string;
}

export default function GrilleClient({ slots, weekDates, defaultDate }: GrilleClientProps) {
  const [selectedDate, setSelectedDate] = useState(defaultDate);

  const filteredSlots = slots.filter((s) => s.slotDate === selectedDate);

  return (
    <div>

      {/* Filtres jours */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        {weekDates.map((date, i) => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`px-[30px] pb-[5px] pt-[3px] rounded-[40px] border font-heading font-bold text-sm transition-colors cursor-pointer ${
              selectedDate === date
                ? 'bg-white text-brand-violet border-white'
                : 'bg-transparent text-white border-white hover:bg-white/10'
            }`}
          >
            {JOURS[i]}
          </button>
        ))}
      </div>

      {/* Liste des émissions */}
      <div className="flex flex-col gap-6">
        {filteredSlots.length > 0 ? (
          filteredSlots.map((slot) => (
            <GrilleCard key={slot.id} slot={slot} />
          ))
        ) : (
          <p className="text-white text-center py-16">
            Aucune émission programmée ce jour.
          </p>
        )}
      </div>

    </div>
  );
}
