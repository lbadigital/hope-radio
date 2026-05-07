<?php

if (!function_exists('acf_add_local_field_group')) {
    return;
}

// ── Page d'options du thème ───────────────────────────────────────────────────
if (function_exists('acf_add_options_page')) {
    acf_add_options_page([
        'page_title' => 'Options du thème',
        'menu_title' => 'Options',
        'menu_slug'  => 'theme-options',
        'capability' => 'edit_posts',
        'redirect'   => false,
    ]);
}

acf_add_local_field_group([
    'key'      => 'group_emission',
    'title'    => "Informations de l'émission",
    'fields'   => [
        [
            'key'   => 'field_emission_theme',
            'label' => 'Thème',
            'name'  => 'theme',
            'type'  => 'text',
        ],
        [
            'key'   => 'field_emission_stream_url',
            'label' => 'URL du stream',
            'name'  => 'stream_url',
            'type'  => 'url',
        ],
        [
            'key'           => 'field_emission_animateurs',
            'label'         => 'Animateurs',
            'name'          => 'animateurs',
            'type'          => 'relationship',
            'post_type'     => ['animateur'],
            'filters'       => ['search'],
            'return_format' => 'object',
        ],
    ],
    'location' => [
        [['param' => 'post_type', 'operator' => '==', 'value' => 'emission']],
    ],
]);

acf_add_local_field_group([
    'key'    => 'group_animateur',
    'title'  => "Informations de l'animateur",
    'fields' => [
        [
            'key'      => 'field_animateur_prenom',
            'label'    => 'Prénom',
            'name'     => 'prenom',
            'type'     => 'text',
            'required' => 1,
        ],
        [
            'key'      => 'field_animateur_nom',
            'label'    => 'Nom',
            'name'     => 'nom',
            'type'     => 'text',
            'required' => 1,
        ],
        [
            'key'   => 'field_animateur_fonction',
            'label' => 'Fonction',
            'name'  => 'fonction',
            'type'  => 'text',
        ],
        [
            'key'     => 'field_animateur_bio',
            'label'   => 'Biographie',
            'name'    => 'bio',
            'type'    => 'wysiwyg',
            'toolbar' => 'basic',
            'tabs'    => 'visual',
        ],
        [
            'key'           => 'field_animateur_photo',
            'label'         => 'Photo',
            'name'          => 'photo',
            'type'          => 'image',
            'return_format' => 'array',
            'preview_size'  => 'medium',
        ],
        [
            'key'        => 'field_animateur_reseaux',
            'label'      => 'Réseaux sociaux',
            'name'       => 'reseaux_sociaux',
            'type'       => 'group',
            'layout'     => 'block',
            'sub_fields' => [
                [
                    'key'   => 'field_animateur_facebook',
                    'label' => 'Facebook',
                    'name'  => 'facebook',
                    'type'  => 'url',
                ],
                [
                    'key'   => 'field_animateur_instagram',
                    'label' => 'Instagram',
                    'name'  => 'instagram',
                    'type'  => 'url',
                ],
                [
                    'key'   => 'field_animateur_twitter',
                    'label' => 'Twitter / X',
                    'name'  => 'twitter',
                    'type'  => 'url',
                ],
                [
                    'key'   => 'field_animateur_youtube',
                    'label' => 'YouTube',
                    'name'  => 'youtube',
                    'type'  => 'url',
                ],
            ],
        ],
    ],
    'location' => [
        [['param' => 'post_type', 'operator' => '==', 'value' => 'animateur']],
    ],
]);

acf_add_local_field_group([
    'key'    => 'group_podcast',
    'title'  => 'Informations du podcast',
    'fields' => [
        [
            'key'           => 'field_podcast_fichier_audio',
            'label'         => 'Fichier audio',
            'name'          => 'fichier_audio',
            'type'          => 'file',
            'return_format' => 'array',
            'mime_types'    => 'mp3, m4a, ogg, wav',
        ],
        [
            'key'           => 'field_podcast_emission',
            'label'         => 'Émission associée',
            'name'          => 'emission',
            'type'          => 'relationship',
            'post_type'     => ['emission'],
            'filters'       => ['search'],
            'return_format' => 'object',
            'max'           => 1,
        ],
        [
            'key'          => 'field_podcast_duree',
            'label'        => 'Durée',
            'name'         => 'duree',
            'type'         => 'text',
            'instructions' => 'Ex : 1h30 ou 45 min',
        ],
        [
            'key'            => 'field_podcast_date_enregistrement',
            'label'          => "Date d'enregistrement",
            'name'           => 'date_enregistrement',
            'type'           => 'date_picker',
            'display_format' => 'd/m/Y',
            'return_format'  => 'Y-m-d',
        ],
    ],
    'location' => [
        [['param' => 'post_type', 'operator' => '==', 'value' => 'podcast']],
    ],
]);

acf_add_local_field_group([
    'key'    => 'group_agenda',
    'title'  => "Informations de l'événement",
    'fields' => [
        [
            'key'            => 'field_agenda_date_evenement',
            'label'          => "Date de l'événement",
            'name'           => 'date_evenement',
            'type'           => 'date_picker',
            'display_format' => 'd/m/Y',
            'return_format'  => 'Y-m-d',
            'required'       => 1,
        ],
        [
            'key'   => 'field_agenda_theme',
            'label' => 'Thème',
            'name'  => 'theme',
            'type'  => 'text',
        ],
        [
            'key'   => 'field_agenda_lien',
            'label' => 'Lien',
            'name'  => 'lien',
            'type'  => 'url',
        ],
    ],
    'location' => [
        [['param' => 'post_type', 'operator' => '==', 'value' => 'agenda']],
    ],
]);

// ── Mise en avant (hero slider) ──────────────────────────────────────────────
//
// Ce field group est exposé via WPGraphQL for ACF.
// Accès GraphQL : node { miseEnAvant { isMisEnAvant } }
// Utilisé pour filtrer les contenus affichés dans le HeroSlider.

acf_add_local_field_group([
    'key'                => 'group_mise_en_avant',
    'title'              => 'Mise en avant',
    'show_in_graphql'    => 1,
    'graphql_field_name' => 'miseEnAvant',
    'fields'             => [
        [
            'key'          => 'field_mise_en_avant',
            'label'        => 'Mettre en avant',
            'name'         => 'is_mis_en_avant',
            'type'         => 'true_false',
            'ui'           => 1,
            'ui_on_text'   => 'Oui',
            'ui_off_text'  => 'Non',
            'default_value' => 0,
            'show_in_graphql' => 1,
        ],
    ],
    'location' => [
        [['param' => 'post_type', 'operator' => '==', 'value' => 'emission']],
        [['param' => 'post_type', 'operator' => '==', 'value' => 'podcast']],
        [['param' => 'post_type', 'operator' => '==', 'value' => 'post']],
        [['param' => 'post_type', 'operator' => '==', 'value' => 'agenda']],
    ],
]);

// ── Promotions (bannières — option de thème) ─────────────────────────────────
//
// Les bannières sont gérées comme option de thème (non liées à un CPT).
// L'exposition GraphQL est faite manuellement via register_graphql_field
// car WPGraphQL for ACF ne supporte pas nativement les options pages avec
// des répéteurs complexes.

acf_add_local_field_group([
    'key'      => 'group_promotions',
    'title'    => 'Promotions',
    'fields'   => [
        [
            'key'   => 'field_tab_promotions',
            'label' => 'Promotions',
            'type'  => 'tab',
        ],
        [
            'key'        => 'field_bannieres',
            'label'      => 'Bannières',
            'name'       => 'bannieres',
            'type'       => 'repeater',
            'layout'     => 'block',
            'sub_fields' => [
                [
                    'key'      => 'field_banniere_titre',
                    'label'    => 'Titre',
                    'name'     => 'titre',
                    'type'     => 'text',
                    'required' => 1,
                ],
                [
                    'key'   => 'field_banniere_sous_titre',
                    'label' => 'Sous titre',
                    'name'  => 'sous_titre',
                    'type'  => 'text',
                ],
                [
                    'key'        => 'field_banniere_images',
                    'label'      => 'Images de fond',
                    'name'       => 'images',
                    'type'       => 'group',
                    'layout'     => 'block',
                    'sub_fields' => [
                        [
                            'key'           => 'field_banniere_image_desktop',
                            'label'         => 'Desktop',
                            'name'          => 'desktop',
                            'type'          => 'image',
                            'return_format' => 'array',
                            'preview_size'  => 'medium',
                            'required'      => 1,
                        ],
                        [
                            'key'           => 'field_banniere_image_mobile',
                            'label'         => 'Mobile (optionnel)',
                            'name'          => 'mobile',
                            'type'          => 'image',
                            'return_format' => 'array',
                            'preview_size'  => 'medium',
                            'required'      => 0,
                        ],
                    ],
                ],
                [
                    'key'   => 'field_banniere_lien',
                    'label' => 'Lien',
                    'name'  => 'lien',
                    'type'  => 'url',
                ],
            ],
        ],
    ],
    'location' => [
        [['param' => 'options_page', 'operator' => '==', 'value' => 'theme-options']],
    ],
]);

// Expose les animateurs d'une émission via un resolver explicite.
// ACF relationship → liste plate AnimateurBasic { prenom nom }.
add_action('graphql_register_types', function () {
    register_graphql_object_type('AnimateurBasic', [
        'description' => 'Animateur simplifié (prénom + nom) pour la grille',
        'fields'      => [
            'prenom' => ['type' => 'String'],
            'nom'    => ['type' => 'String'],
        ],
    ]);

    register_graphql_field('Emission', 'animateurs', [
        'type'        => ['list_of' => 'AnimateurBasic'],
        'description' => 'Animateurs liés à cette émission',
        'resolve'     => function ($emission) {
            $items = get_field('animateurs', $emission->databaseId);
            if (empty($items) || !is_array($items)) return [];
            return array_map(function ($a) {
                return [
                    'prenom' => get_field('prenom', $a->ID) ?? '',
                    'nom'    => get_field('nom', $a->ID)    ?? '',
                ];
            }, $items);
        },
    ]);
});

// WPGraphQL for ACF ne sait pas résoudre les champs sur MenuItem.
// On enregistre les champs directement via l'API WPGraphQL avec un resolver explicite.
add_action('graphql_register_types', function () {
    register_graphql_object_type('MenuItemIcon', [
        'fields' => [
            'sourceUrl' => ['type' => 'String'],
            'altText'   => ['type' => 'String'],
        ],
    ]);

    register_graphql_field('MenuItem', 'topMenuIcon', [
        'type'    => 'MenuItemIcon',
        'resolve' => function ($menu_item) {
            $image = get_field('icone', $menu_item->databaseId);
            if (empty($image)) return null;
            return [
                'sourceUrl' => $image['url'] ?? null,
                'altText'   => $image['alt'] ?? null,
            ];
        },
    ]);

    register_graphql_field('MenuItem', 'topMenuIconInterne', [
        'type'    => 'MenuItemIcon',
        'resolve' => function ($menu_item) {
            $image = get_field('icone_interne', $menu_item->databaseId);
            if (empty($image)) return null;
            return [
                'sourceUrl' => $image['url'] ?? null,
                'altText'   => $image['alt'] ?? null,
            ];
        },
    ]);

    register_graphql_field('MenuItem', 'reseauxMenuIcon', [
        'type'    => 'MenuItemIcon',
        'resolve' => function ($menu_item) {
            $image = get_field('icone', $menu_item->databaseId);
            if (empty($image)) return null;
            return [
                'sourceUrl' => $image['url'] ?? null,
                'altText'   => $image['alt'] ?? null,
            ];
        },
    ]);
});

// Expose les bannières promotionnelles via WPGraphQL.
// Le resolver lit get_field('bannieres', 'option') et mappe chaque item
// du répéteur ACF vers le type BanniereItem.
add_action('graphql_register_types', function () {
    register_graphql_object_type('BanniereImage', [
        'description' => 'Image de bannière avec URL et texte alternatif',
        'fields'      => [
            'sourceUrl' => ['type' => 'String'],
            'altText'   => ['type' => 'String'],
        ],
    ]);

    register_graphql_object_type('BanniereImages', [
        'description' => 'Images de fond de la bannière (desktop + mobile optionnel)',
        'fields'      => [
            'desktop' => ['type' => 'BanniereImage'],
            'mobile'  => ['type' => 'BanniereImage'],
        ],
    ]);

    register_graphql_object_type('BanniereItem', [
        'description' => 'Élément de bannière promotionnelle',
        'fields'      => [
            'titre'     => ['type' => 'String'],
            'sousTitre' => ['type' => 'String'],
            'images'    => ['type' => 'BanniereImages'],
            'lien'      => ['type' => 'String'],
        ],
    ]);

    register_graphql_field('RootQuery', 'bannieres', [
        'type'        => ['list_of' => 'BanniereItem'],
        'description' => 'Liste des bannières promotionnelles gérées via Options du thème',
        'resolve'     => function () {
            $rows = get_field('bannieres', 'option');
            if (empty($rows) || !is_array($rows)) return [];

            return array_map(function ($row) {
                $desktop = $row['images']['desktop'] ?? null;
                $mobile  = $row['images']['mobile']  ?? null;
                return [
                    'titre'     => $row['titre']      ?? null,
                    'sousTitre' => $row['sous_titre']  ?? null,
                    'images'    => [
                        'desktop' => $desktop ? ['sourceUrl' => $desktop['url'] ?? null, 'altText' => $desktop['alt'] ?? ''] : null,
                        'mobile'  => $mobile  ? ['sourceUrl' => $mobile['url']  ?? null, 'altText' => $mobile['alt']  ?? ''] : null,
                    ],
                    'lien'      => $row['lien'] ?? null,
                ];
            }, $rows);
        },
    ]);
});

// Scope each group to its target menu.
// Uses location assignment when available, falls back to menu slug.
// The 4th param ($field_group) is required to identify which group is being matched.
add_filter('acf/location/rule_match/nav_menu_item', function ($match, $rule, $screen, $field_group) {
    $scoped = ['group_top_menu_item', 'group_reseaux_menu_item'];
    if (!isset($field_group['key']) || !in_array($field_group['key'], $scoped, true)) {
        return $match;
    }

    $nav_menu_id = (int) acf_get_data('nav_menu_id');
    if (!$nav_menu_id && isset($_REQUEST['menu'])) {
        $nav_menu_id = (int) $_REQUEST['menu'];
    }
    if (!$nav_menu_id) return $match;

    $locations = get_nav_menu_locations();
    $menu      = wp_get_nav_menu_object($nav_menu_id);
    if (!$menu) return false;

    if ($field_group['key'] === 'group_top_menu_item') {
        $by_location = isset($locations['secondary-menu']) && (int) $locations['secondary-menu'] === $nav_menu_id;
        return $by_location || $menu->slug === 'top-menu';
    }

    if ($field_group['key'] === 'group_reseaux_menu_item') {
        $by_location = isset($locations['reseaux-sociaux']) && (int) $locations['reseaux-sociaux'] === $nav_menu_id;
        return $by_location || $menu->slug === 'reseaux-sociaux';
    }

    return $match;
}, 10, 4);

acf_add_local_field_group([
    'key'    => 'group_top_menu_item',
    'title'  => 'Icônes — Top Menu',
    'fields' => [
        [
            'key'           => 'field_top_menu_item_icone',
            'label'         => 'Icône (header transparent)',
            'name'          => 'icone',
            'type'          => 'image',
            'return_format' => 'array',
            'preview_size'  => 'thumbnail',
        ],
        [
            'key'           => 'field_top_menu_item_icone_interne',
            'label'         => 'Icône — pages internes (header blanc)',
            'name'          => 'icone_interne',
            'type'          => 'image',
            'return_format' => 'array',
            'preview_size'  => 'thumbnail',
        ],
    ],
    'location' => [
        [['param' => 'nav_menu_item', 'operator' => '==', 'value' => 'all']],
    ],
]);

acf_add_local_field_group([
    'key'    => 'group_reseaux_menu_item',
    'title'  => 'Icônes — Réseaux sociaux',
    'fields' => [
        [
            'key'           => 'field_reseaux_menu_item_icone',
            'label'         => 'Icône (header transparent)',
            'name'          => 'icone',
            'type'          => 'image',
            'return_format' => 'array',
            'preview_size'  => 'thumbnail',
        ],
        [
            'key'           => 'field_reseaux_menu_item_icone_interne',
            'label'         => 'Icône — pages internes (header blanc)',
            'name'          => 'icone_interne',
            'type'          => 'image',
            'return_format' => 'array',
            'preview_size'  => 'thumbnail',
        ],
    ],
    'location' => [
        [['param' => 'nav_menu_item', 'operator' => '==', 'value' => 'all']],
    ],
]);
