# TASK — Centralisation des mocks frontend + champ isMisEnAvant

> Implémentation en 2 phases : backend WordPress d'abord, puis frontend Next.js.

---

## Phase 1 — WordPress Backend

### Étape 1 — Désactivation Gutenberg sur les CPTs
- [ ] `inc/gutenberg.php` — Ajouter le filtre `use_block_editor_for_post_type`
  - Désactiver sur : `emission`, `animateur`, `podcast`, `agenda`
  - Conserver Gutenberg (avec restrictions existantes) sur : `post`

### Étape 2 — Champ ACF `isMisEnAvant`
- [ ] `inc/acf-fields.php` — Ajouter le field group `group_mise_en_avant`
  - Champ : `is_mis_en_avant` (type `true_false`)
  - `show_in_graphql: true`
  - `graphql_field_name: 'miseEnAvant'`
  - Location rules : `emission` OR `podcast` OR `post` OR `agenda`

### Étape 3 — Quick Edit admin
- [ ] Créer `inc/quick-edit.php`
  - Hook `manage_{post_type}_posts_columns` — colonne "Mis en avant" sur les 4 post types
  - Hook `manage_{post_type}_posts_custom_column` — affichage valeur courante + `data-attribute` pour le JS
  - Hook `quick_edit_custom_box` — checkbox dans le panneau quick edit + nonce
  - Hook `save_post` — sauvegarde via `update_field()`, vérification nonce + droits + protection autosave
- [ ] Créer `assets/js/quick-edit.js`
  - Pré-remplissage de la checkbox à l'ouverture du panneau quick edit
  - Chargé uniquement sur `edit.php` des post types concernés

### Étape 4 — Loader
- [ ] `functions.php` — Ajouter `require_once` pour `inc/quick-edit.php`

---

## Phase 2 — Frontend Next.js

### Étape 5 — Consolidation des queries GraphQL
- [ ] Créer `graphql/layout.ts`
  - Déplacer `GET_SITE_LOGO` depuis `components/layout/Header.tsx`
- [ ] Créer `graphql/hero.ts`
  - Créer `GET_FEATURED_CONTENT` (query sur `emissions`, `podcasts`, `posts`, `agendaItems` avec `metaQuery` sur `is_mis_en_avant`)

### Étape 6 — Création de `/app/data/`
- [ ] `app/data/menus/mock-main-menu.ts` — miroir réponse `GET_MAIN_MENU`
- [ ] `app/data/menus/mock-top-menu.ts` — miroir réponse `GET_TOP_MENU`
- [ ] `app/data/menus/mock-social-menu.ts` — miroir réponse `GET_SOCIAL_MENU`
- [ ] `app/data/layout/mock-site-logo.ts` — miroir réponse `GET_SITE_LOGO`
- [ ] `app/data/hero/mock-featured-content.ts` — miroir réponse `GET_FEATURED_CONTENT`
- [ ] `app/data/hero/transformer.ts` — map `ApiResponse → FeaturedSlide[]`
- [ ] `app/data/index.ts` — re-exports centralisés

### Étape 7 — Mise à jour des composants
- [ ] `components/layout/Header.tsx` — importer `GET_SITE_LOGO` depuis `graphql/layout.ts`
- [ ] `components/home/HeroSlider.tsx` — remplacer `MOCK_SLIDES` par le mock centralisé + transformer

---

## Règles à respecter

- Chaque mock reflète **exactement** la shape de la réponse WPGraphQL (pas de transformation dans le mock)
- Seul `hero/transformer.ts` est autorisé à mapper la réponse API vers le type interne `FeaturedSlide[]`
- Ne pas inventer le format de réponse API — s'appuyer sur la shape WPGraphQL standard + ACF for WPGraphQL
