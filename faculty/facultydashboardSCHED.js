const API_CONFIG = {
    baseUrl: 'faculty_api/', 
    
    endpoints: {
        getSchedule: 'api_get_schedule.php',
        getSubjectAttendance: 'api_get_subject_attendance.php',
        getApprovedRecords: 'get_approved_records.php'
    }
};

const SCHEDULE_CONFIG = {
    startHour: 7,
    endHour: 21,
    intervalMinutes: 30,
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
};

let currentFacultyId = null;
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

async function initializeScheduleDashboard() {
    currentFacultyId = getCurrentFacultyId();
    await loadScheduleData();
}

function getCurrentFacultyId() {
    return sessionStorage.getItem('faculty_id') || localStorage.getItem('faculty_id') || null;
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
            faculty_id: currentFacultyId,
            ...(schoolYear && { school_year: schoolYear }),
            ...(semester && { semester: semester })
        });
        
        const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getSchedule}?${params}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const result = await response.json();
        
        if (result.success) {
            currentScheduleData = result.data;
            populateFilters(result.data.available_years, result.data.available_semesters);
            renderSchedule(result.data);
        } else {
            throw new Error(result.message || 'Invalid response');
        }
        
    } catch (error) {
        console.error('Failed to load schedule:', error);
        usePlaceholderData();
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

function renderWeeklyGrid(scheduleSlots) {
    const grid = document.getElementById('weeklyScheduleGrid');
    grid.innerHTML = '';
    
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
    
    const timeSlots = generateTimeSlots();
    
    timeSlots.forEach((slot, index) => {
        const timeCell = document.createElement('div');
        timeCell.className = 'grid-time-header';
        timeCell.textContent = slot.label;
        grid.appendChild(timeCell);
        
        SCHEDULE_CONFIG.days.forEach(day => {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.time = slot.time;
            cell.dataset.day = day;
            cell.dataset.rowIndex = index;
            grid.appendChild(cell);
        });
    });
    
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

function formatTimeFull(hour, minute) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
}

function placeClassBlock(grid, classData, timeSlots) {
    const dayIndex = SCHEDULE_CONFIG.days.indexOf(classData.day);
    if (dayIndex === -1) return;
    
    const startRow = timeSlots.findIndex(t => t.time === classData.start_time);
    const endRow = timeSlots.findIndex(t => t.time === classData.end_time);
    
    if (startRow === -1) return;
    
    const rowSpan = endRow - startRow;
    
    const gridCells = grid.querySelectorAll('.grid-cell');
    const cellIndex = startRow * 7 + dayIndex;
    const targetCell = gridCells[cellIndex];
    
    if (!targetCell) return;
    
    const block = document.createElement('div');
    block.className = 'class-block';
    block.style.gridRow = `span ${rowSpan}`;
    block.style.height = `${rowSpan * 50 - 4}px`; 
    
    block.innerHTML = `
        <span class="subject-code">${escapeHtml(classData.subject_code)}</span>
        <span class="subject-room">${escapeHtml(classData.room || '')}</span>
    `;
    
    block.onclick = () => openSubjectAttendance(classData.subject_code);
    
    targetCell.style.position = 'relative';
    targetCell.appendChild(block);
    
    for (let i = 0; i < rowSpan; i++) {
        const occupiedIndex = (startRow + i) * 7 + dayIndex;
        if (gridCells[occupiedIndex]) {
            gridCells[occupiedIndex].dataset.occupied = 'true';
        }
    }
}

function formatSchedule(subject) {
    return `${subject.section || ''} - ${subject.days || ''} ${subject.time || ''}`;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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
                <p>Units: ${subject.units || 'N/A'}</p>
                <p>${escapeHtml(subject.schedule_display || formatSchedule(subject))}</p>
                <button class="view-record-btn" onclick="openSubjectAttendance('${subject.subject_code}')">
                    View Leave and Excuse Record
                </button>
            </div>
        </div>
    `).join('');
}


async function openSubjectAttendance(subjectCode) {
    currentAttendanceCalendar.selectedSubject = subjectCode;
    currentAttendanceCalendar.currentDate = new Date();
    currentAttendanceCalendar.selectedDate = new Date().getDate();
    
    document.getElementById('attendanceCalendarModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    await loadAttendanceData(subjectCode);
    renderAttendanceCalendar();
}

// Attendance Calendar
async function loadAttendanceData(subjectCode) {
    try {
        const year = currentAttendanceCalendar.currentDate.getFullYear();
        const month = currentAttendanceCalendar.currentDate.getMonth() + 1;
        
        const params = new URLSearchParams({
            subject_code: subjectCode,
            year: year,
            month: month
        });
        
        const url = `api/api_get_subject_attendance.php?${params}`;
        
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Server connection failed!');
        
        const result = await response.json();
        
        if (result.success) {
            currentAttendanceCalendar.attendanceData = result.data;
        } else {
            throw new Error(result.message);
        }
        
    } catch (error) {
        console.error("🚨 Calendar Fetch Error:", error); 
        usePlaceholderAttendanceData(subjectCode);
    }
}

function getSubjectName(code) {
    const subject = currentScheduleData?.subjects?.find(s => s.subject_code === code);
    return subject?.description || code;
}

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
    
    const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    weekdays.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-weekday-header';
        header.textContent = day;
        grid.appendChild(header);
    });
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const today = new Date();
    const attendanceMap = buildAttendanceMap();
    
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const dayDiv = createCalendarDay(day, true, false, false, []);
        grid.appendChild(dayDiv);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        const isSelected = day === selectedDay;
        const indicators = attendanceMap.get(dateStr) || [];
        
        const dayDiv = createCalendarDay(day, false, isToday, isSelected, indicators);
        grid.appendChild(dayDiv);
    }
    
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
        map.get(record.date).push(record.status);
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

// ==========================================
// PLACEHOLDER DATA
// ========================================== 

function usePlaceholderData() {
    const placeholder1 = {
        school_year: "2025-2026",
        semester: "First Semester",
        available_years: ["2025-2026"],
        available_semesters: ["First Semester"],
        subjects: [
            {
                subject_code: "ENGMAN",
                description: "Engineering Management",
                lec_hours: 3,
                lab_hours: 0,
                units: 3,
                schedule_display: "2 - BSCpE 2-2 - S 05:30PM-08:30PM GV 311"
            },
            {
                subject_code: "SOFTDES",
                description: "Software Design (Lecture)",
                lec_hours: 3,
                lab_hours: 0,
                units: 3,
                schedule_display: "2 - BSCpE 2-2 - W 06:00PM-09:00PM GV 208"
            },
            {
                subject_code: "FECLEC",
                description: "Fundamentals of Electronics Circuit (Lecture)",
                lec_hours: 0,
                lab_hours: 3,
                units: 1,
                schedule_display: "2 - BSCpE 2-2 - TH 06:00PM-09:00PM GV 311"
            },
            {
                subject_code: "BEEE",
                description: "Basic Electrical and Electronics Engineering",
                lec_hours: 3,
                lab_hours: 0,
                units: 3,
                schedule_display: "2 - BSCpE 2-2 - T 11:30AM-01:00PM GV 208/F 11:30AM-01:00PM GV 208"
            },
            {
                subject_code: "FECLAB",
                description: "Fundamentals of Electronic Circuits (Laboratory)",
                lec_hours: 0,
                lab_hours: 3,
                units: 1,
                schedule_display: "2 - BSCpE 2-2 - W 02:00PM-05:00PM GV I&CLAB2B"
            }
        ],
        schedule_slots: [
            { subject_code: "BEEE", day: "Tuesday", start_time: "11:30", end_time: "13:00", room: "GV 208", section: "BSCpE 2-2" },
            { subject_code: "BEEE", day: "Friday", start_time: "11:30", end_time: "13:00", room: "GV 208", section: "BSCpE 2-2" },
            { subject_code: "FECLAB", day: "Wednesday", start_time: "14:00", end_time: "17:00", room: "GV I&CLAB2B", section: "BSCpE 2-2" },
            { subject_code: "SOFTDES", day: "Wednesday", start_time: "18:00", end_time: "21:00", room: "GV 208", section: "BSCpE 2-2" },
            { subject_code: "FECLEC", day: "Thursday", start_time: "18:00", end_time: "21:00", room: "GV 311", section: "BSCpE 2-2" },
            { subject_code: "ENGMAN", day: "Saturday", start_time: "17:30", end_time: "20:30", room: "GV 311", section: "BSCpE 2-2" }
        ]
    };

    currentScheduleData = placeholder1;
    populateFilters(currentScheduleData.available_years, currentScheduleData.available_semesters);
    renderSchedule(currentScheduleData);
}

function usePlaceholderAttendanceData(subjectCode) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const attendanceDays = [];
    const sampleDays = [6, 7, 10, 13, 14, 20, 21, 27];
    const statuses = ['absent', 'leave', 'excused'];
    
    sampleDays.forEach((day, index) => {
        const date = new Date(year, month, day);
        if (date.getDay() === 0 || date.getDay() === 6) return;
        
        const numStatuses = Math.random() > 0.7 ? 2 : 1;
        
        for (let i = 0; i < numStatuses; i++) {
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            attendanceDays.push({
                date: date.toISOString().split('T')[0],
                status: status
            });
        }
    });
    
    currentAttendanceCalendar.attendanceData = {
        subject_code: subjectCode,
        subject_name: getSubjectName(subjectCode),
        attendance_days: attendanceDays
    };
}

window.showSubjectDetailsView = showSubjectDetailsView;
window.showMainScheduleView = showMainScheduleView;
window.openSubjectAttendance = openSubjectAttendance;
window.closeAttendanceModal = closeAttendanceModal;
window.changeAttendanceMonth = changeAttendanceMonth;