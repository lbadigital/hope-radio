// ─── Site Logo ────────────────────────────────────────────────────────────────
// Query déplacée depuis components/layout/Header.tsx

export interface SiteLogoData {
  customLogo: {
    sourceUrl: string;
    altText: string;
  } | null;
}

export const GET_SITE_LOGO = /* GraphQL */ `
  query GetSiteLogo {
    customLogo {
      sourceUrl
      altText
    }
  }
`;
