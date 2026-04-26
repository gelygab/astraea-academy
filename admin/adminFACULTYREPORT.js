// ==========================================
// Astraea Academy Faculty Report - Version 1 (With Placeholders)
// ==========================================

// ==========================================
// HIERARCHICAL DATA STRUCTURE
// ==========================================

const COLLEGE_DEPARTMENTS = {
    'engineering': {
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
    'education': {
        name: 'College of Education',
        departments: [
            { value: 'early-childhood', label: 'Early Childhood Education' },
            { value: 'elementary', label: 'Elementary Education' },
            { value: 'physical', label: 'Physical Education' },
            { value: 'secondary', label: 'Secondary Education' },
            { value: 'special-needs', label: 'Special Needs Education' }
        ]
    },
    'chass': {
        name: 'College of Humanities, Arts, and Social Sciences',
        departments: [
            { value: 'communications', label: 'Communications' },
            { value: 'social-work', label: 'Social Work' },
            { value: 'psychology', label: 'Psychology' }
        ]
    }
};

// ==========================================
// MOCK DATA - 5 Professors Across Different Colleges/Departments
// ==========================================

const MOCK_FACULTY = [
    { 
        uid: '55555', 
        name: 'Holmes, Sherlock', 
        college: 'engineering',
        collegeName: 'College of Engineering',
        department: 'computer', 
        departmentName: 'Computer Engineering',
        attendance: 92,
        present: 46,
        late: 2,
        absence: 2,
        excuse: 0,
        absentReasons: { sick: 1, personal: 1, emergency: 0, other: 0 }
    },
    { 
        uid: '55556', 
        name: 'Moriarty, Williams', 
        college: 'engineering',
        collegeName: 'College of Engineering',
        department: 'electrical', 
        departmentName: 'Electrical Engineering',
        attendance: 88,
        present: 44,
        late: 3,
        absence: 3,
        excuse: 0,
        absentReasons: { sick: 2, personal: 0, emergency: 1, other: 0 }
    },
    { 
        uid: '55557', 
        name: 'Watsons, John', 
        college: 'education',
        collegeName: 'College of Education',
        department: 'secondary', 
        departmentName: 'Secondary Education',
        attendance: 95,
        present: 47,
        late: 1,
        absence: 1,
        excuse: 1,
        absentReasons: { sick: 0, personal: 0, emergency: 0, other: 1 }
    },
    { 
        uid: '55558', 
        name: 'Holmes, Mycroft', 
        college: 'chass',
        collegeName: 'Humanities, Arts, and Social Sciences',
        department: 'psychology', 
        departmentName: 'Psychology',
        attendance: 85,
        present: 42,
        late: 4,
        absence: 3,
        excuse: 1,
        absentReasons: { sick: 1, personal: 1, emergency: 1, other: 0 }
    },
    { 
        uid: '55559', 
        name: 'Moriarty, Albert', 
        college: 'engineering',
        collegeName: 'College of Engineering',
        department: 'chemical', 
        departmentName: 'Chemical Engineering',
        attendance: 90,
        present: 45,
        late: 2,
        absence: 2,
        excuse: 1,
        absentReasons: { sick: 1, personal: 0, emergency: 0, other: 1 }
    }
];

// Faculty profile data (for individual view)
const MOCK_FACULTY_PROFILES = {
    '55555': { lastName: 'HOLMES,', firstName: 'Sherlock', college: 'College of Engineering', department: 'Computer Engineering' },
    '55556': { lastName: 'MORIARTY,', firstName: 'Williams', college: 'College of Engineering', department: 'Electrical Engineering' },
    '55557': { lastName: 'WATSONS,', firstName: 'John', college: 'College of Education', department: 'Secondary Education' },
    '55558': { lastName: 'HOLMES,', firstName: 'Mycroft', college: 'Humanities, Arts, and Social Sciences', department: 'Psychology' },
    '55559': { lastName: 'MORIARTY,', firstName: 'Albert', college: 'College of Engineering', department: 'Chemical Engineering' }
};

// Subject attendance data
const MOCK_SUBJECTS = [
    { code: 'CET 0221', description: 'Engineering Management', present: 92, absence: 0, late: 5, excuse: 0 },
    { code: 'CPE 0222', description: 'Software Design', present: 92, absence: 0, late: 2, excuse: 0 },
    { code: 'CPE 0223', description: 'Fundamentals of Electronic Circuits', present: 90, absence: 2, late: 2, excuse: 0 },
    { code: 'ELE 0229', description: 'Basic Electrical and Electronics Engineering', present: 92, absence: 0, late: 0, excuse: 0 }
];

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

let currentFaculty = null;
let currentMonth = 2; // March (0-indexed)
let currentYear = 2026;
let currentSubject = { code: 'CET 0221', name: 'Engineering Management' };
let allFaculty = [...MOCK_FACULTY];
let filteredFaculty = [...MOCK_FACULTY];
let departmentChart = null;
let reasonChart = null;
let donutCharts = {};

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupCollegeDepartmentCascade();
    setupFilterListeners();
    loadFaculty(filteredFaculty);
    updateStatistics(filteredFaculty);
    initDepartmentChart();
    initReasonChart();
}

// ==========================================
// HIERARCHICAL FILTERING (College & Department)
// ==========================================

function setupCollegeDepartmentCascade() {
    const collegeSelect = document.getElementById('college');
    const departmentSelect = document.getElementById('department');

    if (!collegeSelect || !departmentSelect) return;

    // Initial population of department dropdown
    populateDepartmentDropdown('', departmentSelect);

    // College change handler
    collegeSelect.addEventListener('change', function() {
        const selectedCollege = this.value;

        // Update department dropdown based on selected college
        populateDepartmentDropdown(selectedCollege, departmentSelect);

        // Apply filters immediately
        applyFilters();
    });
}

function populateDepartmentDropdown(collegeValue, departmentSelect) {
    // Clear existing options except "All Departments"
    departmentSelect.innerHTML = '<option value="">All Departments</option>';

    if (!collegeValue || !COLLEGE_DEPARTMENTS[collegeValue]) {
        // If no college selected, show all departments grouped
        Object.entries(COLLEGE_DEPARTMENTS).forEach(([key, college]) => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = college.name;
            college.departments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept.value;
                option.textContent = dept.label;
                optgroup.appendChild(option);
            });
            departmentSelect.appendChild(optgroup);
        });
    } else {
        // Show only departments for selected college
        const college = COLLEGE_DEPARTMENTS[collegeValue];
        college.departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.value;
            option.textContent = dept.label;
            departmentSelect.appendChild(option);
        });
    }
}

function setupFilterListeners() {
    const filters = ['schoolYear', 'semester', 'college', 'department'];
    filters.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', applyFilters);
        }
    });
}

function applyFilters() {
    const collegeValue = document.getElementById('college')?.value || '';
    const departmentValue = document.getElementById('department')?.value || '';
    const schoolYear = document.getElementById('schoolYear')?.value || '';
    const semester = document.getElementById('semester')?.value || '';

    // Filter faculty based on selected criteria
    filteredFaculty = allFaculty.filter(faculty => {
        let matchesCollege = true;
        let matchesDepartment = true;

        // College filter
        if (collegeValue) {
            matchesCollege = faculty.college === collegeValue;
        }

        // Department filter
        if (departmentValue) {
            matchesDepartment = faculty.department === departmentValue;
        }

        return matchesCollege && matchesDepartment;
    });

    // Update all components
    loadFaculty(filteredFaculty);
    updateStatistics(filteredFaculty);
    updateCharts(filteredFaculty);
}

// ==========================================
// DYNAMIC STATISTICS
// ==========================================

function updateStatistics(faculty) {
    const totalEmployees = faculty.length;

    // Calculate total absences across all filtered students
    const totalAbsent = faculty.reduce((sum, f) => sum + (f.absence || 0), 0);

    // Calculate average attendance rate
    const avgAttendance = totalEmployees > 0 
        ? faculty.reduce((sum, f) => sum + (f.attendance || 0), 0) / totalEmployees 
        : 0;

    // Productivity = average attendance rate
    const productivity = avgAttendance.toFixed(1);

    // Absenteeism = 100 - productivity
    const absenteeism = (100 - avgAttendance).toFixed(1);

    // Update DOM with animation
    animateValue('totalEmployees', parseInt(document.getElementById('totalEmployees')?.textContent || 0), totalEmployees, 500);
    animateValue('totalAbsent', parseInt(document.getElementById('totalAbsent')?.textContent || 0), totalAbsent, 500);

    const productivityEl = document.getElementById('productivity');
    const absenteeismEl = document.getElementById('absenteeism');

    if (productivityEl) productivityEl.textContent = productivity + '%';
    if (absenteeismEl) absenteeismEl.textContent = absenteeism + '%';
}

function animateValue(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const range = end - start;
    const minTimer = 50;
    let stepTime = Math.abs(Math.floor(duration / (range || 1)));
    stepTime = Math.max(stepTime, minTimer);

    let startTime = new Date().getTime();
    let endTime = startTime + duration;
    let timer;

    function run() {
        let now = new Date().getTime();
        let remaining = Math.max((endTime - now) / duration, 0);
        let value = Math.round(end - (remaining * range));
        element.textContent = value + (elementId === 'productivity' || elementId === 'absenteeism' ? '%' : '');
        if (value === end) {
            clearInterval(timer);
        }
    }

    timer = setInterval(run, stepTime);
    run();
}

// ==========================================
// MAIN REPORT VIEW - FACULTY LIST
// ==========================================

function loadFaculty(faculty) {
    renderFaculty(faculty);
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function renderFaculty(faculty) {
    const grid = document.getElementById('facultyGrid');
    if (!grid) return;

    if (faculty.length === 0) {
        grid.innerHTML = '<div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 40px; color: rgba(107, 78, 61, 0.6);">No faculty found matching the selected filters.</div>';
        return;
    }

    grid.innerHTML = faculty.map(member => `
        <div class="faculty-card">
            <div class="faculty-header">
                <div class="faculty-avatar">${getInitials(member.name)}</div>
                <div class="faculty-info">
                    <h4>Prof. ${member.name}</h4>
                    <p>${member.departmentName}</p>
                    <p style="font-size: 11px; color: rgba(107, 78, 61, 0.5);">${member.collegeName}</p>
                </div>
            </div>
            <div class="attendance-bar-container">
                <div class="attendance-bar-header">
                    <span>Attendance Rate</span>
                    <span>${member.attendance}%</span>
                </div>
                <div class="attendance-bar">
                    <div class="attendance-bar-fill" style="width: ${member.attendance}%"></div>
                </div>
            </div>
            <div class="faculty-actions">
                <button class="btn-primary" onclick="viewRecord('${member.uid}')">
                    View Record
                </button>
            </div>
        </div>
    `).join('');
}

function viewRecord(uid) {
    const faculty = allFaculty.find(f => f.uid === uid);
    if (faculty) {
        showFacultyRecord(faculty);
    }
}

// ==========================================
// DYNAMIC CHARTS
// ==========================================

function initDepartmentChart() {
    const ctx = document.getElementById('departmentChart');
    if (!ctx) return;

    const data = calculateDepartmentData(filteredFaculty);

    departmentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Average Attendance Rate (%)',
                data: data.values,
                backgroundColor: 'rgba(212, 168, 67, 0.8)',
                borderColor: '#D4A843',
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    ticks: {
                        font: { size: 10 }
                    }
                }
            }
        }
    });
}

function initReasonChart() {
    const ctx = document.getElementById('reasonChart');
    if (!ctx) return;

    const data = calculateReasonData(filteredFaculty);

    reasonChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Sick Leave', 'Personal', 'Emergency', 'Others'],
            datasets: [{
                data: data,
                backgroundColor: [
                    '#eac35a',
                    '#d2bf44',
                    '#D69E2E',
                    '#bca025'
                ],
                borderColor: '#FFFFFF',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 15,
                        font: { size: 11 }
                    }
                }
            }
        }
    });
}

function updateCharts(faculty) {
    // Update Department Chart
    if (departmentChart) {
        const deptData = calculateDepartmentData(faculty);
        departmentChart.data.labels = deptData.labels;
        departmentChart.data.datasets[0].data = deptData.values;
        departmentChart.update();
    }

    // Update Reason Chart
    if (reasonChart) {
        const reasonData = calculateReasonData(faculty);
        reasonChart.data.datasets[0].data = reasonData;
        reasonChart.update();
    }
}

function calculateDepartmentData(faculty) {
    // Group faculty by department and calculate average attendance
    const deptMap = {};

    faculty.forEach(f => {
        if (!deptMap[f.departmentName]) {
            deptMap[f.departmentName] = { total: 0, count: 0 };
        }
        deptMap[f.departmentName].total += f.attendance;
        deptMap[f.departmentName].count += 1;
    });

    const labels = Object.keys(deptMap);
    const values = labels.map(label => {
        const dept = deptMap[label];
        return Math.round(dept.total / dept.count);
    });

    return { labels, values };
}

function calculateReasonData(faculty) {
    // Sum up all absent reasons
    const totals = { sick: 0, personal: 0, emergency: 0, other: 0 };

    faculty.forEach(f => {
        if (f.absentReasons) {
            totals.sick += f.absentReasons.sick || 0;
            totals.personal += f.absentReasons.personal || 0;
            totals.emergency += f.absentReasons.emergency || 0;
            totals.other += f.absentReasons.other || 0;
        }
    });

    return [totals.sick, totals.personal, totals.emergency, totals.other];
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

function backToFacultyTeamRecords() {
    showView('mainReportView');
}

function showFacultyRecord(facultyData) {
    currentFaculty = facultyData;

    const profile = MOCK_FACULTY_PROFILES[facultyData.uid] || {
        lastName: facultyData.name.split(',')[0] + ',',
        firstName: facultyData.name.split(',')[1] || '',
        college: facultyData.collegeName,
        department: facultyData.departmentName
    };

    // Update profile display
    document.getElementById('profileLastName').textContent = profile.lastName;
    document.getElementById('profileFirstName').textContent = profile.firstName;
    document.getElementById('profileCollege').textContent = profile.college;
    document.getElementById('profileDepartment').textContent = profile.department;

    // Initialize donut charts with faculty-specific data
    initDonutCharts(facultyData);

    // Load subject table
    loadSubjectTable();

    showView('facultyRecordView');
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

function backToFacultyRecord() {
    showView('facultyRecordView');
}

// ==========================================
// FACULTY RECORD VIEW - DONUT CHARTS
// ==========================================

function initDonutCharts(facultyData) {
    // Destroy existing charts
    Object.keys(donutCharts).forEach(key => {
        if (donutCharts[key]) {
            donutCharts[key].destroy();
        }
    });
    donutCharts = {};

    // Use faculty-specific data or calculate from attendance
    const present = facultyData.present || Math.round((facultyData.attendance / 100) * 50);
    const late = facultyData.late || 2;
    const absence = facultyData.absence || 3;
    const excuse = facultyData.excuse || 2;

    const chartConfigs = [
        { id: 'presentChart', value: present, labelId: 'presentPercentage' },
        { id: 'lateChart', value: late, labelId: 'latePercentage' },
        { id: 'absenceChart', value: absence, labelId: 'absencePercentage' },
        { id: 'excuseChart', value: excuse, labelId: 'excusePercentage' }
    ];

    const chartColors = {
        present: { fill: '#FFFFFF', bg: 'rgba(255, 255, 255, 0.15)' },
        late: { fill: '#FFFFFF', bg: 'rgba(245, 217, 130, 0.15)' },
        absence: { fill: '#FFFFFF', bg: 'rgba(232, 199, 106, 0.15)' },
        excuse: { fill: '#FFFFFF', bg: 'rgba(212, 168, 67, 0.15)' }
    };

    chartConfigs.forEach(config => {
        const ctx = document.getElementById(config.id);
        if (!ctx) return;

        const key = config.id.replace('Chart', '');
        const colors = chartColors[key];
        const remaining = Math.max(0, 100 - config.value);

        donutCharts[config.id] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [config.value, remaining],
                    backgroundColor: [colors.fill, colors.bg],
                    borderWidth: 0,
                    cutout: '70%'
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

        // Update percentage text
        const labelEl = document.getElementById(config.labelId);
        if (labelEl) {
            labelEl.textContent = config.value + '%';
        }
    });
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

    // Update total subjects
    const totalEl = document.getElementById('totalSubjects');
    if (totalEl) {
        totalEl.textContent = MOCK_SUBJECTS.length;
    }
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

    document.getElementById('modalFacultyName').textContent = 
        currentFaculty ? `Prof. ${currentFaculty.name}` : 'Prof. -';
    document.getElementById('modalDate').textContent = dateStr;
    document.getElementById('modalID').textContent = 
        currentFaculty ? currentFaculty.uid : '-';

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
// SIDEBAR NAVIGATION
// ==========================================

function toggleNavGroup(button) {
    const navGroup = button.parentElement;
    navGroup.classList.toggle('open');
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