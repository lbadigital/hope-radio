import type { GetBannièresData } from '@/graphql/bannieres';
import { normalizeWpImageUrl } from '@/lib/wordpress';

export interface BanniereCard {
  titre:        string;
  sousTitre:    string;
  imageDesktop: { url: string; alt: string };
  imageMobile:  { url: string; alt: string } | null;
  lien:         string | null;
}

const FALLBACK_IMAGE = 'https://placehold.co/1920x600/720049/FFFFFF?text=Banniere';

export function transformBannieres(data: GetBannièresData): BanniereCard[] {
  return data.bannieres
    .filter((item) => item.images?.desktop)
    .map((item) => ({
      titre:     item.titre     ?? '',
      sousTitre: item.sousTitre ?? '',
      imageDesktop: {
        url: normalizeWpImageUrl(item.images.desktop.sourceUrl) || FALLBACK_IMAGE,
        alt: item.images.desktop.altText || item.titre || '',
      },
      imageMobile: item.images.mobile
        ? {
            url: normalizeWpImageUrl(item.images.mobile.sourceUrl) || FALLBACK_IMAGE,
            alt: item.images.mobile.altText || item.titre || '',
          }
        : null,
      lien: item.lien ?? null,
    }));
}
