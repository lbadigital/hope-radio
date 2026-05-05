<?php

class Grille_Ajax {

    public function init(): void {
        add_action('wp_ajax_grille_save_slot',            [$this, 'save_slot']);
        add_action('wp_ajax_grille_update_slot',          [$this, 'update_slot']);
        add_action('wp_ajax_grille_delete_slot',          [$this, 'delete_slot']);
        add_action('wp_ajax_grille_duplicate_day',        [$this, 'duplicate_day']);
        add_action('wp_ajax_grille_duplicate_week',       [$this, 'duplicate_week']);
        add_action('wp_ajax_grille_duplicate_week_year',  [$this, 'duplicate_week_to_year']);
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

    private function validate_date(string $date): bool {
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            return false;
        }
        $d = DateTime::createFromFormat('Y-m-d', $date);
        return $d && $d->format('Y-m-d') === $date;
    }

    public function save_slot(): void {
        $this->check_access();

        $emission_id = (int) ($_POST['emissionId'] ?? 0);
        $date        = sanitize_text_field($_POST['date']      ?? '');
        $heure_debut = sanitize_text_field($_POST['heureDebut'] ?? '');
        $heure_fin   = sanitize_text_field($_POST['heureFin']   ?? '');
        $post_id     = (int) ($_POST['postId']  ?? 0);

        if (!$this->validate_date($date)) {
            wp_send_json_error('Date invalide.');
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

        update_post_meta($post_id, 'date',        $date);
        update_post_meta($post_id, 'heure_debut', $heure_debut);
        update_post_meta($post_id, 'heure_fin',   $heure_fin);
        update_post_meta($post_id, 'emission_id', $emission_id);

        wp_send_json_success([
            'postId'     => $post_id,
            'date'       => $date,
            'heureDebut' => $heure_debut,
            'heureFin'   => $heure_fin,
            'emissionId' => $emission_id,
        ]);
    }

    public function update_slot(): void {
        $this->check_access();

        $post_id     = (int) ($_POST['postId']    ?? 0);
        $date        = sanitize_text_field($_POST['date']      ?? '');
        $heure_debut = sanitize_text_field($_POST['heureDebut'] ?? '');
        $heure_fin   = sanitize_text_field($_POST['heureFin']   ?? '');

        $post = get_post($post_id);
        if (!$post || $post->post_type !== 'grille_slot') {
            wp_send_json_error('Créneau introuvable.');
        }

        if (!$this->validate_date($date)) {
            wp_send_json_error('Date invalide.');
        }

        if (!$this->validate_time($heure_debut) || !$this->validate_time($heure_fin)) {
            wp_send_json_error('Format horaire invalide.');
        }

        if ($heure_fin <= $heure_debut) {
            wp_send_json_error('L\'heure de fin doit être supérieure à l\'heure de début.');
        }

        update_post_meta($post_id, 'date',        $date);
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

        $source_date  = sanitize_text_field($_POST['sourceDate'] ?? '');
        $target_dates = array_map('sanitize_text_field', (array) ($_POST['targetDates'] ?? []));
        $replace      = ($_POST['replaceExisting'] ?? '0') === '1';

        if (!$this->validate_date($source_date)) {
            wp_send_json_error('Date source invalide.');
        }

        $target_dates = array_values(array_unique(array_filter(
            $target_dates,
            function ($d) use ($source_date) { return $this->validate_date($d) && $d !== $source_date; }
        )));

        if (empty($target_dates)) {
            wp_send_json_error('Aucune date cible valide sélectionnée.');
        }

        $source_slots = get_posts([
            'post_type'      => 'grille_slot',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'meta_query'     => [[
                'key'     => 'date',
                'value'   => $source_date,
                'compare' => '=',
            ]],
        ]);

        if (empty($source_slots)) {
            wp_send_json_error('Aucun créneau à copier sur cette date.');
        }

        $deleted_ids = [];
        $created     = [];

        foreach ($target_dates as $target_date) {
            if ($replace) {
                $existing = get_posts([
                    'post_type'      => 'grille_slot',
                    'post_status'    => 'publish',
                    'posts_per_page' => -1,
                    'fields'         => 'ids',
                    'meta_query'     => [['key' => 'date', 'value' => $target_date, 'compare' => '=']],
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

                if (is_wp_error($new_id)) continue;

                update_post_meta($new_id, 'date',        $target_date);
                update_post_meta($new_id, 'heure_debut', $heure_debut);
                update_post_meta($new_id, 'heure_fin',   $heure_fin);
                update_post_meta($new_id, 'emission_id', $emission_id);

                $created[] = [
                    'postId'     => $new_id,
                    'id'         => 'slot-' . $new_id,
                    'date'       => $target_date,
                    'heureDebut' => $heure_debut,
                    'heureFin'   => $heure_fin,
                    'emissionId' => $emission_id,
                ];
            }
        }

        wp_send_json_success(['deletedPostIds' => $deleted_ids, 'created' => $created]);
    }

    public function duplicate_week(): void {
        $this->check_access();

        $source_week_start  = sanitize_text_field($_POST['sourceWeekStart'] ?? '');
        $target_week_starts = array_map('sanitize_text_field', (array) ($_POST['targetWeekStarts'] ?? []));
        $replace            = ($_POST['replaceExisting'] ?? '0') === '1';

        if (!$this->validate_date($source_week_start)) {
            wp_send_json_error('Date de semaine source invalide.');
        }

        $target_week_starts = array_values(array_unique(array_filter(
            $target_week_starts,
            function ($d) use ($source_week_start) {
                return $this->validate_date($d) && $d !== $source_week_start;
            }
        )));

        if (empty($target_week_starts)) {
            wp_send_json_error('Aucune semaine cible valide sélectionnée.');
        }

        $result = $this->do_duplicate_week($source_week_start, $target_week_starts, $replace);
        wp_send_json_success($result);
    }

    public function duplicate_week_to_year(): void {
        $this->check_access();

        set_time_limit(300);

        $source_week_start = sanitize_text_field($_POST['sourceWeekStart'] ?? '');
        $year              = (int) ($_POST['year'] ?? date('Y'));
        $replace           = ($_POST['replaceExisting'] ?? '0') === '1';

        if (!$this->validate_date($source_week_start)) {
            wp_send_json_error('Date de semaine source invalide.');
        }

        $target_week_starts = $this->get_year_mondays($year, $source_week_start);

        if (empty($target_week_starts)) {
            wp_send_json_error('Aucune semaine cible trouvée pour cette année.');
        }

        $result = $this->do_duplicate_week($source_week_start, $target_week_starts, $replace);
        wp_send_json_success($result);
    }

    // ── Helpers privés ────────────────────────────────────────────────────────

    private function do_duplicate_week(string $source_week_start, array $target_week_starts, bool $replace): array {
        $source_sunday = (new DateTime($source_week_start))->modify('+6 days')->format('Y-m-d');

        $source_slots = get_posts([
            'post_type'      => 'grille_slot',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'meta_query'     => [[
                'key'     => 'date',
                'value'   => [$source_week_start, $source_sunday],
                'compare' => 'BETWEEN',
                'type'    => 'DATE',
            ]],
        ]);

        if (empty($source_slots)) {
            return ['deletedPostIds' => [], 'created' => []];
        }

        // Charger les metas en une passe
        $source_data = [];
        foreach ($source_slots as $slot) {
            $source_data[] = [
                'date'        => get_post_meta($slot->ID, 'date', true),
                'heure_debut' => get_post_meta($slot->ID, 'heure_debut', true),
                'heure_fin'   => get_post_meta($slot->ID, 'heure_fin', true),
                'emission_id' => (int) get_post_meta($slot->ID, 'emission_id', true),
                'title'       => $slot->post_title,
            ];
        }

        $source_ts   = strtotime($source_week_start);
        $deleted_ids = [];
        $created     = [];

        foreach ($target_week_starts as $target_week_start) {
            $target_ts    = strtotime($target_week_start);
            $offset_days  = (int) round(($target_ts - $source_ts) / DAY_IN_SECONDS);
            $target_sunday = (new DateTime($target_week_start))->modify('+6 days')->format('Y-m-d');

            if ($replace) {
                $existing = get_posts([
                    'post_type'      => 'grille_slot',
                    'post_status'    => 'publish',
                    'posts_per_page' => -1,
                    'fields'         => 'ids',
                    'meta_query'     => [[
                        'key'     => 'date',
                        'value'   => [$target_week_start, $target_sunday],
                        'compare' => 'BETWEEN',
                        'type'    => 'DATE',
                    ]],
                ]);
                foreach ($existing as $id) {
                    wp_delete_post($id, true);
                    $deleted_ids[] = $id;
                }
            }

            foreach ($source_data as $data) {
                $new_date = date('Y-m-d', strtotime($data['date']) + $offset_days * DAY_IN_SECONDS);

                $new_id = wp_insert_post([
                    'post_type'   => 'grille_slot',
                    'post_status' => 'publish',
                    'post_title'  => $data['title'],
                ]);

                if (is_wp_error($new_id)) continue;

                update_post_meta($new_id, 'date',        $new_date);
                update_post_meta($new_id, 'heure_debut', $data['heure_debut']);
                update_post_meta($new_id, 'heure_fin',   $data['heure_fin']);
                update_post_meta($new_id, 'emission_id', $data['emission_id']);

                $created[] = [
                    'postId'     => $new_id,
                    'id'         => 'slot-' . $new_id,
                    'date'       => $new_date,
                    'heureDebut' => $data['heure_debut'],
                    'heureFin'   => $data['heure_fin'],
                    'emissionId' => $data['emission_id'],
                ];
            }
        }

        return ['deletedPostIds' => $deleted_ids, 'created' => $created];
    }

    /**
     * Retourne tous les lundis d'une année civile (date dans l'année),
     * en excluant $exclude_date.
     */
    private function get_year_mondays(int $year, string $exclude_date = ''): array {
        $mondays = [];
        $date    = new DateTime("{$year}-01-01");

        // Avancer au premier lundi de l'année
        $dow = (int) $date->format('N'); // 1=lundi … 7=dimanche
        if ($dow !== 1) {
            $date->modify('next Monday');
        }

        while ((int) $date->format('Y') === $year) {
            $date_str = $date->format('Y-m-d');
            if ($date_str !== $exclude_date) {
                $mondays[] = $date_str;
            }
            $date->modify('+7 days');
        }

        return $mondays;
    }
}
