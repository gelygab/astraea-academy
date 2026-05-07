document.addEventListener('DOMContentLoaded', () => {


    // Dropdown logic for selecting subject, program, and block
    const subjectSelect = document.getElementById('subject-select');
    const programSelect = document.getElementById('program-select');
    const blockSelect   = document.getElementById('block-select');
    const excuseSection = document.getElementById('excuse-section');
    const leaveSection  = document.getElementById('leave-section');
    const noFilterMsg   = document.getElementById('no-filter-msg');


    let fetchedSchedules = [];


    let cachedData = {
        e_pending:  [],
        l_pending:  [],
        e_approved: [],
        l_approved: [],
        e_declined: [],
        l_declined: []
    };
    let cachedProgramName = '';


    excuseSection.style.display = 'none';
    leaveSection.style.display  = 'none';


    function clearCards() {
        const eView = document.getElementById('e-pending-view');
        const lView = document.getElementById('l-pending-view');
        const emptyMsg = '<p style="text-align:center; padding: 30px; color: #888;">Select a class to view requests.</p>';
        if (eView) eView.innerHTML = emptyMsg;
        if (lView) lView.innerHTML = emptyMsg;
    }


    if (subjectSelect) {
        subjectSelect.addEventListener('change', () => {
            const selected    = subjectSelect.options[subjectSelect.selectedIndex];
            const subjectCode = selected.getAttribute('data-code');


            programSelect.innerHTML = '<option value="" disabled selected hidden>Loading...</option>';
            programSelect.disabled  = true;
            blockSelect.innerHTML   = '<option value="" disabled selected hidden>Select program first</option>';
            blockSelect.disabled    = true;


            excuseSection.style.display = 'none';
            leaveSection.style.display  = 'none';
            if (noFilterMsg) noFilterMsg.style.display = 'block';


            clearCards();


            const formData = new FormData();
            formData.append('subject_code', subjectCode);


            fetch('api/api_student_filter.php', { method: 'POST', body: formData })
                .then(res => res.json())
                .then(data => {
                    if (!data.success) {
                        programSelect.innerHTML = '<option value="" disabled selected hidden>Error loading programs</option>';
                        return;
                    }
                    fetchedSchedules = data.schedules;
                    programSelect.innerHTML = '<option value="" disabled selected hidden>Select program</option>';
                    data.depts.forEach(dept => {
                        const opt = document.createElement('option');
                        opt.value       = dept.department_id;
                        opt.textContent = `${dept.department_name} (${dept.department_code})`;
                        programSelect.appendChild(opt);
                    });
                    programSelect.disabled = false;
                })
                .catch(err => console.error("Network Error:", err));
        });
    }


    if (programSelect) {
        programSelect.addEventListener('change', () => {
            const deptId         = programSelect.value;
            const filteredBlocks = fetchedSchedules.filter(s => s.department_id == deptId);


            const seen         = new Set();
            const uniqueBlocks = filteredBlocks.filter(sc => {
                const key = `${sc.department_id}-${sc.student_year}-${sc.student_block}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });


            clearCards();
            blockSelect.innerHTML = '<option value="" disabled selected hidden>Select block</option>';
            uniqueBlocks.forEach(sc => {
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
        });
    }


    if (blockSelect) {
        blockSelect.addEventListener('change', () => {
            const selected   = blockSelect.options[blockSelect.selectedIndex];
            const deptId     = selected.getAttribute('data-dept');
            const year       = selected.getAttribute('data-year');
            const block      = selected.getAttribute('data-block');
            const scheduleId = selected.getAttribute('data-schedule');


            cachedProgramName = programSelect.options[programSelect.selectedIndex].text;


            const formData = new FormData();
            formData.append('dept_id',     deptId);
            formData.append('year',        year);
            formData.append('block',       block);
            formData.append('schedule_id', scheduleId);


            fetch('api/api_student_fetch.php', { method: 'POST', body: formData })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        resetAllDetailViews();


                        cachedData.e_pending  = data.excuse.filter(a => a.status.toLowerCase() === 'pending');
                        cachedData.l_pending  = data.leave.filter(a => a.status.toLowerCase() === 'pending');
                        cachedData.e_approved = data.excuse.filter(a => a.status.toLowerCase() === 'approved');
                        cachedData.l_approved = data.leave.filter(a => a.status.toLowerCase() === 'approved');
                        cachedData.e_declined = data.excuse.filter(a => a.status.toLowerCase() === 'rejected');
                        cachedData.l_declined = data.leave.filter(a => a.status.toLowerCase() === 'rejected');


                        renderPendingCards('e', cachedData.e_pending, cachedProgramName);
                        renderPendingCards('l', cachedData.l_pending, cachedProgramName);
                        renderTable('e', 'approved', cachedData.e_approved);
                        renderTable('l', 'approved', cachedData.l_approved);
                        renderTable('e', 'declined', cachedData.e_declined);
                        renderTable('l', 'declined', cachedData.l_declined);


                        if (noFilterMsg) noFilterMsg.style.display = 'none';
                        reattachSearch();


                        const btnExcuse = document.getElementById('btn-excuse');
                        if (btnExcuse.classList.contains('active')) {
                            excuseSection.style.display = 'block';
                            leaveSection.style.display  = 'none';
                        } else {
                            leaveSection.style.display  = 'block';
                            excuseSection.style.display = 'none';
                        }
                    }
                })
                .catch(err => console.error("Fetch Error:", err));
        });
    }


    // Clear out the detail views
    function resetAllDetailViews() {
        const pairs = [
            { view: 'e-pending-view',  detail: 'e-pending-detail',  controls: 'e-pending-controls',  title: 'e-pending-title'  },
            { view: 'l-pending-view',  detail: 'l-pending-detail',  controls: 'l-pending-controls',  title: 'l-pending-title'  },
            { view: 'e-approved-view', detail: 'e-approved-detail', controls: 'e-approved-controls', title: 'e-approved-title' },
            { view: 'l-approved-view', detail: 'l-approved-detail', controls: 'l-approved-controls', title: 'l-approved-title' },
            { view: 'e-declined-view', detail: 'e-declined-detail', controls: 'e-declined-controls', title: 'e-declined-title' },
            { view: 'l-declined-view', detail: 'l-declined-detail', controls: 'l-declined-controls', title: 'l-declined-title' },
        ];
        pairs.forEach(p => {
            const view    = document.getElementById(p.view);
            const detail  = document.getElementById(p.detail);
            const ctrl    = document.getElementById(p.controls);
            const titleEl = document.getElementById(p.title);
            if (view)    view.style.display    = 'block';
            if (detail)  detail.style.display  = 'none';
            if (ctrl)    ctrl.style.display    = 'flex';
            if (titleEl) titleEl.style.display = 'block';
        });
    }


    // Check for overlaps and show warnings
    function fetchAndInjectWarning(appealData, detailView) {
        const warningBanner = detailView.querySelector('.warning-banner');
        const warningTextEl = detailView.querySelector('.warning-text');
        const affectedTbody = detailView.querySelector('.affected-table tbody');


        if (warningTextEl) warningTextEl.textContent = 'Loading affected classes...';
        if (affectedTbody) affectedTbody.innerHTML =
            '<tr><td colspan="2" style="text-align:center;padding:10px;color:#888;">Loading...</td></tr>';


        const startDate  = appealData.start_date  || '';
        const endDate    = appealData.end_date    || '';
        const studentUid = appealData.user_uid    || '';


        if (!startDate || !endDate) {
            console.error('fetchAndInjectWarning: missing dates in appealData', appealData);
            if (warningTextEl) warningTextEl.textContent = 'Could not load affected classes (missing dates).';
            if (affectedTbody) affectedTbody.innerHTML =
                '<tr><td colspan="2" style="text-align:center;padding:10px;color:#c00;">Missing date data.</td></tr>';
            return;
        }


        const formData = new FormData();
        formData.append('start_date',  startDate);
        formData.append('end_date',    endDate);
        formData.append('student_uid', studentUid);


        fetch('api/api_get_affected_classes.php', { method: 'POST', body: formData })
            .then(res => res.text().then(text => {
                if (!text || text.trim() === '') throw new Error('Empty response from server');
                try {
                    return JSON.parse(text);
                } catch (e) {
                    throw new Error('Invalid JSON: ' + text.substring(0, 300));
                }
            }))
            .then(data => {
                if (!data.success) {
                    if (warningTextEl) warningTextEl.textContent = 'Could not load affected classes.';
                    if (affectedTbody) affectedTbody.innerHTML =
                        '<tr><td colspan="2" style="text-align:center;padding:10px;color:#c00;">' +
                        (data.message || 'Error loading data.') + '</td></tr>';
                    return;
                }


                const classes = data.classes || data.affected || [];
                const count   = data.affected_count ?? classes.length;


                if (warningBanner) warningBanner.style.display = count === 0 ? 'none' : '';


                if (warningTextEl) {
                    if (count === 0) {
                        warningTextEl.textContent = 'This request does not overlap with any of your handled subjects.';
                    } else if (count === 1) {
                        warningTextEl.textContent = 'This request overlaps with 1 of your handled subjects.';
                    } else {
                        warningTextEl.textContent = `This request overlaps with ${count} of your handled subjects.`;
                    }
                }


                if (affectedTbody) {
                    if (classes.length === 0) {
                        affectedTbody.innerHTML =
                            '<tr><td colspan="2" style="text-align:center;padding:10px;color:#888;">No affected classes found.</td></tr>';
                    } else {
                        const fmt = (t) => {
                            if (!t) return '—';
                            const parts = t.split(':');
                            let h = parseInt(parts[0], 10);
                            const m    = parts[1] || '00';
                            const ampm = h >= 12 ? 'PM' : 'AM';
                            h = h % 12 || 12;
                            return `${h}:${m} ${ampm}`;
                        };


                        affectedTbody.innerHTML = classes.map(c => {
                            const timeStr = (c.time_start && c.time_end)
                                ? `${fmt(c.time_start)} – ${fmt(c.time_end)}`
                                : (c.time || '—');


                            const dayLabel = c.day_of_week || c.day_week || '';
                            const subjectLabel = c.subject_name
                                ? `${c.subject_name}${dayLabel ? ' (' + dayLabel + ')' : ''}`
                                : c.subject_code;


                            return `<tr>
                                <td style="padding:10px 20px; font-weight:600;">${subjectLabel}</td>
                                <td style="padding:10px 20px; text-align:right; font-weight:600;">${timeStr}</td>
                            </tr>`;
                        }).join('');
                    }
                }
            })
            .catch(err => {
                console.error('fetchAndInjectWarning error:', err);
                if (warningTextEl) warningTextEl.textContent = 'Could not load affected classes.';
                if (affectedTbody) affectedTbody.innerHTML =
                    '<tr><td colspan="2" style="text-align:center;padding:10px;color:#c00;">Network error.</td></tr>';
            });
    }


    // Render pending cards
    function renderPendingCards(prefix, appeals, programName) {
        const view = document.getElementById(`${prefix}-pending-view`);
        if (!view) return;


        if (appeals.length === 0) {
            view.innerHTML = '<p style="text-align:center; padding: 30px; color: #888;">No pending requests found for this class.</p>';
            return;
        }


        let html = '<div class="cards-grid">';
        appeals.forEach(a => {
            const typeText = a.time_type
                ? a.time_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                : 'Appeal';
            html += `
            <div class="request-card" data-appeal='${JSON.stringify(a).replace(/'/g, "&#39;")}'>
                <div class="card-body">
                    <div class="appeal-header">
                        <div class="appeal-title-group">
                            <span class="icon">📄</span>
                            <h3 class="appeal-type">${typeText}</h3>
                        </div>
                        <p class="apply-date">Applied on: ${a.date_filed}</p>
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
                            <span class="detail-label">College:</span>
                            <span class="detail-value">College of Engineering</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Program:</span>
                            <span class="detail-value program-name">${programName}</span>
                        </div>
                    </div>
                    <button class="review-btn ${prefix}-review-btn full-width-btn">View Appeal Summary</button>
                </div>
            </div>`;
        });
        html += '</div>';
        view.innerHTML = html;
        setupViewToggles(prefix);
    }


    // Render approved/declined table
    function renderTable(prefix, status, appeals) {
        const tbody = document.querySelector(`#${prefix}-${status}-view tbody`);
        if (!tbody) return;


        if (appeals.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:#888;">No ${status} requests found.</td></tr>`;
            return;
        }


        let html = '';
        appeals.forEach((a, index) => {
            const dateOfAbsence  = prefix === 'e' ? a.start_date : `${a.start_date} to ${a.end_date}`;
            const attachmentHtml = (a.attachment && a.attachment !== 'null' && a.attachment !== '')
                ? `<a href="../student/uploads/${a.attachment}" target="_blank" class="attachment-link" style="color:#B88B2D;" onclick="event.stopPropagation();">${a.attachment}</a>`
                : `<span style="color:#ccc;">No attached proof</span>`;
            const approvedBy = a.status_updated_by || '—';
            html += `
            <tr class="${status}-row" style="cursor:pointer;" data-appeal='${JSON.stringify(a).replace(/'/g, "&#39;")}'>
                <td style="padding:15px;">${index + 1}</td>
                <td style="font-weight:500;">${a.first_name} ${a.last_name}</td>
                <td>${dateOfAbsence}</td>
                <td>${approvedBy}</td>
                <td>${attachmentHtml}</td>
            </tr>`;
        });
        tbody.innerHTML = html;


        tbody.querySelectorAll('tr[data-appeal]').forEach(row => {
            row.addEventListener('click', () => {
                const appealData = JSON.parse(row.getAttribute('data-appeal'));
                showResolvedDetail(prefix, status, appealData);
            });
        });
    }


    // Shows summary when a row is clicked
    function showResolvedDetail(prefix, status, appealData) {
        const tableView   = document.getElementById(`${prefix}-${status}-view`);
        const detailView  = document.getElementById(`${prefix}-${status}-detail`);
        const controlsRow = document.getElementById(`${prefix}-${status}-controls`);
        const titleEl     = document.getElementById(`${prefix}-${status}-title`);
        if (!tableView || !detailView) return;


        const typeText    = appealData.time_type
            ? appealData.time_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            : 'Appeal';
        const programName = programSelect.options[programSelect.selectedIndex]?.text || '—';


        const detailSection = detailView.querySelector('.appeal-detail-section');
        if (detailSection) {
            detailSection.innerHTML = `
                <div class="detail-row"><span class="detail-label">Student Name:</span><span class="detail-value">${appealData.first_name} ${appealData.last_name}</span></div>
                <div class="detail-row"><span class="detail-label">Student ID:</span><span class="detail-value">${appealData.user_uid}</span></div>
                <div class="detail-row"><span class="detail-label">College:</span><span class="detail-value">College of Engineering</span></div>
                <div class="detail-row"><span class="detail-label">Program:</span><span class="detail-value">${programName}</span></div>
                <div class="detail-row"><span class="detail-label">Year:</span><span class="detail-value">${appealData.student_year}</span></div>
                <div class="detail-row"><span class="detail-label">Block:</span><span class="detail-value">${appealData.student_block}</span></div>
                <div class="detail-row"><span class="detail-label">Date Applied:</span><span class="detail-value">${appealData.date_filed}</span></div>
                <div class="detail-row"><span class="detail-label">Appeal Type:</span><span class="detail-value">${typeText}</span></div>
                <div class="detail-row"><span class="detail-label">Start Date:</span><span class="detail-value">${appealData.start_date}</span></div>
                <div class="detail-row"><span class="detail-label">End Date:</span><span class="detail-value">${appealData.end_date}</span></div>
                <div class="detail-row"><span class="detail-label">Number of Days:</span><span class="detail-value">${appealData.number_of_days}</span></div>
                <div class="detail-row"><span class="detail-label">Return on:</span><span class="detail-value">${appealData.return_on}</span></div>
                <div class="attachment-section" style="margin-top:10px; margin-bottom:5px;">
                    <p><strong>Attachment:</strong></p>
                    ${(appealData.attachment && appealData.attachment !== 'null' && appealData.attachment !== '')
                        ? `<a href="../student/uploads/${appealData.attachment}" target="_blank" class="attachment-link">${appealData.attachment}</a>`
                        : `<span style="color:#888;">No attached proof</span>`}
                </div>
                <div class="detail-row updated-by-row" style="padding-top:15px; border-top:1px solid rgba(0,0,0,0.08);">
                    <span class="detail-label">Approved By:</span>
                    <span class="detail-value">${appealData.status_updated_by || '—'}</span>
                </div>`;
        }


        const commentArea = detailView.querySelector('.comment-area');
        if (commentArea) commentArea.value = appealData.comment || 'No comment provided.';


        if (status === 'declined') {
            const reevalBtn = detailView.querySelector('.e-trigger-reeval, .l-trigger-reeval');
            if (reevalBtn) {
                const newReevalBtn = reevalBtn.cloneNode(true);
                reevalBtn.parentNode.replaceChild(newReevalBtn, reevalBtn);
                newReevalBtn.onclick = () => {
                    const overlay       = document.getElementById('modal-overlay');
                    const reevalConfirm = document.getElementById('reeval-confirm-modal');
                    if (overlay)       overlay.style.display       = 'block';
                    if (reevalConfirm) reevalConfirm.style.display = 'block';
                    const confirmBtn = document.getElementById('confirm-reeval-btn');
                    if (confirmBtn) {
                        const newConfirmBtn = confirmBtn.cloneNode(true);
                        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
                        newConfirmBtn.addEventListener('click', () => revertToPending(appealData.appeal_id, prefix, status));
                    }
                };
            }
        }


        if (controlsRow) controlsRow.style.display = 'none';
        if (titleEl)     titleEl.style.display     = 'none';
        tableView.style.display  = 'none';
        detailView.style.display = 'block';


        const backBtn = detailView.querySelector('.back-btn');
        if (backBtn) {
            const newBack = backBtn.cloneNode(true);
            backBtn.parentNode.replaceChild(newBack, backBtn);
            newBack.addEventListener('click', () => {
                detailView.style.display = 'none';
                tableView.style.display  = 'block';
                if (controlsRow) controlsRow.style.display = 'flex';
                if (titleEl)     titleEl.style.display     = 'block';
            });
        }


        fetchAndInjectWarning(appealData, detailView);
    }


    function revertToPending(appealId, prefix, status) {
        const formData = new FormData();
        formData.append('appeal_id', appealId);
        formData.append('status',    'pending');
        fetch('api/api_update_status.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const reevalConfirm = document.getElementById('reeval-confirm-modal');
                    const reevalSuccess = document.getElementById('reeval-success-modal');
                    if (reevalConfirm) reevalConfirm.style.display = 'none';
                    if (reevalSuccess) reevalSuccess.style.display = 'block';
                    const blockSelectEl = document.getElementById('block-select');
                    if (blockSelectEl) blockSelectEl.dispatchEvent(new Event('change'));
                } else {
                    alert("Error reverting status.");
                }
            });
    }


    // Toggle switch
    const btnExcuse    = document.getElementById('btn-excuse');
    const btnLeave     = document.getElementById('btn-leave');
    const toggleSlider = document.getElementById('toggle-slider');


    btnExcuse.addEventListener('click', () => {
        if (excuseSection.style.display === 'none' && leaveSection.style.display === 'none') return;
        btnLeave.classList.remove('active');
        btnExcuse.classList.add('active');
        toggleSlider.style.transform = 'translateX(0)';
        leaveSection.style.display  = 'none';
        excuseSection.style.display = 'block';
    });


    btnLeave.addEventListener('click', () => {
        if (excuseSection.style.display === 'none' && leaveSection.style.display === 'none') return;
        btnExcuse.classList.remove('active');
        btnLeave.classList.add('active');
        toggleSlider.style.transform = 'translateX(175px)';
        excuseSection.style.display = 'none';
        leaveSection.style.display  = 'block';
    });


    // Tab switching
    function setupTabs(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;
        const tabs = section.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                section.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
                const targetContent = document.getElementById(tab.getAttribute('data-target'));
                if (targetContent) targetContent.style.display = 'block';
            });
        });
    }


    setupTabs('excuse-section');
    setupTabs('leave-section');


    // Sort
    const SORT_MAP = {
        'Date Applied: Newest to Oldest':    { field: 'date_filed',  dir: 'desc' },
        'Date Applied: Oldest to Newest':    { field: 'date_filed',  dir: 'asc'  },
        'Date of Absence: Newest to Oldest': { field: 'start_date',  dir: 'desc' },
        'Date of Absence: Oldest to Newest': { field: 'start_date',  dir: 'asc'  },
        'Leave Duration: Newest to Oldest':  { field: 'start_date',  dir: 'desc' },
        'Leave Duration: Oldest to Newest':  { field: 'start_date',  dir: 'asc'  },
    };


    function sortAppeals(arr, field, dir) {
        return [...arr].sort((a, b) => {
            const va = a[field] || '';
            const vb = b[field] || '';
            const cmp = va.localeCompare(vb);
            return dir === 'asc' ? cmp : -cmp;
        });
    }


    function getSortContext(sortBtn) {
        const tabContent = sortBtn.closest('.tab-content');
        if (!tabContent) return null;
        const id = tabContent.id;
        const map = {
            'e-pending-tab':  { cacheKey: 'e_pending',  renderFn: () => renderPendingCards('e', cachedData.e_pending,  cachedProgramName) },
            'l-pending-tab':  { cacheKey: 'l_pending',  renderFn: () => renderPendingCards('l', cachedData.l_pending,  cachedProgramName) },
            'e-approved-tab': { cacheKey: 'e_approved', renderFn: () => renderTable('e', 'approved', cachedData.e_approved) },
            'l-approved-tab': { cacheKey: 'l_approved', renderFn: () => renderTable('l', 'approved', cachedData.l_approved) },
            'e-declined-tab': { cacheKey: 'e_declined', renderFn: () => renderTable('e', 'declined', cachedData.e_declined) },
            'l-declined-tab': { cacheKey: 'l_declined', renderFn: () => renderTable('l', 'declined', cachedData.l_declined) },
        };
        return map[id] || null;
    }


    document.addEventListener('click', (e) => {
        if (e.target.closest('.sort-btn')) {
            e.stopPropagation();
            const btn  = e.target.closest('.sort-btn');
            const menu = btn.nextElementSibling;
            document.querySelectorAll('.sort-menu').forEach(m => {
                if (m !== menu) m.style.display = 'none';
            });
            if (menu) menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
            return;
        }


        if (e.target.closest('.sort-menu a')) {
            e.preventDefault();
            e.stopPropagation();
            const anchor  = e.target.closest('.sort-menu a');
            const label   = anchor.textContent.trim();
            const sortCfg = SORT_MAP[label];
            const menu    = anchor.closest('.sort-menu');
            if (menu) menu.style.display = 'none';
            if (!sortCfg) return;
            const sortBtn = menu ? menu.previousElementSibling : null;
            if (!sortBtn) return;
            const ctx = getSortContext(sortBtn);
            if (!ctx) return;
            cachedData[ctx.cacheKey] = sortAppeals(cachedData[ctx.cacheKey], sortCfg.field, sortCfg.dir);
            ctx.renderFn();
            reattachSearch();
            return;
        }


        document.querySelectorAll('.sort-menu').forEach(m => m.style.display = 'none');
    });


    // Pending detail view
    function setupViewToggles(prefix) {
        const reviewBtns = document.querySelectorAll(`.${prefix}-review-btn`);
        const detailView = document.getElementById(`${prefix}-pending-detail`);
        const gridView   = document.getElementById(`${prefix}-pending-view`);
        if (!detailView || !gridView) return;


        reviewBtns.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);


            newBtn.addEventListener('click', (e) => {
                const card       = e.target.closest('.request-card');
                const appealData = JSON.parse(card.getAttribute('data-appeal'));
                const typeText   = appealData.time_type
                    ? appealData.time_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                    : 'Appeal';


                const detailValues = detailView.querySelectorAll('.detail-value');
                if (detailValues.length >= 11) {
                    detailValues[0].textContent  = `${appealData.first_name} ${appealData.last_name}`;
                    detailValues[1].textContent  = appealData.user_uid;
                    detailValues[2].textContent  = "College of Engineering";
                    detailValues[3].textContent  = card.querySelector('.program-name')?.textContent || '—';
                    detailValues[4].textContent  = appealData.student_year;
                    detailValues[5].textContent  = appealData.student_block;
                    detailValues[6].textContent  = appealData.date_filed;
                    detailValues[7].textContent  = typeText;
                    detailValues[8].textContent  = appealData.start_date;
                    detailValues[9].textContent  = appealData.end_date;
                    detailValues[10].textContent = appealData.number_of_days;
                    if (detailValues[11]) detailValues[11].textContent = appealData.return_on;
                }


                const commentBox = detailView.querySelector('.comment-area');
                if (commentBox) {
                    commentBox.value       = appealData.comment || '';
                    commentBox.readOnly    = false;
                    commentBox.placeholder = 'Write a comment...';
                }


                const attachmentLink = detailView.querySelector('.attachment-link');
                if (attachmentLink) {
                    if (appealData.attachment && appealData.attachment !== 'null' && appealData.attachment !== '') {
                        attachmentLink.textContent         = appealData.attachment;
                        attachmentLink.href                = `../student/uploads/${appealData.attachment}`;
                        attachmentLink.style.pointerEvents = 'auto';
                        attachmentLink.style.color         = '#B88B2D';
                    } else {
                        attachmentLink.textContent         = 'No attached proof';
                        attachmentLink.removeAttribute('href');
                        attachmentLink.style.pointerEvents = 'none';
                        attachmentLink.style.color         = '#888';
                    }
                }


                const updatedByRow = detailView.querySelector('.updated-by-row');
                if (updatedByRow) updatedByRow.style.display = 'none';


                fetchAndInjectWarning(appealData, detailView);


                const controlsRow = document.getElementById(`${prefix}-pending-controls`);
                if (controlsRow) controlsRow.style.display = 'none';
                const titleEl = document.getElementById(`${prefix}-pending-title`);
                if (titleEl) titleEl.style.display = 'none';


                gridView.style.display   = 'none';
                detailView.style.display = 'block';


                const approveBtnOld = detailView.querySelector('.approve-btn');
                const declineBtnOld = detailView.querySelector('.decline-btn');


                if (approveBtnOld) {
                    const approveBtn = approveBtnOld.cloneNode(true);
                    approveBtnOld.parentNode.replaceChild(approveBtn, approveBtnOld);
                    approveBtn.addEventListener('click', () => {
                        const comment = detailView.querySelector('.comment-area')?.value || '';
                        handleStatusUpdate(appealData.appeal_id, 'approved', prefix, comment);
                    });
                }


                if (declineBtnOld) {
                    const declineBtn = declineBtnOld.cloneNode(true);
                    declineBtnOld.parentNode.replaceChild(declineBtn, declineBtnOld);
                    declineBtn.addEventListener('click', () => {
                        const comment = detailView.querySelector('.comment-area')?.value || '';
                        handleStatusUpdate(appealData.appeal_id, 'rejected', prefix, comment);
                    });
                }
            });
        });
    }


    setupViewToggles('e');
    setupViewToggles('l');


    document.getElementById('e-pending-back-btn')?.addEventListener('click', () => {
        document.getElementById('e-pending-detail').style.display = 'none';
        document.getElementById('e-pending-view').style.display   = 'block';
        const ctrl  = document.getElementById('e-pending-controls');
        const title = document.getElementById('e-pending-title');
        if (ctrl)  ctrl.style.display  = 'flex';
        if (title) title.style.display = 'block';
    });
    document.getElementById('l-pending-back-btn')?.addEventListener('click', () => {
        document.getElementById('l-pending-detail').style.display = 'none';
        document.getElementById('l-pending-view').style.display   = 'block';
        const ctrl  = document.getElementById('l-pending-controls');
        const title = document.getElementById('l-pending-title');
        if (ctrl)  ctrl.style.display  = 'flex';
        if (title) title.style.display = 'block';
    });


    // Update status and modal handling
    function handleStatusUpdate(appealId, newStatus, prefix, comment) {
        const formData = new FormData();
        formData.append('appeal_id', appealId);
        formData.append('status',    newStatus);
        formData.append('comment',   comment || '');


        fetch('api/api_update_status.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    document.getElementById(`${prefix}-pending-detail`).style.display = 'none';
                    const ctrl  = document.getElementById(`${prefix}-pending-controls`);
                    const title = document.getElementById(`${prefix}-pending-title`);
                    if (ctrl)  ctrl.style.display  = 'flex';
                    if (title) title.style.display = 'block';


                    const overlay = document.getElementById('modal-overlay');
                    if (overlay) overlay.style.display = 'block';


                    if (newStatus === 'rejected') {
                        const decModal = document.getElementById('decline-success-modal');
                        if (decModal) decModal.style.display = 'block';
                    } else if (prefix === 'e') {
                        const excModal = document.getElementById('e-approve-modal');
                        if (excModal) excModal.style.display = 'block';
                    } else {
                        const levModal = document.getElementById('l-approve-modal');
                        if (levModal) levModal.style.display = 'block';
                    }


                    const blockSelectEl = document.getElementById('block-select');
                    if (blockSelectEl) blockSelectEl.dispatchEvent(new Event('change'));
                } else {
                    alert("Error updating status.");
                }
            })
            .catch(err => {
                console.error("handleStatusUpdate error:", err);
                alert("Network error. Please try again.");
            });
    }


    document.querySelectorAll('.back-to-pending-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const overlay = document.getElementById('modal-overlay');
            if (overlay) overlay.style.display = 'none';
            document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
            const eView = document.getElementById('e-pending-view');
            const lView = document.getElementById('l-pending-view');
            if (eView) eView.style.display = 'block';
            if (lView) lView.style.display = 'block';
        });
    });


    // Modals
    const overlay             = document.getElementById('modal-overlay');
    const eApproveModal       = document.getElementById('e-approve-modal');
    const lApproveModal       = document.getElementById('l-approve-modal');
    const declineSuccessModal = document.getElementById('decline-success-modal');
    const reevalConfirmModal  = document.getElementById('reeval-confirm-modal');
    const reevalSuccessModal  = document.getElementById('reeval-success-modal');


    function closeAllModals() {
        if (overlay)             overlay.style.display             = 'none';
        if (eApproveModal)       eApproveModal.style.display       = 'none';
        if (lApproveModal)       lApproveModal.style.display       = 'none';
        if (declineSuccessModal) declineSuccessModal.style.display = 'none';
        if (reevalConfirmModal)  reevalConfirmModal.style.display  = 'none';
        if (reevalSuccessModal)  reevalSuccessModal.style.display  = 'none';
    }


    const cancelReevalBtn = document.getElementById('cancel-reeval-btn');
    if (cancelReevalBtn) cancelReevalBtn.addEventListener('click', closeAllModals);


    document.querySelectorAll('.reset-pending-btn, .e-back-pending, .l-back-pending').forEach(btn => {
        btn.addEventListener('click', () => {
            closeAllModals();
            if (excuseSection.style.display === 'block') {
                document.querySelector('.tab[data-target="e-pending-tab"]')?.click();
            } else {
                document.querySelector('.tab[data-target="l-pending-tab"]')?.click();
            }
        });
    });


    if (overlay) overlay.addEventListener('click', closeAllModals);


    // Search
    function setupSearch(inputSelector, containerSelector, nameSelector) {
        const searchInput = document.querySelector(inputSelector);
        if (!searchInput) return;
        const newInput = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newInput, searchInput);
        newInput.addEventListener('input', (e) => {
            const term  = e.target.value.toLowerCase();
            const items = document.querySelectorAll(containerSelector);
            items.forEach(item => {
                const nameEl = item.querySelector(nameSelector);
                if (nameEl) item.style.display = nameEl.textContent.toLowerCase().includes(term) ? '' : 'none';
            });
        });
    }


    function reattachSearch() {
        setupSearch('.e-search',     '#e-pending-view .request-card', '.student-name');
        setupSearch('.e-app-search', '#e-approved-view tbody tr',     'td:nth-child(2)');
        setupSearch('.e-dec-search', '#e-declined-view tbody tr',     'td:nth-child(2)');
        setupSearch('.l-search',     '#l-pending-view .request-card', '.student-name');
        setupSearch('.l-app-search', '#l-approved-view tbody tr',     'td:nth-child(2)');
        setupSearch('.l-dec-search', '#l-declined-view tbody tr',     'td:nth-child(2)');
    }


    reattachSearch();


    // URL TAB REDIRECT
    const urlParams    = new URLSearchParams(window.location.search);
    const requestedTab = urlParams.get('tab');
    if (requestedTab === 'leave') {
        document.getElementById('btn-leave')?.click();
    } else if (requestedTab === 'excuse') {
        document.getElementById('btn-excuse')?.click();
    }


});

