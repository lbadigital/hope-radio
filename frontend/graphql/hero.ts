// ─── Featured Content (Hero Slider) ──────────────────────────────────────────
//
// Récupère les contenus marqués "Mis en avant" via le champ ACF is_mis_en_avant.
// Filtre côté WPGraphQL via metaQuery sur chaque post type.
//
// Champ GraphQL exposé par WPGraphQL for ACF :
//   node { miseEnAvant { isMisEnAvant } }

// ── Types partagés ────────────────────────────────────────────────────────────

export interface FeaturedImageNode {
  sourceUrl: string | null;
  altText: string;
}

export interface MiseEnAvantField {
  isMisEnAvant: boolean;
}

// ── Types par post type ───────────────────────────────────────────────────────

export interface FeaturedEmissionNode {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  uri: string;
  excerpt: string | null;
  featuredImage: { node: FeaturedImageNode } | null;
  miseEnAvant: MiseEnAvantField | null;
}

export interface FeaturedPodcastNode {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  uri: string;
  excerpt: string | null;
  featuredImage: { node: FeaturedImageNode } | null;
  miseEnAvant: MiseEnAvantField | null;
}

export interface FeaturedPostNode {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  uri: string;
  excerpt: string | null;
  featuredImage: { node: FeaturedImageNode } | null;
  miseEnAvant: MiseEnAvantField | null;
}

export interface FeaturedAgendaItemNode {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  uri: string;
  excerpt: string | null;
  featuredImage: { node: FeaturedImageNode } | null;
  miseEnAvant: MiseEnAvantField | null;
}

export interface GetFeaturedContentData {
  emissions: { nodes: FeaturedEmissionNode[] };
  podcasts: { nodes: FeaturedPodcastNode[] };
  posts: { nodes: FeaturedPostNode[] };
  agendaItems: { nodes: FeaturedAgendaItemNode[] };
}

// ── Query ─────────────────────────────────────────────────────────────────────

const FEATURED_WHERE = `where: {
      metaQuery: {
        metaArray: [{ key: "is_mis_en_avant", value: "1", compare: EQUAL_TO }]
      }
    }`;

export const GET_FEATURED_CONTENT = /* GraphQL */ `
  query GetFeaturedContent {
    emissions(
      where: {
        metaQuery: {
          metaArray: [{ key: "is_mis_en_avant", value: "1", compare: EQUAL_TO }]
        }
      }
      first: 5
    ) {
      nodes {
        id
        databaseId
        title
        slug
        uri
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        miseEnAvant {
          isMisEnAvant
        }
      }
    }
    podcasts(
      where: {
        metaQuery: {
          metaArray: [{ key: "is_mis_en_avant", value: "1", compare: EQUAL_TO }]
        }
      }
      first: 5
    ) {
      nodes {
        id
        databaseId
        title
        slug
        uri
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        miseEnAvant {
          isMisEnAvant
        }
      }
    }
    posts(
      where: {
        metaQuery: {
          metaArray: [{ key: "is_mis_en_avant", value: "1", compare: EQUAL_TO }]
        }
      }
      first: 5
    ) {
      nodes {
        id
        databaseId
        title
        slug
        uri
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        miseEnAvant {
          isMisEnAvant
        }
      }
    }
    agendaItems(
      where: {
        metaQuery: {
          metaArray: [{ key: "is_mis_en_avant", value: "1", compare: EQUAL_TO }]
        }
      }
      first: 5
    ) {
      nodes {
        id
        databaseId
        title
        slug
        uri
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        miseEnAvant {
          isMisEnAvant
        }
      }
    }
  }
`;
