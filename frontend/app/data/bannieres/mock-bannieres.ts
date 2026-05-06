// Miroir exact de la réponse WPGraphQL pour GET_BANNIERES.
//
// !! Ne pas modifier la structure sans mettre à jour la query dans graphql/bannieres.ts.

import type { GetBannièresData } from '@/graphql/bannieres';

export const MOCK_BANNIERES: GetBannièresData = {
  bannieres: [
    {
      titre:     'Votre radio, votre foi',
      sousTitre: 'Hope Radio — En direct',
      images: {
        desktop: {
          sourceUrl: 'https://placehold.co/1920x600/720049/FFFFFF?text=Banniere+1',
          altText:   'Hope Radio en direct',
        },
        mobile: null,
      },
      lien: '/emissions',
    },
    {
      titre:     'Gospel & Louange',
      sousTitre: 'Nouveaux programmes',
      images: {
        desktop: {
          sourceUrl: 'https://placehold.co/1920x600/2847AF/FFFFFF?text=Banniere+2',
          altText:   'Programmes Gospel et Louange',
        },
        mobile: {
          sourceUrl: 'https://placehold.co/768x500/2847AF/FFFFFF?text=Banniere+2+mobile',
          altText:   'Programmes Gospel et Louange',
        },
      },
      lien: '/emissions',
    },
    {
      titre:     'Écoutez nos podcasts',
      sousTitre: 'À la demande',
      images: {
        desktop: {
          sourceUrl: 'https://placehold.co/1920x600/E45612/FFFFFF?text=Banniere+3',
          altText:   'Podcasts Hope Radio',
        },
        mobile: null,
      },
      lien: '/podcasts',
    },
  ],
};
