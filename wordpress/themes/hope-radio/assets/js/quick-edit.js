/**
 * Quick Edit — Pré-remplissage du champ "Mis en avant"
 *
 * À l'ouverture du panneau quick edit, lit la valeur stockée dans
 * l'attribut data-mis-en-avant de la colonne de liste et coche ou
 * décoche la checkbox en conséquence.
 */
(function ($) {
    'use strict';

    if (\!window.inlineEditPost) {
        return;
    }

    const wpInlineEditPost = window.inlineEditPost;
    const originalEdit = wpInlineEditPost.edit;

    wpInlineEditPost.edit = function (id) {
        // Appel de la méthode originale en premier.
        originalEdit.apply(this, arguments);

        const postId = typeof id === 'object' ? parseInt(this.getId(id), 10) : parseInt(id, 10);
        if (\!postId) {
            return;
        }

        // Lire la valeur depuis la colonne "À la une" de la ligne concernée.
        const $statusCell = $('#post-' + postId).find('.mis-en-avant-status');
        if (\!$statusCell.length) {
            return;
        }

        const isMisEnAvant = $statusCell.data('mis-en-avant') === 1
            || $statusCell.data('mis-en-avant') === '1';

        // Pré-remplir la checkbox dans le panneau quick edit.
        $('#edit-' + postId)
            .find('input[name="is_mis_en_avant"]')
            .prop('checked', isMisEnAvant);
    };
}(jQuery));
