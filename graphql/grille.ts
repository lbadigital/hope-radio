// ─── Types ────────────────────────────────────────────────────────────────────

export interface GrilleSlotRaw {
  heureDebut: string;
  heureFin:   string;
  emission:   {
    title:         string;
    uri:           string;
    featuredImage: { node: { sourceUrl: string; altText: string } } | null;
    emissionCategories: { nodes: { name: string }[] };
  } | null;
}

export interface GetGrilleSlotsData {
  grilleSlots: GrilleSlotRaw[];
}

// ─── Query ────────────────────────────────────────────────────────────────────

export const GET_GRILLE_SLOTS = `
  query GetGrilleSlots($dateDebut: String!, $dateFin: String!) {
    grilleSlots(dateDebut: $dateDebut, dateFin: $dateFin) {
      heureDebut
      heureFin
      emission {
        title
        uri
        featuredImage { node { sourceUrl altText } }
        emissionCategories { nodes { name } }
      }
    }
  }
`;
