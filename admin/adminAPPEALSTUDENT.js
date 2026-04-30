// ============================================================
// adminAPPEALSTUDENT.js — VERSION 2: Production 
// ============================================================

// Sidebar Navigation Toggle
function toggleNavGroup(button) {
    const navGroup = button.parentElement;
    navGroup.classList.toggle('open');
}

let currentAppealId = null;
let appealsData = [];          // Populated from API
let departmentsList = [];      // Populated from API

// ============================================================
// CONFIGURATION — Update with your actual API endpoints
// ============================================================
const API_CONFIG = {
    baseUrl: 'api/',
    endpoints: {
        appeals: 'get_student_appeals.php',
        departments: 'get_student_departments.php',
    }
};

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', async function() {
    await initializeApp();
});

async function initializeApp() {
    try {
        // 1. Load departments for dropdown
        await loadDepartments();

        // 2. Setup filter listeners
        setupFilterListeners();

        // 3. Load appeals from backend
        await loadAppealsFromAPI();

    } catch (error) {
        console.error('Failed to initialize app:', error);
        showErrorMessage('Failed to load data. Please refresh the page.');
    }
}

// ============================================================
// API FETCH HELPER
// ============================================================
async function apiFetch(endpoint, options = {}) {
    const url = API_CONFIG.baseUrl + endpoint;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer ' + getAuthToken(),
        }
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    console.log(response);

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

// ============================================================
// LOAD DEPARTMENTS (for dropdown)
// ============================================================
async function loadDepartments() {
    const result = await apiFetch(API_CONFIG.endpoints.departments);
    populateDepartmentDropdown(result.data);
}

function populateDepartmentDropdown(departmentsList) {
    const deptSelect = document.getElementById('department');
    if (!deptSelect) return;

    deptSelect.innerHTML = '<option value="">All Departments</option>';

    departmentsList.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.value;
        option.textContent = dept.label;
        deptSelect.appendChild(option);
    });
}

// ============================================================
// LOAD APPEALS FROM API
// ============================================================
async function loadAppealsFromAPI() {
    // --- Replace with your actual API call ---
    const result = await apiFetch(API_CONFIG.endpoints.appeals);
    appealsData = normalizeAppealData(result.data);

    renderAppeals(appealsData);
}

// ============================================================
// DATA NORMALIZATION
// ============================================================
function normalizeAppealData(apiData) {
    return apiData.map(item => ({
        id: item.id || item.appeal_id,
        studentName: item.student_name || item.name,
        studentId: item.student_id || item.student_number,
        department: item.department_code || item.department,
        departmentName: item.department_name || item.department,
        year: String(item.year || item.year_level),
        yearLabel: formatYearLabel(item.year || item.year_level),
        block: item.block || item.student_block || item.section,
        type: item.appeal_type || item.type,
        typeLabel: item.type_label || formatTypeLabel(item.appeal_type || item.type),
        dateApplied: item.date_applied || item.date,
        startDate: item.start_date,
        endDate: item.end_date,
        numDays: item.num_days,
        returnDate: item.return_date,
        status: item.status,
        reason: item.reason,
        attachmentName: item.attachment,
        updatedBy: item.updated_by,
        affectedClasses: item.affected_subjects || []
    }));
}

function formatYearLabel(year) {
    const y = String(year);
    const suffix = { '1': 'st', '2': 'nd', '3': 'rd', '4': 'th' };
    return `${y}${suffix[y] || 'th'} Year`;
}

function formatTypeLabel(type) {
    if (!type) return '';
    return type.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// ============================================================
// FILTER LISTENERS — All 5 dropdowns
// ============================================================
function setupFilterListeners() {
    const filters = ['appealType', 'appealStatus', 'department', 'year', 'block'];

    filters.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', applyFilters);
        }
    });
}

// ============================================================
// APPLY FILTERS (Type, Status, Department, Year, Block)
// ============================================================
function applyFilters() {
    const type       = document.getElementById('appealType')?.value   || '';
    const status     = document.getElementById('appealStatus')?.value || '';
    const department = document.getElementById('department')?.value   || '';
    const year       = document.getElementById('year')?.value         || '';
    const block      = document.getElementById('block')?.value        || '';

    const filtered = appealsData.filter(a => {
        const typeMatch   = !type       || a.type === type;
        const statusMatch = !status     || a.status === status;
        const deptMatch   = !department || a.department === department;
        const yearMatch   = !year       || a.year === year;
        const blockMatch  = !block      || String(a.block) === block;
        return typeMatch && statusMatch && deptMatch && yearMatch && blockMatch;
    });

    renderAppeals(filtered);
}

// ============================================================
// RENDER APPEALS
// ============================================================
function renderAppeals(appeals) {
    const grid = document.getElementById('appealsGrid');
    if (!grid) return;

    if (appeals.length === 0) {
        grid.innerHTML = `
            <div class="no-appeals" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: rgba(107,78,61,0.6);">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 16px; opacity: 0.5;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3 style="font-size: 18px; margin-bottom: 8px; color: var(--brown);">No appeals found</h3>
                <p style="font-size: 14px;">Try adjusting your filters to see more results.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = appeals.map(appeal => `
        <div class="appeal-card ${appeal.status}">
            <div class="appeal-header">
                <div class="appeal-type">
                    <div class="appeal-type-icon ${appeal.type}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            ${getTypeIcon(appeal.type)}
                        </svg>
                    </div>
                    <div class="appeal-type-info">
                        <h4>${appeal.typeLabel}</h4>
                        <p>Applied on: ${appeal.dateApplied}</p>
                    </div>
                </div>
                <span class="status-badge ${appeal.status}">${appeal.status}</span>
            </div>
            <div class="appeal-details">
                <div class="appeal-detail-row">
                    <span class="label">Student Name</span>
                    <span class="value">${appeal.studentName}</span>
                </div>
                <div class="appeal-detail-row">
                    <span class="label">Student ID</span>
                    <span class="value">${appeal.studentId}</span>
                </div>
                <div class="appeal-detail-row">
                    <span class="label">Department</span>
                    <span class="value">${appeal.departmentName}</span>
                </div>
                <div class="appeal-detail-row">
                    <span class="label">Year</span>
                    <span class="value">${appeal.yearLabel}</span>
                </div>
                <div class="appeal-detail-row">
                    <span class="label">Block</span>
                    <span class="value">${appeal.block}</span>
                </div>
            </div>
            <div class="appeal-actions">
                <button class="btn-primary" onclick="viewSummary('${appeal.id}')">
                    View Appeal Summary
                </button>
            </div>
        </div>
    `).join('');
}


// ============================================================
// TYPE ICONS
// ============================================================
function getTypeIcon(type) {
    if (type === 'leave') {
        return '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line>';
    } else {
        return '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>';
    }
}

// ============================================================
// MODAL FUNCTIONS
// ============================================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// ============================================================
// VIEW SUMMARY MODAL
// ============================================================
function viewSummary(appealId) {
    const appeal = appealsData.find(a => String(a.id) === String(appealId));
    if (!appeal) return;

    const subjectsText = appeal.affectedClasses && appeal.affectedClasses.length > 0 
    ? appeal.affectedClasses.map(c => `${c.name} (${c.time})`).join(', ')
    : 'None';

    const subjectEl = document.getElementById('summarySubjectAffected');
    if(subjectEl) {
        subjectEl.textContent = subjectsText;
    }

    currentAppealId = appealId;


   document.getElementById('summaryName').textContent = appeal.studentName;
    document.getElementById('summaryID').textContent = appeal.studentId;
    document.getElementById('summaryDepartment').textContent = appeal.departmentName || appeal.department;
    document.getElementById('summaryYear').textContent = appeal.yearLabel;
    document.getElementById('summaryBlock').textContent = appeal.block;
    document.getElementById('summaryType').textContent = appeal.typeLabel;
    document.getElementById('summaryDate').textContent = appeal.dateApplied;
    document.getElementById('summaryStartDate').textContent = appeal.startDate || 'N/A';
    document.getElementById('summaryEndDate').textContent = appeal.endDate || 'N/A';
    document.getElementById('summaryDays').textContent = appeal.numDays ? `${appeal.numDays} day(s)` : 'N/A';
    document.getElementById('summaryReturnDate').textContent = appeal.returnDate || 'N/A';
    document.getElementById('summaryReason').textContent = appeal.reason || 'N/A';
    // document.getElementById('summarySubjectAffected').textContent = appeal.subjectAffected || 'N/A';
    document.getElementById('summaryAttachment').textContent = appeal.attachmentName || 'No attachment';
    if (appeal.attachmentUrl) {
        document.getElementById('summaryAttachment').href = appeal.attachmentUrl;
        document.getElementById('summaryAttachment').style.pointerEvents = 'auto';
        document.getElementById('summaryAttachment').style.color = 'var(--blue)';
    } else {
        document.getElementById('summaryAttachment').removeAttribute('href');
        document.getElementById('summaryAttachment').style.pointerEvents = 'none';
        document.getElementById('summaryAttachment').style.color = '#666';
    }
   
    document.getElementById('summaryUpdatedBy').textContent = appeal.updatedBy || 'System';


    const statusEl = document.getElementById('summaryStatus');
    statusEl.textContent = appeal.status;
    statusEl.className = 'detail-value status-badge ' + appeal.status;

    openModal('summaryModal');
}


// ============================================================
// LOGOUT
// ============================================================
document.querySelector('.logout')?.addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to log out?')) {
        window.location.href = '/login';
    }
});
