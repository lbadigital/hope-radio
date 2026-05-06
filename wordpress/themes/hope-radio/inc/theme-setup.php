<?php


// Configuration du thème
add_action('after_setup_theme', 'after_setup_theme_hope_radio');

// Autoriser l'upload de svg
add_filter('upload_mimes', 'add_file_types_to_uploads');


function after_setup_theme_hope_radio() {
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('title-tag');

    register_nav_menus([
        'main-menu'      => __('Menu principal', 'hope-radio'),
        'secondary-menu' => __('Top menu', 'hope-radio'),
        'reseaux-sociaux' => __('Réseaux sociaux', 'hope-radio'),
    ]);
}

// Ajoute un contrôle Customizer pour le logo des pages internes
add_action('customize_register', function (WP_Customize_Manager $wp_customize) {
    $wp_customize->add_setting('logo_interne', [
        'default'           => '',
        'sanitize_callback' => 'absint',
        'transport'         => 'refresh',
    ]);

    $wp_customize->add_control(new WP_Customize_Media_Control($wp_customize, 'logo_interne', [
        'label'       => __('Logo — pages internes (fond blanc)', 'hope-radio'),
        'description' => __('Version sombre du logo, affichée sur les pages internes où le header est blanc.', 'hope-radio'),
        'section'     => 'title_tagline',
        'mime_type'   => 'image',
        'priority'    => 9,
    ]));
});

// Expose le logo du customizer via WPGraphQL
add_action('graphql_register_types', function () {
    register_graphql_object_type('SiteLogo', [
        'description' => 'Logo du site',
        'fields'      => [
            'sourceUrl' => ['type' => 'String'],
            'altText'   => ['type' => 'String'],
        ],
    ]);

    register_graphql_field('RootQuery', 'customLogo', [
        'type'        => 'SiteLogo',
        'description' => 'Logo du site défini dans Apparence > Personnaliser',
        'resolve'     => function () {
            $logo_id = get_theme_mod('custom_logo');
            if (!$logo_id) return null;

            $src = wp_get_attachment_url($logo_id);
            $alt = get_post_meta($logo_id, '_wp_attachment_image_alt', true);

            return [
                'sourceUrl' => $src ?: null,
                'altText'   => $alt ?: null,
            ];
        },
    ]);

    register_graphql_field('RootQuery', 'customLogoInterne', [
        'type'        => 'SiteLogo',
        'description' => 'Logo des pages internes (fond blanc) défini dans Apparence > Personnaliser',
        'resolve'     => function () {
            $logo_id = get_theme_mod('logo_interne');
            if (!$logo_id) return null;

            $src = wp_get_attachment_url($logo_id);
            $alt = get_post_meta($logo_id, '_wp_attachment_image_alt', true);

            return [
                'sourceUrl' => $src ?: null,
                'altText'   => $alt ?: null,
            ];
        },
    ]);
});

function add_file_types_to_uploads($file_types){
    $new_filetypes = array();
    $new_filetypes['svg'] = 'image/svg+xml';
    $file_types = array_merge($file_types, $new_filetypes );
    return $file_types;
}
