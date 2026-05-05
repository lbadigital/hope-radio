# TASK — Grille des programmes : migration vers événements datés

> Restructuration complète du module `grille/`.
> Objectif : passer d'une semaine-type récurrente (weekday 0-6) à un planning calendaire
> réel où chaque semaine est indépendante, avec duplication de semaine vers une autre
> ou vers toutes les semaines de l'année en cours.

---

## Phase 1 — Modèle de données (WordPress)

### 1.1 — CPT `grille_slot` (`class-grille-cpt.php`)
- [ ] Supprimer les metas `weekday` (integer) et `semaine` (integer)
- [ ] Ajouter le meta `date` (string `YYYY-MM-DD`)
- [ ] Garder : `heure_debut`, `heure_fin`, `emission_id`

### 1.2 — Handler `save_slot` (`class-grille-ajax.php`)
- [ ] Remplacer le param `weekday` + `semaine` par `date` (`YYYY-MM-DD`)
- [ ] Validation : format date valide + `heure_fin > heure_debut`
- [ ] Écrire le meta `date` à la place de `weekday` + `semaine`
- [ ] Retourner `{ postId, date, heureDebut, heureFin, emissionId }`

### 1.3 — Handler `update_slot` (`class-grille-ajax.php`)
- [ ] Ajouter `date` dans les paramètres (drag entre jours change la date)
- [ ] Mettre à jour le meta `date` (en plus de `heure_debut`/`heure_fin`)

### 1.4 — Handler `duplicate_day` (`class-grille-ajax.php`)
- [ ] Source : une `date` précise (copie tous les slots de ce jour)
- [ ] Cibles : un tableau de dates (`targetDates[]`)
- [ ] Option `replaceExisting`
- [ ] Écrire le meta `date` (cible) sur les nouveaux slots
- [ ] Retourner `{ deletedPostIds, created }`

### 1.5 — Nouveau handler `duplicate_week` (`class-grille-ajax.php`)
- [ ] Remplacer l'ancienne version (semaines abstraites) par la version datée
- [ ] Params : `sourceWeekStart` (lundi YYYY-MM-DD), `targetWeekStarts[]`, `replaceExisting`
- [ ] Logique : pour chaque slot source, calculer `newDate = slotDate + (targetWeekStart - sourceWeekStart)`
- [ ] Retourner `{ deletedPostIds, created }`

### 1.6 — Nouveau handler `duplicate_week_to_year` (`class-grille-ajax.php`)
- [ ] Params : `sourceWeekStart` (lundi YYYY-MM-DD), `year` (int), `replaceExisting`
- [ ] Logique : calculer tous les lundis de l'année `year`, exclure `sourceWeekStart`, dupliquer vers chaque lundi
- [ ] Retourner `{ deletedPostIds, created }`

### 1.7 — Supprimer le handler `delete_week` (`class-grille-ajax.php`)
- [ ] Supprimer l'action `grille_delete_week` (concept de semaine abstraite abandonné)

---

## Phase 2 — Page admin (PHP)

### 2.1 — `get_all_slots()` (`class-grille-admin.php`)
- [ ] Retourner `date` à la place de `weekday` + `semaine`
- [ ] Charger uniquement les slots de l'année en cours (1er jan – 31 déc)
- [ ] Format retourné : `{ postId, id, title, date, heureDebut, heureFin, emissionId, color }`

### 2.2 — Nettoyage HTML (`class-grille-admin.php`)
- [ ] Supprimer `#grille-week-toolbar` (sélecteur + boutons semaine abstraite)
- [ ] Supprimer `#grille-modal-dup-week` (modal duplication semaine abstraite)
- [ ] Ajouter `#grille-modal-dup-week` version datée :
  - Semaine source affichée (label, pré-rempli en JS)
  - Champ date pour semaine cible (input `week` ou date picker)
  - Checkbox "Toutes les semaines de l'année en cours"
  - Checkbox "Remplacer les créneaux existants"
  - Bouton Dupliquer / Annuler + zone d'erreur

### 2.3 — `wp_localize_script` (`class-grille-admin.php`)
- [ ] Supprimer `weeks` de `GrilleData`
- [ ] Ajouter `currentYear` (ex : `2026`) pour le calcul JS des 52 semaines

### 2.4 — Supprimer `get_all_weeks()` (`class-grille-admin.php`)

---

## Phase 3 — JavaScript (`grille-admin.js`)

### 3.1 — Migration événements récurrents → datés
- [ ] Conversion `GrilleData.slots → initialEvents` : utiliser `start`/`end` ISO au lieu de `daysOfWeek`/`startTime`/`endTime`
  - `start = slot.date + 'T' + slot.heureDebut + ':00'`
  - `end   = slot.date + 'T' + slot.heureFin   + ':00'`
- [ ] Mettre à jour `addEventToCalendar` (même format)
- [ ] Supprimer `switchSemaine`, `currentSemaine`, le sélecteur de semaine abstraite

### 3.2 — Callbacks FullCalendar
- [ ] `select` : extraire `date` depuis `info.startStr.slice(0, 10)` + pré-remplir la modal
- [ ] `eventClick` : extraire `date` depuis `info.event.startStr.slice(0, 10)`
- [ ] `eventDrop` : envoyer `date` nouvelle (peut changer si glissé vers un autre jour)
- [ ] `eventResize` : envoyer `date` (inchangée, seule l'heure change)

### 3.3 — Bouton "Dupliquer la semaine" dans FullCalendar
- [ ] Ajouter un bouton custom dans `headerToolbar` (`customButtons`)
- [ ] Au clic : lire `calendar.view.currentStart` pour obtenir le lundi affiché
- [ ] Ouvrir `#grille-modal-dup-week` avec la semaine source pré-remplie

### 3.4 — Modal de duplication de semaine
- [ ] Afficher le label de la semaine source (ex : "4 – 10 mai 2026")
- [ ] Si "Toutes les semaines de l'année" coché : désactiver le champ de semaine cible
- [ ] Calculer les 52 lundis de l'année en JS (utilitaire `getWeekStarts(year)`)
- [ ] Sur succès : si les nouveaux events tombent dans la vue actuelle, les ajouter via `calendar.addEvent`
- [ ] Fonctions AJAX : `ajaxDuplicateWeek` et `ajaxDuplicateWeekToYear`

### 3.5 — Bouton ⧉ duplication de jour (adapter)
- [ ] Le bouton dans les headers de colonnes envoie maintenant la vraie date (`arg.date`)
- [ ] La modal de duplication de jour utilise des dates (`targetDates[]`) à la place de weekdays
  - Proposition UX : checkboxes des 6 autres jours de la semaine affichée (labels : lundi 4 mai, mardi 5 mai, etc.)

### 3.6 — Mise à jour `ajaxSaveSlot`
- [ ] Envoyer `date` au lieu de `weekday` + `semaine`
- [ ] Supprimer l'envoi de `semaine`

---

## Phase 4 — CSS (`grille-admin.css`)
- [ ] Supprimer les styles de `#grille-week-toolbar` et `#grille-week-select`
- [ ] Conserver / adapter les styles de `#grille-modal-dup-week` pour la version datée

---

## Phase 5 — GraphQL (`class-grille-graphql.php`)
- [ ] Remplacer les champs `weekday` et `semaine` par `date` (string `YYYY-MM-DD`)
- [ ] Mettre à jour la query `grilleSlots` :
  - Supprimer les args `weekday` et `semaine`
  - Ajouter arg `dateDebut` (String) → filtre `date >= dateDebut`
  - Ajouter arg `dateFin` (String) → filtre `date <= dateFin`
  - Exemple : `grilleSlots(dateDebut: "2026-05-04", dateFin: "2026-05-10")`

---

## Queries GraphQL côté Next.js (à mettre à jour après)
```graphql
# Grille d'une semaine précise
query GetGrilleWeek {
    grilleSlots(dateDebut: "2026-05-04", dateFin: "2026-05-10") {
        id
        date
        heureDebut
        heureFin
        emission { title slug uri featuredImage { node { sourceUrl } } }
    }
}
```

---

## Points d'attention

- La migration des données existantes (posts avec `weekday` + `semaine`) n'est pas automatique.
  Les slots existants devront être recréés ou migrés manuellement (script de migration si nécessaire).
- Le meta `date` stocké en `YYYY-MM-DD` permet des requêtes `meta_compare` (`>=`, `<=`, `BETWEEN`) natives WordPress.
- `duplicate_week_to_year` peut créer jusqu'à 51 × N slots (N = nb créneaux dans la semaine source) en une seule requête — prévoir un timeout généreux côté AJAX ou traitement par batch.
- Côté Next.js, `date` + `heureDebut`/`heureFin` permettent de construire des objets `Date` ou `dayjs` sans ambiguïté.
