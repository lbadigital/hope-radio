# Page grille sur le frontend
*** UI *** 
![ui-grille-page](ui-grille-page.png)
## Objectif
Afficher toutes les émissions dans la grille du programme.
Les emissions sont organisées par jour de la semaine, et filtrable par des boutons de type "Lundi, Mardi, Mercredi, etc.".

## Composition de la page grille
* background de la page : #310C52
* le contenu est dans un `.container`
* Grand titre h1 "Grille des programmes"
```css
color: #FFF;
text-align: center;

/* H2 */
font-family: "Copyright Radosaw ukasiewicz, radluka.com";
font-size: 88px;
font-style: normal;
font-weight: 900;
line-height: 90%; /* 79.2px */
```
* Filtre de sélection du jour de la semaine : boutons "Lundi, Mardi, Mercredi, etc."
* Css d'un bouton de filtre :
```css
display: flex;
padding: 5px 30px;
justify-content: center;
align-items: center;
gap: 10px;
flex-shrink: 0;
border-radius: 40px;
border: 1px solid #FFF;
```
* Le bouton de filtre selectionné a un background blanc et un texte violet #310C52

## Liste des émissions
* Affichage en grille responsive : 1 colonne
* Une émission est représentée par une carte avec :
  * Image de l'émission
  ```css
  border-radius: 20px;
```
  * Horaire de l'émission
  ```
  css
  color: #72004A;
    /* H5 */
    font-family: "Copyright Radosaw ukasiewicz, radluka.com";
    font-size: 28px;
    font-style: normal;
    font-weight: 900;
    line-height: 110%; /* 30.8px */
  ```
  * Titre de l'émission : 
    ```css
    color: #31251A;
    
    /* H4 */
    font-family: "Copyright Radosaw ukasiewicz, radluka.com";
    font-size: 48px;
    font-style: normal;
    font-weight: 900;
    line-height: 83%; /* 39.84px */
    ```
  * Nom de l'animateur·rice :
    ```css
    color: #31251A;
    /* Small text LABEL */
    font-family: "Gravesend Sans";
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 124%; /* 17.36px */
    ```
  * Extrait : 
  ```css
    color: #31251A;
    font-family: Poppins;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 25px; /* 208.333% */
    text-transform: capitalize;
    ```
  * Bouton plus de détails : fond blanc

## Responsive
Sur desktop un item d'émission est sur 2 colonnes : une pour l'image, une pour le contenu textuel (horaire, titre, animateur·rice, extrait, bouton).
Sur mobile, l'image est au dessus du contenu textuel, et prend toute la largeur de l'écran.
sur desktop le conteneur d'une émission a le style suivant : 
```
css
display: flex;
width: 649px;
height: 399px;
padding: 60px;
flex-direction: column;
justify-content: center;
align-items: flex-start;
gap: 20px;
flex-shrink: 0;
```

en mobile, le conteneur a une height automatique

## Source de données
Les émissions de la grille sont récupérées via **WPGraphQL**.

La query existante `GET_GRILLE_SLOTS` dans `frontend/graphql/grille.ts` (utilisée par `DecouvrirSection`) sert de base. Elle doit être étendue avec `slotDate` (jour de la semaine) et les animateurs.

### Champs GraphQL à fetcher

```graphql
query GetGrilleSlots($dateDebut: String!, $dateFin: String!) {
  grilleSlots(dateDebut: $dateDebut, dateFin: $dateFin) {
    slotDate        # date YYYY-MM-DD — pour filtrer par jour
    heureDebut
    heureFin
    emission {
      title
      uri
      excerpt
      featuredImage { node { sourceUrl altText } }
      animateurs {
        nodes {
          prenom    # champ ACF du CPT animateur
          nom       # champ ACF du CPT animateur
        }
      }
    }
  }
}
```

### Structure des données côté WordPress
- `animateurs` est un champ ACF de type `relationship` sur le CPT `emission`, lié au CPT `animateur`
- Le CPT `animateur` expose ses champs ACF (`prenom`, `nom`, `fonction`, `photo`…) automatiquement via **WPGraphQL for ACF**
- Les deux CPTs sont enregistrés avec `show_in_graphql: true` (`wordpress/themes/hope-radio/inc/post-types.php`)

## Ce qu'il ne faut pas faire
* Insérer des styles css en dur dans les composants React (pas de `style={}`) — tous les styles doivent être migrés vers Tailwind CSS.
* Utiliser des classes CSS personnalisées dans les composants React — tous les styles doivent être migrés vers Tailwind CSS, et les classes CSS personnalisées doivent être supprimées une fois migrées