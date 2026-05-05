<?php

class Grille_Admin {

    const PALETTE = [
        '#E45612', '#720049', '#2847AF', '#B929D8', '#EEBB72', '#320C52',
        '#27AE60', '#E74C3C', '#3498DB', '#F39C12', '#1ABC9C', '#8E44AD',
    ];

    public function init(): void {
        add_action('admin_menu',            [$this, 'register_menu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']);
    }

    public function register_menu(): void {
        add_menu_page(
            'Grille des programmes',
            'Grille',
            'edit_posts',
            'hope-radio-grille',
            [$this, 'render_page'],
            'dashicons-schedule',
            25
        );
    }

    public function enqueue_assets(string $hook): void {
        if ($hook !== 'toplevel_page_hope-radio-grille') {
            return;
        }

        wp_enqueue_script(
            'fullcalendar',
            'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.20/index.global.min.js',
            [],
            '6.1.20',
            true
        );

        wp_enqueue_script(
            'fullcalendar-fr',
            'https://cdn.jsdelivr.net/npm/@fullcalendar/core@6.1.20/locales/fr.global.min.js',
            ['fullcalendar'],
            '6.1.20',
            true
        );

        wp_enqueue_style(
            'grille-admin',
            get_template_directory_uri() . '/grille/assets/css/grille-admin.css',
            [],
            '1.0.0'
        );

        wp_enqueue_script(
            'grille-admin',
            get_template_directory_uri() . '/grille/assets/js/grille-admin.js',
            ['fullcalendar', 'fullcalendar-fr'],
            '1.0.0',
            true
        );

        wp_localize_script('grille-admin', 'GrilleData', [
            'ajaxUrl'     => admin_url('admin-ajax.php'),
            'nonce'       => wp_create_nonce('grille_nonce'),
            'emissions'   => $this->get_emissions_list(),
            'slots'       => $this->get_all_slots(),
            'currentYear' => (int) date('Y'),
        ]);
    }

    public function render_page(): void {
        ?>
        <div class="wrap">
            <h1 class="wp-heading-inline">Grille des programmes</h1>
            <div id="grille-calendar"></div>
        </div>

        <!-- Modal créneau (création / édition) -->
        <div id="grille-modal" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="grille-modal-title">
            <div id="grille-modal-overlay"></div>
            <div id="grille-modal-box">
                <h2 id="grille-modal-title">Créneau</h2>

                <input type="hidden" id="grille-slot-id" />
                <input type="hidden" id="grille-slot-post-id" />

                <div class="grille-field">
                    <label for="grille-emission-id">Émission</label>
                    <select id="grille-emission-id" required>
                        <option value="">— Choisir une émission —</option>
                    </select>
                </div>

                <div class="grille-field">
                    <label for="grille-slot-date">Date</label>
                    <input type="date" id="grille-slot-date" required />
                </div>

                <div class="grille-field">
                    <label for="grille-heure-debut">Début</label>
                    <input type="time" id="grille-heure-debut" step="900" required />
                </div>

                <div class="grille-field">
                    <label for="grille-heure-fin">Fin</label>
                    <input type="time" id="grille-heure-fin" step="900" required />
                </div>

                <div class="grille-modal-actions">
                    <button type="button" id="grille-btn-save"   class="button button-primary">Enregistrer</button>
                    <button type="button" id="grille-btn-delete" class="button button-link-delete" style="display:none;">Supprimer</button>
                    <button type="button" id="grille-btn-cancel" class="button">Annuler</button>
                </div>

                <div id="grille-modal-error" class="notice notice-error" style="display:none;"></div>
            </div>
        </div>

        <!-- Modal duplication de jour -->
        <div id="grille-modal-dup" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="grille-dup-title">
            <div id="grille-modal-dup-overlay"></div>
            <div id="grille-modal-dup-box">
                <h2 id="grille-dup-title">Dupliquer <span id="grille-dup-source-label"></span></h2>
                <p style="margin:0 0 12px;">Copier tous les créneaux vers :</p>

                <div id="grille-dup-days" class="grille-days-grid">
                    <!-- Checkboxes générées dynamiquement en JS (autres jours de la même semaine) -->
                </div>

                <div class="grille-field" style="margin-top:14px;">
                    <label style="font-weight:normal;cursor:pointer;">
                        <input type="checkbox" id="grille-dup-all" style="width:auto;margin-right:6px;" />
                        Toute la semaine
                    </label>
                </div>

                <div class="grille-field">
                    <label style="font-weight:normal;cursor:pointer;">
                        <input type="checkbox" id="grille-dup-replace" style="width:auto;margin-right:6px;" />
                        Remplacer les créneaux existants du jour cible
                    </label>
                </div>

                <div class="grille-modal-actions">
                    <button type="button" id="grille-btn-dup-confirm" class="button button-primary">Dupliquer</button>
                    <button type="button" id="grille-btn-dup-cancel"  class="button">Annuler</button>
                </div>

                <div id="grille-dup-error" class="notice notice-error" style="display:none;"></div>
            </div>
        </div>

        <!-- Modal duplication de semaine -->
        <div id="grille-modal-dup-week" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="grille-dup-week-title">
            <div id="grille-modal-dup-week-overlay"></div>
            <div id="grille-modal-dup-week-box">
                <h2 id="grille-dup-week-title">Dupliquer <span id="grille-dup-week-source-label"></span></h2>
                <p style="margin:0 0 16px;">Copier tous les créneaux de cette semaine vers :</p>

                <div class="grille-field">
                    <label for="grille-dup-week-target">Semaine cible</label>
                    <input type="week" id="grille-dup-week-target" style="width:100%;box-sizing:border-box;" />
                </div>

                <div class="grille-field">
                    <label style="font-weight:normal;cursor:pointer;">
                        <input type="checkbox" id="grille-dup-week-all-year" style="width:auto;margin-right:6px;" />
                        Toutes les semaines de <span id="grille-dup-week-year-label"></span>
                    </label>
                </div>

                <div class="grille-field">
                    <label style="font-weight:normal;cursor:pointer;">
                        <input type="checkbox" id="grille-dup-week-replace" style="width:auto;margin-right:6px;" />
                        Remplacer les créneaux existants
                    </label>
                </div>

                <div class="grille-modal-actions">
                    <button type="button" id="grille-btn-dup-week-confirm" class="button button-primary">Dupliquer</button>
                    <button type="button" id="grille-btn-dup-week-cancel"  class="button">Annuler</button>
                </div>

                <div id="grille-dup-week-error" class="notice notice-error" style="display:none;"></div>
            </div>
        </div>
        <?php
    }

    private function get_emissions_list(): array {
        $posts = get_posts([
            'post_type'      => 'emission',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'orderby'        => 'title',
            'order'          => 'ASC',
        ]);

        return array_map(function ($post) {
            return [
                'id'    => $post->ID,
                'title' => $post->post_title,
                'color' => self::PALETTE[$post->ID % count(self::PALETTE)],
            ];
        }, $posts);
    }

    private function get_all_slots(): array {
        $year  = (int) date('Y');
        $posts = get_posts([
            'post_type'      => 'grille_slot',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'orderby'        => 'meta_value',
            'meta_key'       => 'date',
            'order'          => 'ASC',
            'meta_query'     => [[
                'key'     => 'date',
                'value'   => [$year . '-01-01', $year . '-12-31'],
                'compare' => 'BETWEEN',
                'type'    => 'DATE',
            ]],
        ]);

        $slots = [];
        foreach ($posts as $post) {
            $date = get_post_meta($post->ID, 'date', true);
            if (!$date || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
                continue; // ignorer les anciens slots sans date valide
            }
            $emission_id = (int) get_post_meta($post->ID, 'emission_id', true);
            $slots[] = [
                'postId'     => $post->ID,
                'id'         => 'slot-' . $post->ID,
                'title'      => $post->post_title,
                'date'       => $date,
                'heureDebut' => get_post_meta($post->ID, 'heure_debut', true),
                'heureFin'   => get_post_meta($post->ID, 'heure_fin', true),
                'emissionId' => $emission_id,
                'color'      => self::PALETTE[$emission_id % count(self::PALETTE)],
            ];
        }

        return $slots;
    }
}
