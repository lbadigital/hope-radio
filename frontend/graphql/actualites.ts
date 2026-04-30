// ─── Actualités (Posts natifs) ────────────────────────────────────────────────
//
// Récupère les N derniers posts publiés avec leur image à la une et leurs
// catégories, pour alimenter le composant ActualitesSection sur la home.

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ActualiteImageNode {
  sourceUrl: string;
  altText:   string;
}

export interface ActualiteCategoryNode {
  name: string;
  slug: string;
}

export interface ActualiteNode {
  title:         string;
  excerpt:       string | null;   // HTML brut — stripper via stripHtml()
  slug:          string;
  uri:           string;
  featuredImage: { node: ActualiteImageNode } | null;
  categories:    { nodes: ActualiteCategoryNode[] };
}

export interface GetActualitesData {
  posts: {
    nodes: ActualiteNode[];
  };
}

// ── Query ─────────────────────────────────────────────────────────────────────

export const GET_ACTUALITES = /* GraphQL */ `
  query GetActualites($first: Int!) {
    posts(first: $first, where: { status: PUBLISH }) {
      nodes {
        title
        excerpt
        slug
        uri
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;
