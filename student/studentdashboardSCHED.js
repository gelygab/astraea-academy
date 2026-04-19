// PRODUCTION VERSION - Placeholder data included for development

const API_CONFIG = {
    baseUrl: 'api/',
    
    endpoints: {
        getSchedule: 'get_schedule.php',
        getSubjectAttendance: 'get_subject_attendance.php',
        getApprovedRecords: 'get_approved_records.php'
    }
};

const SCHEDULE_CONFIG = {
    startHour: 7,
    endHour: 21,
    intervalMinutes: 30,
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
};

let currentStudentId = null;
let currentScheduleData = null;
let currentAttendanceCalendar = {
    currentDate: new Date(),
    selectedSubject: null,
    attendanceData: null,
    selectedDate: null
};

document.addEventListener('DOMContentLoaded', function() {
    initializeScheduleDashboard();
    
    document.getElementById('schoolYear').addEventListener('change', handleFilterChange);
    document.getElementById('semester').addEventListener('change', handleFilterChange);
    
    document.getElementById('attendanceCalendarModal').addEventListener('click', function(e) {
        if (e.target === this) closeAttendanceModal();
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeAttendanceModal();
    });
});

// getSchedule API
async function initializeScheduleDashboard() {
    currentStudentId = CURRENT_USER_UID;
    
    if (!currentStudentId) {
        window.location.href = 'studentlogin.php';
        return;
    }
    
    await loadScheduleData();
}

function getAuthToken() {
    return sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token') || '';
}

async function loadScheduleData() {
    showLoading(true);
    
    try {
        const schoolYear = document.getElementById('schoolYear').value;
        const semester = document.getElementById('semester').value;
        
        const params = new URLSearchParams({
            uid: currentStudentId,
            ...(schoolYear && { school_year: schoolYear }),
            ...(semester && { semester: semester })
        });
        
        const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getSchedule}?${params}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                // 'Authorization': `Bearer ${getAuthToken()}`
            },
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const result = await response.json();
        console.log(result);

        if (result.success) {
            currentScheduleData = result.data;
            populateFilters(result.data.available_years, result.data.available_semesters);
            renderSchedule(result.data);
        } else {
            throw new Error(result.message || 'Invalid response');
        }
        
    } catch (error) {
        console.error('Failed to load schedule:', error);
        // For development: show placeholder on error
        // REMOVE IN PRODUCTION: usePlaceholderData();
        // REPLACE WITH: showEmptyState(true);
        showEmptyState(true);
        // usePlaceholderData();
    } finally {
        showLoading(false);
    }
}

async function handleFilterChange() {
    await loadScheduleData();
}

function populateFilters(years, semesters) {
    const yearSelect = document.getElementById('schoolYear');
    const semesterSelect = document.getElementById('semester');
    
    if (yearSelect.options.length === 0 && years) {
        yearSelect.innerHTML = years.map(y => 
            `<option value="${y}" ${y === currentScheduleData?.school_year ? 'selected' : ''}>${y}</option>`
        ).join('');
    }
    
    if (semesterSelect.options.length === 0 && semesters) {
        semesterSelect.innerHTML = semesters.map(s => 
            `<option value="${s}" ${s === currentScheduleData?.semester ? 'selected' : ''}>${s}</option>`
        ).join('');
    }
}

function renderSchedule(data) {
    if (!data.subjects || data.subjects.length === 0) {
        showEmptyState(true);
        return;
    }
    
    showEmptyState(false);
    renderSubjectsTable(data.subjects);
    renderWeeklyGrid(data.schedule_slots || []);
}

function renderSubjectsTable(subjects) {
    const tbody = document.getElementById('subjectsTableBody');
    tbody.innerHTML = subjects.map(subject => `
        <tr>
            <td>${escapeHtml(subject.subject_code)}</td>
            <td>${escapeHtml(subject.description)}</td>
            <td>${escapeHtml(subject.schedule_display || formatSchedule(subject))}</td>
        </tr>
    `).join('');
}

// Render weekly grid with proper spanning class blocks
function renderWeeklyGrid(scheduleSlots) {
    const grid = document.getElementById('weeklyScheduleGrid');
    grid.innerHTML = '';
    
    // Create header row
    const cornerCell = document.createElement('div');
    cornerCell.className = 'grid-time-header';
    cornerCell.textContent = 'Time';
    grid.appendChild(cornerCell);
    
    SCHEDULE_CONFIG.days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'grid-header';
        dayHeader.textContent = day.substring(0, 3);
        grid.appendChild(dayHeader);
    });
    
    // Generate time slots with full format
    const timeSlots = generateTimeSlots();
    
    // Create empty grid cells first 
    timeSlots.forEach((slot, index) => {
        // Time label column
        const timeCell = document.createElement('div');
        timeCell.className = 'grid-time-header';
        timeCell.textContent = slot.label;
        grid.appendChild(timeCell);
        
        // Day columns
        SCHEDULE_CONFIG.days.forEach(day => {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.time = slot.time;
            cell.dataset.day = day;
            cell.dataset.rowIndex = index;
            grid.appendChild(cell);
        });
    });
    
    // Class blocks that span multiple rows
    if (scheduleSlots) {
        scheduleSlots.forEach(slot => {
            placeClassBlock(grid, slot, timeSlots);
        });
    }
}

function generateTimeSlots() {
    const slots = [];
    const { startHour, endHour, intervalMinutes } = SCHEDULE_CONFIG;
    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += intervalMinutes) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const label = formatTimeFull(hour, minute);
            slots.push({ time, label, hour, minute });
        }
    }
    
    return slots;
}

// Full time format 
function formatTimeFull(hour, minute) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
}

// Place class block spanning multiple time slots
function placeClassBlock(grid, classData, timeSlots) {
    const dayIndex = SCHEDULE_CONFIG.days.indexOf(classData.day);
    if (dayIndex === -1) return;
    
    // Find start and end row indices
    const startRow = timeSlots.findIndex(t => t.time === classData.start_time);
    const endRow = timeSlots.findIndex(t => t.time === classData.end_time);
    
    if (startRow === -1) return;
    
    // Calculate span (how many 30-min slots)
    const rowSpan = endRow - startRow;
    
    // Find the cell at start time + day
    const gridCells = grid.querySelectorAll('.grid-cell');
    const cellIndex = startRow * 7 + dayIndex;
    const targetCell = gridCells[cellIndex];
    
    if (!targetCell) return;
    
    // Create the class block
    const block = document.createElement('div');
    block.className = 'class-block';
    block.style.gridRow = `span ${rowSpan}`;
    block.style.height = `${rowSpan * 50 - 4}px`; // 50px per row, minus gap
    
    block.innerHTML = `
        <span class="subject-code">${escapeHtml(classData.subject_code)}</span>
        <span class="subject-code">${escapeHtml(classData.description)}</span>
        <span class="subject-room">${escapeHtml("Faculty:" + " " + classData.teacher)}</span>
        <span class="subject-room">${escapeHtml(classData.room || '')}</span>
    `;
    
    block.onclick = () => openSubjectAttendance(classData.subject_code);
    
    // Position absolutely within the cell
    targetCell.style.position = 'relative';
    targetCell.appendChild(block);
    
    // Mark cells as occupied
    for (let i = 0; i < rowSpan; i++) {
        const occupiedIndex = (startRow + i) * 7 + dayIndex;
        if (gridCells[occupiedIndex]) {
            gridCells[occupiedIndex].dataset.occupied = 'true';
        }
    }
}

function formatSchedule(subject) {
    return `${subject.section || ''} - ${subject.days || ''} ${subject.time || ''} ${subject.room || ''}`;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// View Navigation
function showSubjectDetailsView() {
    document.getElementById('mainScheduleView').classList.add('hidden');
    document.getElementById('subjectDetailsView').classList.remove('hidden');
    renderSubjectCards();
}

function showMainScheduleView() {
    document.getElementById('subjectDetailsView').classList.add('hidden');
    document.getElementById('mainScheduleView').classList.remove('hidden');
}

function renderSubjectCards() {
    if (!currentScheduleData?.subjects) return;
    
    const grid = document.getElementById('subjectCardsGrid');
    grid.innerHTML = currentScheduleData.subjects.map(subject => `
        <div class="subject-card">
            <div class="subject-card-header">
                ${escapeHtml(subject.subject_code)}
            </div>
            <div class="subject-card-body">
                <p><strong>${escapeHtml(subject.description)}</strong></p>
                <p>${escapeHtml(subject.schedule_display || formatSchedule(subject))}</p>
                <button class="view-record-btn" onclick="openSubjectAttendance('${subject.subject_code}')">
                    View Leave and Excuse Record
                </button>
            </div>
        </div>
    `).join('');
}

// Attendance Calendar
async function openSubjectAttendance(subjectCode) {
    currentAttendanceCalendar.selectedSubject = subjectCode;
    currentAttendanceCalendar.currentDate = new Date();
    currentAttendanceCalendar.selectedDate = new Date().getDate();
    
    document.getElementById('attendanceCalendarModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    await loadAttendanceData(subjectCode);
    renderAttendanceCalendar();
}

// getSubjectAttendance API
async function loadAttendanceData(subjectCode) {
    try {
        const year = currentAttendanceCalendar.currentDate.getFullYear();
        const month = currentAttendanceCalendar.currentDate.getMonth() + 1;
        
        const params = new URLSearchParams({
            uid: currentStudentId,
            subject_code: subjectCode,
            year: year,
            month: month
        });
        
        const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getSubjectAttendance}?${params}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to fetch attendance');
        
        const result = await response.json();
        
        if (result.success) {
            currentAttendanceCalendar.attendanceData = result.data;
        } else {
            throw new Error(result.message);
        }

        console.log(currentAttendanceCalendar.attendanceData);
        
    } catch (error) {
        currentAttendanceCalendar.attendanceData = {
            subject_code: subjectCode,
            subject_name: getSubjectName(subjectCode),
            attendance_days: []
        };
    }
}

function getSubjectName(code) {
    const subject = currentScheduleData?.subjects?.find(s => s.subject_code === code);
    return subject?.description || code;
}

// Calendar 
function renderAttendanceCalendar() {
    const date = currentAttendanceCalendar.currentDate;
    const year = date.getFullYear();
    const month = date.getMonth();
    const selectedDay = currentAttendanceCalendar.selectedDate;
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    
    document.getElementById('attendanceMonthYear').textContent = 
        `${monthNames[month]} ${year}`;
    
    const grid = document.getElementById('attendanceCalendarGrid');
    grid.innerHTML = '';
    
    // Weekday headers
    const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    weekdays.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-weekday-header';
        header.textContent = day;
        grid.appendChild(header);
    });
    
    // Calculate calendar structure
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const today = new Date();
    const attendanceMap = buildAttendanceMap();
    
    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const dayDiv = createCalendarDay(day, true, false, false, []);
        grid.appendChild(dayDiv);
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        const isSelected = day === selectedDay;
        const indicators = attendanceMap.get(dateStr) || [];
        
        const dayDiv = createCalendarDay(day, false, isToday, isSelected, indicators);
        grid.appendChild(dayDiv);
    }
    
    // Next month days (gray) - fill to complete 6 rows (42 cells)
    const totalCellsSoFar = firstDayOfMonth + daysInMonth;
    const remainingCells = 42 - totalCellsSoFar;
    
    for (let day = 1; day <= remainingCells; day++) {
        const dayDiv = createCalendarDay(day, true, false, false, []);
        grid.appendChild(dayDiv);
    }
}

function createCalendarDay(day, isOtherMonth, isToday, isSelected, indicators) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell';
    
    if (isOtherMonth) cell.classList.add('other-month');
    if (isToday) cell.classList.add('today');
    if (isSelected) cell.classList.add('selected');
    
    const numberSpan = document.createElement('span');
    numberSpan.className = 'calendar-day-number';
    numberSpan.textContent = day;
    cell.appendChild(numberSpan);
    
    // Indicators only for current month
    if (!isOtherMonth && indicators.length > 0) {
        const indicatorsDiv = document.createElement('div');
        indicatorsDiv.className = 'day-indicators';
        
        indicators.forEach(status => {
            const dot = document.createElement('span');
            dot.className = `day-indicator ${status}`;
            indicatorsDiv.appendChild(dot);
        });
        
        cell.appendChild(indicatorsDiv);
    } else {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'day-indicators';
        cell.appendChild(emptyDiv);
    }
    
    if (!isOtherMonth) {
        cell.addEventListener('click', () => {
            document.querySelectorAll('.calendar-day-cell').forEach(c => c.classList.remove('selected'));
            cell.classList.add('selected');
            currentAttendanceCalendar.selectedDate = day;
        });
    }
    
    return cell;
}

function buildAttendanceMap() {
    const map = new Map();
    const data = currentAttendanceCalendar.attendanceData?.attendance_days || [];
    
    data.forEach(record => {
        if (!map.has(record.date)) {
            map.set(record.date, []);
        }
        map.get(record.date).push(record.status.toLowerCase());
    });
    
    return map;
}

function changeAttendanceMonth(direction) {
    currentAttendanceCalendar.currentDate.setMonth(
        currentAttendanceCalendar.currentDate.getMonth() + direction
    );
    loadAttendanceData(currentAttendanceCalendar.selectedSubject).then(renderAttendanceCalendar);
}

function closeAttendanceModal() {
    document.getElementById('attendanceCalendarModal').classList.add('hidden');
    document.body.style.overflow = '';
    currentAttendanceCalendar.selectedSubject = null;
    currentAttendanceCalendar.attendanceData = null;
}

function showLoading(show) {
    document.getElementById('loadingState').classList.toggle('hidden', !show);
    document.getElementById('mainScheduleView').classList.toggle('hidden', show);
}

function showEmptyState(show) {
    document.getElementById('emptyState').classList.toggle('hidden', !show);
    if (show) {
        document.getElementById('mainScheduleView').classList.add('hidden');
    }
}

// Expose functions globally
window.showSubjectDetailsView = showSubjectDetailsView;
window.showMainScheduleView = showMainScheduleView;
window.openSubjectAttendance = openSubjectAttendance;
window.closeAttendanceModal = closeAttendanceModal;
window.changeAttendanceMonth = changeAttendanceMonth;