<?php

class Grille_Emission_Meta {

    const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    public function init(): void {
        add_action('add_meta_boxes', [$this, 'register_meta_box']);
        add_filter('manage_emission_posts_columns', [$this, 'add_column']);
        add_filter('manage_emission_posts_columns', [$this, 'order_columns'], 99);
        add_action('manage_emission_posts_custom_column', [$this, 'render_column'], 10, 2);
    }

    public function add_column(array $columns): array {
        $columns['grille_creneaux'] = 'Créneaux';
        return $columns;
    }

    public function order_columns(array $columns): array {
        $order = ['cb', 'title', 'grille_creneaux', 'mis_en_avant', 'date'];
        $result = [];
        foreach ($order as $key) {
            if (isset($columns[$key])) {
                $result[$key] = $columns[$key];
            }
        }
        foreach ($columns as $key => $label) {
            if (!isset($result[$key])) {
                $result[$key] = $label;
            }
        }
        return $result;
    }

    public function render_column(string $column, int $post_id): void {
        if ($column !== 'grille_creneaux') {
            return;
        }

        $slots = get_posts([
            'post_type'      => 'grille_slot',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'orderby'        => 'meta_value_num',
            'meta_key'       => 'weekday',
            'order'          => 'ASC',
            'meta_query'     => [[
                'key'     => 'emission_id',
                'value'   => $post_id,
                'compare' => '=',
                'type'    => 'NUMERIC',
            ]],
        ]);

        if (empty($slots)) {
            echo '<span style="color:#999;">—</span>';
            return;
        }

        $lines = [];
        foreach ($slots as $slot) {
            $weekday     = (int) get_post_meta($slot->ID, 'weekday', true);
            $heure_debut = get_post_meta($slot->ID, 'heure_debut', true);
            $heure_fin   = get_post_meta($slot->ID, 'heure_fin', true);
            $jour        = self::JOURS[$weekday] ?? '—';
            $lines[]     = sprintf(
                '<span style="white-space:nowrap;">%s %s–%s</span>',
                esc_html(substr($jour, 0, 3)),
                esc_html($heure_debut),
                esc_html($heure_fin)
            );
        }
        echo implode('<br>', $lines);
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
