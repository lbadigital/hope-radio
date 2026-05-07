## Page émissions
Cette page affiche toutes les émissionss.

## Structure
La page émission a la même structure que la page grille `app/grille/page.tsx` à la différence qu'on filtre les émissions par catégorie.

## Style supplémentaires
* le background de la page émission : #E35711 (secondary color)
* le filtre actif a un background white et couleur : #E35711
* le titre de la page est émission

## Filtre
Filtrer les émissions par catégories et ajouter un bouton supplémentaire `Toutes` au début pour afficher toutes les émissions au début

## Sources de données
On récupère les données via wpgraphql des émissions

## Ce qu'il ne faut pas faire
* Dupliquer les composants, il faut extraire les structures répétitives et les réutiliser (comme la card grille qui est réutilisable dans émissions)

## Ce qu'il faut faire
* Implémenter un lazy scroll pour éviter de surcharger la page et pour optimiser le chargement, on affichera 4 émissions au début (filtre `Toutes`)

