// ==========================================
// Astraea Academy Faculty Report - PRODUCTION VERSION
// ==========================================

// ==========================================
// GLOBAL VARIABLES & STATE
// ==========================================

let currentFaculty = null;
let currentMonth = new Date().getMonth(); // Automatically sets to current month
let currentYear = new Date().getFullYear(); // Automatically sets to current year
let currentSubject = null;

let allFaculty = [];
let filteredFaculty = [];
let departmentChart = null;
let reasonChart = null;
let donutCharts = {};
let calendarDaysData = {}; // Stores calendar data fetched from the database

// Configuration for hierarchical departments
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
            { value: 'mass communication', label: 'Mass Communication' },
            { value: 'social-work', label: 'Social Work' },
            { value: 'psychology', label: 'Psychology' }
        ]
    }
};

//facultylist get_faculty.php
//facultyprofile get_faculty_profile.php
//faculty calendar get_faculty_calendar.php

const API_CONFIG = {
    baseUrl: 'api/',
    endpoints: {
        getFacultyList: 'get_faculty.php',
        getFacultyProfile: 'get_faculty_profile.php',
        getFacultyCalendar: 'get_faculty_calendar.php'
    }
};

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    setupCollegeDepartmentCascade();
    setupFilterListeners();
    initDepartmentChart();
    initReasonChart();
    // Fetch initial data from backend
    await fetchAndLoadFacultyList();
    updateCharts(filteredFaculty);
}

function showLoading(show) {
    isLoading = show;
    const grid = document.getElementById('facultyGrid');
    if (!grid) return;

    if (show) {
        grid.innerHTML = '<div class="loading-spinner">Loading faculty records...></div>'
    }
}

function showError(message) {
    const grid = document.getElementById('facultyGrid');
    if (grid) {
        grid.innerHTML = `<div class="error-message">${message}</div>`;
    }
}

// ==========================================
// API FETCH FUNCTIONS (Plug in your backend here)
// ==========================================

async function fetchAndLoadFacultyList() {
    showLoading(true);

    try {
        // TODO: Replace with your actual API endpoint to get all faculty
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getFacultyList}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response: ", data);

        if (data.success && Array.isArray(data.faculty)) {
            allFaculty = data.faculty;
            filteredFaculty = [...allFaculty];
            renderFaculty(filteredFaculty);
            updateStatistics(filteredFaculty);
            applyFilters();
        }else {
            console.error('Invalid data format received:', data);
            showError('Failed to load faculty data');
        }
        
    } catch (error) {
        console.error("Error fetching faculty list:", error);
        showError();
    } finally {
        showLoading(false);
    }
}

async function loadFacultyList(faculty) {
    renderFaculty(faculty);
}

async function fetchFacultyProfile(uid) {
    try {
        // TODO: Replace with actual API call to get specific faculty profile and subjects
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getFacultyProfile}?facultyId=${uid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Profile API response:', data);
        return data.success ? data : null;
        
    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

async function fetchFacultyCalendar(uid, subjectCode, month, year) {
    try {
        // TODO: Replace with actual API call to get attendance for a specific subject and month
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getFacultyCalendar}?facultyId=${uid}&subject=${encodeURIComponent(subjectCode)}&month=${month}&year=${year}`);
        const data = await response.json();
        const days = {};
        data.data.attendance_days.forEach(entry => {
            const day = parseInt(entry.date.split('-')[2]);
            days[day] = {
                status: entry.status.toLowerCase(),
                appealType: entry.appealType || null,
                dateApplied: entry.dateApplied || null,
                reason: entry.reason || null,
                updatedBy: entry.updatedBy || null
            };
        });
        return days; 
        
        /* Expected backend return format example:
        {
            3: { status: 'absent' },
            6: { status: 'excused', appealType: 'Sick Leave', dateApplied: 'March 5', reason: 'Flu', updatedBy: 'Admin' }
        }
        // */
        // return {}; 
    } catch (error) {
        console.error("Error fetching calendar:", error);
        return {};
    }
}

// ==========================================
// HIERARCHICAL FILTERING
// ==========================================

function setupCollegeDepartmentCascade() {
    const collegeSelect = document.getElementById('college');
    const departmentSelect = document.getElementById('department');

    if (!collegeSelect || !departmentSelect) return;

    populateDepartmentDropdown('', departmentSelect);

    collegeSelect.addEventListener('change', function() {
        populateDepartmentDropdown(this.value, departmentSelect);
        applyFilters();
    });
}

function populateDepartmentDropdown(collegeValue, departmentSelect) {
    departmentSelect.innerHTML = '<option value="">All Departments</option>';

    if (!collegeValue || !COLLEGE_DEPARTMENTS[collegeValue]) {
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

    fetchFilteredFaculty({
        department: departmentValue,
        college: collegeValue
    });
}

async function fetchFilteredFaculty(filters) {
    showLoading(true);

    try {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== 'All' && !value.includes('All ')) queryParams.append(key, value);
        });

        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getFacultyList}?${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response: ", data);

        if (data.success && Array.isArray(data.faculty)) {
            allFaculty = data.faculty;
            filteredFaculty = [...allFaculty];
            renderFaculty(filteredFaculty);
            updateStatistics(filteredFaculty);
        }else {
            console.error('Invalid data format received:', data);
            showError('Failed to load faculty data');
        }
        
    } catch (error) {
        console.error("Error fetching faculty list:", error);
        grid.innerHTML = '<div class="error-message">Failed to load data. Please try again later.</div>';
    } finally {
        showLoading(false);
    }
}


// ==========================================
// DYNAMIC STATISTICS
// ==========================================

function updateStatistics(faculty) {
    const totalEmployees = faculty.length;
    const totalAbsent = faculty.reduce((sum, f) => sum + (f.absence || 0), 0);
    const avgAttendance = totalEmployees > 0 
        ? faculty.reduce((sum, f) => sum + (f.attendance || 0), 0) / totalEmployees 
        : 0;

    const totalPresent = totalEmployees - totalAbsent;
    const productivity = (totalEmployees > 0 && totalEmployees > totalAbsent) ? ((totalPresent / totalEmployees) * 100).toFixed(1) : '0.0';

    const avgAbsences = totalEmployees > 0 ? (totalAbsent / totalEmployees) : 0;
    const absenteeism = Math.min((avgAbsences * 100), 100).toFixed(1);

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
        if (value === end) clearInterval(timer);
    }

    timer = setInterval(run, stepTime);
    run();
}

// ==========================================
// MAIN REPORT VIEW - FACULTY LIST
// ==========================================

function getInitials(name) {
    if(!name) return 'PR';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function renderFaculty(faculty) {
    const grid = document.getElementById('facultyGrid');
    if (!grid) return;


    if (faculty.length === 0) {
        grid.innerHTML = '<div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 40px; color: rgba(107, 78, 61, 0.6);">No faculty found matching the selected filters.</div>';
        return;
    }


    // Define the scale for the bars (usually 100 for percentage-based data)
    const maxValue = 100;


    grid.innerHTML = faculty.map(member => {
        // Prepare the data object for the viewRecord function to match your student report's logic
        const facultyDataString = decodeURIComponent(encodeURIComponent(JSON.stringify(member)));


        return `
        <div class="faculty-card-item">
            <div class="faculty-card-header-row">
                <div class="faculty-info-block">
                    <span class="faculty-uid-text">UID: ${member.uid}</span>
                    <span class="faculty-name-text">Prof. ${member.name}</span>
                    <span class="faculty-dept-text" style="font-size: 11px; color: rgba(107, 78, 61, 0.6); margin-top: 2px;">
                        ${member.departmentName || 'Unknown Department'}
                    </span>
                </div>
               
                <button class="btn-view-record-gold" onclick="viewRecord('${member.uid}')">
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
                        <div class="bar-chart-fill attendance" style="width: ${(member.absence / maxValue) * 100}%"></div>
                    </div>
                    <span class="bar-chart-value">${member.absence || 0}</span>
                </div>


                <div class="bar-chart-row">
                    <span class="bar-chart-label">Leave</span>
                    <div class="bar-chart-track">
                        <div class="bar-chart-fill absence" style="width: ${(member.leave / maxValue) * 100}%"></div>
                    </div>
                    <span class="bar-chart-value">${member.leave || 0}</span>
                </div>


                <div class="bar-chart-row">
                    <span class="bar-chart-label">Excused</span>
                    <div class="bar-chart-track">
                        <div class="bar-chart-fill late" style="width: ${(member.excuse / maxValue) * 100}%"></div>
                    </div>
                    <span class="bar-chart-value">${member.excuse || 0}</span>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

async function viewRecord(uid) {
    const basicInfo = allFaculty.find(f => f.uid === uid);
    if (!basicInfo) return;

    currentFaculty = basicInfo;
    
    const response = await fetchFacultyProfile(uid);

    if (response && response.success) {
        const profileData = response.data;
        const subjects = profileData.subjects || [];

        let totals = {
            present: 0,
            late: 0,
            absence: 0,
            excuse: 0
        };

        subjects.forEach(sub => {
            totals.present += Number(sub.present) || 0;
            totals.late += Number(sub.late) || 0;
            totals.absence += Number(sub.absence) || 0;
            totals.excuse += Number(sub.excuse) || 0;
        });

    showFacultyRecord(basicInfo, profileData, totals);
    }
}

// ==========================================
// DYNAMIC CHARTS
// ==========================================

function initDepartmentChart() {
    const ctx = document.getElementById('departmentChart');
    if (!ctx) return;

    departmentChart = new Chart(ctx, {
        type: 'bar',
        data: { labels: [], datasets: [{ label: 'Average Attendance Rate (%)', data: [], backgroundColor: 'rgba(212, 168, 67, 0.8)', borderColor: '#D4A843', borderWidth: 1, borderRadius: 6 }] },
        options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, max: 100, ticks: { callback: function(value) { return value + '%'; } } },
                x: { ticks: { font: { size: 10 } } }
            }
        }
    });
}

function initReasonChart() {
    const ctx = document.getElementById('reasonChart');
    if (!ctx) return;

    reasonChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Sick Leave', 'Personal', 'Emergency', 'Others'],
            datasets: [{ data: [0,0,0,0], backgroundColor: ['#eac35a', '#d2bf44', '#D69E2E', '#bca025'], borderColor: '#FFFFFF', borderWidth: 2 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 15, font: { size: 11 } } } } }
    });
}

function updateCharts(faculty) {
    if (departmentChart) {
        const deptData = calculateDepartmentData(faculty);
        departmentChart.data.labels = deptData.labels;
        departmentChart.data.datasets[0].data = deptData.values;
        departmentChart.update();
    }
    if (reasonChart) {
        reasonChart.data.datasets[0].data = calculateReasonData(faculty);
        reasonChart.update();
    }
}

function calculateDepartmentData(faculty) {
    const deptMap = {};
    faculty.forEach(f => {
        const deptName = f.departmentName || 'Unknown';
        if (!deptMap[deptName]) deptMap[deptName] = { present: 0, total: 0 };
        deptMap[deptName].present += parseInt(f.attendance) || 0;
        deptMap[deptName].total += (parseInt(f.attendance) || 0) + (parseInt(f.absence) || 0);
    });
    const labels = Object.keys(deptMap);
    const values = labels.map(label => {
        const dept = deptMap[label];
        return dept.total > 0 ? Math.round((dept.present / dept.total) * 100) : 0;
    });
    return { labels, values };
}

function calculateReasonData(faculty) {
    const totals = { sick: 0, personal: 0, emergency: 0, other: 0 };
    
    faculty.forEach(f => {
        if (Array.isArray(f.absentReasons)) {
            f.absentReasons.forEach(reason => {
                const type = reason.type.toLowerCase();
                const count = parseInt(reason.count) || 0;

                if (type === 'sick_leave' || type === 'medical_appointment') {
                    totals.sick += count;
                } 
                else if (type === 'personal_emergency' || type === 'leave_of_absence') {
                    totals.personal += count;
                } 
                else if (type === 'emergency_leave' || type === 'emergency') {
                    totals.emergency += count;
                } 
                else {
                    totals.other += count;
                }
            });
        }
    });
    console.log(faculty.map(f => f.absentReasons));
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

function showMainReport() { showView('mainReportView'); }
function backToFacultyTeamRecords() { showView('mainReportView'); }
function backToFacultyRecord() { showView('facultyRecordView'); }

function showFacultyRecord(basicInfo, profileData, totals) {
    let lastName = profileData?.lastName || "-";
    let firstName = profileData?.firstName || "-";
    
    if (lastName === "-" && basicInfo.name) {
        const parts = basicInfo.name.split(',');
        lastName = parts[0] ? parts[0].trim() : '';
        firstName = parts[1] ? parts[1].trim() : '';
    }

    console.log('profileData: ', profileData);
    document.getElementById('profileLastName').textContent = lastName;
    document.getElementById('profileFirstName').textContent = firstName;
    document.getElementById('profileCollege').textContent = basicInfo.collegeName || '-';
    document.getElementById('profileDepartment').textContent = basicInfo.departmentName || '-';

    if (totals) {
        initDonutCharts(totals);
    }
    
    if (profileData && profileData.subjects) {
        loadSubjectTable(profileData.subjects);
    }

    // const subjects = profileData && profileData.data.subjects ? profileData.data.subjects : [];
    // loadSubjectTable(subjects);

    showView('facultyRecordView');
}

async function showCalendarView(subjectCode, subjectName) {
    currentSubject = { code: subjectCode, name: subjectName };
    document.getElementById('calendarSubjectTitle').textContent = `${subjectCode} ${subjectName}`;
    
    currentMonth = new Date().getMonth();
    currentYear = new Date().getFullYear();

    await loadAndRenderCalendar();
    showView('calendarView');
}

async function loadAndRenderCalendar() {
    if(!currentFaculty || !currentSubject) return;
    
    // Fetch real calendar data for this month
    calendarDaysData = await fetchFacultyCalendar(currentFaculty.uid, currentSubject.code, currentMonth + 1, currentYear);
    console.log('Calendar Data: ', calendarDaysData);
    renderCalendar();
}

// ==========================================
// FACULTY RECORD VIEW - DONUT CHARTS
// ==========================================

function initDonutCharts(facultyData) {
    Object.keys(donutCharts).forEach(key => {
        if (donutCharts[key]) donutCharts[key].destroy();
    });
    donutCharts = {};

    const present = Number(facultyData.present) || 0;
    const late = Number(facultyData.late) || 0;
    const absence = Number(facultyData.absence) || 0;
    const excuse = Number(facultyData.excuse) || 0;

    const total = present + late + absence + excuse;

    
    // EDITED MATH CALCULCATIONS
    const presentPct = total > 0 ? Math.round((present / total) * 100) : 0;
    const latePct = total > 0 ? Math.round((late / total) * 100) : 0;
    const absencePct = total > 0 ? Math.round((absence / total) * 100) : 0;
    const excusePct = total > 0 ? Math.round((excuse / total) * 100) : 0;

    const chartConfigs = [
        { id: 'presentChart', value: presentPct, labelId: 'presentPercentage' },
        { id: 'lateChart', value: latePct, labelId: 'latePercentage' },
        { id: 'absenceChart', value: absencePct, labelId: 'absencePercentage' },
        { id: 'excuseChart', value: excusePct, labelId: 'excusePercentage' }
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
            options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false }, tooltip: { enabled: false } }, animation: { animateRotate: true, duration: 1000 } }
        });

        const labelEl = document.getElementById(config.labelId);
        if (labelEl) labelEl.textContent = config.value + '%';
    });
}

// ==========================================
// SUBJECT TABLE
// ==========================================

function loadSubjectTable(subjects) {
    const tbody = document.getElementById('subjectTableBody');
    if (!tbody) return;

    if (!subjects || subjects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No subjects found</td></tr>';
        document.getElementById('totalSubjects').textContent = '0';
        return;
    }

    tbody.innerHTML = subjects.map(subject => `
        <tr>
            <td>${subject.code}</td>
            <td>${subject.description}</td>
            <td>${subject.present || 0}</td>
            <td>${subject.absence || 0}</td>
            <td>${subject.late || 0}</td>
            <td>${subject.excuse || 0}</td>
            <td>
                <button class="btn-view-calendar-small" onclick="showCalendarView('${subject.code}', '${subject.description}')">
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

    const totalEl = document.getElementById('totalSubjects');
    if (totalEl) totalEl.textContent = subjects.length;
}

// ==========================================
// CALENDAR VIEW (Reads from API fetched data)
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

    // Current month days with status indicators and detailed click handlers
    for (let day = 1; day <= daysInMonth; day++) {
        // Read from the fetched calendarDaysData object instead of the mock data
        const dayData = calendarDaysData[day];
        let statusIndicator = '';
        let clickHandler = '';

        if (dayData) {
            const status = dayData.status;
            statusIndicator = `<span class="status-indicator ${status}"></span>`;
            
            // Safely format the extra data strings
            const appealType = dayData.appealType ? `'${dayData.appealType}'` : "'-'";
            const dateApplied = dayData.dateApplied ? `'${dayData.dateApplied}'` : "'-'";
            const reason = dayData.reason ? `'${dayData.reason}'` : "'-'";
            const updatedBy = dayData.updatedBy ? `'${dayData.updatedBy}'` : "'-'";

            clickHandler = `onclick="showAttendanceDetails(${day}, '${status}', ${appealType}, ${dateApplied}, ${reason}, ${updatedBy})"`;
        }

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
    await loadAndRenderCalendar();
}

// ==========================================
// ATTENDANCE MODAL
// ==========================================

function showAttendanceDetails(day, status, appealType = '-', dateApplied = '-', reason = '-', updatedBy = '-') {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const dateStr = `${monthNames[currentMonth]} ${day}, ${currentYear}`;

    document.getElementById('modalFacultyName').textContent = 
        currentFaculty ? `Prof. ${currentFaculty.name}` : 'Prof. -';
    document.getElementById('modalDate').textContent = dateStr;
    document.getElementById('modalID').textContent = 
        currentFaculty ? currentFaculty.uid : '-';

    // Toggle specific rows based on status
    const appealRow = document.getElementById('modalAppealType').parentElement;
    const dateAppliedRow = document.getElementById('modalDateApplied').parentElement;
    const reasonRow = document.getElementById('modalReason').parentElement;
    const updatedByRow = document.getElementById('modalStatusUpdatedBy').parentElement;

    if (status.toLowerCase() === 'absent') {
        appealRow.style.display = 'none';
        dateAppliedRow.style.display = 'none';
        reasonRow.style.display = 'none';
        updatedByRow.style.display = 'none';
    } else {
        appealRow.style.display = 'flex';
        dateAppliedRow.style.display = 'flex';
        reasonRow.style.display = 'flex';
        updatedByRow.style.display = 'flex';

        document.getElementById('modalAppealType').textContent = appealType;
        document.getElementById('modalDateApplied').textContent = dateApplied;
        document.getElementById('modalReason').textContent = reason;
        document.getElementById('modalStatusUpdatedBy').textContent = updatedBy;
    }

    document.getElementById('attendanceModal').classList.add('active');
}

function closeAttendanceModal(event) {
    const modal = document.getElementById('attendanceModal');
    if (!modal) return;

    if (!event) {
        modal.classList.remove('active');
        return;
    }

    if (event.target.id === 'attendanceModal') {
        modal.classList.remove('active');
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
        window.location.href = 'adminlogout.php'; // Adjust to real logout endpoint
    }
});

