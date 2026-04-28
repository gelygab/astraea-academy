const STATUS_CONFIG = {
    'approved': { cardClass: 'approved', modalClass: 'status-approved', badgeClass: 'approved', display: 'Approved' },
    'pending': { cardClass: 'pending', modalClass: 'status-pending', badgeClass: 'pending', display: 'Pending' },
    'rejected': { cardClass: 'rejected', modalClass: 'status-rejected', badgeClass: 'rejected', display: 'Rejected' }
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
        const response = await fetch('api/view_appeals.php', {
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
    showEmptyState(false);
    if (grid) {
        grid.innerHTML = appeals.map(appeal => createAppealCard(appeal)).join('');
    }
}

function createAppealCard(appeal) {
    const statusConfig = STATUS_CONFIG[appeal.status] || STATUS_CONFIG['pending'];
    const typeDisplayName = APPEAL_TYPE_NAMES[appeal.appeal_type] || appeal.appeal_type;
    const dateFiled = formatDate(appeal.date_filed);
    
    const isLeave = appeal.appeal_type && appeal.appeal_type.includes('leave');
    const iconClass = isLeave ? 'leave' : 'excuse';
    const iconName = isLeave ? 'description' : 'schedule'; 

    return `
        <div class="appeal-card ${statusConfig.cardClass}">
            <div class="appeal-header">
                <div class="appeal-type">
                    <div class="appeal-type-icon ${iconClass}">
                        <span class="material-symbols-outlined">${iconName}</span>
                    </div>
                    <div class="appeal-type-info">
                        <h4>${escapeHtml(typeDisplayName)}</h4>
                        <p>Applied on: ${dateFiled}</p>
                    </div>
                </div>
                <div class="status-badge ${statusConfig.cardClass}">${statusConfig.display}</div>
            </div>

            <div class="appeal-details">
                <div class="appeal-detail-row">
                    <span class="label">Student Name</span>
                    <span class="value">${escapeHtml(appeal.student_name || 'N/A')}</span>
                </div>
                <div class="appeal-detail-row">
                    <span class="label">Student ID</span>
                    <span class="value">${escapeHtml(appeal.student_id || 'N/A')}</span>
                </div>
                <div class="appeal-detail-row">
                    <span class="label">College</span>
                    <span class="value">${escapeHtml(appeal.college || 'N/A')}</span>
                </div>
                <div class="appeal-detail-row">
                    <span class="label">Program</span>
                    <span class="value">${escapeHtml(appeal.program || appeal.department || 'N/A')}</span>
                </div>
            </div>

            <div class="appeal-actions">
                <button type="button" class="view-btn" onclick="showAppealDetails('${appeal.id}')">View Appeal Summary</button>
            </div>
        </div>
    `;
}

// Function to SHOW modal
window.showAppealDetails = function(appealId) {
    const appeal = appealsData.find(a => String(a.id) === String(appealId));
    if (!appeal) return;
    
    populateDetails(appeal);
    
    const modal = document.getElementById('appealDetailsSection');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; 
    }
};

// Function to HIDE modal
window.hideDetails = function() {
    const modal = document.getElementById('appealDetailsSection');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Unlocks background scroll
    }
};

// Fixed populateDetails function with setSafeText
function populateDetails(appeal) {
    const statusConfig = STATUS_CONFIG[appeal.status] || STATUS_CONFIG['pending'];
    const typeDisplayName = APPEAL_TYPE_NAMES[appeal.appeal_type] || appeal.appeal_type;

    // Helper function to prevent errors if an ID is missing
    const setSafeText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    setSafeText('detName', appeal.student_name);
setSafeText('detId', appeal.student_id);
setSafeText('detCollege', appeal.college);
setSafeText('detDept', appeal.program);
setSafeText('detYear', appeal.year);
setSafeText('detBlock', appeal.block);
setSafeText('detType', typeDisplayName);
setSafeText('detDate', formatDate(appeal.date_filed));
setSafeText('detStartDate', formatDate(appeal.start_date));
setSafeText('detEndDate', formatDate(appeal.end_date));
setSafeText('detNumDays', appeal.num_days);
setSafeText('detReturn', formatDate(appeal.return_date));
setSafeText('detReason', appeal.comment);
setSafeText('detUpdatedBy', appeal.updated_by);
    
    const badge = document.getElementById('detStatusBadge');
    if (badge) {
        badge.className = `status-badge ${statusConfig.badgeClass}`;
        badge.textContent = statusConfig.display;
    }

   const row = document.getElementById('attachmentRow');
    const link = document.getElementById('detAttachment');
    if (row && link) {
        row.style.display = 'flex';
        
        if (appeal.attachment_url) {
    
            link.href = appeal.attachment_url;
            link.textContent = appeal.attachment_name || "View Attachment";
            link.style.pointerEvents = 'auto'; 
            link.style.color = '#f57190'; 
            link.style.textDecoration = 'underline';
        } else {
           
            link.removeAttribute('href'); 
            link.textContent = "No attached file"; 
            link.style.pointerEvents = 'none'; 
            link.style.color = '#888888'; 
            link.style.textDecoration = 'none'; 
        }
    }
}

function showLoading(show) {
    const loadingState = document.getElementById('loadingState');
    if(loadingState) loadingState.classList.toggle('hidden', !show);
}

function showEmptyState(show) {
    const emptyState = document.getElementById('emptyState');
    if(emptyState) emptyState.classList.toggle('hidden', !show);
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
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