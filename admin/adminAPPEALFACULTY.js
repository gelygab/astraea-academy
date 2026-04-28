// ============================================================
// adminAPPEALFACULTY.js — VERSION 1: Testing/Mock Data
// ============================================================
// Uses hardcoded mock data with College & Department fields.
// Test the UI immediately without a backend.
// ============================================================

// Sidebar Navigation Toggle
function toggleNavGroup(button) {
    const navGroup = button.parentElement;
    navGroup.classList.toggle('open');
}

let currentAppealId = null;

// ============================================================
// COLLEGE & DEPARTMENT CASCADING DATA
// ============================================================
const COLLEGE_DEPARTMENTS = {
    engineering: {
        name: 'College of Engineering',
        departments: [
            { value: 'civil', label: 'Civil Engineering' },
            { value: 'chemical', label: 'Chemical Engineering' },
            { value: 'computer', label: 'Computer Engineering' },
            { value: 'electrical', label: 'Electrical Engineering' },
            { value: 'electronics', label: 'Electronics Engineering' },
            { value: 'mechanical', label: 'Mechanical Engineering' },
            { value: 'manufacturing', label: 'Manufacturing Engineering' }
        ]
    },
    education: {
        name: 'College of Education',
        departments: [
            { value: 'early-childhood', label: 'Early Childhood Education' },
            { value: 'elementary', label: 'Elementary Education' },
            { value: 'physical', label: 'Physical Education' },
            { value: 'secondary', label: 'Secondary Education' },
            { value: 'special-needs', label: 'Special Needs Education' }
        ]
    },
    chass: {
        name: 'College of Humanities, Arts, and Social Sciences',
        departments: [
            { value: 'communications', label: 'Communications' },
            { value: 'social-work', label: 'Social Work' },
            { value: 'psychology', label: 'Psychology' }
        ]
    }
};

// ============================================================
// MOCK DATA — 5 FACULTY APPEALS WITH COLLEGE & DEPARTMENT
// ============================================================
const appealsData = [
    {
        id: '1',
        facultyName: 'Dela Cruz, Juan',
        facultyId: '55555',
        college: 'engineering',
        collegeName: 'College of Engineering',
        department: 'civil',
        departmentName: 'Civil Engineering',
        type: 'leave',
        typeLabel: 'Emergency Leave',
        dateApplied: 'March 2, 2026',
        status: 'pending',
        reason: 'Family emergency — need to attend to sick family member in the province. Will be unavailable for 3 days.'
    },
    {
        id: '2',
        facultyName: 'Santos, Maria',
        facultyId: '55556',
        college: 'education',
        collegeName: 'College of Education',
        department: 'elementary',
        departmentName: 'Elementary Education',
        type: 'leave',
        typeLabel: 'Sick Leave',
        dateApplied: 'March 5, 2026',
        status: 'pending',
        reason: 'High fever and flu symptoms, advised by doctor to rest for 5 days. Medical certificate attached.'
    },
    {
        id: '3',
        facultyName: 'Reyes, Pedro',
        facultyId: '55557',
        college: 'chass',
        collegeName: 'Humanities, Arts, and Social Sciences',
        department: 'psychology',
        departmentName: 'Psychology',
        type: 'excuse',
        typeLabel: 'Leave of Absence',
        dateApplied: 'February 22, 2026',
        status: 'approved',
        reason: 'Attending professional development conference on Behavioral Psychology in Manila. Approved by department head.'
    },
    {
        id: '4',
        facultyName: 'Garcia, Ana',
        facultyId: '55558',
        college: 'engineering',
        collegeName: 'College of Engineering',
        department: 'computer',
        departmentName: 'Computer Engineering',
        type: 'excuse',
        typeLabel: 'Medical Appointment',
        dateApplied: 'March 8, 2026',
        status: 'rejected',
        reason: 'Regular dental check-up, not urgent. Requested only 2 hours but insufficient justification provided.'
    },
    {
        id: '5',
        facultyName: 'Lopez, Jose',
        facultyId: '55559',
        college: 'education',
        collegeName: 'College of Education',
        department: 'physical',
        departmentName: 'Physical Education',
        type: 'leave',
        typeLabel: 'Personal Leave',
        dateApplied: 'March 10, 2026',
        status: 'approved',
        reason: 'Family wedding out of town in Cebu. Will make up for missed classes upon return.'
    }
];

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    setupCollegeDepartmentCascade();
    setupFilterListeners();
    loadAppeals();
});

// ============================================================
// COLLEGE → DEPARTMENT CASCADE
// ============================================================
function setupCollegeDepartmentCascade() {
    const collegeSelect = document.getElementById('college');
    const departmentSelect = document.getElementById('department');

    if (!collegeSelect || !departmentSelect) return;

    collegeSelect.addEventListener('change', function() {
        const selectedCollege = this.value;

        // Clear existing options except "All Departments"
        departmentSelect.innerHTML = '<option value="">All Departments</option>';

        if (selectedCollege && COLLEGE_DEPARTMENTS[selectedCollege]) {
            const departments = COLLEGE_DEPARTMENTS[selectedCollege].departments;
            departments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept.value;
                option.textContent = dept.label;
                departmentSelect.appendChild(option);
            });
        }

        // Trigger filter update when college changes
        applyFilters();
    });

    // Also trigger filter when department changes
    departmentSelect.addEventListener('change', applyFilters);
}

// ============================================================
// FILTER LISTENERS
// ============================================================
function setupFilterListeners() {
    const typeFilter = document.getElementById('appealType');
    const statusFilter = document.getElementById('appealStatus');

    if (typeFilter) {
        typeFilter.addEventListener('change', applyFilters);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
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
// LOAD & RE  NDER APPEALS
// ============================================================
function loadAppeals() {
    renderAppeals(appealsData);
}

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
    const appeal = appealsData.find(a => a.id === appealId);
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
    
    document.getElementById('summaryUpdatedBy').textContent = appeal.updatedBy || 'N/A';

    const statusEl = document.getElementById('summaryStatus');
    statusEl.textContent = appeal.status;
    statusEl.className = 'detail-value status-badge ' + appeal.status;

    openModal('summaryModal');
}

// ============================================================
// UPDATE STATUS MODAL
// ============================================================
function openUpdateStatus(appealId) {
    const appeal = appealsData.find(a => a.id === appealId);
    if (!appeal) return;

    currentAppealId = appealId;

    // Set Faculty Name and Status
    document.getElementById('statusFacultyName').textContent = appeal.facultyName;
    const currentStatusEl = document.getElementById('statusCurrent');
    currentStatusEl.textContent = appeal.status;
    currentStatusEl.className = appeal.status;

    // //start edit
    const warningBox = document.getElementById('statusConflictWarning');
    const classList = document.getElementById('statusAffectedClassesList');
    const conflictCount = document.getElementById('statusConflictCount');

    if (appeal.status === 'pending' && (appeal.type == 'leave' || appeal.type == 'excuse' )) {

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

function updateStatus(newStatus) {
    if (!currentAppealId) return;

    const appeal = appealsData.find(a => a.id === currentAppealId);
    if (!appeal) return;

    // Update the data
    appeal.status = newStatus;

    // Re-render with current filters
    applyFilters();

    // Close modal
    closeModal('updateStatusModal');
}