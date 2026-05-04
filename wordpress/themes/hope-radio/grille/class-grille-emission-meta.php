<?php

class Grille_Emission_Meta {

    const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    public function init(): void {
        add_action('add_meta_boxes', [$this, 'register_meta_box']);
    }

    public function register_meta_box(): void {
        add_meta_box(
            'grille-emission-slots',
            'Créneaux dans la grille',
            [$this, 'render'],
            'emission',
            'side',
            'default'
        );
    }

    public function render(\WP_Post $post): void {
        $slots = get_posts([
            'post_type'      => 'grille_slot',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'orderby'        => 'meta_value_num',
            'meta_key'       => 'weekday',
            'order'          => 'ASC',
            'meta_query'     => [[
                'key'     => 'emission_id',
                'value'   => $post->ID,
                'compare' => '=',
                'type'    => 'NUMERIC',
            ]],
        ]);

        $grille_url = admin_url('admin.php?page=hope-radio-grille');

        if (empty($slots)) {
            echo '<p style="margin:0 0 8px;color:#666;">Aucun créneau configuré.</p>';
            printf(
                '<a href="%s" style="font-size:12px;">Gérer la grille →</a>',
                esc_url($grille_url)
            );
            return;
        }

        echo '<ul style="margin:0 0 8px;padding:0;list-style:none;">';
        foreach ($slots as $slot) {
            $weekday    = (int) get_post_meta($slot->ID, 'weekday', true);
            $heure_debut = get_post_meta($slot->ID, 'heure_debut', true);
            $heure_fin   = get_post_meta($slot->ID, 'heure_fin', true);
            $jour        = self::JOURS[$weekday] ?? '—';
            printf(
                '<li style="padding:4px 0;border-bottom:1px solid #eee;font-size:12px;">%s — %s – %s</li>',
                esc_html($jour),
                esc_html($heure_debut),
                esc_html($heure_fin)
            );
        }
        echo '</ul>';
        printf(
            '<a href="%s" style="font-size:12px;">Gérer la grille →</a>',
            esc_url($grille_url)
        );
    }
}
