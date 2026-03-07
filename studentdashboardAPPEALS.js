/**
 * STATUS CONFIGURATION
 * Colors are determined by status
 */
const STATUS_CONFIG = {
    'approved': { 
        cardClass: 'status-approved', 
        modalClass: 'status-approved',
        badgeClass: 'status-approved',
        display: 'Approved' 
    },
    'pending': { 
        cardClass: 'status-pending', 
        modalClass: 'status-pending',
        badgeClass: 'status-pending',
        display: 'Pending' 
    },
    'rejected': { 
        cardClass: 'status-rejected', 
        modalClass: 'status-rejected',
        badgeClass: 'status-rejected',
        display: 'Rejected' 
    }
};

/**
 * APPEAL TYPE DISPLAY NAMES
 * Maps database values to display names
 */
const APPEAL_TYPE_NAMES = {
    // Leave types
    'emergency_leave': 'Emergency Leave',
    'sick_leave': 'Sick Leave',
    'leave_of_absence': 'Leave of Absence',
    'other_leave': 'Other',
    // Excuse types
    'extracurricular_activity': 'Extracurricular Activity',
    'medical_appointment': 'Medical Appointment',
    'personal_emergency': 'Personal Emergency',
    'other_excuse': 'Other'
};

/**
 * API CONFIGURATION
 * Configure these endpoints to match your PHP backend
 */
const API_CONFIG = {
    // Base URL for your PHP backend - change this to your actual backend URL
    baseUrl: '', // Example: 'https://yourdomain.com/api/' or '/backend/'
    
    // PHP Endpoints
    endpoints: {
        // GET request - fetch all appeals for logged-in student
        // Expected PHP: get_appeals.php
        getAppeals: 'get_appeals.php',
        
        // GET request - fetch single appeal details (optional, for fresh data)
        // Expected PHP: get_appeal_detail.php
        getAppealDetail: 'get_appeal_detail.php'
    }
};

/**
 * GLOBAL STATE
 */
let appealsData = [];
let currentStudentId = null;

/**
 * INITIALIZATION
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    
    // Close modal when clicking outside
    document.getElementById('appealModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

/**
 * Initialize Dashboard
 * Gets student ID and loads appeals
 */
async function initializeDashboard() {
    currentStudentId = getCurrentStudentId();
    
    if (!currentStudentId) {
        console.error('No student ID found. User not logged in.');
        // Uncomment for production: window.location.href = 'studentlogin.html';
        // For now, load placeholder data
        usePlaceholderData();
        return;
    }
    
    await loadAppeals();
}

/**
 * Get Current Student ID
 * Retrieves from sessionStorage or localStorage (set during login)
 * 
 * PHP INTEGRATION NOTE: 
 * Alternatively, PHP can set a cookie or embed the ID in the page
 */
function getCurrentStudentId() {
    // Priority: sessionStorage > localStorage > null
    return sessionStorage.getItem('student_id') || 
           localStorage.getItem('student_id') || 
           null;
}

/**
 * Get Authentication Token
 * For JWT or session-based auth
 */
function getAuthToken() {
    return sessionStorage.getItem('auth_token') || 
           localStorage.getItem('auth_token') || 
           '';
}

/**
 * LOAD APPEALS FROM BACKEND
 * 
 * PHP INTEGRATION:
 * This function makes a GET request to your PHP backend.
 * 
 * Expected PHP Endpoint: get_appeals.php
 * 
 * PHP should:
 * 1. Verify user authentication (session/token)
 * 2. Get student_id from query param or session
 * 3. Query database for appeals belonging to this student
 * 4. Return JSON response
 * 
 * Expected Response Format:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": 1,
 *       "appeal_type": "emergency_leave",  // or "sick_leave", "extracurricular_activity", etc.
 *       "date_filed": "2026-03-02",
 *       "start_date": "2026-03-02",
 *       "end_date": "2026-03-04",
 *       "num_days": 2,
 *       "return_date": "2026-03-05",
 *       "comment": "Basta comments na sinubmit nila kasama ng form andito",
 *       "attachment_url": "uploads/medical-cert.pdf",
 *       "attachment_name": "medical-cert.pdf",
 *       "status": "approved",  // "approved", "pending", or "rejected"
 *       "updated_by": "Ryan Justine Mondero",
 *       "created_at": "2026-03-02 10:30:00"
 *     }
 *   ]
 * }
 */
async function loadAppeals() {
    showLoading(true);
    
    try {
        const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getAppeals}?student_id=${encodeURIComponent(currentStudentId)}`;
        
        // FETCH REQUEST TO PHP BACKEND
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // Include auth token if using JWT
                'Authorization': `Bearer ${getAuthToken()}`
            },
            // Include credentials for session-based auth
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
            appealsData = result.data;
            renderAppealsGrid(appealsData);
        } else {
            throw new Error(result.message || 'Invalid response format');
        }
        
    } catch (error) {
        console.error('Failed to load appeals:', error);
        
        // For development: use placeholder data
        // REMOVE usePlaceholderData() IN PRODUCTION
        usePlaceholderData();
        
        // IN PRODUCTION, show error to user instead:
        // showErrorMessage('Failed to load appeals. Please refresh the page.');
    } finally {
        showLoading(false);
    }
}

/**
 * RENDER APPEALS GRID
 */
function renderAppealsGrid(appeals) {
    const grid = document.getElementById('appealsGrid');
    
    if (appeals.length === 0) {
        showEmptyState(true);
        return;
    }
    
    showEmptyState(false);
    grid.innerHTML = appeals.map(appeal => createAppealCard(appeal)).join('');
}

/**
 * CREATE APPEAL CARD HTML
 */
function createAppealCard(appeal) {
    const statusConfig = STATUS_CONFIG[appeal.status] || STATUS_CONFIG['pending'];
    const typeDisplayName = APPEAL_TYPE_NAMES[appeal.appeal_type] || appeal.appeal_type;
    const dateFiled = formatDate(appeal.date_filed);
    
    return `
        <div class="appeal-card ${statusConfig.cardClass}" onclick="openAppealModal(${appeal.id})">
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

/**
 * OPEN APPEAL MODAL
 */
async function openAppealModal(appealId) {
    const appeal = appealsData.find(a => a.id === appealId);
    
    if (!appeal) {
        console.error('Appeal not found:', appealId);
        return;
    }
    
    // Optional: Fetch fresh data from backend
    // Uncomment if you want real-time data when opening modal
    /*
    try {
        const freshData = await fetchAppealDetail(appealId);
        if (freshData) {
            Object.assign(appeal, freshData);
        }
    } catch (e) {
        console.warn('Using cached data:', e);
    }
    */
    
    populateModal(appeal);
    document.getElementById('appealModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

/**
 * POPULATE MODAL WITH APPEAL DATA
 */
function populateModal(appeal) {
    const statusConfig = STATUS_CONFIG[appeal.status] || STATUS_CONFIG['pending'];
    const typeDisplayName = APPEAL_TYPE_NAMES[appeal.appeal_type] || appeal.appeal_type;
    
    // Set header with status color
    const modalHeader = document.getElementById('modalHeader');
    modalHeader.className = `modal-header ${statusConfig.modalClass}`;
    document.getElementById('modalTitle').textContent = typeDisplayName;
    
    // Set form fields
    document.getElementById('modalTimeType').value = typeDisplayName;
    document.getElementById('modalDateFiled').value = formatDate(appeal.date_filed);
    document.getElementById('modalStartDate').value = formatDate(appeal.start_date);
    document.getElementById('modalEndDate').value = formatDate(appeal.end_date);
    document.getElementById('modalNumDays').value = appeal.num_days || '';
    document.getElementById('modalReturnDate').value = formatDate(appeal.return_date);
    document.getElementById('modalComment').value = appeal.comment || '';
    
    // Set attachment
    const attachmentLink = document.getElementById('modalAttachment');
    if (appeal.attachment_url) {
        attachmentLink.href = appeal.attachment_url;
        attachmentLink.textContent = appeal.attachment_name || 'View Attachment';
        attachmentLink.style.display = 'inline';
    } else {
        attachmentLink.style.display = 'none';
        attachmentLink.insertAdjacentHTML('afterend', '<span style="color:#666;">No attachment</span>');
    }
    
    // Set updated by
    document.getElementById('modalUpdatedBy').textContent = appeal.updated_by || 'System';
    
    // Set status badge (all red/dark pink as per screenshot)
    const statusBadge = document.getElementById('modalStatus');
    statusBadge.className = `status-badge ${statusConfig.badgeClass}`;
    statusBadge.textContent = `Status: ${statusConfig.display}`;
}

/**
 * CLOSE MODAL
 */
function closeModal() {
    document.getElementById('appealModal').classList.add('hidden');
    document.body.style.overflow = '';
}

/**
 * FETCH SINGLE APPEAL DETAIL (Optional)
 * 
 * PHP Endpoint: get_appeal_detail.php?id={id}&student_id={student_id}
 */
async function fetchAppealDetail(appealId) {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getAppealDetail}?id=${encodeURIComponent(appealId)}&student_id=${encodeURIComponent(currentStudentId)}`;
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
        },
        credentials: 'include'
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch appeal detail');
    }
    
    const result = await response.json();
    return result.success ? result.data : null;
}

/**
 * UI STATE HELPERS
 */
function showLoading(show) {
    document.getElementById('loadingState').classList.toggle('hidden', !show);
    document.getElementById('appealsGrid').classList.toggle('hidden', show);
}

function showEmptyState(show) {
    document.getElementById('emptyState').classList.toggle('hidden', !show);
    if (show) {
        document.getElementById('appealsGrid').classList.add('hidden');
    }
}

/**
 * UTILITY FUNCTIONS
 */
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
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

/**
 * PLACEHOLDER DATA - FOR DEVELOPMENT ONLY
 * Remove this in production
 */
function usePlaceholderData() {
    appealsData = [
        {
            id: 1,
            appeal_type: 'emergency_leave',
            date_filed: '2026-03-02',
            start_date: '2026-03-02',
            end_date: '2026-03-04',
            num_days: 2,
            return_date: '2026-03-05',
            comment: 'Basta comments na sinubmit nila kasama ng form andito',
            attachment_url: 'uploads/medical-cert.pdf',
            attachment_name: 'medical-cert.pdf',
            status: 'approved',
            updated_by: 'Ryan Justine Mondero',
            created_at: '2026-03-02 10:30:00'
        },
        {
            id: 2,
            appeal_type: 'sick_leave',
            date_filed: '2026-03-05',
            start_date: '2026-03-05',
            end_date: '2026-03-06',
            num_days: 1,
            return_date: '2026-03-07',
            comment: 'Fever and flu symptoms, doctor advised rest',
            attachment_url: null,
            attachment_name: null,
            status: 'pending',
            updated_by: 'System',
            created_at: '2026-03-05 14:20:00'
        },
        {
            id: 3,
            appeal_type: 'leave_of_absence',
            date_filed: '2026-02-22',
            start_date: '2026-02-25',
            end_date: '2026-02-28',
            num_days: 3,
            return_date: '2026-03-01',
            comment: 'Family emergency out of town',
            attachment_url: 'uploads/supporting-doc.pdf',
            attachment_name: 'supporting-doc.pdf',
            status: 'rejected',
            updated_by: 'Admin User',
            created_at: '2026-02-22 09:00:00'
        }
    ];
    
    renderAppealsGrid(appealsData);
}

/**
 * REFRESH APPEALS
 * Call this function to reload data from backend
 */
function refreshAppeals() {
    loadAppeals();
}

// Expose functions globally for HTML onclick handlers
window.openAppealModal = openAppealModal;
window.closeModal = closeModal;
window.refreshAppeals = refreshAppeals;