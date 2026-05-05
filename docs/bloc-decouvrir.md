# Section découvrir sur la partie frontend
## Objectif 
Ce bloc affiche les émissions qui vont se passer aujourd'hui

## Qu'est ce qu'il faut faire
* Récupérer la date courante
* Comparer le jour, mois, année et récupérer quelles émissions sont programmées pour aujourd'hui
* Récupérer les données de chaque émission via cette liste via wpgraphql
* Afficher les émissions en respectant l'UI ![decouvrir.png](decouvrir.png) dans un composant `DecouvrirSection`
* Le style du grand titre est identique à celui du titre `h2` dans le composant `ActualitesSection``
* La couleur de fond de la section est la couleur pimaire `#720049`
* Le padding de la section est identique à `.actualites-section`
* *** Style des horaires sur l'image *** : les horaires affiche l'heure de début et l'heure de fin
```css
color: #FFF;
text-align: center;

/* H5 */
font-family: "Copyright Radosaw ukasiewicz, radluka.com";
font-size: 28px;
font-style: normal;
font-weight: 900;
line-height: 110%; /* 30.8px */
```
* *** Style du bloc parent des horaires *** : 
```css
display: flex;
padding: 15px 20px;
align-items: flex-start;
gap: 10px;
flex: 1 0 0;
```
* ***Titre d'un item *** : 
```css
color: #FFF;

/* Petit titre */
font-family: "Gravesend Sans Bold";
font-size: 20px;
font-style: normal;
font-weight: 700;
line-height: 110%; /* 22px */
```
* ***Nom de la catégorie de l'item*** : 
```css
color: #E45612;

/* Small text LABEL */
font-family: "Gravesend Sans";
font-size: 14px;
font-style: normal;
font-weight: 700;
line-height: 124%; /* 17.36px */
```

* ***Configuration du slider***
```css
autoplay:true
spaceBetween:20
slidesPerView:3 + 20% du quatrième item
```
* En mobile afficher un slide per view
* en tablette portrait 2 slides per view
* ***Style du bloc image d'un item***
```css
display: flex;
width: 368px;
height: 234px;
padding: 0 18px 19px 30px;
flex-direction: column;
align-items: flex-end;
gap: 1px;
```

## Ce qu'il ne faut pas faire
* Dupliquer les tyles déjà existants sur le site
