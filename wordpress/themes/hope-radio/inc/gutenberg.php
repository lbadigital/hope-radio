<?php

add_filter('allowed_block_types_all', function ($allowed_blocks, $editor_context) {
    return [
        'core/paragraph',
        'core/heading',
        'core/image',
        'core/list',
        'core/quote',
        'core/embed',
        'core/audio',
        'core/separator',
        'core/columns',
        'core/group',
    ];
}, 10, 2);

/**
 * Désactive l'éditeur de blocs sur les CPTs administrés exclusivement via ACF.
 * Le post type natif "post" conserve Gutenberg avec les restrictions ci-dessus.
 */
add_filter('use_block_editor_for_post_type', function ($use_block_editor, $post_type) {
    $cpts_without_gutenberg = ['emission', 'animateur', 'podcast', 'agenda'];
    if (in_array($post_type, $cpts_without_gutenberg, true)) {
        return false;
    }
    return $use_block_editor;
}, 10, 2);
