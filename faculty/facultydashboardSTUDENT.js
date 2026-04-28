document.addEventListener('DOMContentLoaded', () => {

    // ══════════════════════════════════════════════
    // GLOBAL STATE
    // ══════════════════════════════════════════════
    let currentAppeal   = null;
    let currentSection  = 'e';
    let currentTabState = 'pending';
    let allAppeals      = { excuse: [], leave: [] };
    let currentFilter   = { deptId: null, year: null, block: null };

    // ══════════════════════════════════════════════
    // ELEMENTS
    // ══════════════════════════════════════════════
    const btnExcuse     = document.getElementById('btn-excuse');
    const btnLeave      = document.getElementById('btn-leave');
    const toggleSlider  = document.getElementById('toggle-slider');
    const excuseSection = document.getElementById('excuse-section');
    const leaveSection  = document.getElementById('leave-section');
    const noFilterMsg   = document.getElementById('no-filter-msg');
    const subjectSelect = document.getElementById('subject-select');
    const programSelect = document.getElementById('program-select');
    const blockSelect   = document.getElementById('block-select');

    // ══════════════════════════════════════════════
    // TOGGLE SWITCH
    // ══════════════════════════════════════════════
    excuseSection.style.display = 'none';
    leaveSection.style.display  = 'none';

    btnExcuse.addEventListener('click', () => {
        if (excuseSection.style.display === 'none' && leaveSection.style.display === 'none') return;
        btnLeave.classList.remove('active');
        btnExcuse.classList.add('active');
        toggleSlider.style.transform = 'translateX(0)';
        leaveSection.style.display   = 'none';
        excuseSection.style.display  = 'block';
        currentSection = 'e';
    });

    btnLeave.addEventListener('click', () => {
        if (excuseSection.style.display === 'none' && leaveSection.style.display === 'none') return;
        btnExcuse.classList.remove('active');
        btnLeave.classList.add('active');
        toggleSlider.style.transform = 'translateX(175px)';
        excuseSection.style.display  = 'none';
        leaveSection.style.display   = 'block';
        currentSection = 'l';
    });

    // ══════════════════════════════════════════════
    // STEP 1 — Subject selected → fetch programs & blocks
    // ══════════════════════════════════════════════
    subjectSelect.addEventListener('change', () => {
        const selected    = subjectSelect.options[subjectSelect.selectedIndex];
        const subjectCode = selected.getAttribute('data-code');

        programSelect.innerHTML = '<option value="" disabled selected hidden>Loading...</option>';
        programSelect.disabled  = true;
        blockSelect.innerHTML   = '<option value="" disabled selected hidden>Select program first</option>';
        blockSelect.disabled    = true;

        excuseSection.style.display = 'none';
        leaveSection.style.display  = 'none';
        noFilterMsg.style.display   = 'none';

        const formData = new FormData();
        formData.append('subject_code', subjectCode);

        fetch('/astraea-academy/astraea-academy/faculty/facultydashboardSTUDENTFILTER.php', {
            method: 'POST',
            body:   formData,
        })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                programSelect.innerHTML = '<option value="" disabled selected hidden>Error loading programs</option>';
                return;
            }

            window.currentSchedules = data.schedules;

            programSelect.innerHTML = '<option value="" disabled selected hidden>Select program</option>';
            data.depts.forEach(dept => {
                const opt       = document.createElement('option');
                opt.value       = dept.department_id;
                opt.textContent = `${dept.department_name} (${dept.department_code})`;
                programSelect.appendChild(opt);
            });
            programSelect.disabled = false;

            if (data.depts.length === 1) {
                programSelect.selectedIndex = 1;
                programSelect.dispatchEvent(new Event('change'));
            }
        })
        .catch(err => {
            programSelect.innerHTML = '<option value="" disabled selected hidden>Network error</option>';
            console.error('Filter fetch error:', err);
        });
    });

    // ══════════════════════════════════════════════
    // STEP 2 — Program selected → fill Block dropdown
    // ══════════════════════════════════════════════
    programSelect.addEventListener('change', () => {
        const deptId   = programSelect.value;
        const filtered = (window.currentSchedules || []).filter(s => s.department_id == deptId);

        blockSelect.innerHTML = '<option value="" disabled selected hidden>Select block</option>';
        filtered.forEach(sc => {
            const opt = document.createElement('option');
            opt.value = sc.schedule_id;
            opt.setAttribute('data-dept',     sc.department_id);
            opt.setAttribute('data-year',     sc.student_year);
            opt.setAttribute('data-block',    sc.student_block);
            opt.setAttribute('data-schedule', sc.schedule_id);
            opt.textContent = `Block ${sc.student_block} (Year ${sc.student_year})`;
            blockSelect.appendChild(opt);
        });
        blockSelect.disabled = false;

        excuseSection.style.display = 'none';
        leaveSection.style.display  = 'none';
        noFilterMsg.style.display   = 'block';
        noFilterMsg.innerHTML       = `
            <span class="material-symbols-outlined" style="font-size:3rem;display:block;margin-bottom:10px;color:#ccc;">filter_list</span>
            Please select a Block to view student records.`;

        if (filtered.length === 1) {
            blockSelect.selectedIndex = 1;
            blockSelect.dispatchEvent(new Event('change'));
        }
    });

    // ══════════════════════════════════════════════
    // STEP 3 — Block selected → fetch appeals
    // ══════════════════════════════════════════════

    blockSelect.addEventListener('change', () => {
        const selected   = blockSelect.options[blockSelect.selectedIndex];
        const deptId     = selected.getAttribute('data-dept');
        const year       = selected.getAttribute('data-year');
        const block      = selected.getAttribute('data-block');
        const scheduleId = selected.getAttribute('data-schedule');

        currentFilter = { deptId, year, block, scheduleId };

        const sectionToRestore = currentSection;
        fetchAppeals(deptId, year, block, sectionToRestore, 'pending', scheduleId);
    });

    // ══════════════════════════════════════════════
    // FETCH APPEALS
    // ══════════════════════════════════════════════
    function fetchAppeals(deptId, year, block, restoreSection = 'e', restoreTab = 'pending', scheduleId = null) {
        excuseSection.style.display = 'none';
        leaveSection.style.display  = 'none';
        noFilterMsg.style.display   = 'block';
        noFilterMsg.innerHTML       = `
            <span class="material-symbols-outlined" style="font-size:2rem;display:block;margin-bottom:8px;color:#620e2c;">hourglass_top</span>
            Loading student records...`;

        const formData = new FormData();
        formData.append('dept_id',     deptId);
        formData.append('year',        year);
        formData.append('block',       block);
        if (scheduleId) formData.append('schedule_id', scheduleId);

        fetch('/astraea-academy/astraea-academy/faculty/facultydashboardSTUDENTFETCH.php', {
            method: 'POST',
            body:   formData,
        })
        .then(res => res.json())
        .then(data => {
            noFilterMsg.style.display = 'none';

            if (!data.success) {
                noFilterMsg.style.display = 'block';
                noFilterMsg.innerHTML     = `<span style="color:red;">Error: ${data.message}</span>`;
                return;
            }

            allAppeals.excuse = data.appeals.filter(a => isExcuse(a.time_type));
            allAppeals.leave  = data.appeals.filter(a => !isExcuse(a.time_type));

            renderPendingCards('e', allAppeals.excuse.filter(a => a.status === 'pending'));
            renderTable('e-approved-view', allAppeals.excuse.filter(a => a.status === 'approved'), 'approved');
            renderTable('e-declined-view', allAppeals.excuse.filter(a => a.status === 'rejected'), 'declined');

            renderPendingCards('l', allAppeals.leave.filter(a => a.status === 'pending'));
            renderTable('l-approved-view', allAppeals.leave.filter(a => a.status === 'approved'), 'approved');
            renderTable('l-declined-view', allAppeals.leave.filter(a => a.status === 'rejected'), 'declined');

            updateBadge('e-pending-count', allAppeals.excuse.filter(a => a.status === 'pending').length);
            updateBadge('l-pending-count', allAppeals.leave.filter(a => a.status === 'pending').length);

            if (restoreSection === 'l') {
                excuseSection.style.display  = 'none';
                leaveSection.style.display   = 'block';
                btnExcuse.classList.remove('active');
                btnLeave.classList.add('active');
                toggleSlider.style.transform = 'translateX(175px)';
                currentSection = 'l';
            } else {
                excuseSection.style.display  = 'block';
                leaveSection.style.display   = 'none';
                btnExcuse.classList.add('active');
                btnLeave.classList.remove('active');
                toggleSlider.style.transform = 'translateX(0)';
                currentSection = 'e';
            }

            const sectionEl = restoreSection === 'l' ? leaveSection : excuseSection;
            const allTabs = sectionEl.querySelectorAll('.tab');
            let matched = false;
            allTabs.forEach(t => {
                const target = t.getAttribute('data-target') || '';
                if (target.includes(restoreTab)) {
                    t.click();
                    matched = true;
                }
            });
            if (!matched && allTabs.length > 0) allTabs[0].click();
            currentTabState = restoreTab;

            attachCardListeners();
            attachRowListeners();
            setupSearch();
        })
        .catch(err => {
            noFilterMsg.style.display = 'block';
            noFilterMsg.innerHTML     = '<span style="color:red;">Network error. Please try again.</span>';
            console.error('Fetch error:', err);
        });
    }

    // ══════════════════════════════════════════════
    // HELPERS
    // ══════════════════════════════════════════════
    function isExcuse(type) {
        return ['extracurricular_activity', 'medical_appointment', 'personal_emergency', 'other_excuse'].includes(type);
    }

    function updateBadge(id, count) {
        const badge = document.getElementById(id);
        if (!badge) return;
        badge.textContent   = count > 0 ? count : '';
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    }

    function formatDate(d) {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    const typeMap = {
        emergency_leave:          'Emergency Leave',
        sick_leave:               'Sick Leave',
        leave_of_absence:         'Leave of Absence',
        other_leave:              'Other Leave',
        extracurricular_activity: 'Extracurricular Activity',
        medical_appointment:      'Medical Appointment',
        personal_emergency:       'Personal Emergency',
        other_excuse:             'Other Excuse',
    };
    function formatType(t) { return typeMap[t] || t; }

    // ══════════════════════════════════════════════
    // RENDER: PENDING CARDS
    // ══════════════════════════════════════════════
    function renderPendingCards(prefix, appeals) {
        const view = document.getElementById(`${prefix}-pending-view`);
        if (!view) return;

        if (appeals.length === 0) {
            view.innerHTML = `<div class="empty-state" style="text-align:center;padding:30px;color:#999;">
                <span class="material-symbols-outlined" style="font-size:2.5rem;display:block;margin-bottom:8px;">folder_open</span>
                No pending requests.
            </div>`;
            return;
        }

        let html = '<div class="cards-grid">';
        appeals.forEach(a => {
            html += `
            <div class="request-card" data-appeal='${JSON.stringify(a).replace(/'/g, "&#39;")}'>
                <div class="card-body">
                    <div class="appeal-header">
                        <div class="appeal-title-group">
                            <span class="icon">📄</span>
                            <h3 class="appeal-type">${formatType(a.time_type)}</h3>
                        </div>
                        <p class="apply-date">Applied on: ${formatDate(a.date_filed)}</p>
                    </div>
                    <div class="appeal-detail-section card-details">
                        <div class="detail-row">
                            <span class="detail-label">Student Name:</span>
                            <span class="detail-value student-name">${a.first_name} ${a.last_name}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Student ID:</span>
                            <span class="detail-value">${a.user_uid}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Year &amp; Block:</span>
                            <span class="detail-value">Year ${a.student_year} - Block ${a.student_block}</span>
                        </div>
                    </div>
                    <button class="review-btn ${prefix}-review-btn full-width-btn">View Appeal Summary</button>
                </div>
            </div>`;
        });
        html += '</div>';
        view.innerHTML = html;
    }

    // ══════════════════════════════════════════════
    // RENDER: APPROVED / DECLINED TABLE
    // ══════════════════════════════════════════════
    function renderTable(viewId, appeals, type) {
        const view = document.getElementById(viewId);
        if (!view) return;

        const isLeave   = viewId.startsWith('l-');
        const colLabel  = isLeave ? 'Leave Duration' : 'Date of Absence';
        const prefix    = viewId.startsWith('e-') ? 'e' : 'l';
        const rowClass  = `${prefix}-${type}-row`;

        if (appeals.length === 0) {
            view.innerHTML = `<div class="empty-state" style="text-align:center;padding:30px;color:#999;">
                <span class="material-symbols-outlined" style="font-size:2.5rem;display:block;margin-bottom:8px;">folder_open</span>
                No ${type} requests.
            </div>`;
            return;
        }

        let rows = '';
        appeals.forEach((a, i) => {
            const dateCol = isLeave
                ? `${formatDate(a.start_date)} – ${formatDate(a.end_date)}`
                : formatDate(a.start_date);
            const attachHtml = a.attachment
                ? `<a href="../uploads/${a.attachment}" class="attachment-link" target="_blank">${a.attachment}</a>`
                : '<span style="opacity:0.6;">No attachment</span>';

            rows += `
            <tr class="${rowClass}" data-appeal='${JSON.stringify(a).replace(/'/g, "&#39;")}'>
                <td>${i + 1}</td>
                <td>${a.first_name} ${a.last_name}</td>
                <td>${dateCol}</td>
                <td>${a.status_updated_by || '—'}</td>
                <td>${attachHtml}</td>
            </tr>`;
        });

        view.innerHTML = `
        <div class="table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Student Name</th>
                        <th>${colLabel}</th>
                        <th>Approved By</th>
                        <th>Attachment</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>`;
    }

    // ══════════════════════════════════════════════
    // BUILD BASE DETAIL HTML
    // ══════════════════════════════════════════════
    function buildDetailHTML(a) {
        const attachHtml = a.attachment
            ? `<a href="../uploads/${a.attachment}" class="attachment-link" target="_blank">${a.attachment}</a>`
            : '<span style="color:#999;">No attachment</span>';

        return `
        <div class="appeal-detail-section">
            <div class="detail-row"><span class="detail-label">Student Name:</span><span class="detail-value student-name">${a.first_name} ${a.last_name}</span></div>
            <div class="detail-row"><span class="detail-label">Student ID:</span><span class="detail-value">${a.user_uid}</span></div>
            <div class="detail-row"><span class="detail-label">Year:</span><span class="detail-value">${a.student_year || '—'}</span></div>
            <div class="detail-row"><span class="detail-label">Block:</span><span class="detail-value">${a.student_block || '—'}</span></div>
            <div class="detail-row"><span class="detail-label">Date Applied:</span><span class="detail-value">${formatDate(a.date_filed)}</span></div>
            <div class="detail-row"><span class="detail-label">Appeal Type:</span><span class="detail-value">${formatType(a.time_type)}</span></div>
            <div class="detail-row"><span class="detail-label">Start Date:</span><span class="detail-value">${formatDate(a.start_date)}</span></div>
            <div class="detail-row"><span class="detail-label">End Date:</span><span class="detail-value">${formatDate(a.end_date)}</span></div>
            <div class="detail-row"><span class="detail-label">Number of Days:</span><span class="detail-value">${a.number_of_days}</span></div>
            <div class="detail-row"><span class="detail-label">Return on:</span><span class="detail-value">${formatDate(a.return_on)}</span></div>
            <div class="detail-row attachment-row"><span class="detail-label">Attachment:</span>${attachHtml}</div>
            ${a.status_updated_by && a.status !== 'pending' ? `<div class="detail-row updated-by-row"><span class="detail-label">Status Updated by:</span><span class="detail-value">${a.status_updated_by}</span></div>` : ''}
        </div>
        <div id="warning-section-placeholder"></div>`;
    }

    // ══════════════════════════════════════════════
    // FETCH + INJECT WARNING BANNER
    // ══════════════════════════════════════════════
    function fetchAndInjectWarning(appeal, infoDiv) {
        if (appeal.status === 'approved') return;

        const formData = new FormData();
        formData.append('start_date',  appeal.start_date);
        formData.append('end_date',    appeal.end_date);
        formData.append('student_uid', appeal.user_uid);

        fetch('/astraea-academy/astraea-academy/faculty/facultydashboardSTUDENTAFFECTED.php', {
            method: 'POST',
            body:   formData,
        })
        .then(res => res.json())
        .then(data => {
            const placeholder = infoDiv.querySelector('#warning-section-placeholder');
            if (!placeholder) return;

            if (data.success && data.affected.length > 0) {
                let rows = '';
                data.affected.forEach(sc => {
                    rows += `<tr>
                        <td>• ${sc.subject_name}</td>
                        <td>(${sc.day_week} ${sc.time})</td>
                    </tr>`;
                });

                placeholder.innerHTML = `
                <div class="warning-banner">
                    <span class="warning-icon">⚠️ Warning:</span>
                    <span class="warning-text">This leave overlaps with ${data.affected.length} of your handled subject${data.affected.length > 1 ? 's' : ''}.</span>
                </div>
                <div class="affected-classes-box">
                    <table class="affected-table">
                        <thead>
                            <tr><th>Affected Classes</th><th>Time</th></tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>`;
            } else {
                placeholder.innerHTML = '';
            }
        })
        .catch(err => console.error('Warning fetch error:', err));
    }

    function attachCardListeners() {
        ['e', 'l'].forEach(prefix => {
            document.querySelectorAll(`#${prefix}-pending-view .${prefix}-review-btn`).forEach(btn => {
                btn.addEventListener('click', () => {
                    const card   = btn.closest('.request-card');
                    const appeal = JSON.parse(card.getAttribute('data-appeal'));
                    openDetail(prefix, 'pending', appeal);
                });
            });
        });
    }

    function attachRowListeners() {
        ['e', 'l'].forEach(prefix => {
            ['approved', 'declined'].forEach(type => {
                const viewId   = `${prefix}-${type}-view`;
                const rowClass = `.${prefix}-${type}-row`;
                document.querySelectorAll(`#${viewId} ${rowClass}`).forEach(row => {
                    row.addEventListener('click', () => {
                        const appeal = JSON.parse(row.getAttribute('data-appeal'));
                        openDetail(prefix, type, appeal);
                    });
                });
            });
        });
    }

    // ══════════════════════════════════════════════
    // OPEN DETAIL VIEW
    // ══════════════════════════════════════════════
    function openDetail(prefix, tabKey, appeal) {
        currentAppeal   = appeal;
        currentSection  = prefix;
        currentTabState = tabKey;

        const view       = document.getElementById(`${prefix}-${tabKey}-view`);
        const detail     = document.getElementById(`${prefix}-${tabKey}-detail`);
        const controls   = document.getElementById(`${prefix}-${tabKey}-controls`);
        const title      = document.getElementById(`${prefix}-${tabKey}-title`);
        const infoDiv    = document.getElementById(`${prefix}-${tabKey}-detail-info`);
        const commentBox = document.getElementById(`${prefix}-${tabKey}-comment`);

        infoDiv.innerHTML = buildDetailHTML(appeal);

        fetchAndInjectWarning(appeal, infoDiv);

        if (commentBox) {
            commentBox.value    = appeal.comment || '';
            commentBox.readOnly = (tabKey !== 'pending');
        }

        if (view)     view.style.display     = 'none';
        if (controls) controls.style.display = 'none';
        if (title)    title.style.display    = 'none';
        if (detail)   detail.style.display   = 'block';
    }

    // ══════════════════════════════════════════════
    // BACK BUTTONS
    // ══════════════════════════════════════════════
    ['e', 'l'].forEach(prefix => {
        ['pending', 'approved', 'declined'].forEach(tab => {
            const backBtn = document.getElementById(`${prefix}-${tab}-back-btn`);
            if (!backBtn) return;
            backBtn.addEventListener('click', () => {
                const detail   = document.getElementById(`${prefix}-${tab}-detail`);
                const view     = document.getElementById(`${prefix}-${tab}-view`);
                const controls = document.getElementById(`${prefix}-${tab}-controls`);
                const title    = document.getElementById(`${prefix}-${tab}-title`);

                if (detail)   detail.style.display   = 'none';
                if (view)     view.style.display      = 'block';
                if (controls) controls.style.display  = 'flex';
                if (title)    title.style.display     = 'block';
                currentAppeal = null;
            });
        });
    });

    // ══════════════════════════════════════════════
    // TAB SWITCHING
    // ══════════════════════════════════════════════
    ['excuse-section', 'leave-section'].forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (!section) return;
        section.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                section.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                section.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
                const target = document.getElementById(tab.getAttribute('data-target'));
                if (target) target.style.display = 'block';
            });
        });
    });

    // ══════════════════════════════════════════════
    // SORT
    // ══════════════════════════════════════════════
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.sort-dropdown-container')) {
            document.querySelectorAll('.sort-menu').forEach(m => m.style.display = 'none');
        }

        if (e.target.closest('.sort-btn')) {
            e.stopPropagation();
            const menu = e.target.closest('.sort-dropdown-container').querySelector('.sort-menu');
            document.querySelectorAll('.sort-menu').forEach(m => { if (m !== menu) m.style.display = 'none'; });
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        }

        if (e.target.matches('.sort-menu a')) {
            e.preventDefault();
            const sortType = e.target.getAttribute('data-sort');
            const viewId   = e.target.getAttribute('data-view');
            const itemType = e.target.getAttribute('data-type');
            sortView(viewId, sortType, itemType);
            e.target.closest('.sort-menu').style.display = 'none';
        }
    });

    function sortView(viewId, sortType, itemType) {
        const prefix   = viewId.startsWith('e-') ? 'e' : 'l';
        const tabPart  = viewId.replace(`${prefix}-`, '').replace('-view', '');
        const statusDb = tabPart === 'declined' ? 'rejected' : tabPart;
        const source   = prefix === 'e' ? allAppeals.excuse : allAppeals.leave;
        const filtered = source.filter(a => a.status === statusDb);

        filtered.sort((a, b) => {
            const dateA = new Date(a.date_filed);
            const dateB = new Date(b.date_filed);
            return sortType === 'newest' ? dateB - dateA : dateA - dateB;
        });

        if (itemType === 'card') {
            renderPendingCards(prefix, filtered);
            attachCardListeners();
        } else {
            renderTable(viewId, filtered, tabPart === 'approved' ? 'approved' : 'declined');
            attachRowListeners();
        }
        setupSearch();
    }

    // ══════════════════════════════════════════════
    // SEARCH
    // ══════════════════════════════════════════════
    function setupSearch() {
        [['e-search', 'e-pending-view'], ['l-search', 'l-pending-view']].forEach(([inputClass, viewId]) => {
            const input = document.querySelector(`.${inputClass}`);
            if (!input) return;
            input.oninput = (e) => {
                const term = e.target.value.toLowerCase();
                document.querySelectorAll(`#${viewId} .request-card`).forEach(card => {
                    const name = card.querySelector('.student-name')?.textContent.toLowerCase() || '';
                    card.style.display = name.includes(term) ? '' : 'none';
                });
            };
        });

        [
            ['e-app-search', 'e-approved-view'],
            ['e-dec-search', 'e-declined-view'],
            ['l-app-search', 'l-approved-view'],
            ['l-dec-search', 'l-declined-view'],
        ].forEach(([inputClass, viewId]) => {
            const input = document.querySelector(`.${inputClass}`);
            if (!input) return;
            input.oninput = (e) => {
                const term = e.target.value.toLowerCase();
                document.querySelectorAll(`#${viewId} tbody tr`).forEach(row => {
                    const name = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
                    row.style.display = name.includes(term) ? '' : 'none';
                });
            };
        });
    }

    // ══════════════════════════════════════════════
    // MODALS & STATUS UPDATE
    // ══════════════════════════════════════════════
    const overlay = document.getElementById('modal-overlay');

    function openModal(id) {
        if (overlay) overlay.style.display = 'block';
        const m = document.getElementById(id);
        if (m) m.style.display = 'block';
    }

    function closeAllModals() {
        if (overlay) overlay.style.display = 'none';
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    }

    if (overlay) overlay.addEventListener('click', closeAllModals);

    function getComment() {
        const box = document.getElementById(`${currentSection}-${currentTabState}-comment`);
        return box ? box.value.trim() : '';
    }

    function updateStatus(action) {
        if (!currentAppeal) return;
        const loading = document.getElementById('loading-indicator');
        if (loading) loading.style.display = 'block';

        const formData = new FormData();
        formData.append('appeal_id', currentAppeal.id);
        formData.append('action',    action);
        formData.append('comment',   getComment());

        fetch('/astraea-academy/astraea-academy/faculty/facultydashboardSTUDENTAPPEALUPDATE.php', {
            method: 'POST',
            body:   formData,
        })
        .then(res => res.json())
        .then(data => {
            if (loading) loading.style.display = 'none';
            if (data.success) {
                if (action === 'approve') {
                    openModal(currentSection === 'e' ? 'e-approve-modal' : 'l-approve-modal');
                } else if (action === 'reject') {
                    openModal('decline-success-modal');
                } else {
                    openModal('reeval-success-modal');
                }
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(err => {
            if (loading) loading.style.display = 'none';
            alert('Network error. Please try again.');
            console.error(err);
        });
    }

    document.querySelectorAll('.e-trigger-approve, .l-trigger-approve').forEach(btn => {
        btn.addEventListener('click', () => updateStatus('approve'));
    });
    document.querySelectorAll('.e-trigger-decline, .l-trigger-decline').forEach(btn => {
        btn.addEventListener('click', () => updateStatus('reject'));
    });
    document.querySelectorAll('.e-trigger-reeval, .l-trigger-reeval').forEach(btn => {
        btn.addEventListener('click', () => openModal('reeval-confirm-modal'));
    });

    document.getElementById('cancel-reeval-btn')?.addEventListener('click', closeAllModals);
    document.getElementById('confirm-reeval-btn')?.addEventListener('click', () => {
        closeAllModals();
        updateStatus('reeval');
    });

    // ══════════════════════════════════════════════
    // MODAL BACK BUTTONS
    // ══════════════════════════════════════════════
    document.querySelectorAll('.reset-pending-btn, .e-back-pending, .l-back-pending').forEach(btn => {
        btn.addEventListener('click', () => {
            closeAllModals();

            const savedSection = currentSection;
            const savedTab     = 'pending';

            ['e', 'l'].forEach(prefix => {
                ['pending', 'approved', 'declined'].forEach(tab => {
                    const detail   = document.getElementById(`${prefix}-${tab}-detail`);
                    const view     = document.getElementById(`${prefix}-${tab}-view`);
                    const controls = document.getElementById(`${prefix}-${tab}-controls`);
                    const title    = document.getElementById(`${prefix}-${tab}-title`);

                    if (detail)   detail.style.display   = 'none';
                    if (view)     view.style.display      = 'block';
                    if (controls) controls.style.display  = 'flex';
                    if (title)    title.style.display     = 'block';
                });
            });

            currentAppeal = null;

            const { deptId, year, block, scheduleId } = currentFilter;
            if (deptId && year && block) {
                fetchAppeals(deptId, year, block, savedSection, savedTab, scheduleId);
            } else {
                window.location.reload();
            }
        });
    });

});