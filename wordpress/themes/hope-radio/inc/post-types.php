<?php

add_action('init', function () {
    register_post_type('emission', [
        'labels' => [
            'name'               => __('Émissions', 'hope-radio'),
            'singular_name'      => __('Émission', 'hope-radio'),
            'add_new_item'       => __('Ajouter une émission', 'hope-radio'),
            'edit_item'          => __("Modifier l'émission", 'hope-radio'),
            'not_found'          => __('Aucune émission trouvée', 'hope-radio'),
            'not_found_in_trash' => __('Aucune émission dans la corbeille', 'hope-radio'),
        ],
        'public'              => true,
        'has_archive'         => true,
        'rewrite'             => ['slug' => 'emissions'],
        'supports'            => ['title', 'editor', 'thumbnail'],
        'menu_icon'           => 'dashicons-microphone',
        'show_in_rest'        => true,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'emission',
        'graphql_plural_name' => 'emissions',
    ]);

    register_post_type('animateur', [
        'labels' => [
            'name'               => __('Animateurs', 'hope-radio'),
            'singular_name'      => __('Animateur', 'hope-radio'),
            'add_new_item'       => __('Ajouter un animateur', 'hope-radio'),
            'edit_item'          => __("Modifier l'animateur", 'hope-radio'),
            'not_found'          => __('Aucun animateur trouvé', 'hope-radio'),
            'not_found_in_trash' => __('Aucun animateur dans la corbeille', 'hope-radio'),
        ],
        'public'              => true,
        'has_archive'         => true,
        'rewrite'             => ['slug' => 'animateurs'],
        'supports'            => ['title', 'thumbnail'],
        'menu_icon'           => 'dashicons-admin-users',
        'show_in_rest'        => true,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'animateur',
        'graphql_plural_name' => 'animateurs',
    ]);

    register_post_type('podcast', [
        'labels' => [
            'name'               => __('Podcasts', 'hope-radio'),
            'singular_name'      => __('Podcast', 'hope-radio'),
            'add_new_item'       => __('Ajouter un podcast', 'hope-radio'),
            'edit_item'          => __('Modifier le podcast', 'hope-radio'),
            'not_found'          => __('Aucun podcast trouvé', 'hope-radio'),
            'not_found_in_trash' => __('Aucun podcast dans la corbeille', 'hope-radio'),
        ],
        'public'              => true,
        'has_archive'         => true,
        'rewrite'             => ['slug' => 'podcasts'],
        'supports'            => ['title', 'editor', 'thumbnail'],
        'menu_icon'           => 'dashicons-format-audio',
        'show_in_rest'        => true,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'podcast',
        'graphql_plural_name' => 'podcasts',
    ]);

    register_post_type('agenda', [
        'labels' => [
            'name'               => __('Agenda', 'hope-radio'),
            'singular_name'      => __('Événement', 'hope-radio'),
            'add_new_item'       => __('Ajouter un événement', 'hope-radio'),
            'edit_item'          => __("Modifier l'événement", 'hope-radio'),
            'not_found'          => __('Aucun événement trouvé', 'hope-radio'),
            'not_found_in_trash' => __('Aucun événement dans la corbeille', 'hope-radio'),
        ],
        'public'              => true,
        'has_archive'         => true,
        'rewrite'             => ['slug' => 'agenda'],
        'supports'            => ['title', 'editor', 'thumbnail'],
        'menu_icon'           => 'dashicons-calendar-alt',
        'show_in_rest'        => true,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'agendaItem',
        'graphql_plural_name' => 'agendaItems',
    ]);
});
