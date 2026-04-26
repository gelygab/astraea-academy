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
        appeals: 'get_faculty_appeals.php',
        departments: 'get_faculty_departments.php',
        updateStatus: '/student-appeals/{id}/status'
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

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

// ============================================================
// LOAD DEPARTMENTS (for dropdown)
// ============================================================
async function loadDepartments() {
    // --- OPTION A: Fetch from API ---
    // departmentsList = await apiFetch(API_CONFIG.endpoints.departments);

    // --- OPTION B: Hardcoded fallback (remove when API ready) ---
    departmentsList = [
        { value: 'civil', label: 'Civil Engineering' },
        { value: 'chemical', label: 'Chemical Engineering' },
        { value: 'computer', label: 'Computer Engineering' },
        { value: 'electrical', label: 'Electrical Engineering' },
        { value: 'electronics', label: 'Electronics Engineering' },
        { value: 'mechanical', label: 'Mechanical Engineering' },
        { value: 'manufacturing', label: 'Manufacturing Engineering' },
        { value: 'early-childhood', label: 'Early Childhood Education' },
        { value: 'elementary', label: 'Elementary Education' },
        { value: 'physical', label: 'Physical Education' },
        { value: 'secondary', label: 'Secondary Education' },
        { value: 'special-needs', label: 'Special Needs Education' },
        { value: 'communications', label: 'Communications' },
        { value: 'social-work', label: 'Social Work' },
        { value: 'psychology', label: 'Psychology' }
    ];

    populateDepartmentDropdown();
}

function populateDepartmentDropdown() {
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
    // const data = await apiFetch(API_CONFIG.endpoints.appeals);
    // appealsData = normalizeAppealData(data);

    // --- Fallback: empty array until API connected ---
    appealsData = [];

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
        block: item.block || item.section,
        type: item.appeal_type || item.type,
        typeLabel: item.type_label || formatTypeLabel(item.appeal_type || item.type),
        dateApplied: item.date_applied || item.date,
        status: item.status,
        reason: item.reason
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
        const blockMatch  = !block      || a.block === block;
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
    const appeal = appealsData.find(a => a.id === appealId);
    if (!appeal) return;

    currentAppealId = appealId;

    document.getElementById('summaryName').textContent       = appeal.studentName;
    document.getElementById('summaryID').textContent         = appeal.studentId;
    document.getElementById('summaryDepartment').textContent = appeal.departmentName;
    document.getElementById('summaryYear').textContent       = appeal.yearLabel;
    document.getElementById('summaryBlock').textContent      = appeal.block;
    document.getElementById('summaryType').textContent       = appeal.typeLabel;
    document.getElementById('summaryDate').textContent       = appeal.dateApplied;

    const statusEl = document.getElementById('summaryStatus');
    statusEl.textContent = appeal.status;
    statusEl.className = 'detail-value status-badge ' + appeal.status;

    document.getElementById('summaryReason').textContent = appeal.reason;

    openModal('summaryModal');
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function showErrorMessage(message) {
    const grid = document.getElementById('appealsGrid');
    if (grid) {
        grid.innerHTML = `
            <div class="no-appeals" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #E53E3E;">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 16px;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <h3 style="font-size: 18px; margin-bottom: 8px;">Error</h3>
                <p style="font-size: 14px;">${message}</p>
            </div>
        `;
    }
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

