document.addEventListener('DOMContentLoaded', function () {

    // ── Populer le select des émissions ──────────────────────────────────────
    var selectEmission = document.getElementById('grille-emission-id');
    GrilleData.emissions.forEach(function (em) {
        var opt = document.createElement('option');
        opt.value       = em.id;
        opt.textContent = em.title;
        selectEmission.appendChild(opt);
    });

    // ── Convertir les slots WP en events FullCalendar ────────────────────────
    var initialEvents = GrilleData.slots.map(function (slot) {
        return {
            id:          slot.id,
            title:       slot.title,
            daysOfWeek:  [parseInt(slot.weekday, 10)],
            startTime:   slot.heureDebut + ':00',
            endTime:     slot.heureFin   + ':00',
            color:       slot.color,
            extendedProps: {
                emissionId: slot.emissionId,
                postId:     slot.postId,
            },
        };
    });

    // ── Initialisation FullCalendar ───────────────────────────────────────────
    var calendarEl = document.getElementById('grille-calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        locale:            'fr',
        initialView:       'timeGridWeek',
        allDaySlot:        false,
        slotMinTime:       '05:00:00',
        slotMaxTime:       '24:00:00',
        slotDuration:      '00:15:00',
        slotLabelInterval: '01:00:00',
        height:            'auto',
        selectable:        true,
        editable:          true,
        eventOverlap:      false,
        headerToolbar: {
            left:   'prev,next today',
            center: 'title',
            right:  '',
        },
        events: initialEvents,

        select: function (info) {
            openModal('create', {
                weekday:    info.start.getDay(),
                heureDebut: formatTime(info.start),
                heureFin:   formatTime(info.end),
            });
            calendar.unselect();
        },

        eventClick: function (info) {
            openModal('edit', {
                id:         info.event.id,
                postId:     info.event.extendedProps.postId,
                emissionId: info.event.extendedProps.emissionId,
                weekday:    info.event.start.getDay(),
                heureDebut: formatTime(info.event.start),
                heureFin:   formatTime(info.event.end),
            });
        },

        eventDrop: function (info) {
            ajaxUpdateSlot(
                {
                    postId:     info.event.extendedProps.postId,
                    weekday:    info.event.start.getDay(),
                    heureDebut: formatTime(info.event.start),
                    heureFin:   formatTime(info.event.end),
                },
                null,
                function () { info.revert(); }
            );
        },

        eventResize: function (info) {
            ajaxUpdateSlot(
                {
                    postId:     info.event.extendedProps.postId,
                    weekday:    info.event.start.getDay(),
                    heureDebut: formatTime(info.event.start),
                    heureFin:   formatTime(info.event.end),
                },
                null,
                function () { info.revert(); }
            );
        },

        dayHeaderDidMount: function (arg) {
            var weekday = arg.date.getDay();
            var btn = document.createElement('button');
            btn.type        = 'button';
            btn.className   = 'grille-dup-header-btn';
            btn.title       = 'Dupliquer ce jour';
            btn.textContent = '⧉';
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                openDupModal(weekday);
            });
            arg.el.appendChild(btn);
        },
    });

    calendar.render();

    // ── Helpers ───────────────────────────────────────────────────────────────

    function formatTime(date) {
        return date.toTimeString().slice(0, 5);
    }

    function addEventToCalendar(saved) {
        var emission = GrilleData.emissions.find(function (e) {
            return e.id == saved.emissionId;
        });
        calendar.addEvent({
            id:          'slot-' + saved.postId,
            title:       emission ? emission.title : 'Émission',
            daysOfWeek:  [parseInt(saved.weekday, 10)],
            startTime:   saved.heureDebut + ':00',
            endTime:     saved.heureFin   + ':00',
            color:       emission ? emission.color : '#999999',
            extendedProps: {
                emissionId: saved.emissionId,
                postId:     saved.postId,
            },
        });
    }

    // ── Modal ─────────────────────────────────────────────────────────────────

    var modal       = document.getElementById('grille-modal');
    var overlay     = document.getElementById('grille-modal-overlay');
    var errorBox    = document.getElementById('grille-modal-error');
    var btnDelete   = document.getElementById('grille-btn-delete');
    var modalTitle  = document.getElementById('grille-modal-title');
    var currentMode = 'create';
    var originalDay = null; // jour du slot en cours d'édition

    function openModal(mode, data) {
        currentMode = mode;
        originalDay = data.weekday !== undefined ? parseInt(data.weekday, 10) : null;

        document.getElementById('grille-slot-id').value      = data.id         || '';
        document.getElementById('grille-slot-post-id').value = data.postId     || '';
        document.getElementById('grille-emission-id').value  = data.emissionId || '';
        document.getElementById('grille-heure-debut').value  = data.heureDebut || '';
        document.getElementById('grille-heure-fin').value    = data.heureFin   || '';

        // Pré-cocher uniquement le jour concerné (création = jour dessiné, édition = jour actuel)
        document.querySelectorAll('input[name="grille-weekday-cb"]').forEach(function (cb) {
            cb.checked = (parseInt(cb.value, 10) === originalDay);
        });

        modalTitle.textContent  = (mode === 'create') ? 'Nouveau créneau' : 'Modifier le créneau';
        btnDelete.style.display = (mode === 'edit') ? 'inline-block' : 'none';
        errorBox.style.display  = 'none';
        modal.style.display     = 'flex';
        document.getElementById('grille-emission-id').focus();
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    overlay.addEventListener('click', closeModal);
    document.getElementById('grille-btn-cancel').addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (modal.style.display    === 'flex') closeModal();
            if (modalDup.style.display === 'flex') closeDupModal();
        }
    });

    // ── Bouton Enregistrer ────────────────────────────────────────────────────

    document.getElementById('grille-btn-save').addEventListener('click', function () {
        var emissionId = document.getElementById('grille-emission-id').value;
        var heureDebut = document.getElementById('grille-heure-debut').value;
        var heureFin   = document.getElementById('grille-heure-fin').value;

        if (!emissionId || !heureDebut || !heureFin) {
            showError('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        var checkedDays = Array.from(document.querySelectorAll('input[name="grille-weekday-cb"]:checked'))
                              .map(function (cb) { return cb.value; });

        if (checkedDays.length === 0) {
            showError('Veuillez sélectionner au moins un jour.');
            return;
        }

        if (currentMode === 'edit') {
            var slotId = document.getElementById('grille-slot-id').value;
            var postId = document.getElementById('grille-slot-post-id').value;

            // Si le jour original est encore coché, on garde le slot en place (même postId).
            // Sinon on déplace le slot sur le premier jour coché.
            var origStr   = originalDay !== null ? String(originalDay) : null;
            var updateDay = (origStr && checkedDays.indexOf(origStr) !== -1) ? origStr : checkedDays[0];
            var extraDays = checkedDays.filter(function (d) { return d !== updateDay; });

            ajaxSaveSlot(
                { emissionId: emissionId, weekday: updateDay, heureDebut: heureDebut, heureFin: heureFin, slotId: slotId, postId: postId },
                function (saved) {
                    if (slotId) {
                        var ex = calendar.getEventById(slotId);
                        if (ex) ex.remove();
                    }
                    addEventToCalendar(saved);

                    // Créer un nouveau slot pour chaque jour supplémentaire coché
                    extraDays.forEach(function (day) {
                        ajaxSaveSlot(
                            { emissionId: emissionId, weekday: day, heureDebut: heureDebut, heureFin: heureFin, slotId: '', postId: '' },
                            addEventToCalendar,
                            showError
                        );
                    });

                    closeModal();
                },
                showError
            );
        } else {
            // Mode création : un appel AJAX par jour coché
            var pending    = checkedDays.length;
            var firstError = null;

            checkedDays.forEach(function (day) {
                ajaxSaveSlot(
                    { emissionId: emissionId, weekday: day, heureDebut: heureDebut, heureFin: heureFin, slotId: '', postId: '' },
                    function (saved) {
                        addEventToCalendar(saved);
                        if (--pending === 0 && !firstError) closeModal();
                    },
                    function (err) {
                        if (!firstError) { firstError = err; showError(err); }
                        --pending;
                    }
                );
            });
        }
    });

    // ── Bouton Supprimer ──────────────────────────────────────────────────────

    btnDelete.addEventListener('click', function () {
        var postId = document.getElementById('grille-slot-post-id').value;
        var slotId = document.getElementById('grille-slot-id').value;

        if (!confirm('Supprimer ce créneau définitivement ?')) return;

        ajaxDeleteSlot(
            postId,
            function () {
                var ex = calendar.getEventById(slotId);
                if (ex) ex.remove();
                closeModal();
            },
            showError
        );
    });

    // ── Affichage d'erreur modal ──────────────────────────────────────────────

    function showError(msg) {
        errorBox.textContent   = msg;
        errorBox.style.display = 'block';
    }

    // ── AJAX helpers ──────────────────────────────────────────────────────────

    function ajaxPost(action, data, onSuccess, onError) {
        var body = new URLSearchParams(Object.assign({ action: action, nonce: GrilleData.nonce }, data));
        fetch(GrilleData.ajaxUrl, { method: 'POST', body: body })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (json.success) {
                    if (onSuccess) onSuccess(json.data);
                } else {
                    if (onError) onError(json.data || 'Une erreur est survenue.');
                }
            })
            .catch(function () {
                if (onError) onError('Erreur réseau.');
            });
    }

    function ajaxSaveSlot(data, onSuccess, onError) {
        ajaxPost('grille_save_slot', data, onSuccess, onError);
    }

    function ajaxUpdateSlot(data, onSuccess, onError) {
        ajaxPost('grille_update_slot', data, onSuccess, onError);
    }

    function ajaxDeleteSlot(postId, onSuccess, onError) {
        ajaxPost('grille_delete_slot', { postId: postId }, onSuccess, onError);
    }

    function ajaxDuplicateDay(sourceWeekday, targetWeekdays, replaceExisting, onSuccess, onError) {
        var body = new URLSearchParams();
        body.append('action',          'grille_duplicate_day');
        body.append('nonce',           GrilleData.nonce);
        body.append('sourceWeekday',   sourceWeekday);
        body.append('replaceExisting', replaceExisting ? '1' : '0');
        targetWeekdays.forEach(function (d) { body.append('targetWeekdays[]', d); });
        fetch(GrilleData.ajaxUrl, { method: 'POST', body: body })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (json.success) { if (onSuccess) onSuccess(json.data); }
                else              { if (onError)   onError(json.data || 'Une erreur est survenue.'); }
            })
            .catch(function () { if (onError) onError('Erreur réseau.'); });
    }

    // ── Modal de duplication ──────────────────────────────────────────────────

    var modalDup    = document.getElementById('grille-modal-dup');
    var dupOverlay  = document.getElementById('grille-modal-dup-overlay');
    var dupSourceDay = null;
    var DAY_NAMES   = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    function openDupModal(weekday) {
        dupSourceDay = weekday;
        document.getElementById('grille-dup-source-label').textContent = DAY_NAMES[weekday];

        var container = document.getElementById('grille-dup-days');
        container.innerHTML = '';
        for (var d = 0; d < 7; d++) {
            if (d === weekday) continue;
            var lbl = document.createElement('label');
            var cb  = document.createElement('input');
            cb.type      = 'checkbox';
            cb.name      = 'grille-dup-day-cb';
            cb.value     = d;
            var span = document.createElement('span');
            span.textContent = DAY_NAMES[d];
            lbl.appendChild(cb);
            lbl.appendChild(span);
            container.appendChild(lbl);
        }

        document.getElementById('grille-dup-all').checked     = false;
        document.getElementById('grille-dup-replace').checked = false;
        document.getElementById('grille-dup-error').style.display = 'none';
        document.getElementById('grille-btn-dup-confirm').disabled = false;
        modalDup.style.display = 'flex';
    }

    function closeDupModal() {
        modalDup.style.display = 'none';
    }

    dupOverlay.addEventListener('click', closeDupModal);
    document.getElementById('grille-btn-dup-cancel').addEventListener('click', closeDupModal);

    document.getElementById('grille-dup-all').addEventListener('change', function () {
        var checked = this.checked;
        document.querySelectorAll('#grille-dup-days input[name="grille-dup-day-cb"]').forEach(function (cb) {
            cb.checked = checked;
        });
    });

    document.getElementById('grille-btn-dup-confirm').addEventListener('click', function () {
        var targets = Array.from(
            document.querySelectorAll('#grille-dup-days input[name="grille-dup-day-cb"]:checked')
        ).map(function (cb) { return parseInt(cb.value, 10); });

        if (targets.length === 0) {
            var errBox = document.getElementById('grille-dup-error');
            errBox.textContent   = 'Veuillez sélectionner au moins un jour cible.';
            errBox.style.display = 'block';
            return;
        }

        var replaceExisting = document.getElementById('grille-dup-replace').checked;
        var btnConfirm = document.getElementById('grille-btn-dup-confirm');
        btnConfirm.disabled = true;

        ajaxDuplicateDay(
            dupSourceDay,
            targets,
            replaceExisting,
            function (data) {
                (data.deletedPostIds || []).forEach(function (id) {
                    var ev = calendar.getEventById('slot-' + id);
                    if (ev) ev.remove();
                });
                (data.created || []).forEach(addEventToCalendar);
                closeDupModal();
            },
            function (msg) {
                var errBox = document.getElementById('grille-dup-error');
                errBox.textContent   = msg;
                errBox.style.display = 'block';
                btnConfirm.disabled  = false;
            }
        );
    });
});
