// ─── Types ────────────────────────────────────────────────────────────────────

export interface EmissionCategoryNode {
  id:   string;
  name: string;
  slug: string;
}

export interface GetEmissionCategoriesData {
  emissionCategories: { nodes: EmissionCategoryNode[] };
}

export interface EmissionNode {
  id:            string;
  databaseId:    number;
  title:         string;
  uri:           string;
  excerpt:       string | null;
  featuredImage: { node: { sourceUrl: string; altText: string } } | null;
  emissionCategories: { nodes: { name: string; slug: string }[] };
  animateurs:    { prenom: string; nom: string }[];
}

export interface GetEmissionsData {
  emissions: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor:   string | null;
    };
    nodes: EmissionNode[];
  };
}

export interface GetEmissionsByCategoryData {
  emissionCategory: {
    emissions: {
      pageInfo: {
        hasNextPage: boolean;
        endCursor:   string | null;
      };
      nodes: EmissionNode[];
    };
  } | null;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

const EMISSION_NODES = `
  pageInfo {
    hasNextPage
    endCursor
  }
  nodes {
    id
    databaseId
    title
    uri
    excerpt
    featuredImage {
      node {
        sourceUrl
        altText
      }
    }
    emissionCategories {
      nodes {
        name
        slug
      }
    }
    animateurs {
      prenom
      nom
    }
  }
`;

export const GET_EMISSION_CATEGORIES = `
  query GetEmissionCategories {
    emissionCategories(first: 100, where: { hideEmpty: false }) {
      nodes {
        id
        name
        slug
      }
    }
  }
`;

export const GET_EMISSIONS_ALL = `
  query GetEmissionsAll($first: Int!, $after: String) {
    emissions(
      first: $first
      after: $after
      where: { status: PUBLISH }
    ) {
      ${EMISSION_NODES}
    }
  }
`;

export const GET_EMISSIONS_BY_CATEGORY = `
  query GetEmissionsByCategory($first: Int!, $after: String, $categorySlug: ID!) {
    emissionCategory(id: $categorySlug, idType: SLUG) {
      emissions(
        first: $first
        after: $after
        where: { status: PUBLISH }
      ) {
        ${EMISSION_NODES}
      }
    }
  }
`;
