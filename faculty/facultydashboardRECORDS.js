const STATUS_CONFIG = {
    'approved': { cardClass: 'approved', badgeClass: 'approved', display: 'Approved' },
    'pending':  { cardClass: 'pending',  badgeClass: 'pending',  display: 'Pending'  },
    'rejected': { cardClass: 'rejected', badgeClass: 'rejected', display: 'Rejected' }
};

const APPEAL_TYPE_NAMES = {
    'emergency_leave':          'Emergency Leave',
    'sick_leave':               'Sick Leave',
    'leave_of_absence':         'Leave of Absence',
    'other_leave':              'Other Leave',
    'medical_appointment':      'Medical Appointment',
    'personal_emergency':       'Personal Emergency',
    'extracurricular_activity': 'Extracurricular Activity',
    'other_excuse':             'Other Excuse',
};

let appealsData = [];

document.addEventListener('DOMContentLoaded', function () {
    loadAppeals();
});

function loadAppeals() {
    showLoading(true);

    appealsData = (typeof appealsDataFromDB !== 'undefined') ? appealsDataFromDB : [];

    if (appealsData && appealsData.length > 0) {
        renderAppealsGrid(appealsData);
    } else {
        showEmptyState(true);
    }

    showLoading(false);
}

// Render Grid
function renderAppealsGrid(appeals) {
    const grid = document.getElementById('appealsGrid');
    showEmptyState(false);
    if (grid) {
        grid.innerHTML = appeals.map((appeal, index) => createAppealCard(appeal, index)).join('');
    }
}

// Built card html
function createAppealCard(appeal, index) {
    const statusConfig    = STATUS_CONFIG[appeal.status] || STATUS_CONFIG['pending'];
    const typeKey         = appeal.time_type || appeal.appeal_type || '';
    const typeDisplayName = APPEAL_TYPE_NAMES[typeKey] || typeKey;

    const isLeave   = typeKey.includes('leave');
    const iconClass = isLeave ? 'leave' : 'excuse';
    const iconName  = isLeave ? 'description' : 'schedule';

    const fullName = `${appeal.first_name || ''} ${appeal.last_name || ''}`.trim() || '—';

    return `
        <div class="appeal-card ${statusConfig.cardClass}">
            <div class="appeal-header">
                <div class="appeal-type">
                    <div class="appeal-type-icon ${iconClass}">
                        <span class="material-symbols-outlined">${iconName}</span>
                    </div>
                    <div class="appeal-type-info">
                        <h4>${escapeHtml(typeDisplayName)}</h4>
                        <p>Applied on: ${formatDate(appeal.date_filed)}</p>
                    </div>
                </div>
                <div class="status-badge ${statusConfig.cardClass}">${statusConfig.display}</div>
            </div>

            <div class="appeal-details">
                <div class="appeal-detail-row">
                    <span class="label">Faculty Name</span>
                    <span class="value">${escapeHtml(fullName)}</span>
                </div>
                <div class="appeal-detail-row">
                    <span class="label">Faculty ID</span>
                    <span class="value">${escapeHtml(String(appeal.teacher_id || appeal.user_uid || 'N/A'))}</span>
                </div>
                <div class="appeal-detail-row">
                    <span class="label">College</span>
                    <span class="value">${escapeHtml(appeal.college_name || '—')}</span>
                </div>
                <div class="appeal-detail-row">
                    <span class="label">Department</span>
                    <span class="value">${escapeHtml(appeal.department_name || '—')}</span>
                </div>
            </div>

            <div class="appeal-actions">
                <button type="button" class="view-btn" onclick="showAppealDetails(${index})">
                    View Appeal Summary
                </button>
            </div>
        </div>
    `;
}

// Show modal
window.showAppealDetails = function (index) {
    const appeal = appealsData[index];
    if (!appeal) return;

    populateDetails(appeal);

    const modal = document.getElementById('appealDetailsSection');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
};

// Hide modal 
window.hideDetails = function () {
    const modal = document.getElementById('appealDetailsSection');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
};

// Populate modal detail
function populateDetails(appeal) {
    const statusConfig    = STATUS_CONFIG[appeal.status] || STATUS_CONFIG['pending'];
    const typeKey         = appeal.time_type || appeal.appeal_type || '';
    const typeDisplayName = APPEAL_TYPE_NAMES[typeKey] || typeKey;

    const setSafeText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = (text !== null && text !== undefined && text !== '') ? text : '—';
    };

    setSafeText('detName',      `${appeal.first_name || ''} ${appeal.last_name || ''}`.trim() || '—');
    setSafeText('detId',        String(appeal.teacher_id || appeal.user_uid || '—'));
    setSafeText('detCollege',   appeal.college_name     || '—');
    setSafeText('detDept',      appeal.department_name  || '—');
    setSafeText('detType',      typeDisplayName);
    setSafeText('detDate',      formatDate(appeal.date_filed));
    setSafeText('detStartDate', formatDate(appeal.start_date));
    setSafeText('detEndDate',   formatDate(appeal.end_date));
    setSafeText('detNumDays',   appeal.number_of_days);
    setSafeText('detReturn',    formatDate(appeal.return_on));
    setSafeText('detReason',    appeal.comment);

    // Update the status badge in the modal
    const badge = document.getElementById('detStatusBadge');
    if (badge) {
        badge.className   = `status-badge ${statusConfig.badgeClass}`;
        badge.textContent = statusConfig.display;
    }

    // Handles the footer visibility for resolved appeals
    const updatedByWrapper = document.getElementById('updatedByWrapper');
    const detUpdatedBy     = document.getElementById('detUpdatedBy');

    const isResolved = appeal.status === 'approved' || appeal.status === 'rejected';

    if (updatedByWrapper) {
        if (isResolved) {
            updatedByWrapper.style.display = '';
            if (detUpdatedBy) detUpdatedBy.textContent = 'Admin';
        } else {
            updatedByWrapper.style.display = 'none';
            if (detUpdatedBy) detUpdatedBy.textContent = '';
        }
    }

    // Affected subject row
    const affectedSubjectRow = document.getElementById('affectedSubjectRow');
    if (appeal.affected_subject_name) {
        setSafeText(
            'detAffectedSubject',
            `${appeal.affected_subject_name} (${appeal.affected_subject_code})`
        );
        if (affectedSubjectRow) affectedSubjectRow.style.display = '';
    } else {
        if (affectedSubjectRow) affectedSubjectRow.style.display = 'none';
    }

    // Attachment
    const row  = document.getElementById('attachmentRow');
    const link = document.getElementById('detAttachment');
    if (row && link) {
        if (appeal.attachment && appeal.attachment !== 'NULL' && appeal.attachment !== '') {
            link.href                 = '../uploads/' + appeal.attachment;
            link.textContent          = 'View Attached File';
            link.style.pointerEvents  = 'auto';
            link.style.color          = '#94426A';
            link.style.textDecoration = 'underline';
        } else {
            link.removeAttribute('href');
            link.textContent          = 'No attached file';
            link.style.pointerEvents  = 'none';
            link.style.color          = '#888888';
            link.style.textDecoration = 'none';
        }
    }
}

// UI Helpers
function showLoading(show) {
    const el = document.getElementById('loadingState');
    if (el) el.classList.toggle('hidden', !show);
}

function showEmptyState(show) {
    const el = document.getElementById('emptyState');
    if (el) el.classList.toggle('hidden', !show);
}

function formatDate(dateString) {
    if (!dateString || dateString === 'NULL') return '—';
    const date = new Date(dateString.replace(/-/g, '/'));
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}