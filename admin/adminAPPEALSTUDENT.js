// ============================================================
// adminAPPEALSTUDENT.js — VERSION 1: Testing/Mock Data
// ============================================================

// Sidebar Navigation Toggle
function toggleNavGroup(button) {
    const navGroup = button.parentElement;
    navGroup.classList.toggle('open');
}

let currentAppealId = null;

// ============================================================
// DEPARTMENT DATA (for dynamic dropdown population)
// ============================================================
const DEPARTMENTS = [
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

// ============================================================
// MOCK DATA 
// ============================================================
const appealsData = [
    {
        id: '1',
        studentName: 'Amores, Princess Jasmine',
        studentId: '33333',
        department: 'civil',
        departmentName: 'Civil Engineering',
        year: '3',
        yearLabel: '3rd Year',
        block: '1',
        type: 'leave',
        typeLabel: 'Emergency Leave',
        dateApplied: 'March 2, 2026',
        status: 'approved',
        reason: 'Family emergency — need to attend to sick family member in the province. Will be unavailable for 3 days.'
    },
    {
        id: '2',
        studentName: 'Santos, Maria Clara',
        studentId: '33334',
        department: 'elementary',
        departmentName: 'Elementary Education',
        year: '2',
        yearLabel: '2nd Year',
        block: '3',
        type: 'leave',
        typeLabel: 'Sick Leave',
        dateApplied: 'March 5, 2026',
        status: 'pending',
        reason: 'High fever and flu symptoms, advised by doctor to rest for 5 days. Medical certificate attached.'
    },
    {
        id: '3',
        studentName: 'Reyes, Juan Carlos',
        studentId: '33335',
        department: 'psychology',
        departmentName: 'Psychology',
        year: '4',
        yearLabel: '4th Year',
        block: '3',
        type: 'excuse',
        typeLabel: 'Leave of Absence',
        dateApplied: 'February 22, 2026',
        status: 'rejected',
        reason: 'Personal travel plans during school week. No valid documentation provided.'
    },
    {
        id: '4',
        studentName: 'Cruz, Ana Marie',
        studentId: '33336',
        department: 'computer',
        departmentName: 'Computer Engineering',
        year: '1',
        yearLabel: '1st Year',
        block: '1',
        type: 'excuse',
        typeLabel: 'Medical Appointment',
        dateApplied: 'March 8, 2026',
        status: 'pending',
        reason: 'Scheduled dental surgery — have medical certificate from accredited clinic.'
    },
    {
        id: '5',
        studentName: 'Garcia, Miguel Jose',
        studentId: '33337',
        department: 'electrical',
        departmentName: 'Electrical Engineering',
        year: '3',
        yearLabel: '3rd Year',
        block: '2',
        type: 'leave',
        typeLabel: 'Extracurricular Activity',
        dateApplied: 'March 10, 2026',
        status: 'approved',
        reason: 'Representing school in regional debate competition. Endorsed by adviser.'
    },
    {
        id: '6',
        studentName: 'Zamora, Tricia Mae',
        studentId: '33338',
        department: 'physical',
        departmentName: 'Physical Education',
        year: '2',
        yearLabel: '2nd Year',
        block: '2',
        type: 'excuse',
        typeLabel: 'Family Event',
        dateApplied: 'March 12, 2026',
        status: 'approved',
        reason: 'Sister graduation ceremony out of town. Will submit photos as proof.'
    },
    {
        id: '7',
        studentName: 'Lopez, Carlos Miguel',
        studentId: '33339',
        department: 'mechanical',
        departmentName: 'Mechanical Engineering',
        year: '4',
        yearLabel: '4th Year',
        block: '2',
        type: 'leave',
        typeLabel: 'Bereavement Leave',
        dateApplied: 'March 15, 2026',
        status: 'pending',
        reason: 'Death of immediate family member. Funeral service will be held in hometown.'
    },
    {
        id: '8',
        studentName: 'Torres, Sofia Marie',
        studentId: '33340',
        department: 'communications',
        departmentName: 'Communications',
        year: '1',
        yearLabel: '1st Year',
        block: '2',
        type: 'excuse',
        typeLabel: 'Court Appearance',
        dateApplied: 'March 18, 2026',
        status: 'rejected',
        reason: 'Required to testify as witness — date can be rescheduled per court clerk.'
    }
];

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    populateDepartmentDropdown();
    setupFilterListeners();
    loadAppeals();
});

// ============================================================
// POPULATE DEPARTMENT DROPDOWN
// ============================================================
function populateDepartmentDropdown() {
    const deptSelect = document.getElementById('department');
    if (!deptSelect) return;

    deptSelect.innerHTML = '<option value="">All Departments</option>';

    DEPARTMENTS.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.value;
        option.textContent = dept.label;
        deptSelect.appendChild(option);
    });
}

// ============================================================
// FILTER LISTENERS 
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
// APPLY FILTERS
// ============================================================
function applyFilters() {
    const type      = document.getElementById('appealType')?.value  || '';
    const status    = document.getElementById('appealStatus')?.value || '';
    const department = document.getElementById('department')?.value  || '';
    const year      = document.getElementById('year')?.value        || '';
    const block     = document.getElementById('block')?.value       || '';

    const filtered = appealsData.filter(a => {
        const typeMatch      = !type      || a.type === type;
        const statusMatch    = !status    || a.status === status;
        const deptMatch      = !department || a.department === department;
        const yearMatch      = !year      || a.year === year;
        const blockMatch     = !block     || a.block === block;
        return typeMatch && statusMatch && deptMatch && yearMatch && blockMatch;
    });

    renderAppeals(filtered);
}

// ============================================================
// LOAD & RENDER APPEALS
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
                  <div class="appeal-detail-row">
                    <span class="label">Subject Affected</span>
                    <span class="value">${appeal.subjectAffected}</span>
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
// LOGOUT
// ============================================================
document.querySelector('.logout')?.addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to log out?')) {
        window.location.href = '/login';
    }
});
