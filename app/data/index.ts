// ─── Centralisation des mocks ─────────────────────────────────────────────────
// Point d'entrée unique pour tous les mocks du projet.
// Chaque mock reflète exactement la shape de la réponse WPGraphQL correspondante.

// Menus
export { MOCK_MAIN_MENU }   from './menus/mock-main-menu';
export { MOCK_TOP_MENU }    from './menus/mock-top-menu';
export { MOCK_SOCIAL_MENU } from './menus/mock-social-menu';

// Layout
export { MOCK_SITE_LOGO } from './layout/mock-site-logo';

// Hero Slider
export { MOCK_FEATURED_CONTENT }              from './hero/mock-featured-content';
export { transformFeaturedContent }           from './hero/transformer';
export type { FeaturedSlide, PostType }       from './hero/transformer';

// Actualités
export { MOCK_ACTUALITES }                    from './actualites/mock-actualites';
export { transformActualites }                from './actualites/transformer';
export type { ActualiteCard }                 from './actualites/transformer';

// Grille
export { MOCK_GRILLE_SLOTS, MOCK_WEEK_DATES } from './grille/mock-grille';
export { transformGrilleSlots }               from './grille/transformer';
export type { EmissionSlot }                  from './grille/transformer';

// Bannières
export { MOCK_BANNIERES }                     from './bannieres/mock-bannieres';
export { transformBannieres }                 from './bannieres/transformer';
export type { BanniereCard }                  from './bannieres/transformer';

// Émissions
export { MOCK_EMISSIONS, MOCK_EMISSION_CATEGORIES } from './emissions/mock-emissions';
export { transformEmissions }                       from './emissions/transformer';
export type { EmissionCard, EmissionPageInfo }      from './emissions/transformer';
