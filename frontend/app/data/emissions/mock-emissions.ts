import type { GetEmissionsData } from '@/graphql/emissions';
import type { EmissionCategoryNode } from '@/graphql/emissions';

export const MOCK_EMISSION_CATEGORIES: EmissionCategoryNode[] = [
  { id: 'cat-1', name: 'Information', slug: 'information' },
  { id: 'cat-2', name: 'Gospel',      slug: 'gospel'      },
  { id: 'cat-3', name: 'Louange',     slug: 'louange'     },
  { id: 'cat-4', name: 'Spirituel',   slug: 'spirituel'   },
];

export const MOCK_EMISSIONS: GetEmissionsData = {
  emissions: {
    pageInfo: { hasNextPage: false, endCursor: null },
    nodes: [
      {
        id: 'em-1', databaseId: 1,
        title: 'La Matinale',
        uri: '/emissions/la-matinale',
        excerpt: '<p>Commencez votre journée avec les dernières actualités et une sélection musicale soigneusement choisie.</p>',
        featuredImage: null,
        emissionCategories: { nodes: [{ name: 'Information', slug: 'information' }] },
        animateurs: [{ prenom: 'Jean', nom: 'Dupont' }],
      },
      {
        id: 'em-2', databaseId: 2,
        title: 'Gospel Time',
        uri: '/emissions/gospel-time',
        excerpt: '<p>Une heure dédiée aux meilleurs titres gospel contemporains et traditionnels.</p>',
        featuredImage: null,
        emissionCategories: { nodes: [{ name: 'Gospel', slug: 'gospel' }] },
        animateurs: [{ prenom: 'Marie', nom: 'Koffi' }],
      },
      {
        id: 'em-3', databaseId: 3,
        title: 'Heure de Louange',
        uri: '/emissions/heure-de-louange',
        excerpt: '<p>Un moment de worship intense pour entrer dans la présence de Dieu.</p>',
        featuredImage: null,
        emissionCategories: { nodes: [{ name: 'Louange', slug: 'louange' }] },
        animateurs: [{ prenom: 'Paul', nom: 'Mensah' }],
      },
      {
        id: 'em-4', databaseId: 4,
        title: 'Parole et Vie',
        uri: '/emissions/parole-et-vie',
        excerpt: '<p>Méditations bibliques et enseignements pour fortifier votre foi au quotidien.</p>',
        featuredImage: null,
        emissionCategories: { nodes: [{ name: 'Spirituel', slug: 'spirituel' }] },
        animateurs: [{ prenom: 'Sophie', nom: 'Adeyemi' }],
      },
    ],
  },
};
