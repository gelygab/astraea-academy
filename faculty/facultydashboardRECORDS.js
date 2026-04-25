const STATUS_CONFIG = {
    'approved': { cardClass: 'status-approved', modalClass: 'status-approved', badgeClass: 'status-approved', display: 'Approved' },
    'pending': { cardClass: 'status-pending', modalClass: 'status-pending', badgeClass: 'status-pending', display: 'Pending' },
    'rejected': { cardClass: 'status-rejected', modalClass: 'status-rejected', badgeClass: 'status-rejected', display: 'Rejected' }
};

const APPEAL_TYPE_NAMES = {
    'emergency_leave': 'Emergency Leave',
    'sick_leave': 'Sick Leave',
    'leave_of_absence': 'Leave of Absence',
    'other_leave': 'Other',
    'medical_appointment': 'Medical Appointment',
    'personal_emergency': 'Personal Emergency',
    'other_excuse': 'Other',
};

let appealsData = [];

document.addEventListener('DOMContentLoaded', function() {
    loadAppeals();
});

// Placeholder function for data fetching
async function loadAppeals() {
    showLoading(true);
    
    setTimeout(() => {
        appealsData = [
            {
                id: "1",
                status: "approved",
                appeal_type: "emergency_leave",
                date_filed: "2026-03-02",
                start_date: "2026-03-02",
                end_date: "2026-03-04",
                num_days: "3",
                return_date: "2026-03-05",
                comment: "Family emergency requiring immediate travel. Documents attached.",
                attachment_url: "#",
                attachment_name: "medical_cert.pdf",
                updated_by: "Admin"
            },
            {
                id: "2",
                status: "pending",
                appeal_type: "sick_leave",
                date_filed: "2026-03-13",
                start_date: "2026-03-13",
                end_date: "2026-03-16",
                num_days: "1",
                return_date: "2026-03-17",
                comment: "Routine check-up at the city hospital.",
                attachment_url: null,
                attachment_name: null,
                updated_by: "Admin"
            },
            {
                id: "3",
                status: "rejected",
                appeal_type: "leave_of_absence",
                date_filed: "2026-02-22",
                start_date: "2026-02-24",
                end_date: "2026-02-26",
                num_days: "2",
                return_date: "2026-02-27",
                comment: "Attending a conference outside the city.",
                attachment_url: "#",
                attachment_name: "invite.jpg",
                updated_by: "Admin"
            }
        ];

        if (appealsData.length > 0) {
            renderAppealsGrid(appealsData);
        } else {
            showEmptyState(true);
        }
        showLoading(false);
    }, 400);
}

function renderAppealsGrid(appeals) {
    const grid = document.getElementById('appealsGrid');
    showEmptyState(false);
    grid.innerHTML = appeals.map(appeal => createAppealCard(appeal)).join('');
}

function createAppealCard(appeal) {
    const statusConfig = STATUS_CONFIG[appeal.status] || STATUS_CONFIG['pending'];
    const typeDisplayName = APPEAL_TYPE_NAMES[appeal.appeal_type] || appeal.appeal_type;
    const dateFiled = formatDate(appeal.date_filed);
    
    return `
        <div class="appeal-card ${statusConfig.cardClass}" onclick="showAppealDetails('${appeal.id}')">
            <div class="card-header">
                ${escapeHtml(typeDisplayName)}
            </div>
            <div class="card-body">
                <p class="card-info">
                    <strong>Applied on:</strong> ${dateFiled}
                </p>
                <p class="card-info">
                    <strong>Status:</strong> ${statusConfig.display}
                </p>
                <button class="view-btn">View Appeal Summary</button>
            </div>
        </div>
    `;
}

function showAppealDetails(appealId) {
    const appeal = appealsData.find(a => String(a.id) === String(appealId));
    if (!appeal) return;
    
    populateDetails(appeal);
    
    // Hide Grid, Show Detail Section
    document.getElementById('appealsGrid').classList.add('hidden');
    document.getElementById('appealDetailsSection').classList.remove('hidden');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function populateDetails(appeal) {
    const statusConfig = STATUS_CONFIG[appeal.status] || STATUS_CONFIG['pending'];
    const typeDisplayName = APPEAL_TYPE_NAMES[appeal.appeal_type] || appeal.appeal_type;
    
    const modalHeader = document.getElementById('modalHeader');
    modalHeader.className = `blueprint-header ${statusConfig.modalClass}`;
    document.getElementById('modalTitle').textContent = typeDisplayName;
    
    document.getElementById('modalTimeType').value = typeDisplayName;
    document.getElementById('modalDateFiled').value = formatDate(appeal.date_filed);
    document.getElementById('modalStartDate').value = formatDate(appeal.start_date);
    document.getElementById('modalEndDate').value = formatDate(appeal.end_date);
    document.getElementById('modalNumDays').value = appeal.num_days || '';
    document.getElementById('modalReturnDate').value = formatDate(appeal.return_date);
    document.getElementById('modalComment').value = appeal.comment || '';
    
    const attachmentLink = document.getElementById('modalAttachment');
    if (appeal.attachment_url) {
        attachmentLink.href = appeal.attachment_url;
        attachmentLink.textContent = appeal.attachment_name || 'View Attachment';
        attachmentLink.parentElement.style.display = 'block';
    } else {
        attachmentLink.parentElement.style.display = 'none';
    }
    
    document.getElementById('modalUpdatedBy').textContent = appeal.updated_by || 'System';
    
    const statusBadge = document.getElementById('modalStatus');
    statusBadge.textContent = `Status: ${statusConfig.display}`;
}

function hideDetails() {
    document.getElementById('appealDetailsSection').classList.add('hidden');
    document.getElementById('appealsGrid').classList.remove('hidden');
}

function showLoading(show) {
    const loadingState = document.getElementById('loadingState');
    if(loadingState) loadingState.classList.toggle('hidden', !show);
}

function showEmptyState(show) {
    const emptyState = document.getElementById('emptyState');
    const appealsGrid = document.getElementById('appealsGrid');
    if(emptyState) emptyState.classList.toggle('hidden', !show);
    if (show && appealsGrid) {
        appealsGrid.classList.add('hidden');
    }
}

function formatDate(dateString) {
    if (!dateString) return '';
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

window.showAppealDetails = showAppealDetails;
window.hideDetails = hideDetails;