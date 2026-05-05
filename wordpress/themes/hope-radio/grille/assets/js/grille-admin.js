document.addEventListener('DOMContentLoaded', function () {

    // ── Populer le select des émissions ──────────────────────────────────────
    var selectEmission = document.getElementById('grille-emission-id');
    GrilleData.emissions.forEach(function (em) {
        var opt = document.createElement('option');
        opt.value       = em.id;
        opt.textContent = em.title;
        selectEmission.appendChild(opt);
    });

    // ── Convertir les slots WP en events FullCalendar ─────────────────────────
    var initialEvents = GrilleData.slots.map(function (slot) {
        return {
            id:    slot.id,
            title: slot.title,
            start: slot.date + 'T' + slot.heureDebut + ':00',
            end:   slot.date + 'T' + slot.heureFin   + ':00',
            color: slot.color,
            extendedProps: {
                emissionId: slot.emissionId,
                postId:     slot.postId,
                date:       slot.date,
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
            left:   'prev,next today dupWeekBtn',
            center: 'title',
            right:  '',
        },
        customButtons: {
            dupWeekBtn: {
                text: '⧉ Dupliquer la semaine',
                click: function () { openDupWeekModal(); },
            },
        },
        events: initialEvents,

        select: function (info) {
            openModal('create', {
                date:       getDateStr(info.start),
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
                date:       info.event.extendedProps.date,
                heureDebut: formatTime(info.event.start),
                heureFin:   formatTime(info.event.end),
            });
        },

        eventDrop: function (info) {
            ajaxUpdateSlot(
                {
                    postId:     info.event.extendedProps.postId,
                    date:       getDateStr(info.event.start),
                    heureDebut: formatTime(info.event.start),
                    heureFin:   formatTime(info.event.end),
                },
                function () {
                    // Mettre à jour la date dans extendedProps
                    info.event.setExtendedProp('date', getDateStr(info.event.start));
                },
                function () { info.revert(); }
            );
        },

        eventResize: function (info) {
            ajaxUpdateSlot(
                {
                    postId:     info.event.extendedProps.postId,
                    date:       info.event.extendedProps.date,
                    heureDebut: formatTime(info.event.start),
                    heureFin:   formatTime(info.event.end),
                },
                null,
                function () { info.revert(); }
            );
        },

        dayHeaderDidMount: function (arg) {
            var dateStr = getDateStr(arg.date);
            var btn = document.createElement('button');
            btn.type        = 'button';
            btn.className   = 'grille-dup-header-btn';
            btn.title       = 'Dupliquer ce jour';
            btn.textContent = '⧉';
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                openDupModal(dateStr);
            });
            arg.el.appendChild(btn);
        },
    });

    calendar.render();

    // ── Helpers ───────────────────────────────────────────────────────────────

    function formatTime(date) {
        return date.toTimeString().slice(0, 5);
    }

    function getDateStr(date) {
        var y = date.getFullYear();
        var m = String(date.getMonth() + 1).padStart(2, '0');
        var d = String(date.getDate()).padStart(2, '0');
        return y + '-' + m + '-' + d;
    }

    function formatDateLabel(dateStr) {
        var d = new Date(dateStr + 'T12:00:00');
        return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    }

    function formatWeekLabel(mondayStr) {
        var mon = new Date(mondayStr + 'T12:00:00');
        var sun = new Date(mon);
        sun.setDate(sun.getDate() + 6);
        var startLabel = mon.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
        var endLabel   = sun.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        return 'semaine du ' + startLabel + ' au ' + endLabel;
    }

    function getWeekMondayStr(dateStr) {
        var d   = new Date(dateStr + 'T12:00:00');
        var dow = d.getDay() === 0 ? 7 : d.getDay(); // 1=lundi … 7=dimanche
        d.setDate(d.getDate() - (dow - 1));
        return getDateStr(d);
    }

    function weekInputToMonday(weekValue) {
        // weekValue = "YYYY-Www" (ISO 8601)
        var parts = weekValue.split('-W');
        if (parts.length !== 2) return null;
        var year = parseInt(parts[0], 10);
        var week = parseInt(parts[1], 10);
        // Le 4 janvier est toujours en semaine 1
        var jan4 = new Date(year, 0, 4);
        var dow  = jan4.getDay() === 0 ? 7 : jan4.getDay();
        var monday = new Date(jan4);
        monday.setDate(jan4.getDate() - (dow - 1) + (week - 1) * 7);
        return getDateStr(monday);
    }

    function dateToWeekInput(mondayStr) {
        // Convertit un lundi YYYY-MM-DD en valeur "YYYY-Www" pour input[type=week]
        var d   = new Date(mondayStr + 'T12:00:00');
        var jan4 = new Date(d.getFullYear(), 0, 4);
        var dow  = jan4.getDay() === 0 ? 7 : jan4.getDay();
        var week1Monday = new Date(jan4);
        week1Monday.setDate(jan4.getDate() - (dow - 1));
        var diffDays = Math.round((d - week1Monday) / 86400000);
        var weekNum  = Math.floor(diffDays / 7) + 1;
        var year     = d.getFullYear();
        // Correction si la semaine appartient à l'année suivante
        if (weekNum > 52) {
            var dec28 = new Date(year, 11, 28);
            if (d > dec28) { year++; weekNum = 1; }
        }
        return year + '-W' + String(weekNum).padStart(2, '0');
    }

    function addEventToCalendar(saved) {
        var emission = GrilleData.emissions.find(function (e) { return e.id == saved.emissionId; });
        calendar.addEvent({
            id:    'slot-' + saved.postId,
            title: emission ? emission.title : 'Émission',
            start: saved.date + 'T' + saved.heureDebut + ':00',
            end:   saved.date + 'T' + saved.heureFin   + ':00',
            color: emission ? emission.color : '#999999',
            extendedProps: {
                emissionId: saved.emissionId,
                postId:     saved.postId,
                date:       saved.date,
            },
        });
    }

    function slotFromSaved(saved) {
        return {
            postId:     saved.postId,
            id:         'slot-' + saved.postId,
            title:      saved.title || '',
            date:       saved.date,
            heureDebut: saved.heureDebut,
            heureFin:   saved.heureFin,
            emissionId: saved.emissionId,
        };
    }

    // ── Modal créneau ─────────────────────────────────────────────────────────

    var modal      = document.getElementById('grille-modal');
    var overlay    = document.getElementById('grille-modal-overlay');
    var errorBox   = document.getElementById('grille-modal-error');
    var btnDelete  = document.getElementById('grille-btn-delete');
    var modalTitle = document.getElementById('grille-modal-title');

    function openModal(mode, data) {
        document.getElementById('grille-slot-id').value      = data.id         || '';
        document.getElementById('grille-slot-post-id').value = data.postId     || '';
        document.getElementById('grille-emission-id').value  = data.emissionId || '';
        document.getElementById('grille-slot-date').value    = data.date       || '';
        document.getElementById('grille-heure-debut').value  = data.heureDebut || '';
        document.getElementById('grille-heure-fin').value    = data.heureFin   || '';

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
            if (modal.style.display        === 'flex') closeModal();
            if (modalDup.style.display     === 'flex') closeDupModal();
            if (modalDupWeek.style.display === 'flex') closeDupWeekModal();
        }
    });

    // ── Bouton Enregistrer ────────────────────────────────────────────────────

    document.getElementById('grille-btn-save').addEventListener('click', function () {
        var emissionId = document.getElementById('grille-emission-id').value;
        var date       = document.getElementById('grille-slot-date').value;
        var heureDebut = document.getElementById('grille-heure-debut').value;
        var heureFin   = document.getElementById('grille-heure-fin').value;
        var slotId     = document.getElementById('grille-slot-id').value;
        var postId     = document.getElementById('grille-slot-post-id').value;

        if (!emissionId || !date || !heureDebut || !heureFin) {
            showError('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        ajaxSaveSlot(
            { emissionId: emissionId, date: date, heureDebut: heureDebut, heureFin: heureFin, slotId: slotId, postId: postId },
            function (saved) {
                if (slotId) {
                    var ex = calendar.getEventById(slotId);
                    if (ex) ex.remove();
                    GrilleData.slots = GrilleData.slots.filter(function (s) { return s.postId !== saved.postId; });
                }
                GrilleData.slots.push(slotFromSaved(saved));
                addEventToCalendar(saved);
                closeModal();
            },
            showError
        );
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
                GrilleData.slots = GrilleData.slots.filter(function (s) {
                    return s.postId !== parseInt(postId, 10);
                });
                closeModal();
            },
            showError
        );
    });

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
                if (json.success) { if (onSuccess) onSuccess(json.data); }
                else              { if (onError)   onError(json.data || 'Une erreur est survenue.'); }
            })
            .catch(function () { if (onError) onError('Erreur réseau.'); });
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

    function ajaxDuplicateDay(sourceDate, targetDates, replaceExisting, onSuccess, onError) {
        var body = new URLSearchParams();
        body.append('action',          'grille_duplicate_day');
        body.append('nonce',           GrilleData.nonce);
        body.append('sourceDate',      sourceDate);
        body.append('replaceExisting', replaceExisting ? '1' : '0');
        targetDates.forEach(function (d) { body.append('targetDates[]', d); });
        fetch(GrilleData.ajaxUrl, { method: 'POST', body: body })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (json.success) { if (onSuccess) onSuccess(json.data); }
                else              { if (onError)   onError(json.data || 'Une erreur est survenue.'); }
            })
            .catch(function () { if (onError) onError('Erreur réseau.'); });
    }

    function ajaxDuplicateWeek(sourceWeekStart, targetWeekStarts, replaceExisting, onSuccess, onError) {
        var body = new URLSearchParams();
        body.append('action',          'grille_duplicate_week');
        body.append('nonce',           GrilleData.nonce);
        body.append('sourceWeekStart', sourceWeekStart);
        body.append('replaceExisting', replaceExisting ? '1' : '0');
        targetWeekStarts.forEach(function (d) { body.append('targetWeekStarts[]', d); });
        fetch(GrilleData.ajaxUrl, { method: 'POST', body: body })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (json.success) { if (onSuccess) onSuccess(json.data); }
                else              { if (onError)   onError(json.data || 'Une erreur est survenue.'); }
            })
            .catch(function () { if (onError) onError('Erreur réseau.'); });
    }

    function ajaxDuplicateWeekToYear(sourceWeekStart, year, replaceExisting, onSuccess, onError) {
        ajaxPost(
            'grille_duplicate_week_year',
            { sourceWeekStart: sourceWeekStart, year: year, replaceExisting: replaceExisting ? '1' : '0' },
            onSuccess,
            onError
        );
    }

    // ── Modal de duplication de jour ──────────────────────────────────────────

    var modalDup      = document.getElementById('grille-modal-dup');
    var dupOverlay    = document.getElementById('grille-modal-dup-overlay');
    var dupSourceDate = null;

    function openDupModal(dateStr) {
        dupSourceDate = dateStr;
        document.getElementById('grille-dup-source-label').textContent = formatDateLabel(dateStr);

        var mondayStr = getWeekMondayStr(dateStr);
        var container = document.getElementById('grille-dup-days');
        container.innerHTML = '';

        for (var i = 0; i < 7; i++) {
            var d    = new Date(mondayStr + 'T12:00:00');
            d.setDate(d.getDate() + i);
            var dStr = getDateStr(d);
            if (dStr === dateStr) continue;

            var lbl  = document.createElement('label');
            var cb   = document.createElement('input');
            cb.type  = 'checkbox';
            cb.name  = 'grille-dup-day-cb';
            cb.value = dStr;
            var span = document.createElement('span');
            span.textContent = formatDateLabel(dStr);
            lbl.appendChild(cb);
            lbl.appendChild(span);
            container.appendChild(lbl);
        }

        document.getElementById('grille-dup-all').checked     = false;
        document.getElementById('grille-dup-replace').checked = false;
        document.getElementById('grille-dup-error').style.display   = 'none';
        document.getElementById('grille-btn-dup-confirm').disabled  = false;
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
        ).map(function (cb) { return cb.value; });

        if (targets.length === 0) {
            showDupError('Veuillez sélectionner au moins un jour cible.');
            return;
        }

        var replace    = document.getElementById('grille-dup-replace').checked;
        var btnConfirm = document.getElementById('grille-btn-dup-confirm');
        btnConfirm.disabled = true;

        ajaxDuplicateDay(
            dupSourceDate,
            targets,
            replace,
            function (data) {
                applyDupResult(data);
                closeDupModal();
            },
            function (msg) {
                showDupError(msg);
                btnConfirm.disabled = false;
            }
        );
    });

    function showDupError(msg) {
        var el = document.getElementById('grille-dup-error');
        el.textContent   = msg;
        el.style.display = 'block';
    }

    // ── Modal de duplication de semaine ───────────────────────────────────────

    var modalDupWeek      = document.getElementById('grille-modal-dup-week');
    var dupWeekOverlay    = document.getElementById('grille-modal-dup-week-overlay');
    var dupWeekSourceStart = null;

    function openDupWeekModal() {
        var viewStart     = calendar.view.currentStart;
        dupWeekSourceStart = getDateStr(viewStart);

        document.getElementById('grille-dup-week-source-label').textContent = formatWeekLabel(dupWeekSourceStart);
        document.getElementById('grille-dup-week-year-label').textContent   = GrilleData.currentYear;

        // Pré-remplir avec la semaine suivante
        var nextMonday = new Date(viewStart);
        nextMonday.setDate(nextMonday.getDate() + 7);
        document.getElementById('grille-dup-week-target').value = dateToWeekInput(getDateStr(nextMonday));

        document.getElementById('grille-dup-week-all-year').checked = false;
        document.getElementById('grille-dup-week-replace').checked  = false;
        document.getElementById('grille-dup-week-target').disabled  = false;
        document.getElementById('grille-dup-week-error').style.display    = 'none';
        document.getElementById('grille-btn-dup-week-confirm').disabled   = false;

        modalDupWeek.style.display = 'flex';
    }

    function closeDupWeekModal() {
        modalDupWeek.style.display = 'none';
    }

    dupWeekOverlay.addEventListener('click', closeDupWeekModal);
    document.getElementById('grille-btn-dup-week-cancel').addEventListener('click', closeDupWeekModal);

    document.getElementById('grille-dup-week-all-year').addEventListener('change', function () {
        document.getElementById('grille-dup-week-target').disabled = this.checked;
    });

    document.getElementById('grille-btn-dup-week-confirm').addEventListener('click', function () {
        var allYear    = document.getElementById('grille-dup-week-all-year').checked;
        var replace    = document.getElementById('grille-dup-week-replace').checked;
        var btnConfirm = document.getElementById('grille-btn-dup-week-confirm');

        if (allYear) {
            btnConfirm.disabled = true;
            ajaxDuplicateWeekToYear(
                dupWeekSourceStart,
                GrilleData.currentYear,
                replace,
                function (data) { applyDupResult(data, true); closeDupWeekModal(); },
                function (msg)  { showDupWeekError(msg); btnConfirm.disabled = false; }
            );
        } else {
            var weekInput = document.getElementById('grille-dup-week-target').value;
            if (!weekInput) {
                showDupWeekError('Veuillez sélectionner une semaine cible.');
                return;
            }
            var targetMonday = weekInputToMonday(weekInput);
            if (!targetMonday) {
                showDupWeekError('Semaine cible invalide.');
                return;
            }
            if (targetMonday === dupWeekSourceStart) {
                showDupWeekError('La semaine cible doit être différente de la semaine source.');
                return;
            }
            btnConfirm.disabled = true;
            ajaxDuplicateWeek(
                dupWeekSourceStart,
                [targetMonday],
                replace,
                function (data) { applyDupResult(data); closeDupWeekModal(); },
                function (msg)  { showDupWeekError(msg); btnConfirm.disabled = false; }
            );
        }
    });

    function showDupWeekError(msg) {
        var el = document.getElementById('grille-dup-week-error');
        el.textContent   = msg;
        el.style.display = 'block';
    }

    // ── Application du résultat de duplication ────────────────────────────────

    function applyDupResult(data, largeDataset) {
        (data.deletedPostIds || []).forEach(function (id) {
            var ev = calendar.getEventById('slot-' + id);
            if (ev) ev.remove();
            GrilleData.slots = GrilleData.slots.filter(function (s) { return s.postId !== id; });
        });

        var viewStart = calendar.view.currentStart.toISOString().slice(0, 10);
        var viewEnd   = calendar.view.currentEnd.toISOString().slice(0, 10);

        (data.created || []).forEach(function (slot) {
            GrilleData.slots.push(slotFromSaved(slot));
            // Pour les grands jeux de données, n'ajouter au calendrier que si visible
            if (!largeDataset || (slot.date >= viewStart && slot.date < viewEnd)) {
                addEventToCalendar(slot);
            }
        });
    }
});
