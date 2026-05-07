import type { GetGrilleSlotsData } from '@/graphql/grille';

// Dates fixes pour le mock (semaine du 2026-05-04)
const DAYS = {
  lundi:    '2026-05-04',
  mardi:    '2026-05-05',
  mercredi: '2026-05-06',
  jeudi:    '2026-05-07',
  vendredi: '2026-05-08',
  samedi:   '2026-05-09',
  dimanche: '2026-05-10',
};

export const MOCK_WEEK_DATES = Object.values(DAYS);

export const MOCK_GRILLE_SLOTS: GetGrilleSlotsData = {
  grilleSlots: [
    {
      slotDate:   DAYS.lundi,
      heureDebut: '08:30',
      heureFin:   '09:30',
      emission: {
        title:   'La Matinale',
        uri:     '/emissions/la-matinale',
        excerpt: 'Commencez votre journée avec les meilleures nouvelles et de la bonne musique.',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/368x234/720049/fff?text=La+Matinale',
            altText:   'La Matinale',
          },
        },
        emissionCategories: { nodes: [{ name: 'Information' }] },
        animateurs: [{ prenom: 'Jean', nom: 'Dupont' }],
      },
    },
    {
      slotDate:   DAYS.lundi,
      heureDebut: '11:30',
      heureFin:   '12:30',
      emission: {
        title:   'Midi Gospel',
        uri:     '/emissions/midi-gospel',
        excerpt: 'Une heure de gospel pour élever votre âme et nourrir votre foi.',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/368x234/720049/fff?text=Midi+Gospel',
            altText:   'Midi Gospel',
          },
        },
        emissionCategories: { nodes: [{ name: 'Gospel' }] },
        animateurs: [{ prenom: 'Marie', nom: 'Leblanc' }],
      },
    },
    {
      slotDate:   DAYS.lundi,
      heureDebut: '16:00',
      heureFin:   '17:00',
      emission: {
        title:   "L'Heure du Drive",
        uri:     '/emissions/heure-du-drive',
        excerpt: 'La bande-son idéale pour votre retour à la maison.',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/368x234/720049/fff?text=Drive',
            altText:   "L'Heure du Drive",
          },
        },
        emissionCategories: { nodes: [{ name: 'Musique' }] },
        animateurs: [{ prenom: 'Paul', nom: 'Martin' }],
      },
    },
    {
      slotDate:   DAYS.lundi,
      heureDebut: '19:00',
      heureFin:   '20:00',
      emission: {
        title:   'Soirée Louange',
        uri:     '/emissions/soiree-louange',
        excerpt: 'Plongez dans une atmosphère de louange et de worship.',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/368x234/720049/fff?text=Louange',
            altText:   'Soirée Louange',
          },
        },
        emissionCategories: { nodes: [{ name: 'Louange' }] },
        animateurs: [{ prenom: 'Sophie', nom: 'Bernard' }],
      },
    },
    {
      slotDate:   DAYS.mardi,
      heureDebut: '09:00',
      heureFin:   '10:00',
      emission: {
        title:   'Parole du Matin',
        uri:     '/emissions/parole-du-matin',
        excerpt: 'Une méditation quotidienne pour démarrer la journée avec la Parole.',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/368x234/320C52/fff?text=Parole',
            altText:   'Parole du Matin',
          },
        },
        emissionCategories: { nodes: [{ name: 'Spirituel' }] },
        animateurs: [{ prenom: 'Thomas', nom: 'Petit' }],
      },
    },
    {
      slotDate:   DAYS.mardi,
      heureDebut: '14:00',
      heureFin:   '15:00',
      emission: {
        title:   'Tempo Gospel',
        uri:     '/emissions/tempo-gospel',
        excerpt: 'Le meilleur du gospel contemporain et traditionnel.',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/368x234/320C52/fff?text=Tempo',
            altText:   'Tempo Gospel',
          },
        },
        emissionCategories: { nodes: [{ name: 'Gospel' }] },
        animateurs: [{ prenom: 'Claire', nom: 'Moreau' }],
      },
    },
    {
      slotDate:   DAYS.mercredi,
      heureDebut: '10:00',
      heureFin:   '11:30',
      emission: {
        title:   'Jeunesse en Action',
        uri:     '/emissions/jeunesse-en-action',
        excerpt: "Une émission dédiée à la jeunesse chrétienne et à ses engagements.",
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/368x234/2847AF/fff?text=Jeunesse',
            altText:   'Jeunesse en Action',
          },
        },
        emissionCategories: { nodes: [{ name: 'Jeunesse' }] },
        animateurs: [{ prenom: 'Lucas', nom: 'Simon' }],
      },
    },
    {
      slotDate:   DAYS.jeudi,
      heureDebut: '20:00',
      heureFin:   '22:00',
      emission: {
        title:   'Nuit de Prière',
        uri:     '/emissions/nuit-de-priere',
        excerpt: 'Une veillée de prière et de méditation en direct.',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/368x234/720049/fff?text=Pri%C3%A8re',
            altText:   'Nuit de Prière',
          },
        },
        emissionCategories: { nodes: [{ name: 'Spirituel' }] },
        animateurs: [{ prenom: 'Hélène', nom: 'Rousseau' }],
      },
    },
    {
      slotDate:   DAYS.vendredi,
      heureDebut: '18:00',
      heureFin:   '19:00',
      emission: {
        title:   'Vendredi Worship',
        uri:     '/emissions/vendredi-worship',
        excerpt: 'Terminez la semaine en beauté avec les plus beaux chants de worship.',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/368x234/720049/fff?text=Worship',
            altText:   'Vendredi Worship',
          },
        },
        emissionCategories: { nodes: [{ name: 'Louange' }] },
        animateurs: [{ prenom: 'David', nom: 'Laurent' }],
      },
    },
    {
      slotDate:   DAYS.samedi,
      heureDebut: '11:00',
      heureFin:   '12:00',
      emission: {
        title:   'Famille & Foi',
        uri:     '/emissions/famille-et-foi',
        excerpt: 'Conseils, témoignages et musique pour toute la famille.',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/368x234/E45612/fff?text=Famille',
            altText:   'Famille & Foi',
          },
        },
        emissionCategories: { nodes: [{ name: 'Famille' }] },
        animateurs: [{ prenom: 'Isabelle', nom: 'Fontaine' }],
      },
    },
    {
      slotDate:   DAYS.dimanche,
      heureDebut: '10:00',
      heureFin:   '12:00',
      emission: {
        title:   'Culte du Dimanche',
        uri:     '/emissions/culte-du-dimanche',
        excerpt: 'Participez au culte dominical en direct depuis notre studio.',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/368x234/320C52/fff?text=Culte',
            altText:   'Culte du Dimanche',
          },
        },
        emissionCategories: { nodes: [{ name: 'Culte' }] },
        animateurs: [{ prenom: 'Pierre', nom: 'Durand' }],
      },
    },
  ],
};
