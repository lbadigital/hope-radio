<?php

class Grille_CPT {

    public function init(): void {
        add_action('init', [$this, 'register_post_type']);
        add_action('init', [$this, 'register_metas']);
    }

    public function register_post_type(): void {
        register_post_type('grille_slot', [
            'labels'              => [
                'name'          => 'Créneaux',
                'singular_name' => 'Créneau',
            ],
            'public'              => false,
            'show_ui'             => false,
            'show_in_nav_menus'   => false,
            'show_in_rest'        => false,
            'show_in_graphql'     => true,
            'graphql_single_name' => 'grilleSlot',
            'graphql_plural_name' => 'allGrilleSlots',
            'supports'            => ['title'],
        ]);
    }

    public function register_metas(): void {
        $args = [
            'show_in_rest'    => false,
            'show_in_graphql' => false,
            'single'          => true,
        ];

        register_post_meta('grille_slot', 'date',        array_merge($args, ['type' => 'string']));
        register_post_meta('grille_slot', 'heure_debut', array_merge($args, ['type' => 'string']));
        register_post_meta('grille_slot', 'heure_fin',   array_merge($args, ['type' => 'string']));
        register_post_meta('grille_slot', 'emission_id', array_merge($args, ['type' => 'integer']));
    }
}
