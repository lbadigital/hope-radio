<?php

if (!function_exists('acf_add_local_field_group')) {
    return;
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
    'title'  => 'Icône — Top Menu',
    'fields' => [
        [
            'key'           => 'field_top_menu_item_icone',
            'label'         => 'Icône',
            'name'          => 'icone',
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
    'title'  => 'Icône — Réseaux sociaux',
    'fields' => [
        [
            'key'           => 'field_reseaux_menu_item_icone',
            'label'         => 'Icône',
            'name'          => 'icone',
            'type'          => 'image',
            'return_format' => 'array',
            'preview_size'  => 'thumbnail',
        ],
    ],
    'location' => [
        [['param' => 'nav_menu_item', 'operator' => '==', 'value' => 'all']],
    ],
]);
