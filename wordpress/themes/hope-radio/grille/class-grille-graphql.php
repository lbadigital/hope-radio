<?php

class Grille_GraphQL {

    public function init(): void {
        add_action('graphql_register_types', [$this, 'register_fields']);
    }

    public function register_fields(): void {
        register_graphql_fields('GrilleSlot', [
            'slotDate' => [
                'type'        => 'String',
                'description' => 'Date du créneau au format YYYY-MM-DD',
                'resolve'     => function ($post) {
                    return get_post_meta($post->ID, 'date', true) ?: null;
                },
            ],
            'heureDebut' => [
                'type'        => 'String',
                'description' => 'Heure de début au format HH:MM',
                'resolve'     => function ($post) {
                    return get_post_meta($post->ID, 'heure_debut', true) ?: null;
                },
            ],
            'heureFin' => [
                'type'        => 'String',
                'description' => 'Heure de fin au format HH:MM',
                'resolve'     => function ($post) {
                    return get_post_meta($post->ID, 'heure_fin', true) ?: null;
                },
            ],
            'emission' => [
                'type'        => 'Emission',
                'description' => 'Émission associée à ce créneau',
                'resolve'     => function ($post) {
                    $emission_id = (int) get_post_meta($post->ID, 'emission_id', true);
                    if (!$emission_id) return null;
                    $emission = get_post($emission_id);
                    if (!$emission || $emission->post_status !== 'publish') return null;
                    return new \WPGraphQL\Model\Post($emission);
                },
            ],
        ]);

        register_graphql_field('RootQuery', 'grilleSlots', [
            'type'        => ['list_of' => 'GrilleSlot'],
            'description' => 'Créneaux de la grille, filtrables par plage de dates.',
            'args'        => [
                'dateDebut' => [
                    'type'        => 'String',
                    'description' => 'Date de début au format YYYY-MM-DD (incluse)',
                ],
                'dateFin' => [
                    'type'        => 'String',
                    'description' => 'Date de fin au format YYYY-MM-DD (incluse)',
                ],
            ],
            'resolve' => function ($root, $args) {
                $query_args = [
                    'post_type'      => 'grille_slot',
                    'post_status'    => 'publish',
                    'posts_per_page' => -1,
                    'orderby'        => 'meta_value',
                    'meta_key'       => 'date',
                    'order'          => 'ASC',
                ];

                if (isset($args['dateDebut']) || isset($args['dateFin'])) {
                    $date_debut = $args['dateDebut'] ?? '0000-01-01';
                    $date_fin   = $args['dateFin']   ?? '9999-12-31';

                    $query_args['meta_query'] = [[
                        'key'     => 'date',
                        'value'   => [$date_debut, $date_fin],
                        'compare' => 'BETWEEN',
                        'type'    => 'DATE',
                    ]];
                }

                return get_posts($query_args) ?: [];
            },
        ]);
    }
}
