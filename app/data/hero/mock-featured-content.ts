// Miroir exact de la réponse WPGraphQL pour GET_FEATURED_CONTENT.
//
// Structure anticipée basée sur :
//   - Shape standard WPGraphQL (nodes, featuredImage, uri, excerpt)
//   - Champ ACF exposé via WPGraphQL for ACF : miseEnAvant { isMisEnAvant }
//
// !! Ne pas modifier la structure de ce fichier sans mettre à jour
//   la query GET_FEATURED_CONTENT dans graphql/hero.ts.

import type { GetFeaturedContentData } from '@/graphql/hero';

export const MOCK_FEATURED_CONTENT: GetFeaturedContentData = {
  emissions: {
    nodes: [
      {
        id:         'cG9zdDox',
        databaseId: 1,
        title:      "Titre de l'Émission",
        slug:       'titre-emission',
        uri:        '/emissions/titre-emission/',
        excerpt:    "<p>Avec nom de l'animateur et des chroniqueurs, de 18h à 20h.</p>",
        featuredImage: null,
        miseEnAvant: { isMisEnAvant: true },
      },
    ],
  },
  podcasts: {
    nodes: [
      {
        id:         'cG9zdDoy',
        databaseId: 2,
        title:      'Nom du Podcast Featured',
        slug:       'nom-podcast-featured',
        uri:        '/podcasts/nom-podcast-featured/',
        excerpt:    '<p>Description courte du podcast — saison 2.</p>',
        featuredImage: null,
        miseEnAvant: { isMisEnAvant: true },
      },
    ],
  },
  posts: {
    nodes: [
      {
        id:         'cG9zdDoz',
        databaseId: 3,
        title:      "Titre de l'Article à la Une",
        slug:       'titre-article-une',
        uri:        '/actualites/titre-article-une/',
        excerpt:    "<p>Un court résumé de l'actualité mise à la une.</p>",
        featuredImage: null,
        miseEnAvant: { isMisEnAvant: true },
      },
    ],
  },
  agendaItems: {
    nodes: [
      {
        id:         'cG9zdDo0',
        databaseId: 4,
        title:      "Titre de l'Événement",
        slug:       'titre-evenement',
        uri:        '/agenda/titre-evenement/',
        excerpt:    "<p>Description courte de l'événement à mettre en avant.</p>",
        featuredImage: null,
        miseEnAvant: { isMisEnAvant: true },
      },
    ],
  },
};
