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
    'extracurricular_activity': 'Extracurricular Activity',
    'medical_appointment': 'Medical Appointment',
    'personal_emergency': 'Personal Emergency',
    'other_excuse': 'Other',
};

let appealsData = [];

document.addEventListener('DOMContentLoaded', function() {

    loadAppeals();
    
    document.getElementById('appealModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
});

async function loadAppeals() {
    showLoading(true);
    
    try {
        // Using a relative path so it automatically finds the PHP file in the same folder
        const response = await fetch('view_appeals.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include' 
        });
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
            appealsData = result.data;
            renderAppealsGrid(appealsData);
        } else {
            console.error("Server returned an error:", result);
            throw new Error(result.message || 'Invalid response format');
        }
        
    } catch (error) {
        console.error('Failed to load appeals:', error);
        showEmptyState(true);
    } finally {
        showLoading(false);
    }
}

function renderAppealsGrid(appeals) {
    const grid = document.getElementById('appealsGrid');
    
    if (appeals.length === 0) {
        showEmptyState(true);
        return;
    }
    
    showEmptyState(false);
    grid.innerHTML = appeals.map(appeal => createAppealCard(appeal)).join('');
}

function createAppealCard(appeal) {
    const statusConfig = STATUS_CONFIG[appeal.status] || STATUS_CONFIG['pending'];
    const typeDisplayName = APPEAL_TYPE_NAMES[appeal.appeal_type] || appeal.appeal_type;
    const dateFiled = formatDate(appeal.date_filed);
    
    return `
        <div class="appeal-card ${statusConfig.cardClass}" onclick="openAppealModal('${appeal.id}')">
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

function openAppealModal(appealId) {
    const appeal = appealsData.find(a => String(a.id) === String(appealId));
    
    if (!appeal) {
        console.error('Appeal not found:', appealId);
        return;
    }
    
    populateModal(appeal);
    document.getElementById('appealModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function populateModal(appeal) {
    const statusConfig = STATUS_CONFIG[appeal.status] || STATUS_CONFIG['pending'];
    const typeDisplayName = APPEAL_TYPE_NAMES[appeal.appeal_type] || appeal.appeal_type;
    
    const modalHeader = document.getElementById('modalHeader');
    modalHeader.className = `modal-header ${statusConfig.modalClass}`;
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
        attachmentLink.style.display = 'inline';
        
        // Remove "no attachment" text if it exists
        const existingNoAttach = attachmentLink.nextElementSibling;
        if(existingNoAttach && existingNoAttach.textContent === 'No attachment') {
            existingNoAttach.remove();
        }
    } else {
        attachmentLink.style.display = 'none';
        
        // Add "no attachment" text if it doesn't exist yet
        const existingNoAttach = attachmentLink.nextElementSibling;
        if(!existingNoAttach || existingNoAttach.textContent !== 'No attachment') {
            attachmentLink.insertAdjacentHTML('afterend', '<span style="color:#666; font-size: 14px; margin-top: 5px; display: inline-block;">No attachment</span>');
        }
    }
    
    document.getElementById('modalUpdatedBy').textContent = appeal.updated_by || 'System';
    
    const statusBadge = document.getElementById('modalStatus');
    statusBadge.className = `status-badge ${statusConfig.badgeClass}`;
    statusBadge.textContent = `Status: ${statusConfig.display}`;
}

function closeModal() {
    document.getElementById('appealModal').classList.add('hidden');
    document.body.style.overflow = '';
}

function showLoading(show) {
    const loadingState = document.getElementById('loadingState');
    const appealsGrid = document.getElementById('appealsGrid');
    if(loadingState) loadingState.classList.toggle('hidden', !show);
    if(appealsGrid) appealsGrid.classList.toggle('hidden', show);
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
    
    const safeDateString = dateString.replace(/-/g, '/');
    const date = new Date(safeDateString);
    
    if (isNaN(date.getTime())) return dateString;
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function refreshAppeals() {
    loadAppeals();
}

window.openAppealModal = openAppealModal;
window.closeModal = closeModal;
window.refreshAppeals = refreshAppeals;