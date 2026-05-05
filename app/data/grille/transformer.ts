import type { GetGrilleSlotsData } from '@/graphql/grille';

export interface EmissionSlot {
  id:         string;
  heureDebut: string;
  heureFin:   string;
  title:      string;
  category:   string | null;
  image:      { url: string; alt: string };
  uri:        string;
}

export function transformGrilleSlots(data: GetGrilleSlotsData): EmissionSlot[] {
  return data.grilleSlots
    .filter((slot) => slot.emission !== null)
    .map((slot) => {
      const emission = slot.emission!;
      return {
        id:         slot.id,
        heureDebut: slot.heureDebut,
        heureFin:   slot.heureFin,
        title:      emission.title,
        category:   emission.emissionCategories.nodes[0]?.name ?? null,
        image: {
          url: emission.featuredImage?.node.sourceUrl ?? '',
          alt: emission.featuredImage?.node.altText  ?? emission.title,
        },
        uri: emission.uri,
      };
    });
}
