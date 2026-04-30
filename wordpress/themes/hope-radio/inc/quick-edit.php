<?php

/**
 * Quick Edit — Champ "Mis en avant"
 *
 * Ajoute un interrupteur "Mettre en avant" dans la modification rapide
 * pour les post types : emission, podcast, post, agenda.
 *
 * Implémentation en 5 parties :
 *  1. Colonne dans la liste admin (expose la valeur courante au JS)
 *  2. Affichage de la valeur dans la colonne
 *  3. Rendu du champ dans le panneau de modification rapide
 *  4. Sauvegarde via save_post
 *  5. Chargement du JS d'admin
 */

define('HOPE_MIS_EN_AVANT_POST_TYPES', ['emission', 'podcast', 'post', 'agenda']);

// ── 1. Colonne dans la liste admin ────────────────────────────────────────────

foreach (HOPE_MIS_EN_AVANT_POST_TYPES as $post_type) {
    add_filter("manage_{$post_type}_posts_columns", function (array $columns): array {
        $columns['mis_en_avant'] = 'À la une';
        return $columns;
    });
}

// ── 2. Valeur dans la colonne ─────────────────────────────────────────────────

add_action('manage_posts_custom_column', function (string $column, int $post_id): void {
    if ($column !== 'mis_en_avant') {
        return;
    }
    $value = (bool) get_field('is_mis_en_avant', $post_id);
    printf(
        '<span class="mis-en-avant-status" data-mis-en-avant="%s">%s</span>',
        $value ? '1' : '0',
        $value ? '✓' : '—'
    );
}, 10, 2);

// ── 3. Champ dans le panneau Quick Edit ───────────────────────────────────────

add_action('quick_edit_custom_box', function (string $column, string $post_type): void {
    if ($column !== 'mis_en_avant' || !in_array($post_type, HOPE_MIS_EN_AVANT_POST_TYPES, true)) {
        return;
    }
    wp_nonce_field('hope_mis_en_avant_quick_edit', 'hope_mis_en_avant_nonce');
    ?>
    <fieldset class="inline-edit-col-left">
        <div class="inline-edit-col">
            <label class="alignleft">
                <input type="checkbox" name="is_mis_en_avant" value="1" />
                <span class="checkbox-title">Mettre en avant (à la une)</span>
            </label>
        </div>
    </fieldset>
    <?php
}, 10, 2);

// ── 4. Sauvegarde ─────────────────────────────────────────────────────────────

add_action('save_post', function (int $post_id): void {
    // Ignorer les autosaves et les révisions.
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (wp_is_post_revision($post_id)) {
        return;
    }

    // Nonce absent = ne provient pas du panneau quick edit.
    if (empty($_POST['hope_mis_en_avant_nonce'])) {
        return;
    }
    if (!wp_verify_nonce($_POST['hope_mis_en_avant_nonce'], 'hope_mis_en_avant_quick_edit')) {
        return;
    }

    // Vérification des droits.
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    // Vérification du post type.
    $post_type = get_post_type($post_id);
    if (!in_array($post_type, HOPE_MIS_EN_AVANT_POST_TYPES, true)) {
        return;
    }

    $value = !empty($_POST['is_mis_en_avant']) ? 1 : 0;
    update_field('is_mis_en_avant', $value, $post_id);
});

// ── 5. Chargement du JS d'admin ───────────────────────────────────────────────

add_action('admin_enqueue_scripts', function (string $hook): void {
    if ($hook !== 'edit.php') {
        return;
    }
    $screen = get_current_screen();
    if (!$screen || !in_array($screen->post_type, HOPE_MIS_EN_AVANT_POST_TYPES, true)) {
        return;
    }
    wp_enqueue_script(
        'hope-radio-quick-edit',
        get_template_directory_uri() . '/assets/js/quick-edit.js',
        ['jquery', 'inline-edit-post'],
        '1.0.0',
        true
    );
});
