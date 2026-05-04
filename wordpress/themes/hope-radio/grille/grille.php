<?php

require_once __DIR__ . '/class-grille-cpt.php';
require_once __DIR__ . '/class-grille-graphql.php';
require_once __DIR__ . '/class-grille-admin.php';
require_once __DIR__ . '/class-grille-ajax.php';
require_once __DIR__ . '/class-grille-emission-meta.php';

(new Grille_CPT())->init();
(new Grille_GraphQL())->init();
(new Grille_Admin())->init();
(new Grille_Ajax())->init();
(new Grille_Emission_Meta())->init();
