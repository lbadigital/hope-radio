// Miroir exact de la réponse WPGraphQL pour GET_SITE_LOGO.
// Shape : { customLogo: { sourceUrl: string; altText: string } | null }
import type { SiteLogoData } from '@/graphql/layout';

export const MOCK_SITE_LOGO: SiteLogoData = {
  customLogo: {
    sourceUrl: "",
    altText:   'Hope Radio',
  },
};
