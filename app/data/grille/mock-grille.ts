import type { GetGrilleSlotsData } from '@/graphql/grille';

const TODAY = new Date().toISOString().split('T')[0];

export const MOCK_GRILLE_SLOTS: GetGrilleSlotsData = {
  grilleSlots: [
    {
      id:         '1',
      date:       TODAY,
      heureDebut: '08:30',
      heureFin:   '09:30',
      emission: {
        title: 'La Matinale',
        uri:   '/emissions/la-matinale',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/368x234/720049/fff?text=La+Matinale',
            altText:   'La Matinale',
          },
        },
        emissionCategories: { nodes: [{ name: 'Information' }] },
      },
    },
    {
      id:         '2',
      date:       TODAY,
      heureDebut: '11:30',
      heureFin:   '12:30',
      emission: {
        title: 'Midi Gospel',
        uri:   '/emissions/midi-gospel',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/368x234/720049/fff?text=Midi+Gospel',
            altText:   'Midi Gospel',
          },
        },
        emissionCategories: { nodes: [{ name: 'Gospel' }] },
      },
    },
    {
      id:         '3',
      date:       TODAY,
      heureDebut: '16:00',
      heureFin:   '17:00',
      emission: {
        title: 'L\'Heure du Drive',
        uri:   '/emissions/heure-du-drive',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/368x234/720049/fff?text=Drive',
            altText:   'L\'Heure du Drive',
          },
        },
        emissionCategories: { nodes: [{ name: 'Musique' }] },
      },
    },
    {
      id:         '4',
      date:       TODAY,
      heureDebut: '19:00',
      heureFin:   '20:00',
      emission: {
        title: 'Soirée Louange',
        uri:   '/emissions/soiree-louange',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/368x234/720049/fff?text=Louange',
            altText:   'Soirée Louange',
          },
        },
        emissionCategories: { nodes: [{ name: 'Louange' }] },
      },
    },
  ],
};
