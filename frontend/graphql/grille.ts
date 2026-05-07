// ─── Types ────────────────────────────────────────────────────────────────────

export interface GrilleSlotRaw {
  slotDate:   string;
  heureDebut: string;
  heureFin:   string;
  emission:   {
    title:         string;
    uri:           string;
    excerpt:       string | null;
    featuredImage: { node: { sourceUrl: string; altText: string } } | null;
    emissionCategories: { nodes: { name: string }[] };
    animateurs: { prenom: string; nom: string }[];
  } | null;
}

export interface GetGrilleSlotsData {
  grilleSlots: GrilleSlotRaw[];
}

// ─── Query ────────────────────────────────────────────────────────────────────

export const GET_GRILLE_SLOTS = `
  query GetGrilleSlots($dateDebut: String!, $dateFin: String!) {
    grilleSlots(dateDebut: $dateDebut, dateFin: $dateFin) {
      slotDate
      heureDebut
      heureFin
      emission {
        title
        uri
        excerpt
        featuredImage { node { sourceUrl altText } }
        emissionCategories { nodes { name } }
        animateurs { prenom nom }
      }
    }
  }
`;
