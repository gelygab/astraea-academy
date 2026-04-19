// ==========================================
// Astraea Academy Student Report - Version 1 (Placeholders)
// ==========================================

const MOCK_STUDENTS = [
    // Civil Engineering
    { uid: '11001', name: 'Amores, Jasmine', department: 'Civil Engineering', absence: 2, leave: 5, excused: 2 },
    { uid: '12002', name: 'Hollander, Shane', department: 'Civil Engineering', absence: 2, leave: 4, excused: 1 },
    { uid: '12003', name: 'Rozanov, Ilya', department: 'Civil Engineering', absence: 5, leave: 3, excused: 2 },
    
    // Electrical Engineering
    { uid: '21001', name: 'Leclerc, Charles', department: 'Electrical Engineering', absence: 1, leave: 2, excused: 0 },
    { uid: '22002', name: 'Sainz, Carlos', department: 'Electrical Engineering', absence: 3, leave: 1, excused: 1 },
    { uid: '23003', name: 'Verstappen, Max', department: 'Electrical Engineering', absence: 0, leave: 4, excused: 2 },
    { uid: '23004', name: 'Tsunoda, Yuki', department: 'Electrical Engineering', absence: 2, leave: 0, excused: 3 },
    
    // Mechanical Engineering
    { uid: '31001', name: 'Sorilla, Katrina', department: 'Mechanical Engineering', absence: 4, leave: 2, excused: 1 },
    { uid: '32002', name: 'Ternate, Jessie', department: 'Mechanical Engineering', absence: 1, leave: 3, excused: 0 },
    { uid: '33003', name: 'Paz, Francesca', department: 'Mechanical Engineering', absence: 6, leave: 1, excused: 2 },
    { uid: '33004', name: 'Choi, Alexa', department: 'Mechanical Engineering', absence: 2, leave: 2, excused: 1 },
    { uid: '33005', name: 'Lee, Rean', department: 'Mechanical Engineering', absence: 0, leave: 1, excused: 0 },
    
    // Computer Engineering
    { uid: '42001', name: 'Faiyaz, Brent', department: 'Computer Engineering', absence: 1, leave: 1, excused: 0 },
    { uid: '41002', name: 'Perez, Grent', department: 'Computer Engineering', absence: 3, leave: 4, excused: 1 },
    { uid: '41003', name: 'Tiller, Bryson', department: 'Computer Engineering', absence: 2, leave: 2, excused: 2 },
    { uid: '42004', name: 'Aiko, Jhene', department: 'Computer Engineering', absence: 0, leave: 0, excused: 1 },
    
    // Chemical Engineering
    { uid: '42001', name: 'Yoon, Jeonghan', department: 'Chemical Engineering', absence: 2, leave: 3, excused: 1 },
    { uid: '33002', name: 'Quero, Jael', department: 'Chemical Engineering', absence: 4, leave: 1, excused: 0 },
    
    // Electronics Engineering
    { uid: '21001', name: 'Takuma, Ino', department: 'Electronics Engineering', absence: 1, leave: 2, excused: 1 },
    { uid: '12002', name: 'Zenin, Maki', department: 'Electronics Engineering', absence: 3, leave: 3, excused: 2 },
    
    // Manufacturing Engineering
    { uid: '31001', name: 'Ieiri, Shoko', department: 'Manufacturing Engineering', absence: 5, leave: 2, excused: 1 },
    { uid: '12002', name: 'Tsukumo, Yuki', department: 'Manufacturing Engineering', absence: 2, leave: 4, excused: 0 }
];

// Subject attendance data
const MOCK_SUBJECTS = [
    { code: 'AAP 007', description: 'Art Appreciation', present: 92, absence: 0, late: 5, excuse: 0 },
    { code: 'CET 023.1', description: 'Computer-Aided Drafting', present: 92, absence: 0, late: 2, excuse: 0 },
    { code: 'CET 0211', description: 'Differential Equations', present: 90, absence: 2, late: 2, excuse: 0 },
    { code: 'CET 0221', description: 'Engineering Data Analysis', present: 92, absence: 0, late: 2, excuse: 0 },
    { code: 'CET 0223', description: 'Dynamics of Rigid Bodies', present: 91, absence: 1, late: 3, excuse: 0 },
    { code: 'CIV 0221', description: 'Geology for Civil Engineers', present: 89, absence: 3, late: 1, excuse: 0 },
    { code: 'CIV 0222', description: 'Mechanics of Deformable Bodies', present: 92, absence: 0, late: 1, excuse: 0 },
    { code: 'PATHFIT 405', description: 'Larong Lahi', present: 92, absence: 0, late: 2, excuse: 0 }
];

// Student profile data
const MOCK_STUDENT_PROFILE = {
    lastName: 'AMORES,',
    firstName: 'Princess Jasmine',
    college: 'College of Engineering',
    department: 'Civil Engineering'
};

// Calendar marked days
const MOCK_CALENDAR_DAYS = {
    3: 'absent',
    6: 'excused',
    7: 'absent',
    13: 'leave',
    14: 'absent',
    20: 'excused',
    21: 'leave',
    27: 'absent',
    28: 'excused'
};

// ==========================================
// GLOBAL VARIABLES
// ==========================================

let currentStudent = null;
let currentMonth = 2; // March (0-indexed)
let currentYear = 2026;
let currentSubject = { code: 'CET 0211', name: 'Differential Equations' };
let allStudents = [...MOCK_STUDENTS]; // Working copy of students
let donutCharts = {};

// Department value mapping for filter dropdown
const DEPARTMENT_MAP = {
    'civil': 'Civil Engineering',
    'chemical': 'Chemical Engineering',
    'computer': 'Computer Engineering',
    'electrical': 'Electrical Engineering',
    'electronics': 'Electronics Engineering',
    'mechanical': 'Mechanical Engineering',
    'manufacturing': 'Manufacturing Engineering',
    'early childhood': 'Early Childhood Education',
    'elementary education': 'Elementary Education',
    'secondary education': 'Secondary Education',
    'special needs': 'Special Needs Education',
    'physical education': 'Physical Education',
    'social work': 'Social Work',
    'mass communication': 'Mass Communication',
    'psychology': 'Psychology',

};

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();

});

function initializeApp() {
    setupFilterListeners();
    loadStudents(allStudents);
    updateStatistics(allStudents);
}

// ==========================================
// SIDEBAR NAVIGATION
// ==========================================

function toggleNavGroup(button) {
    const navGroup = button.parentElement;
    navGroup.classList.toggle('open');
}

// ==========================================
// VIEW NAVIGATION
// ==========================================

function showView(viewId) {
    document.querySelectorAll('.view-container').forEach(view => {
        view.classList.remove('active');
    });
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');
        window.scrollTo(0, 0);
    }
}

function showMainReport() {
    showView('mainReportView');
}

function backToStudentTeamRecords() {
    showView('mainReportView');
}

function showStudentRecord(studentData) {
    currentStudent = studentData;
    
    // Update profile display
    document.getElementById('profileLastName').textContent = MOCK_STUDENT_PROFILE.lastName;
    document.getElementById('profileFirstName').textContent = MOCK_STUDENT_PROFILE.firstName;
    document.getElementById('profileCollege').textContent = MOCK_STUDENT_PROFILE.college;
    document.getElementById('profileDepartment').textContent = studentData.department || MOCK_STUDENT_PROFILE.department;

    // Initialize donut charts
    initDonutCharts(studentData);

    // Load subject table
    loadSubjectTable();

    showView('studentRecordView');
}

function showCalendarView(subjectCode = null) {
    if (subjectCode) {
        const subject = MOCK_SUBJECTS.find(s => s.code === subjectCode);
        if (subject) {
            currentSubject = { code: subject.code, name: subject.description };
        }
    }
    document.getElementById('calendarSubjectTitle').textContent = 
        currentSubject.code + ' ' + currentSubject.name;
    renderCalendar();
    showView('calendarView');
}

function backToStudentRecord() {
    showView('studentRecordView');
}

// ==========================================
// FILTERING LOGIC
// ==========================================

function setupFilterListeners() {
    const departmentFilter = document.getElementById('department');
    const yearFilter = document.getElementById('year');
    const blockFilter = document.getElementById('block');
    
    if (departmentFilter) {
        departmentFilter.addEventListener('change', applyFilters);
    }
    if (yearFilter) {
        yearFilter.addEventListener('change', applyFilters);
    }
    if (blockFilter) {
        blockFilter.addEventListener('change', applyFilters);
    }
}

function applyFilters() {
    const departmentValue = document.getElementById('department')?.value || '';
    const yearValue = document.getElementById('year')?.value || '';
    const blockValue = document.getElementById('block')?.value || '';
    
    // Filter students based on selected criteria
    let filteredStudents = MOCK_STUDENTS.filter(student => {
        let matchesDepartment = true;
        let matchesYear = true;
        let matchesBlock = true;
        
        // Department filter
        if (departmentValue && DEPARTMENT_MAP[departmentValue]) {
            matchesDepartment = student.department === DEPARTMENT_MAP[departmentValue];
        }
        
        // Year filter (extract from UID or use a year property if available)
        // For mock data, we'll simulate year from UID first digit
        if (yearValue) {
            const studentYear = student.uid.charAt(0);
            matchesYear = studentYear === yearValue;
        }
        
        // Block filter (simulate from UID second digit)
        if (blockValue) {
            const studentBlock = student.uid.charAt(1);
            matchesBlock = studentBlock === blockValue;
        }
        
        return matchesDepartment && matchesYear && matchesBlock;
    });
    
    // Update working copy
    allStudents = filteredStudents;
    
    // Re-render students and statistics
    loadStudents(allStudents);
    updateStatistics(allStudents);
}

// ==========================================
// DYNAMIC STATISTICS
// ==========================================

function updateStatistics(students) {
    // Calculate statistics based on current filtered data
    const totalStudents = students.length;
    
    // Calculate total absences across all filtered students
    const totalAbsences = students.reduce((sum, student) => sum + student.absence, 0);
    
    // Calculate productivity (students with 0 absences / total students)
    const studentsWithNoAbsences = students.filter(s => s.absence === 0).length;
    const productivity = totalStudents > 0 
        ? ((studentsWithNoAbsences / totalStudents) * 100).toFixed(1) 
        : '0.0';
    
    // Calculate absenteeism rate (average absences per student)
    const avgAbsences = totalStudents > 0 ? (totalAbsences / totalStudents) : 0;
    // Cap at 100% for display, scale appropriately
    const absenteeism = Math.min((avgAbsences / 5 * 100), 100).toFixed(1);
    
    // Update DOM elements
    const totalStudentsEl = document.getElementById('totalStudents');
    const totalAbsentEl = document.getElementById('totalAbsent');
    const productivityEl = document.getElementById('productivity');
    const absenteeismEl = document.getElementById('absenteeism');
    
    if (totalStudentsEl) totalStudentsEl.textContent = totalStudents;
    if (totalAbsentEl) totalAbsentEl.textContent = totalAbsences;
    if (productivityEl) productivityEl.textContent = productivity + '%';
    if (absenteeismEl) absenteeismEl.textContent = absenteeism + '%';
}

// ==========================================
// MAIN REPORT VIEW - STUDENT LIST
// ==========================================

function loadStudents(students) {
    renderStudents(students);
}

function getMaxValue(students) {
    let max = 0;
    students.forEach(s => {
        max = Math.max(max, s.absence, s.leave, s.excused);
    });
    return Math.max(max, 1); // Prevent division by zero
}

function renderStudents(students) {
    const grid = document.getElementById('studentsGrid');
    if (!grid) return;

    if (students.length === 0) {
        grid.innerHTML = '<div class="no-results">No students found matching the selected filters.</div>';
        return;
    }

    const maxValue = getMaxValue(students);

    grid.innerHTML = students.map(student => `
        <div class="student-card-item">
            <div class="student-card-header-row">
                <div class="student-info-block">
                    <span class="student-uid-text">UID: ${student.uid}</span>
                    <span class="student-name-text">${student.name}</span>
                    <span class="student-dept-text" style="font-size: 11px; color: rgba(107, 78, 61, 0.6); margin-top: 2px;">${student.department}</span>
                </div>
                <button class="btn-view-record-gold" onclick='viewRecord(${JSON.stringify(student).replace(/'/g, "&#39;")})'>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View Record
                </button>
            </div>
            <div class="horizontal-chart-container">
                <div class="bar-chart-row">
                    <span class="bar-chart-label">Absence</span>
                    <div class="bar-chart-track">
                        <div class="bar-chart-fill absence" style="width: ${(student.absence / maxValue) * 100}%"></div>
                    </div>
                    <span class="bar-chart-value">${student.absence}</span>
                </div>
                <div class="bar-chart-row">
                    <span class="bar-chart-label">Leave</span>
                    <div class="bar-chart-track">
                        <div class="bar-chart-fill leave" style="width: ${(student.leave / maxValue) * 100}%"></div>
                    </div>
                    <span class="bar-chart-value">${student.leave}</span>
                </div>
                <div class="bar-chart-row">
                    <span class="bar-chart-label">Excused</span>
                    <div class="bar-chart-track">
                        <div class="bar-chart-fill excused" style="width: ${(student.excused / maxValue) * 100}%"></div>
                    </div>
                    <span class="bar-chart-value">${student.excused}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function viewRecord(student) {
    showStudentRecord(student);
}

// ==========================================
// STUDENT RECORD VIEW - DONUT CHARTS
// ==========================================

function initDonutCharts(studentData) {
    // Destroy existing charts
    ['presentChart', 'lateChart', 'absenceChart', 'excuseChart'].forEach(id => {
        if (donutCharts[id]) {
            donutCharts[id].destroy();
        }
    });

    // Ensure we have valid numbers (default to 0 if undefined)
    const absence = parseInt(studentData.absence) || 0;
    const leave = parseInt(studentData.leave) || 0;
    const excused = parseInt(studentData.excused) || 0;
    
    // Calculate percentages that sum to 100
    // Assume a base of 100 total days for calculation
    const totalDays = 100;
    
    // Calculate raw values first
    let absencePct = Math.min(absence * 5, 30); // Cap at 30%
    let leavePct = Math.min(leave * 3, 25);     // Cap at 25%
    let excusedPct = Math.min(excused * 2, 15); // Cap at 15%
    
    // Present is whatever remains (ensures total = 100)
    let presentPct = Math.max(0, 100 - absencePct - leavePct - excusedPct);
    
    // Round to whole numbers
    presentPct = Math.round(presentPct);
    absencePct = Math.round(absencePct);
    leavePct = Math.round(leavePct);
    excusedPct = Math.round(excusedPct);

    const chartConfigs = [
        { id: 'presentChart', value: presentPct, label: 'present' },
        { id: 'lateChart', value: leavePct, label: 'late' },
        { id: 'absenceChart', value: absencePct, label: 'absence' },
        { id: 'excuseChart', value: excusedPct, label: 'excuse' }
    ];

    chartConfigs.forEach(config => {
        const ctx = document.getElementById(config.id);
        if (!ctx) return;

        // Ensure value is a valid number between 0-100
        const safeValue = Math.max(0, Math.min(100, parseInt(config.value) || 0));
        const remaining = 100 - safeValue;

        donutCharts[config.id] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [config.label, 'Remaining'],
                datasets: [{
                    data: [safeValue, remaining],
                    backgroundColor: [
                        'rgba(255, 255, 255, 0.9)',  
                        'rgba(255, 255, 255, 0.15)'   
                    ],
                    borderWidth: 0,
                    cutout: '75%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                animation: {
                    animateRotate: true,
                    duration: 1000
                }
            }
        });
    });

    // Update percentage text with safe values
    document.getElementById('presentPercentage').textContent = presentPct + '%';
    document.getElementById('latePercentage').textContent = leavePct + '%';
    document.getElementById('absencePercentage').textContent = absencePct + '%';
    document.getElementById('excusePercentage').textContent = excusedPct + '%';
}

// ==========================================
// SUBJECT TABLE
// ==========================================

function loadSubjectTable() {
    const tbody = document.getElementById('subjectTableBody');
    if (!tbody) return;

    tbody.innerHTML = MOCK_SUBJECTS.map(subject => `
        <tr>
            <td>${subject.code}</td>
            <td>${subject.description}</td>
            <td>${subject.present}</td>
            <td>${subject.absence}</td>
            <td>${subject.late}</td>
            <td>${subject.excuse}</td>
            <td>
                <button class="btn-view-calendar-small" onclick="showCalendarView('${subject.code}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    View Calendar
                </button>
            </td>
        </tr>
    `).join('');
}

// ==========================================
// CALENDAR VIEW
// ==========================================

function renderCalendar() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    document.getElementById('calendarMonthDisplay').textContent = 
        `${monthNames[currentMonth]} ${currentYear}`;

    const daysContainer = document.getElementById('calendarDaysGrid');
    if (!daysContainer) return;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    let html = '';

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        html += `<div class="calendar-day-cell other-month">
            <span class="day-number">${daysInPrevMonth - i}</span>
        </div>`;
    }

    // Current month days with status indicators
    for (let day = 1; day <= daysInMonth; day++) {
        const status = MOCK_CALENDAR_DAYS[day];
        const statusIndicator = status ? `<span class="status-indicator ${status}"></span>` : '';
        const clickHandler = status ? `onclick="showAttendanceDetails(${day}, '${status}')"` : '';

        html += `<div class="calendar-day-cell" ${clickHandler}>
            <span class="day-number">${day}</span>
            ${statusIndicator}
        </div>`;
    }

    // Next month days
    const totalCells = firstDay + daysInMonth;
    const remainingCells = (Math.ceil(totalCells / 7) * 7) - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
        html += `<div class="calendar-day-cell other-month">
            <span class="day-number">${i}</span>
        </div>`;
    }

    daysContainer.innerHTML = html;
}

function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

// ==========================================
// ATTENDANCE MODAL
// ==========================================

function showAttendanceDetails(day, status) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const dateStr = `${monthNames[currentMonth]} ${day}, ${currentYear}`;

    document.getElementById('modalStudentName').textContent = 
        currentStudent ? currentStudent.name : 'Amores, Princess Jasmine';
    document.getElementById('modalDate').textContent = dateStr;
    document.getElementById('modalID').textContent = 
        currentStudent ? currentStudent.uid : '33333';

    const statusPill = document.getElementById('modalStatus');
    statusPill.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    statusPill.className = `detail-data status-pill ${status}`;

    document.getElementById('attendanceModal').classList.add('active');
}

function closeAttendanceModal(event) {
    if (!event || event.target.id === 'attendanceModal' || event.target.classList.contains('modal-close-btn')) {
        document.getElementById('attendanceModal').classList.remove('active');
    }
}

// ==========================================
// LOGOUT
// ==========================================

document.querySelector('.logout')?.addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to log out?')) {
        window.location.href = '/login';
    }
});