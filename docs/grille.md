# SPEC — Fonctionnalité "Grille des programmes"

> Spec destinée à Claude Code.
> Périmètre : WordPress uniquement (back-office + API GraphQL).
> Le rendu front Next.js est hors-scope de cette spec.
> Basée sur la documentation officielle FullCalendar v6 (fullcalendar.io/docs).

---

## Contexte

Hope Radio est un site de radio chrétienne francophone en architecture headless.
WordPress est **uniquement un back-office** : aucune page n'est affichée aux visiteurs.
Le contenu est exposé via **WPGraphQL** et consommé par un front Next.js.

La "Grille des programmes" est la planification des émissions par semaine calendaire.
Chaque créneau associe une **Émission** (CPT `emission`) à un jour et une plage horaire précis,
avec une vraie date `YYYY-MM-DD`.

La grille n'est **pas récurrente** : chaque semaine est indépendante. L'utilisateur peut
dupliquer une semaine vers une autre (ou vers toutes les semaines de l'année) pour faciliter le remplissage.

---

## Librairie : FullCalendar v6

**Package :** `fullcalendar` (standard bundle — MIT, open-source)
**Version :** 6.1.20 (dernière stable)
**Aucune dépendance externe requise** — le bundle standard est autonome.

### CDN à utiliser (vanilla JS, standard bundle)

```html
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.20/index.global.min.js"></script>
```

Pour la locale française, ajouter **après** le bundle :

```html
<script src="https://cdn.jsdelivr.net/npm/@fullcalendar/core@6.1.20/locales/fr.global.min.js"></script>
```

> ⚠️ Ne pas utiliser les anciens bundles jQuery (v3 et antérieur). FullCalendar v6 est vanilla JS pur.

### Format d'un event daté

Les créneaux utilisent des dates réelles (`start`/`end` ISO datetime) — pas de récurrence :

```js
{
    id:    'slot-42',
    title: 'Le Morning',
    start: '2026-05-04T08:00:00',   // YYYY-MM-DDTHH:MM:SS (heure locale)
    end:   '2026-05-04T09:00:00',
    color: '#3498db',
    extendedProps: {
        emissionId: 42,
        postId:     7,
        date:       '2026-05-04',   // YYYY-MM-DD, utilisé pour drag & drop
    }
}
```

> Ne jamais utiliser `daysOfWeek` + `startTime` + `endTime` — ce format est réservé aux
> événements récurrents et ferait apparaître le créneau sur toutes les semaines.

### Callbacks clés

| Callback | Signature | Usage |
|---|---|---|
| `select` | `(info)` | L'utilisateur dessine une plage horaire vide |
| `eventClick` | `(info)` | Clic sur un créneau existant → édition |
| `eventDrop` | `(info)` | Drag & drop d'un créneau (peut changer la date) |
| `eventResize` | `(info)` | Redimensionnement d'un créneau |
| `dayHeaderDidMount` | `(arg)` | Injection d'un bouton de duplication dans l'en-tête de colonne |

**Accès aux données dans les callbacks :**

```js
// select
select: function(info) {
    // info.start  → objet Date (heure locale)
    // info.end    → objet Date
    // getDateStr(info.start) → "2026-05-04" (helper local, pas toISOString)
    // formatTime(info.start) → "08:00"
}

// eventDrop
eventDrop: function(info) {
    // info.event.extendedProps.postId
    // getDateStr(info.event.start) → nouvelle date si changement de jour
    // info.event.setExtendedProp('date', newDate) → mettre à jour extendedProps
    // info.revert() → annuler si AJAX échoue
}
```

> **Important** : utiliser `getDateStr(date)` (helper local via `getFullYear/getMonth/getDate`)
> et non `date.toISOString().slice(0, 10)` — ce dernier peut décaler la date en dehors de UTC.

### Méthodes de l'instance

```js
calendar.addEvent({ id, title, start, end, color, extendedProps });
calendar.getEventById('slot-42');
event.setExtendedProp('date', '2026-05-05');
event.remove();
```

---

## Structure des fichiers

```
wordpress/wp-content/themes/hope-radio/grille/
├── grille.php                ← point d'entrée, chargé via functions.php
├── class-grille-cpt.php      ← enregistrement du CPT grille_slot + metas
├── class-grille-graphql.php  ← champs WPGraphQL
├── class-grille-admin.php    ← page admin + enqueue + HTML des modals
├── class-grille-ajax.php     ← 6 handlers AJAX
├── assets/
│   ├── css/
│   │   └── grille-admin.css  ← styles page admin uniquement
│   └── js/
│       └── grille-admin.js   ← FullCalendar + modals + AJAX
```

`functions.php` n'ajoute qu'**une seule ligne** :

```php
require_once get_template_directory() . '/grille/grille.php';
```

---

## 1. CPT `grille_slot`

Fichier : `class-grille-cpt.php`

```php
register_post_type('grille_slot', [
    'labels'              => ['name' => 'Créneaux', 'singular_name' => 'Créneau'],
    'public'              => false,
    'show_ui'             => false,
    'show_in_nav_menus'   => false,
    'show_in_rest'        => false,
    'show_in_graphql'     => true,
    'graphql_single_name' => 'grilleSlot',
    'graphql_plural_name' => 'grilleSlots',
    'supports'            => ['title'],
]);
```

**Champs meta** (enregistrés via `register_post_meta()`, tous `show_in_rest: false`, `show_in_graphql: false`) :

| Meta key      | Type    | Description                                  |
|---------------|---------|----------------------------------------------|
| `date`        | string  | Date du créneau `YYYY-MM-DD`                 |
| `heure_debut` | string  | Heure de début `HH:MM` (ex : `08:00`)        |
| `heure_fin`   | string  | Heure de fin `HH:MM` (ex : `09:00`)          |
| `emission_id` | integer | ID du post `emission` associé                |

---

## 2. Page d'administration

Fichier : `class-grille-admin.php`

**Menu :**

```php
add_menu_page(
    'Grille des programmes', 'Grille', 'edit_posts',
    'hope-radio-grille', [$this, 'render_page'],
    'dashicons-schedule', 25
);
```

**Rendu HTML :**

```html
<div class="wrap">
    <h1 class="wp-heading-inline">Grille des programmes</h1>
    <div id="grille-calendar"></div>
</div>

<!-- Modal créneau (création / édition) -->
<div id="grille-modal" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="grille-modal-title">
    <div id="grille-modal-overlay"></div>
    <div id="grille-modal-box">
        <h2 id="grille-modal-title">Créneau</h2>
        <input type="hidden" id="grille-slot-id" />       <!-- "slot-{postId}" -->
        <input type="hidden" id="grille-slot-post-id" />  <!-- postId WordPress -->

        <div class="grille-field">
            <label for="grille-emission-id">Émission</label>
            <select id="grille-emission-id" required>
                <option value="">— Choisir une émission —</option>
            </select>
        </div>
        <div class="grille-field">
            <label for="grille-slot-date">Date</label>
            <input type="date" id="grille-slot-date" required />
        </div>
        <div class="grille-field">
            <label for="grille-heure-debut">Début</label>
            <input type="time" id="grille-heure-debut" step="900" required />
        </div>
        <div class="grille-field">
            <label for="grille-heure-fin">Fin</label>
            <input type="time" id="grille-heure-fin" step="900" required />
        </div>
        <div class="grille-modal-actions">
            <button type="button" id="grille-btn-save"   class="button button-primary">Enregistrer</button>
            <button type="button" id="grille-btn-delete" class="button button-link-delete" style="display:none;">Supprimer</button>
            <button type="button" id="grille-btn-cancel" class="button">Annuler</button>
        </div>
        <div id="grille-modal-error" class="notice notice-error" style="display:none;"></div>
    </div>
</div>

<!-- Modal duplication de jour -->
<div id="grille-modal-dup" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="grille-dup-title">
    <div id="grille-modal-dup-overlay"></div>
    <div id="grille-modal-dup-box">
        <h2 id="grille-dup-title">Dupliquer <span id="grille-dup-source-label"></span></h2>
        <p>Copier tous les créneaux vers :</p>
        <div id="grille-dup-days" class="grille-days-grid">
            <!-- Checkboxes des 6 autres jours de la semaine, générées en JS -->
        </div>
        <div class="grille-field">
            <label><input type="checkbox" id="grille-dup-all" /> Toute la semaine</label>
        </div>
        <div class="grille-field">
            <label><input type="checkbox" id="grille-dup-replace" /> Remplacer les créneaux existants du jour cible</label>
        </div>
        <div class="grille-modal-actions">
            <button type="button" id="grille-btn-dup-confirm" class="button button-primary">Dupliquer</button>
            <button type="button" id="grille-btn-dup-cancel"  class="button">Annuler</button>
        </div>
        <div id="grille-dup-error" class="notice notice-error" style="display:none;"></div>
    </div>
</div>

<!-- Modal duplication de semaine -->
<div id="grille-modal-dup-week" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="grille-dup-week-title">
    <div id="grille-modal-dup-week-overlay"></div>
    <div id="grille-modal-dup-week-box">
        <h2 id="grille-dup-week-title">Dupliquer <span id="grille-dup-week-source-label"></span></h2>
        <p>Copier tous les créneaux de cette semaine vers :</p>
        <div class="grille-field">
            <label for="grille-dup-week-target">Semaine cible</label>
            <input type="week" id="grille-dup-week-target" />
        </div>
        <div class="grille-field">
            <label>
                <input type="checkbox" id="grille-dup-week-all-year" />
                Toutes les semaines de <span id="grille-dup-week-year-label"></span>
            </label>
        </div>
        <div class="grille-field">
            <label><input type="checkbox" id="grille-dup-week-replace" /> Remplacer les créneaux existants</label>
        </div>
        <div class="grille-modal-actions">
            <button type="button" id="grille-btn-dup-week-confirm" class="button button-primary">Dupliquer</button>
            <button type="button" id="grille-btn-dup-week-cancel"  class="button">Annuler</button>
        </div>
        <div id="grille-dup-week-error" class="notice notice-error" style="display:none;"></div>
    </div>
</div>
```

**Enqueue des assets :**

```php
// Enregistré uniquement sur $hook === 'toplevel_page_hope-radio-grille'
wp_localize_script('grille-admin', 'GrilleData', [
    'ajaxUrl'     => admin_url('admin-ajax.php'),
    'nonce'       => wp_create_nonce('grille_nonce'),
    'emissions'   => $this->get_emissions_list(),
    'slots'       => $this->get_all_slots(),
    'currentYear' => (int) date('Y'),
]);
```

**Format des slots injectés (`get_all_slots()`) :**

Limité à l'année en cours via `meta_query BETWEEN`. Les slots sans meta `date` valide sont ignorés.

```json
[
    {
        "postId":     7,
        "id":         "slot-7",
        "title":      "Le Morning",
        "date":       "2026-05-04",
        "heureDebut": "08:00",
        "heureFin":   "09:00",
        "emissionId": 42,
        "color":      "#3498db"
    }
]
```

**Format des émissions injectées :**

```json
[{ "id": 42, "title": "Le Morning", "color": "#3498db" }]
```

La couleur est déterministe : `PALETTE[$emission_id % count(PALETTE)]`
sur une palette fixe de 12 couleurs hex (constante de classe).

---

## 3. Initialisation FullCalendar (`grille-admin.js`)

### Configuration

```js
var calendar = new FullCalendar.Calendar(calendarEl, {
    locale:            'fr',
    initialView:       'timeGridWeek',
    allDaySlot:        false,
    slotMinTime:       '05:00:00',
    slotMaxTime:       '24:00:00',
    slotDuration:      '00:15:00',
    slotLabelInterval: '01:00:00',
    height:            'auto',
    selectable:        true,
    editable:          true,
    eventOverlap:      false,
    headerToolbar: {
        left:   'prev,next today dupWeekBtn',
        center: 'title',
        right:  '',
    },
    customButtons: {
        dupWeekBtn: {
            text:  '⧉ Dupliquer la semaine',
            click: function () { openDupWeekModal(); },
        },
    },
    events: initialEvents,   // events datés avec start/end ISO
    select:             ...,
    eventClick:         ...,
    eventDrop:          ...,
    eventResize:        ...,
    dayHeaderDidMount:  ...,
});
```

### Helpers JS clés

```js
// Extrait "YYYY-MM-DD" en heure locale (ne pas utiliser toISOString)
function getDateStr(date) {
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, '0');
    var d = String(date.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;
}

// Extrait "HH:MM" depuis un objet Date
function formatTime(date) {
    return date.toTimeString().slice(0, 5);
}

// Trouve le lundi de la semaine d'une date donnée (ISO : lundi = 1)
function getWeekMondayStr(dateStr) {
    var d   = new Date(dateStr + 'T12:00:00');
    var dow = d.getDay() === 0 ? 7 : d.getDay();
    d.setDate(d.getDate() - (dow - 1));
    return getDateStr(d);
}

// Convertit "YYYY-Www" (input[type=week]) → lundi YYYY-MM-DD (ISO 8601 : jan 4 = semaine 1)
function weekInputToMonday(weekValue) { ... }

// Inverse : lundi YYYY-MM-DD → "YYYY-Www"
function dateToWeekInput(mondayStr) { ... }
```

### Duplication de jour (`dayHeaderDidMount`)

Un bouton `⧉` est injecté dans chaque en-tête de colonne. Il ouvre `openDupModal(dateStr)` qui :
- calcule le lundi de la semaine via `getWeekMondayStr`
- génère 6 checkboxes (les autres jours de la même semaine) avec leurs dates réelles
- la checkbox "Toute la semaine" coche/décoche toutes les options

### Duplication de semaine (`openDupWeekModal`)

Bouton personnalisé dans le `headerToolbar`. Le modal :
- pré-remplit `input[type=week]` avec la semaine suivante via `dateToWeekInput`
- la checkbox "Toutes les semaines de [année]" désactive l'input semaine et appelle `grille_duplicate_week_year`
- sinon, convertit la valeur semaine en lundi via `weekInputToMonday` et appelle `grille_duplicate_week`

### `applyDupResult(data, largeDataset)`

Applique le résultat d'une duplication au calendrier et à `GrilleData.slots` :
- supprime les events dont le `postId` est dans `data.deletedPostIds`
- ajoute les nouveaux events ; si `largeDataset = true` (duplication année), n'ajoute au calendrier
  que les events dans la plage visible (`calendar.view.currentStart/currentEnd`)

---

## 4. Handlers AJAX (`class-grille-ajax.php`)

6 actions. Toutes protégées par `check_ajax_referer('grille_nonce', 'nonce')` + `current_user_can('edit_posts')`.

```php
add_action('wp_ajax_grille_save_slot',           [$this, 'save_slot']);
add_action('wp_ajax_grille_update_slot',         [$this, 'update_slot']);
add_action('wp_ajax_grille_delete_slot',         [$this, 'delete_slot']);
add_action('wp_ajax_grille_duplicate_day',       [$this, 'duplicate_day']);
add_action('wp_ajax_grille_duplicate_week',      [$this, 'duplicate_week']);
add_action('wp_ajax_grille_duplicate_week_year', [$this, 'duplicate_week_to_year']);
```

### `grille_save_slot`

**POST :** `emissionId`, `date` (YYYY-MM-DD), `heureDebut`, `heureFin`, `postId` (vide = création)

**Validation :**
- `date` : regex `/^\d{4}-\d{2}-\d{2}$/` + round-trip `DateTime::createFromFormat`
- `heureDebut` / `heureFin` : regex `/^\d{2}:\d{2}$/`
- `heureFin` > `heureDebut`
- `emissionId` est un post `emission` publié

**Retourne :**
```json
{ "postId": 7, "date": "2026-05-04", "heureDebut": "08:00", "heureFin": "09:00", "emissionId": 42 }
```

### `grille_update_slot`

**POST :** `postId`, `date`, `heureDebut`, `heureFin`

Mise à jour silencieuse (drag & drop / resize). Inclut `date` car un drag peut changer le jour.
Retourne `{ "success": true }`.

### `grille_delete_slot`

**POST :** `postId`

`wp_delete_post($post_id, true)` (suppression définitive).

### `grille_duplicate_day`

**POST :** `sourceDate` (YYYY-MM-DD), `targetDates[]`, `replaceExisting` (0/1)

Copie tous les slots de `sourceDate` vers chaque date dans `targetDates`. Si `replaceExisting = 1`,
supprime d'abord les slots existants sur chaque date cible.

**Retourne :** `{ "deletedPostIds": [...], "created": [...] }`

Chaque entrée de `created` : `{ postId, id, date, heureDebut, heureFin, emissionId }`.

### `grille_duplicate_week`

**POST :** `sourceWeekStart` (lundi YYYY-MM-DD), `targetWeekStarts[]`, `replaceExisting`

Délègue à `do_duplicate_week()`.

### `grille_duplicate_week_year`

**POST :** `sourceWeekStart`, `year`, `replaceExisting`

`set_time_limit(300)`. Calcule tous les lundis de l'année via `get_year_mondays($year, $exclude)`.
Délègue à `do_duplicate_week()`.

### `do_duplicate_week()` (helper privé)

```php
private function do_duplicate_week(string $source_week_start, array $target_week_starts, bool $replace): array {
    $source_sunday = (new DateTime($source_week_start))->modify('+6 days')->format('Y-m-d');
    // Charge les slots source (BETWEEN DATE)
    // Pour chaque semaine cible :
    //   $offset_days = (int) round(($target_ts - $source_ts) / DAY_IN_SECONDS);
    //   $new_date    = date('Y-m-d', strtotime($data['date']) + $offset_days * DAY_IN_SECONDS);
}
```

---

## 5. Exposition WPGraphQL (`class-grille-graphql.php`)

Hook : `graphql_register_types`.

### Champs sur `GrilleSlot`

```php
register_graphql_fields('GrilleSlot', [
    'date'       => ['type' => 'String', 'resolve' => fn($post) => get_post_meta($post->ID, 'date', true) ?: null],
    'heureDebut' => ['type' => 'String', 'resolve' => fn($post) => get_post_meta($post->ID, 'heure_debut', true) ?: null],
    'heureFin'   => ['type' => 'String', 'resolve' => fn($post) => get_post_meta($post->ID, 'heure_fin', true) ?: null],
    'emission'   => ['type' => 'Emission', 'resolve' => ...],
]);
```

### Query `grilleSlots`

```php
register_graphql_field('RootQuery', 'grilleSlots', [
    'type' => ['list_of' => 'GrilleSlot'],
    'args' => [
        'dateDebut' => ['type' => 'String'],  // YYYY-MM-DD incluse
        'dateFin'   => ['type' => 'String'],  // YYYY-MM-DD incluse
    ],
    'resolve' => function($root, $args) {
        // meta_query BETWEEN DATE si args fournis
    },
]);
```

**Queries GraphQL côté Next.js :**

```graphql
# Tous les créneaux d'une semaine
query GetGrilleWeek {
    grilleSlots(dateDebut: "2026-05-04", dateFin: "2026-05-10") {
        id
        date
        heureDebut
        heureFin
        emission {
            id
            title
            slug
            uri
            featuredImage { node { sourceUrl altText } }
        }
    }
}

# Tous les créneaux (sans filtre)
query GetGrille {
    grilleSlots {
        id
        date
        heureDebut
        heureFin
        emission { title uri }
    }
}
```

---

## Ce qu'il ne faut pas faire

- **Ne pas utiliser `daysOfWeek` + `startTime` + `endTime`** pour les events FullCalendar — ce format récurrent ferait apparaître chaque créneau sur toutes les semaines.
- **Ne pas utiliser `toISOString().slice(0, 10)`** pour extraire une date — utiliser `getFullYear/getMonth/getDate` (heure locale) via le helper `getDateStr()`.
- **Ne pas stocker `weekday` en base** — stocker `date` (YYYY-MM-DD) dans le meta `date`.
- **Ne pas utiliser ACF** pour les champs du créneau — `register_post_meta()` natif uniquement.
- **Ne pas afficher le CPT dans les listes admin** (`show_ui: false`, `show_in_nav_menus: false`).
- **Ne pas exposer le CPT via l'API REST** (`show_in_rest: false`).
- **Ne pas charger FullCalendar sur toutes les pages admin** — vérifier `$hook === 'toplevel_page_hope-radio-grille'`.
- **Ne pas utiliser l'ancien bundle jQuery de FullCalendar** (v3).
- **Ne pas créer de table SQL custom** — utiliser CPT + post meta.
- **Ne pas modifier `functions.php`** au-delà d'un seul `require_once` vers `grille/grille.php`.
- **Ne pas gérer les chevauchements sans `eventOverlap: false`** — deux émissions ne peuvent pas se superposer.
- **Ne pas omettre `set_time_limit(300)`** dans `duplicate_week_to_year` — la duplication vers 52 semaines peut dépasser le timeout par défaut.

---

## Critères de validation

- [ ] La page "Grille" apparaît dans le menu admin WordPress avec l'icône `dashicons-schedule`
- [ ] FullCalendar s'affiche en vue `timeGridWeek` avec navigation prev/next/today
- [ ] Les créneaux de l'année en cours sont chargés et visibles au rendu initial
- [ ] Dessiner une plage ouvre le modal avec la date et les horaires pré-remplis
- [ ] Le select "Émission" liste tous les posts `emission` publiés
- [ ] Enregistrer un créneau l'ajoute au calendrier sans rechargement de page
- [ ] Modifier un créneau met à jour l'event existant
- [ ] Drag & drop sauvegarde silencieusement (avec mise à jour de la `date`) et annule si AJAX échoue
- [ ] Resize sauvegarde silencieusement et annule si AJAX échoue
- [ ] Supprimer un créneau le retire du calendrier et le supprime en base
- [ ] Deux créneaux ne peuvent pas se chevaucher (`eventOverlap: false`)
- [ ] Bouton `⧉` dans chaque en-tête de colonne → modal de duplication du jour
- [ ] La checkbox "Toute la semaine" sélectionne tous les jours cibles
- [ ] La duplication de jour avec "Remplacer" supprime d'abord les créneaux existants
- [ ] Bouton "⧉ Dupliquer la semaine" dans le toolbar → modal de duplication de semaine
- [ ] `input[type=week]` pré-rempli avec la semaine suivante
- [ ] La checkbox "Toutes les semaines de [année]" désactive l'input semaine et duplique vers toute l'année
- [ ] La duplication vers toute l'année n'ajoute au calendrier que les events de la semaine visible
- [ ] La query GraphQL `grilleSlots` retourne les créneaux avec l'objet `emission` résolu
- [ ] `grilleSlots(dateDebut: "...", dateFin: "...")` filtre correctement par plage de dates
- [ ] Aucun asset FullCalendar n'est chargé sur les autres pages admin
