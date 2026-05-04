<?php

class Grille_Ajax {

    public function init(): void {
        add_action('wp_ajax_grille_save_slot',      [$this, 'save_slot']);
        add_action('wp_ajax_grille_update_slot',    [$this, 'update_slot']);
        add_action('wp_ajax_grille_delete_slot',    [$this, 'delete_slot']);
        add_action('wp_ajax_grille_duplicate_day',  [$this, 'duplicate_day']);
    }

    private function check_access(): void {
        check_ajax_referer('grille_nonce', 'nonce');
        if (!current_user_can('edit_posts')) {
            wp_send_json_error('Accès refusé.');
        }
    }

    private function validate_time(string $time): bool {
        return (bool) preg_match('/^\d{2}:\d{2}$/', $time);
    }

    public function save_slot(): void {
        $this->check_access();

        $emission_id = (int) $_POST['emissionId'];
        $weekday     = (int) $_POST['weekday'];
        $heure_debut = sanitize_text_field($_POST['heureDebut'] ?? '');
        $heure_fin   = sanitize_text_field($_POST['heureFin']   ?? '');
        $post_id     = (int) ($_POST['postId'] ?? 0);

        if ($weekday < 0 || $weekday > 6) {
            wp_send_json_error('Jour invalide.');
        }

        if (!$this->validate_time($heure_debut) || !$this->validate_time($heure_fin)) {
            wp_send_json_error('Format horaire invalide.');
        }

        if ($heure_fin <= $heure_debut) {
            wp_send_json_error('L\'heure de fin doit être supérieure à l\'heure de début.');
        }

        $emission = get_post($emission_id);
        if (!$emission || $emission->post_type !== 'emission' || $emission->post_status !== 'publish') {
            wp_send_json_error('Émission introuvable ou non publiée.');
        }

        if ($post_id > 0) {
            $existing = get_post($post_id);
            if (!$existing || $existing->post_type !== 'grille_slot') {
                wp_send_json_error('Créneau introuvable.');
            }
            wp_update_post(['ID' => $post_id, 'post_title' => $emission->post_title]);
        } else {
            $post_id = wp_insert_post([
                'post_type'   => 'grille_slot',
                'post_status' => 'publish',
                'post_title'  => $emission->post_title,
            ]);

            if (is_wp_error($post_id)) {
                wp_send_json_error('Erreur lors de la création du créneau.');
            }
        }

        update_post_meta($post_id, 'weekday',     $weekday);
        update_post_meta($post_id, 'heure_debut', $heure_debut);
        update_post_meta($post_id, 'heure_fin',   $heure_fin);
        update_post_meta($post_id, 'emission_id', $emission_id);

        wp_send_json_success([
            'postId'     => $post_id,
            'weekday'    => $weekday,
            'heureDebut' => $heure_debut,
            'heureFin'   => $heure_fin,
            'emissionId' => $emission_id,
        ]);
    }

    public function update_slot(): void {
        $this->check_access();

        $post_id     = (int) ($_POST['postId']    ?? 0);
        $weekday     = (int) $_POST['weekday'];
        $heure_debut = sanitize_text_field($_POST['heureDebut'] ?? '');
        $heure_fin   = sanitize_text_field($_POST['heureFin']   ?? '');

        $post = get_post($post_id);
        if (!$post || $post->post_type !== 'grille_slot') {
            wp_send_json_error('Créneau introuvable.');
        }

        if ($weekday < 0 || $weekday > 6) {
            wp_send_json_error('Jour invalide.');
        }

        if (!$this->validate_time($heure_debut) || !$this->validate_time($heure_fin)) {
            wp_send_json_error('Format horaire invalide.');
        }

        if ($heure_fin <= $heure_debut) {
            wp_send_json_error('L\'heure de fin doit être supérieure à l\'heure de début.');
        }

        update_post_meta($post_id, 'weekday',     $weekday);
        update_post_meta($post_id, 'heure_debut', $heure_debut);
        update_post_meta($post_id, 'heure_fin',   $heure_fin);

        wp_send_json_success();
    }

    public function delete_slot(): void {
        $this->check_access();

        $post_id = (int) ($_POST['postId'] ?? 0);

        $post = get_post($post_id);
        if (!$post || $post->post_type !== 'grille_slot') {
            wp_send_json_error('Créneau introuvable.');
        }

        wp_delete_post($post_id, true);

        wp_send_json_success();
    }

    public function duplicate_day(): void {
        $this->check_access();

        $source_weekday  = (int) ($_POST['sourceWeekday'] ?? -1);
        $target_weekdays = array_map('intval', (array) ($_POST['targetWeekdays'] ?? []));
        $replace         = ($_POST['replaceExisting'] ?? '0') === '1';

        if ($source_weekday < 0 || $source_weekday > 6) {
            wp_send_json_error('Jour source invalide.');
        }

        $target_weekdays = array_values(array_unique(array_filter(
            $target_weekdays,
            function ($d) use ($source_weekday) { return $d >= 0 && $d <= 6 && $d !== $source_weekday; }
        )));

        if (empty($target_weekdays)) {
            wp_send_json_error('Aucun jour cible valide sélectionné.');
        }

        $source_slots = get_posts([
            'post_type'      => 'grille_slot',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'meta_query'     => [[
                'key'     => 'weekday',
                'value'   => $source_weekday,
                'compare' => '=',
                'type'    => 'NUMERIC',
            ]],
        ]);

        if (empty($source_slots)) {
            wp_send_json_error('Aucun créneau à copier sur ce jour.');
        }

        $deleted_ids = [];
        $created     = [];

        foreach ($target_weekdays as $target_day) {
            if ($replace) {
                $existing = get_posts([
                    'post_type'      => 'grille_slot',
                    'post_status'    => 'publish',
                    'posts_per_page' => -1,
                    'fields'         => 'ids',
                    'meta_query'     => [[
                        'key'     => 'weekday',
                        'value'   => $target_day,
                        'compare' => '=',
                        'type'    => 'NUMERIC',
                    ]],
                ]);
                foreach ($existing as $id) {
                    wp_delete_post($id, true);
                    $deleted_ids[] = $id;
                }
            }

            foreach ($source_slots as $slot) {
                $emission_id = (int) get_post_meta($slot->ID, 'emission_id', true);
                $heure_debut = get_post_meta($slot->ID, 'heure_debut', true);
                $heure_fin   = get_post_meta($slot->ID, 'heure_fin', true);

                $new_id = wp_insert_post([
                    'post_type'   => 'grille_slot',
                    'post_status' => 'publish',
                    'post_title'  => $slot->post_title,
                ]);

                if (is_wp_error($new_id)) {
                    continue;
                }

                update_post_meta($new_id, 'weekday',     $target_day);
                update_post_meta($new_id, 'heure_debut', $heure_debut);
                update_post_meta($new_id, 'heure_fin',   $heure_fin);
                update_post_meta($new_id, 'emission_id', $emission_id);

                $created[] = [
                    'postId'     => $new_id,
                    'weekday'    => $target_day,
                    'heureDebut' => $heure_debut,
                    'heureFin'   => $heure_fin,
                    'emissionId' => $emission_id,
                ];
            }
        }

        wp_send_json_success([
            'deletedPostIds' => $deleted_ids,
            'created'        => $created,
        ]);
    }
}
