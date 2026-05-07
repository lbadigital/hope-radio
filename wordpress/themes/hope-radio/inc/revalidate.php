<?php

add_action('transition_post_status', function (string $new_status, string $old_status, WP_Post $post): void {
    if ($new_status !== 'publish' && $old_status !== 'publish') {
        return;
    }

    $frontend_url   = function_exists('get_field') ? (get_field('next_frontend_url', 'option') ?: '') : '';
    $revalidate_key = defined('REVALIDATE_SECRET_KEY') ? REVALIDATE_SECRET_KEY : '';

    if (!$frontend_url || !$revalidate_key) {
        return;
    }

    wp_remote_post(trailingslashit($frontend_url) . 'api/revalidate', [
        'timeout'  => 5,
        'blocking' => false,
        'headers'  => [
            'Content-Type'        => 'application/json',
            'x-revalidate-secret' => $revalidate_key,
        ],
        'body' => wp_json_encode(['postType' => $post->post_type]),
    ]);
}, 10, 3);
