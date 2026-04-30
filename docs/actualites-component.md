# Spec — Composant Actualités (Home)

> Statut : **En attente de validation**
> Dernière mise à jour : 2026-04-30 (v2)

---

## Périmètre

Implémentation du bloc "Actualités" affiché sur la page d'accueil du site Hope Radio.
Comprend : un plugin WordPress de seed, une query WPGraphQL, un transformer et un composant React Server Component.

---

## 1. WordPress — Plugin de seed

### Emplacement

```
wordpress/wp-content/plugins/hope-seed-actualites/
└── hope-seed-actualites.php
```

Plugin standard (non mu-plugin), activable/désactivable depuis l'admin.
Protégé par `WP_DEBUG` : toute action de seed ou rollback est bloquée si `WP_DEBUG !== true`.

### Données créées par le seed

**5 catégories natives** :
- Sport
- Culture
- Société
- Musique
- Événements

**20 posts natifs (`post`)** comprenant chacun :
- `post_title` : titre en français (lorem ipsum francisé ou titres réalistes générés)
- `post_excerpt` : extrait court (~200 caractères), renseigné dans le champ "Extrait" Gutenberg
- `post_content` : contenu long (~2–3 paragraphes)
- `post_status` : `publish`
- Featured image (`_thumbnail_id`) via `media_sideload_image()` depuis :
  `https://placehold.co/744x380/E35711/FFFFFF?text=Actualite+N` (N = numéro du post)
- 1 à 2 catégories assignées aléatoirement parmi les 5

### Idempotence

Avant d'exécuter le seed, le plugin vérifie si des posts portant le meta `_seeded_by_hope = true` existent déjà.
Si oui : le seed est bloqué et une notice admin `warning` informe l'utilisateur.

### Interface admin (bouton dans `/wp-admin/edit.php`)

Affiché via le hook `admin_notices`, **uniquement si `WP_DEBUG === true`**.

Deux boutons distincts :

| Bouton | Couleur | Action |
|---|---|---|
| 🌱 Générer les actualités de test | Vert `#2ea44f` | Crée les 20 posts + catégories |
| 🗑 Supprimer les actualités de test | Rouge `#d73a49` | Rollback complet |

Chaque bouton soumet un formulaire `POST` vers `admin-post.php` avec :
- `action` : `hope_seed_actualites` ou `hope_rollback_actualites`
- `_wpnonce` : nonce vérifié côté callback

Après exécution : `wp_safe_redirect()` vers `edit.php` avec paramètre `?hope_seeded=1` ou `?hope_rolled_back=1`, puis notice de confirmation.

### Rollback

Supprime tous les posts ayant le meta `_seeded_by_hope = true` (via `wp_delete_post()`), ainsi que leurs featured images attachées.
Ne supprime **pas** les catégories (elles pourraient être réutilisées par de vrais posts).

### Sécurité

- Vérification `current_user_can('manage_options')` sur chaque callback
- Vérification `check_admin_referer()` sur chaque nonce
- Condition `WP_DEBUG` vérifiée à la fois à l'affichage ET dans les callbacks

---

## 2. WPGraphQL — Query

**Fichier** : `frontend/graphql/actualites.ts`

### Query

```graphql
query GetActualites($first: Int!) {
  posts(first: $first, where: { status: PUBLISH }) {
    nodes {
      title
      excerpt
      slug
      uri
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
    }
  }
}
```

### Types exportés

```ts
export interface ActualiteImageNode {
  sourceUrl: string
  altText: string
}

export interface ActualiteCategoryNode {
  name: string
  slug: string
}

export interface ActualiteNode {
  title: string
  excerpt: string         // HTML brut — à stripper via stripHtml()
  slug: string
  uri: string
  featuredImage: {
    node: ActualiteImageNode
  } | null
  categories: {
    nodes: ActualiteCategoryNode[]
  }
}

export interface GetActualitesData {
  posts: {
    nodes: ActualiteNode[]
  }
}
```

---

## 3. Frontend — Structure des fichiers

```
frontend/
├── graphql/
│   └── actualites.ts                  ← query GET_ACTUALITES + types
├── app/data/
│   └── actualites/
│       ├── mock-actualites.ts          ← mock calqué sur la shape WPGraphQL (20 items)
│       └── transformer.ts              ← ActualiteNode[] → ActualiteCard[]
└── components/home/
    └── ActualitesSection.tsx           ← composant serveur async
```

Intégration dans `frontend/app/page.tsx` :
```tsx
<ActualitesSection count={3} title="Actualités" />
```

---

## 4. Transformer

**Fichier** : `frontend/app/data/actualites/transformer.ts`

```ts
export interface ActualiteCard {
  title: string       // post_title
  excerpt: string     // post_excerpt strippé du HTML
  category: string    // nom de categories.nodes[0], ou "" si absent
  image: {
    url: string       // featuredImage.node.sourceUrl ou fallback placehold.co
    alt: string
  }
  uri: string         // lien vers le post single
}
```

- Si `categories.nodes` est vide → `category: ""`
- Si plusieurs catégories → on prend `nodes[0]` uniquement
- Si `featuredImage` est `null` → fallback : `https://placehold.co/744x380/E35711/FFFFFF?text=Actualite`
- `excerpt` passé dans `stripHtml()` (utilitaire déjà présent dans le projet)

---

## 5. Composant `ActualitesSection`

### Props

```ts
interface ActualitesSectionProps {
  count: number      // nombre de cards à afficher
  title?: string     // défaut : "Actualités"
}
```

### Comportement data

- React Server Component (`async`)
- Tente `fetchGraphQL<GetActualitesData>(GET_ACTUALITES, { first: count })`
- Si erreur API → fallback sur le mock `MOCK_ACTUALITES` (slicé à `count`)
- `next: { revalidate: 60 }` (ISR 1 minute)

### Breakpoints responsives

| Breakpoint | Comportement |
|---|---|
| `< 768px` | Swiper — `slidesPerView: 1`, `spaceBetween: 16` |
| `768px – 986px` | Swiper — `slidesPerView: 2`, `spaceBetween: 24` |
| `> 986px` | Grille flex statique — 3 colonnes, pas de Swiper |

### Rendu — Desktop (> 986px)

```
┌─────────────────────────────────────────────────────────────────────┐
│ ACTUALITÉS (titre H2)                    TOUTES LES ACTUALITÉS →    │
├────────────────┬────────────────┬────────────────────────────────────┤
│ [Image]        │ [Image]        │ [Image]                            │
│ THÉMATIQUE     │ THÉMATIQUE     │ THÉMATIQUE                         │
│ Titre du post  │ Titre du post  │ Titre du post                      │
└────────────────┴────────────────┴────────────────────────────────────┘
```

Layout : `display: flex; gap: 24px;` pour la grille de cards (colonnes fixes).
Header du bloc : `display: flex; justify-content: space-between; align-items: center;`
Lien "TOUTES LES ACTUALITÉS" dans le header, aligné à droite.

### Rendu — Tablette (768px – 986px) et Mobile (< 768px)

Swiper.js (Client Component) avec :
- `slidesPerView: 2` entre 768px et 986px
- `slidesPerView: 1` en dessous de 768px
- Breakpoints Swiper natifs (`breakpoints: { 768: { slidesPerView: 2 } }`)
- Pas de boutons prev/next
- **Pagination dots** : même style que le composant HeroSlider de la home (bullets custom, couleur primaire `#72004A`)
- Lien "TOUTES LES ACTUALITÉS" affiché **sous** le slider, centré (`text-align: center; margin-top: 16px;`)

### Architecture du composant (split server/client)

Le composant est découpé en deux couches pour rester compatible avec le pattern RSC du projet :

```
ActualitesSection.tsx      ← Server Component async (fetch data)
└── ActualitesSlider.tsx   ← Client Component 'use client' (Swiper + breakpoints)
```

- `ActualitesSection` : fetch GraphQL, transforme les données, rend la grille desktop et passe les cards à `ActualitesSlider`
- `ActualitesSlider` : reçoit `cards: ActualiteCard[]` en prop, gère Swiper avec breakpoints responsive
- Sur desktop (> 986px), `ActualitesSlider` n'est pas rendu — la grille statique est rendue directement dans `ActualitesSection`
- Alternativement : `ActualitesSlider` est toujours rendu mais gère les deux layouts via CSS + Swiper (à trancher à l'implémentation selon ce qui est le plus propre)

---

## 6. Card — détail

### Interaction

- La card entière est un `<a href={uri}>` (cliquable en totalité)
- L'image est dans un conteneur `overflow: hidden`
- **Par défaut** : `transform: scale(1.05)` sur l'image + `transition` cubic-bezier
- **Au hover de la card** : `transform: scale(1)` avec easing `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- Durée : `0.4s`

```css
.card-image {
  transform: scale(1.05);
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.card:hover .card-image {
  transform: scale(1);
}
```

### Styles des éléments de la card

| Élément | Styles |
|---|---|
| Thumbnail | `width: 372px; height: 190px; aspect-ratio: 186/95; object-fit: cover;` |
| Catégorie | `color: #E85B21; font-family: "Gravesend Sans Bold"; font-size: 12px; font-weight: 700; line-height: 22px; text-transform: uppercase;` |
| Titre du post | `color: #000; font-family: "Gravesend Sans Bold"; font-size: 16px; font-weight: 700; line-height: 22px; text-transform: uppercase;` |

---

## 7. Styles du bloc

| Élément | Styles |
|---|---|
| Titre "ACTUALITÉS" | `display: flex; width: 625px; height: 59px; flex-direction: column; justify-content: center;` + Gravesend Sans Bold Italic |
| Lien "TOUTES LES ACTUALITÉS" | `display: flex; width: 205px; height: 31px; flex-direction: column; justify-content: center; text-decoration: underline;` |
| Lien mobile | `text-align: center; margin-top: 16px;` |

---

## 8. Ordre d'implémentation suggéré

1. Plugin WordPress `hope-seed-actualites` (seed + rollback + boutons admin)
2. Query GraphQL + types (`frontend/graphql/actualites.ts`)
3. Mock + transformer (`frontend/app/data/actualites/`)
4. Composant `ActualitesSection` (desktop + mobile)
5. Intégration dans `app/page.tsx`

---

## Points en suspens / décisions futures

- Split server/client : à valider à l'implémentation (`ActualitesSlider` toujours rendu vs. conditionnel)
- Lien de chaque card : pointe vers `/actualites/[slug]` — la page single sera implémentée séparément
- Les catégories **ne sont pas supprimées** lors du rollback (comportement conservateur)
