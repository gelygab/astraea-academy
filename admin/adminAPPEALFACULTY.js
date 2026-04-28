 // ============================================================
// adminAPPEALFACULTY.js — VERSION 2: Production 
// ============================================================

// Sidebar Navigation Toggle
function toggleNavGroup(button) {
    const navGroup = button.parentElement;
    navGroup.classList.toggle('open');
}

let currentAppealId = null;
let appealsData = [];          // Populated from API
let departmentsData = [];      // Populated from API

// ============================================================
// CONFIGURATION — Update these with your actual API endpoints
// ============================================================
const API_CONFIG = {
    baseUrl: 'api/',  // Change to your backend base URL
    endpoints: {
        appeals: 'get_faculty_appeals.php',
        colleges: 'get_faculty_colleges.php',
        departments: 'get_faculty_departments.php',
        updateStatus: 'update_faculty_appeal_status.php'
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
        // 1. Load colleges & departments for cascading dropdowns
        await loadColleges();
        await loadDepartments();

        // 2. Setup event listeners
        setupFilterListeners();

        // 3. Load appeals from backend
        await loadAppealsFromAPI();

    } catch (error) {
        console.error('Failed to initialize app:', error);
        showErrorMessage('Failed to load data. Please refresh the page.');
    }
}

// ============================================================
// API FETCH HELPERS
// ============================================================
async function apiFetch(endpoint, options = {}) {
    const url = API_CONFIG.baseUrl + endpoint;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer ' + getAuthToken(), // Uncomment when auth is ready
        }
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

// ============================================================
// LOAD COLLEGES & DEPARTMENTS (for cascading dropdowns)
// ============================================================
async function loadColleges() {
    // --- OPTION A: Fetch from API ---
    const result = await apiFetch(API_CONFIG.endpoints.colleges);
    populateCollegeDropdown(result.data);
    
}

async function loadDepartments() {
    const result = await apiFetch(API_CONFIG.endpoints.departments);
    populateDepartmentDropdown(result.data);
}

function populateDepartmentDropdown(departmentsData) {
    const deptSelect = document.getElementById('department');
    if (!deptSelect) return;

    deptSelect.innerHTML = '<option value="">All Departments</option>';

    departmentsData.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.value;
        option.textContent = dept.label;
        deptSelect.appendChild(option);
    });
}


function populateCollegeDropdown(colleges) {
    const collegeSelect = document.getElementById('college');
    if (!collegeSelect) return;

    // Keep "All Colleges" option, add dynamic ones
    collegeSelect.innerHTML = '<option value="">All Colleges</option>';

    colleges.forEach(college => {
        const option = document.createElement('option');
        option.value = college.value;
        option.textContent = college.label;
        collegeSelect.appendChild(option);
    });
}

// ============================================================
// COLLEGE → DEPARTMENT CASCADE
// ============================================================
// function setupCollegeDepartmentCascade() {
//     const collegeSelect = document.getElementById('college');
//     const departmentSelect = document.getElementById('department');

//     if (!collegeSelect || !departmentSelect) return;

//     collegeSelect.addEventListener('change', function() {
//         const selectedCollege = this.value;

//         // Clear existing options except "All Departments"
//         departmentSelect.innerHTML = '<option value="">All Departments</option>';

//         if (selectedCollege && departmentsData[selectedCollege]) {
//             const departments = departmentsData[selectedCollege];
//             departments.forEach(dept => {
//                 const option = document.createElement('option');
//                 option.value = dept.value;
//                 option.textContent = dept.label;
//                 departmentSelect.appendChild(option);
//             });
//         }

//         applyFilters();
//     });

//     departmentSelect.addEventListener('change', applyFilters);
// }

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
// DATA NORMALIZATION (adapt API response to frontend format)
// ============================================================
function normalizeAppealData(apiData) {
    // Adjust field names based on your API response structure
    return apiData.map(item => ({
        id: item.id || item.appeal_id,
        facultyName: item.faculty_name || item.name,
        facultyId: item.faculty_id || item.employee_id,
        college: item.college_code || item.college,
        collegeName: item.college_name || item.college,
        department: item.department_code || item.department,
        departmentName: item.department_name || item.department,
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
        updatedBy: item.updated_by
    }));
}

function formatTypeLabel(type) {
    if (!type) return '';
    return type.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// ============================================================
// FILTER LISTENERS
// ============================================================
function setupFilterListeners() {
    const filters = ['appealType', 'appealStatus', 'department', 'college'];

    filters.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', applyFilters);
        }
    });
}

// ============================================================
// APPLY FILTERS (Type, Status, College, Department)
// ============================================================
function applyFilters() {
    const type = document.getElementById('appealType')?.value || '';
    const status = document.getElementById('appealStatus')?.value || '';
    const college = document.getElementById('college')?.value || '';
    const department = document.getElementById('department')?.value || '';

    const filtered = appealsData.filter(a => {
        const typeMatch = !type || a.type === type;
        const statusMatch = !status || a.status === status;
        const collegeMatch = !college || a.college === college;
        const departmentMatch = !department || a.department === department;
        return typeMatch && statusMatch && collegeMatch && departmentMatch;
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
                    <span class="label">Faculty Name</span>
                    <span class="value">${appeal.facultyName}</span>
                </div>
                <div class="appeal-detail-row">
                    <span class="label">Faculty ID</span>
                    <span class="value">${appeal.facultyId}</span>
                </div>
                <div class="appeal-detail-row">
                    <span class="label">College</span>
                    <span class="value">${appeal.collegeName || appeal.college}</span>
                </div>
                <div class="appeal-detail-row">
                    <span class="label">Department</span>
                    <span class="value">${appeal.departmentName || appeal.department}</span>
                </div>
            </div>
            <div class="appeal-actions">
                <button class="btn-primary" onclick="viewSummary('${appeal.id}')">
                    View Appeal Summary
                </button>
                ${appeal.status === 'pending' ? `
                    <button class="btn-secondary" onclick="openUpdateStatus('${appeal.id}')">
                        Edit Status
                    </button>
                ` : ''}
                ${appeal.status === 'rejected' ? `
                    <button class="btn-secondary" onclick="openUpdateStatus('${appeal.id}')">
                        Edit Status
                    </button>
                ` : ''}
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
    if (modalId === 'updateStatusModal') {
        currentAppealId = null;
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


    currentAppealId = appealId;

document.getElementById('summaryName').textContent = appeal.facultyName;
    document.getElementById('summaryID').textContent = appeal.facultyId;
    document.getElementById('summaryCollege').textContent = appeal.collegeName || appeal.college;
    document.getElementById('summaryDepartment').textContent = appeal.departmentName || appeal.department;
    document.getElementById('summaryType').textContent = appeal.typeLabel;
    document.getElementById('summaryDate').textContent = appeal.dateApplied;
    document.getElementById('summaryStartDate').textContent = appeal.startDate || 'N/A';
    document.getElementById('summaryEndDate').textContent = appeal.endDate || 'N/A';
    document.getElementById('summaryDays').textContent = appeal.numDays ? `${appeal.numDays} day(s)` : 'N/A';
    document.getElementById('summaryReturnDate').textContent = appeal.returnDate || 'N/A';
    document.getElementById('summaryReason').textContent = appeal.reason || 'N/A';
    document.getElementById('summarySubjectAffected').textContent = appeal.subjectAffected || 'N/A';
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
// UPDATE STATUS MODAL
// ============================================================
function openUpdateStatus(appealId) {
    const appeal = appealsData.find(a => String(a.id) === String(appealId));
    if (!appeal) return;


    currentAppealId = appealId;


    document.getElementById('statusFacultyName').textContent = appeal.facultyName;


    const currentStatusEl = document.getElementById('statusCurrent');
    currentStatusEl.textContent = appeal.status;
    currentStatusEl.className = appeal.status;

    
  // //start edit
    const warningBox = document.getElementById('statusConflictWarning');
    const classList = document.getElementById('statusAffectedClassesList');
    const conflictCount = document.getElementById('statusConflictCount');


    if (appeal.status === 'pending'&& (appeal.type == 'leave' || appeal.type == 'excuse')) {


        const affectedClasses = [
            { name: 'Software Design', time: 'Mon 8:00 AM' },
            { name: 'Engineering Management', time: 'Wed 10:00 AM' },
            { name: 'Basic Electrical Eng.', time: 'Fri 1:00 PM' }
        ];


        conflictCount.textContent = affectedClasses.length;
       
        // Map the data into the HTML structure
        classList.innerHTML = affectedClasses.map(cls => `
            <div style="display: flex; justify-content: space-between; padding: 12px 15px; border-bottom: 1px solid rgba(133, 38, 44, 0.1); font-size: 13px; color: #6B4E3D; background: #fff;">
                <span style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: #85262C; font-weight: bold;">•</span> ${cls.name}
                </span>
                <span style="font-weight: 600; color: #4A3628;">(${cls.time})</span>
            </div>
        `).join('');


        // Ensure the last item doesn't have a double border
        if (classList.lastElementChild) {
            classList.lastElementChild.style.borderBottom = 'none';
        }


        warningBox.style.display = 'block';
    } else {
        warningBox.style.display = 'none';
    }
    // //end edit

    openModal('updateStatusModal');
}


async function updateStatus(newStatus) {
    try {
        const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.updateStatus}?appealId=${currentAppealId}`
        if (!currentAppealId) return;
        const response = await fetch (url, {
            method: 'POST',
            body: JSON.stringify({ id: currentAppealId, status: newStatus }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if(!response.ok) throw new Error ("Fetch failed");
        const data = await response.json();
        console.log(data);

        const appeal = appealsData.find(a => String(a.id) === String(currentAppealId));
        if (!appeal) return;

        // Update the data
        appeal.status = newStatus;

        // Re-render with current filters
        applyFilters();

        // Close modal
        closeModal('updateStatusModal');
        location.reload(); 

    } catch (error) {
        console.error("Fetching admin profile failed: ", error);
    }
}

