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

            error_log('[customLogo] id=' . $logo_id . ' src=' . ($src ?: 'FALSE'));

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
