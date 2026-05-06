// ─── Bannières promotionnelles (option de thème) ──────────────────────────────
//
// Récupère toutes les bannières configurées dans Options > Promotions
// pour alimenter le composant BanniereSection.

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BanniereImageNode {
  sourceUrl: string;
  altText:   string;
}

export interface BanniereImagesNode {
  desktop: BanniereImageNode;
  mobile:  BanniereImageNode | null;
}

export interface BanniereItemNode {
  titre:     string | null;
  sousTitre: string | null;
  images:    BanniereImagesNode;
  lien:      string | null;
}

export interface GetBannièresData {
  bannieres: BanniereItemNode[];
}

// ── Query ─────────────────────────────────────────────────────────────────────

export const GET_BANNIERES = /* GraphQL */ `
  query GetBannieres {
    bannieres {
      titre
      sousTitre
      images {
        desktop {
          sourceUrl
          altText
        }
        mobile {
          sourceUrl
          altText
        }
      }
      lien
    }
  }
`;
