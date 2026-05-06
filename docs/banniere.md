# Composant Bannière
## Objectif
Afficher une slide de bannière dans un composant, ce composant peut-être utilisé n'importe ou dans le site.

## UI
![banniere](banniere.png)

## Backoffice
Dans le backoffice, il s'agit de créer une option de thème à partir d'ACF avec un onglet "Promotions"
L'onglet "Promotions" contient une répétition de champs "Bannière" avec les champs suivants :
* Titre (champ texte)
* Sous titre (champ texte)
* Image de fond (champ image) pour desktop, et un champ image de fond pour mobile (optionnel, si non renseigné on utilise l'image desktop) dans un seul groupe de champ
* Lien (champ URL), le lien peut-être interne ou externe

## Comment récupérer les données
Pour récupérer les données, exposer l'option de thème via WPGraphQL en utilisant `register_graphql_field` dans le fichier `inc/acf-fields.php`. Le champ doit être de type liste pour pouvoir récupérer toutes les bannières.

## Frontend
Dans le frontend, il s'agit de créer un composant qui consomme les données de cette option de thème et qui affiche une slide de bannière. 
Le composant doit être réutilisable n'importe ou dans le site.
Le composant affiche un item à la fois
La pagination du slide est aligné à droite en desktop, au centre en dessous du bouton en mobile tout en respectant les espaces

## Design
Selon l'ordre ci-dessous afficher les elements de la bannière :
* Image de fond utilisant la balise `<Image>` de Next.js
* Sous titre aligné à gauche
```css
color: #FFF;

/* Small text LABEL */
font-family: "Gravesend Sans";
font-size: 14px;
font-style: normal;
font-weight: 700;
line-height: 124%; /* 17.36px */
```
* Titre aligné à gauche
```css
color: #FFF;

/* H2 */
font-family: "Copyright Radosaw ukasiewicz, radluka.com";
font-size: 88px;
font-style: normal;
font-weight: 900;
line-height: 90%; /* 79.2px */
```
* Bouton de fond blanc centré horizontalement (si lien exterieur utilise un lien de type `<a>` avec `target="_blank"` sinon un lien de type `<Link>` de Next.js)

## En responsive
En mobile uniquement les contenus sont centrés : 
* Background image centrée
* Sous titre aligné au centre
* Titre aligné au centre
* Bouton de fond blanc centré horizontalement

## Points de vigilance
* Le composant doit être responsive et s'adapter à toutes les tailles d'écran.
* Le composant doit être accessible et respecter les bonnes pratiques d'accessibilité.
* Le composant doit être performant et ne pas ralentir le chargement de la page.