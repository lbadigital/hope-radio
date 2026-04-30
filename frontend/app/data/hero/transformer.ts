// Transformer : réponse WPGraphQL → FeaturedSlide[]
//
// Ce fichier est le seul point de la codebase autorisé à mapper la shape
// de l'API vers le type interne FeaturedSlide utilisé par HeroSlider.
// Les mocks (mock-featured-content.ts) restent fidèles à la réponse API brute.

import type { GetFeaturedContentData } from '@/graphql/hero';

export type PostType = 'emission' | 'podcast' | 'post' | 'agenda';

export interface FeaturedSlide {
  id: string;
  type: PostType;
  title: string;
  description: string;
  imageUrl: string | null;
  link: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Supprime les balises HTML de l'excerpt WordPress. */
function stripHtml(html: string | null): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

// ── Transformer principal ─────────────────────────────────────────────────────

export function transformFeaturedContent(
  data: GetFeaturedContentData,
): FeaturedSlide[] {
  const slides: FeaturedSlide[] = [];

  for (const node of data.emissions.nodes) {
    slides.push({
      id:          node.id,
      type:        'emission',
      title:       node.title,
      description: stripHtml(node.excerpt),
      imageUrl:    node.featuredImage?.node.sourceUrl ?? null,
      link:        node.uri,
    });
  }

  for (const node of data.podcasts.nodes) {
    slides.push({
      id:          node.id,
      type:        'podcast',
      title:       node.title,
      description: stripHtml(node.excerpt),
      imageUrl:    node.featuredImage?.node.sourceUrl ?? null,
      link:        node.uri,
    });
  }

  for (const node of data.posts.nodes) {
    slides.push({
      id:          node.id,
      type:        'post',
      title:       node.title,
      description: stripHtml(node.excerpt),
      imageUrl:    node.featuredImage?.node.sourceUrl ?? null,
      link:        node.uri,
    });
  }

  for (const node of data.agendaItems.nodes) {
    slides.push({
      id:          node.id,
      type:        'agenda',
      title:       node.title,
      description: stripHtml(node.excerpt),
      imageUrl:    node.featuredImage?.node.sourceUrl ?? null,
      link:        node.uri,
    });
  }

  return slides;
}
