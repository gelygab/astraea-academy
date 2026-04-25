// ==========================================
// Astraea Academy Student Report - Production
// ==========================================

// ==========================================
// CONFIGURATION
// ==========================================

const API_CONFIG = {
    baseUrl: 'api/', // Adjust based on your server setup
    endpoints: {
        getStudents: 'get_students.php',
        getsubjects: 'get_subjects.php',
        getattendance: 'get_attendance.php',
        getstudentProfile: 'get_student_profile.php'
    }
};

// Department value mapping for filter dropdown
const DEPARTMENT_MAP = {
    'Civil': 'Civil Engineering',
    'Chemical': 'Chemical Engineering',
    'Computer': 'Computer Engineering',
    'Electrical': 'Electrical Engineering',
    'Electronics': 'Electronics Engineering',
    'Mechanical': 'Mechanical Engineering',
    'Manufacturing': 'Manufacturing Engineering',
    'Early Childhood': 'Early Childhood Education',
    'Elementary Education': 'Elementary Education',
    'Secondary Education': 'Secondary Education',
    'Special Needs': 'Special Needs Education',
    'Physical Education': 'Physical Education',
    'Social Work': 'Social Work',
    'Mass communication': 'Mass Communication',
    'Psychology': 'Psychology',

};

// ==========================================
// GLOBAL VARIABLES
// ==========================================

let currentStudent = null;
let currentMonth = 2; // March (0-indexed)
let currentYear = 2026;
let currentSubject = { code: 'CET 0211', name: 'Differential Equations' };
let allStudents = []; // Will be populated from API
let filteredStudents = []; // Current filtered view
let donutCharts = {};
let isLoading = false;

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    setupFilterListeners();
    await fetchAndLoadStudents();
}

// ==========================================
// API FETCH FUNCTIONS
// ==========================================

/**
 * Fetch students from backend
 */
async function fetchAndLoadStudents() {
    showLoading(true);
    
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getStudents}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add authentication headers if needed
                // 'Authorization': 'Bearer ' + getAuthToken()
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && Array.isArray(data.students)) {
            allStudents = data.students;
            filteredStudents = [...allStudents];
            loadStudents(filteredStudents);
            updateStatistics(filteredStudents);
        } else {
            console.error('Invalid data format received:', data);
            showError('Failed to load student data');
        }
    } catch (error) {
        console.error('Error fetching students:', error);
        showError('Failed to connect to server. Please try again.');
    } finally {
        showLoading(false);
    }
}

/**
 * Fetch subjects for a specific student
 */
async function fetchStudentSubjects(studentId) {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getSubjects}?studentId=${studentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.success ? data.subjects : [];
    } catch (error) {
        console.error('Error fetching subjects:', error);
        return [];
    }
}

/**
 * Fetch attendance calendar data for a student and subject
 */
async function fetchAttendanceCalendar(studentId, subjectCode, month, year) {
    try {
        const response = await fetch(
            `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getAttendance}?studentId=${studentId}&subjectCode=${subjectCode}&month=${month + 1}&year=${year}`, 
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.success ? data.calendarDays : {};
    } catch (error) {
        console.error('Error fetching attendance:', error);
        return {};
    }
}

/**
 * Fetch detailed student profile
 */
async function fetchStudentProfile(studentId) {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getStudentProfile}?studentId=${studentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.success ? data.profile : null;
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
}

// ==========================================
// UI HELPERS
// ==========================================

function showLoading(show) {
    isLoading = show;
    const grid = document.getElementById('studentsGrid');
    if (!grid) return;
    
    if (show) {
        grid.innerHTML = '<div class="loading-spinner">Loading students...</div>';
    }
}

function showError(message) {
    const grid = document.getElementById('studentsGrid');
    if (grid) {
        grid.innerHTML = `<div class="error-message">${message}</div>`;
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

async function showStudentRecord(studentData) {
    currentStudent = studentData;
    
    // Fetch detailed profile if available
    const profile = await fetchStudentProfile(studentData.uid);
    
    // Update profile display
    document.getElementById('profileLastName').textContent = profile?.lastName || studentData.name.split(',')[0] + ',';
    document.getElementById('profileFirstName').textContent = profile?.firstName || studentData.name.split(',')[1] || '';
    document.getElementById('profileCollege').textContent = profile?.college || 'College of Engineering';
    document.getElementById('profileDepartment').textContent = studentData.department || profile?.department || 'Unknown Department';

    // Initialize donut charts with dynamic data
    initDonutCharts(studentData);

    // Load subject table (could fetch from API)
    await loadSubjectTable(studentData.uid);

    showView('studentRecordView');
}

async function showCalendarView(subjectCode = null) {
    if (subjectCode && currentStudent) {
        // Fetch calendar data from API
        const calendarData = await fetchAttendanceCalendar(
            currentStudent.uid, 
            subjectCode, 
            currentMonth, 
            currentYear
        );
        
        // Store for rendering
        window.currentCalendarData = calendarData;
        
        // Update subject info
        currentSubject = { 
            code: subjectCode, 
            name: 'Subject Details' // Could fetch full details
        };
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
    const filters = ['schoolYear', 'semester', 'department', 'year', 'block'];
    filters.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', applyFilters);
        }
    });
}

function applyFilters() {
    const departmentValue = document.getElementById('department')?.value || '';
    const yearValue = document.getElementById('year')?.value || '';
    const blockValue = document.getElementById('block')?.value || '';
    const schoolYear = document.getElementById('schoolYear')?.value || '';
    const semester = document.getElementById('semester')?.value || '';
    
    // Filter students based on selected criteria
    filteredStudents = allStudents.filter(student => {
        let matchesDepartment = true;
        let matchesYear = true;
        let matchesBlock = true;
        
        // Department filter
        if (departmentValue !== '') {
            matchesDepartment = student.department === departmentValue;
        }
        
        // Year filter
        if (yearValue) {
            // Use year property if available, otherwise infer from UID
            const studentYear = student.year || student.uid?.charAt(0);
            matchesYear = String(studentYear) === yearValue;
        }
        
        // Block filter
        if (blockValue) {
            const studentBlock = student.block || student.uid?.charAt(1);
            matchesBlock = String(studentBlock) === blockValue;
        }
        
        return matchesDepartment && matchesYear && matchesBlock;
    });
    
    // Re-render students and statistics
    loadStudents(filteredStudents);
    updateStatistics(filteredStudents);
    
    // Optional: Send filter params to backend for server-side filtering
    // fetchFilteredStudents({ department: departmentValue, year: yearValue, block: blockValue });
}

/**
 * Alternative: Server-side filtering
 */
async function fetchFilteredStudents(filters) {
    showLoading(true);
    
    try {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) queryParams.append(key, value);
        });
        
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getStudents}?${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && Array.isArray(data.students)) {
            filteredStudents = data.students;
            loadStudents(filteredStudents);
            updateStatistics(filteredStudents);
        }
    } catch (error) {
        console.error('Error fetching filtered students:', error);
    } finally {
        showLoading(false);
    }
}

// ==========================================
// DYNAMIC STATISTICS
// ==========================================

function updateStatistics(students) {
    // Calculate statistics based on current filtered data
    const totalStudents = students.length;
    
    // Calculate total absences across all filtered students
    const totalAbsences = students.reduce((sum, student) => sum + (student.absence || 0), 0);
    
    // Calculate productivity (students with 0 absences / total students)
    const totalPresent = totalStudents - totalAbsences;
    const productivity = (totalStudents > 0  && totalStudents > totalAbsences)
        ? ((totalPresent / totalStudents) * 100).toFixed(1) 
        : '0.0';
    
    // Calculate absenteeism rate
    const avgAbsences = totalStudents > 0 ? (totalAbsences / totalStudents) : 0;
    const absenteeism = Math.min((avgAbsences * 100), 100).toFixed(1);
    
    // Update DOM elements with animation
    animateValue('totalStudents', parseInt(document.getElementById('totalStudents')?.textContent || 0), totalStudents, 500);
    animateValue('totalAbsent', parseInt(document.getElementById('totalAbsent')?.textContent || 0), totalAbsences, 500);
    
    const productivityEl = document.getElementById('productivity');
    const absenteeismEl = document.getElementById('absenteeism');
    
    if (productivityEl) productivityEl.textContent = productivity + '%';
    if (absenteeismEl) absenteeismEl.textContent = absenteeism + '%';
}

/**
 * Animate number changes
 */
function animateValue(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const range = end - start;
    const minTimer = 50;
    let stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);
    
    let startTime = new Date().getTime();
    let endTime = startTime + duration;
    let timer;
    
    function run() {
        let now = new Date().getTime();
        let remaining = Math.max((endTime - now) / duration, 0);
        let value = Math.round(end - (remaining * range));
        element.textContent = value;
        if (value == end) {
            clearInterval(timer);
        }
    }
    
    timer = setInterval(run, stepTime);
    run();
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
        max = Math.max(max, s.absence || 0, s.leave || 0, s.excused || 0);
    });
    return Math.max(max, 1); // Prevent division by zero
}

function renderStudents(students) {
    const grid = document.getElementById('studentsGrid');
    if (!grid) return;

    if (students.length === 0) {
        grid.innerHTML = '<div class="no-results" style="text-align: center; padding: 40px; color: rgba(107, 78, 61, 0.6);">No students found matching the selected filters.</div>';
        return;
    }

    const maxValue = getMaxValue(students);

    grid.innerHTML = students.map(student => `
        <div class="student-card-item">
            <div class="student-card-header-row">
                <div class="student-info-block">
                    <span class="student-uid-text">UID: ${student.uid}</span>
                    <span class="student-name-text">${student.name}</span>
                    <span class="student-dept-text" style="font-size: 11px; color: rgba(107, 78, 61, 0.6); margin-top: 2px;">${student.department || 'Unknown Department'}</span>
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
                        <div class="bar-chart-fill absence" style="width: ${((student.absence || 0) / maxValue) * 100}%"></div>
                    </div>
                    <span class="bar-chart-value">${student.absence || 0}</span>
                </div>
                <div class="bar-chart-row">
                    <span class="bar-chart-label">Leave</span>
                    <div class="bar-chart-track">
                        <div class="bar-chart-fill leave" style="width: ${((student.leave || 0) / maxValue) * 100}%"></div>
                    </div>
                    <span class="bar-chart-value">${student.leave || 0}</span>
                </div>
                <div class="bar-chart-row">
                    <span class="bar-chart-label">Excused</span>
                    <div class="bar-chart-track">
                        <div class="bar-chart-fill excused" style="width: ${((student.excused || 0) / maxValue) * 100}%"></div>
                    </div>
                    <span class="bar-chart-value">${student.excused || 0}</span>
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

    // Ensure we have valid numbers (handle both API data and calculated data)
    const absence = parseInt(studentData.absence) || parseInt(studentData.absencePercentage) || 0;
    const leave = parseInt(studentData.leave) || parseInt(studentData.latePercentage) || 0;
    const excused = parseInt(studentData.excused) || parseInt(studentData.excusePercentage) || 0;
    
    let presentPct, latePct, absencePct, excusedPct;
    
    // Check if API provided direct percentages
    if (studentData.presentPercentage && 
        studentData.latePercentage && 
        studentData.absencePercentage && 
        studentData.excusePercentage) {
        // Use API-provided percentages
        presentPct = Math.round(parseInt(studentData.presentPercentage) || 0);
        latePct = Math.round(parseInt(studentData.latePercentage) || 0);
        absencePct = Math.round(parseInt(studentData.absencePercentage) || 0);
        excusedPct = Math.round(parseInt(studentData.excusePercentage) || 0);
    } else {
        // Calculate from raw counts
        const totalDays = 100; // Base assumption
        
        absencePct = Math.min(absence * 5, 30);
        latePct = Math.min(leave * 3, 25);
        excusedPct = Math.min(excused * 2, 15);
        presentPct = Math.max(0, 100 - absencePct - latePct - excusedPct);
        
        // Round all values
        presentPct = Math.round(presentPct);
        absencePct = Math.round(absencePct);
        latePct = Math.round(latePct);
        excusedPct = Math.round(excusedPct);
    }

    const chartConfigs = [
        { id: 'presentChart', value: presentPct, label: 'present' },
        { id: 'lateChart', value: latePct, label: 'late' },
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
    const presentEl = document.getElementById('presentPercentage');
    const lateEl = document.getElementById('latePercentage');
    const absenceEl = document.getElementById('absencePercentage');
    const excuseEl = document.getElementById('excusePercentage');
    
    if (presentEl) presentEl.textContent = presentPct + '%';
    if (lateEl) lateEl.textContent = latePct + '%';
    if (absenceEl) absenceEl.textContent = absencePct + '%';
    if (excuseEl) excuseEl.textContent = excusedPct + '%';
}
// ==========================================
// SUBJECT TABLE
// ==========================================

async function loadSubjectTable(studentId) {
    const tbody = document.getElementById('subjectTableBody');
    if (!tbody) return;

    // Fetch subjects from API if studentId provided
    let subjects = [];
    if (studentId) {
        subjects = await fetchStudentSubjects(studentId);
    }
    
    // Fallback to empty state if no data
    if (subjects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: rgba(107, 78, 61, 0.6);">No subject data available</td></tr>';
        return;
    }

    tbody.innerHTML = subjects.map(subject => `
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

    // Use API data if available, otherwise empty
    const calendarDays = window.currentCalendarData || {};

    let html = '';

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        html += `<div class="calendar-day-cell other-month">
            <span class="day-number">${daysInPrevMonth - i}</span>
        </div>`;
    }

    // Current month days with status indicators
    for (let day = 1; day <= daysInMonth; day++) {
        const status = calendarDays[day];
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

async function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    
    // Refetch calendar data for new month if viewing a student's calendar
    if (currentStudent && currentSubject.code) {
        window.currentCalendarData = await fetchAttendanceCalendar(
            currentStudent.uid,
            currentSubject.code,
            currentMonth,
            currentYear
        );
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
        currentStudent ? currentStudent.name : '-';
    document.getElementById('modalDate').textContent = dateStr;
    document.getElementById('modalID').textContent = 
        currentStudent ? currentStudent.uid : '-';

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
        // Optional: Call logout API
        // fetch(`${API_CONFIG.baseUrl}/logout.php`, { method: 'POST' });
        window.location.href = '/login';
    }
});

