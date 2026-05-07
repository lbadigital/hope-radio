import type { GetGrilleSlotsData } from '@/graphql/grille';

export interface EmissionSlot {
  id:         string;
  slotDate:   string;
  heureDebut: string;
  heureFin:   string;
  title:      string;
  category:   string | null;
  image:      { url: string; alt: string };
  uri:        string;
  excerpt:    string | null;
  animateur:  string | null;
}

export function transformGrilleSlots(data: GetGrilleSlotsData): EmissionSlot[] {
  return data.grilleSlots
    .filter((slot) => slot.emission !== null)
    .map((slot) => {
      const emission = slot.emission!;
      const animateurNode = emission.animateurs?.[0];
      const animateur = animateurNode
        ? `${animateurNode.prenom} ${animateurNode.nom}`.trim()
        : null;
      return {
        id:         `${slot.slotDate}-${slot.heureDebut}-${slot.heureFin}`,
        slotDate:   slot.slotDate,
        heureDebut: slot.heureDebut,
        heureFin:   slot.heureFin,
        title:      emission.title,
        category:   emission.emissionCategories.nodes[0]?.name ?? null,
        image: {
          url: emission.featuredImage?.node.sourceUrl ?? '',
          alt: emission.featuredImage?.node.altText  ?? emission.title,
        },
        uri:        emission.uri,
        excerpt:    emission.excerpt ?? null,
        animateur,
      };
    });
}
