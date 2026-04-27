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
    register_graphql_field('RootQuery', 'customLogo', [
        'type'        => 'MediaItem',
        'description' => 'Logo du site défini dans Apparence > Personnaliser',
        'resolve'     => function () {
            $logo_id = get_theme_mod('custom_logo');
            if (!$logo_id) return null;
            return get_post($logo_id);
        },
    ]);
});

function add_file_types_to_uploads($file_types){
    $new_filetypes = array();
    $new_filetypes['svg'] = 'image/svg+xml';
    $file_types = array_merge($file_types, $new_filetypes );
    return $file_types;
}
