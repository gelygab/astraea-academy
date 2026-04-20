/* ==========================================
   DATA & STATE
   ========================================== */
let startSelection = null;
let endSelection = null;
let currentBaseDate = new Date();

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const studentData = {
    name: "Loading...",
    program: "Student Record",
    yearBlock: "",
    uid: "--",
    contact: "--",
    email: "--",
    address: "--",
    dateRange: "Loading Dates...",
    stats: { present: 0, absent: 0, late: 0, excused: 0 },
    months: [] // Will be filled dynamically
};

/* ==========================================
   INITIALIZATION ROUTER
   ========================================== */
window.onload = function() {
    generateStars();

    if (document.getElementById('displayName')) {
        initReportView();
    } 
    else if (document.getElementById('select-month-left')) {
        initDashboard();
    }
};

/* ==========================================
   REPORT VIEW LOGIC 
   ========================================== */
function initReportView() {
    const urlParams = new URLSearchParams(window.location.search);
    const start = urlParams.get('start');
    const end = urlParams.get('end');
    const uid = urlParams.get('uid');

    if (start && end) {
        const sDate = new Date(start.replace(/-/g, '/'));
        const eDate = new Date(end.replace(/-/g, '/'));
        studentData.dateRange = `${sDate.toLocaleDateString('en-US', {month:'short', day:'numeric'})} - ${eDate.toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}`;

        const generatedMonths = [];
        let runner = new Date(sDate.getFullYear(), sDate.getMonth(), 1);
        
        while (runner <= eDate) {
            generatedMonths.push({
                name: months[runner.getMonth()],
                monthNum: runner.getMonth() + 1, 
                year: runner.getFullYear(),
                days: new Date(runner.getFullYear(), runner.getMonth() + 1, 0).getDate()
            });
            runner.setMonth(runner.getMonth() + 1);
        }
        studentData.months = generatedMonths;
    }

    if (uid && uid !== "ALL") {
        fetch(`faculty/faculty_api/api_get_full_record.php?uid=${uid}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.profile) {
                    studentData.name = `${data.profile.first_name} ${data.profile.last_name}`;
                    studentData.uid = uid;
                    studentData.contact = data.profile.student_contact || "No Contact Info";
                    studentData.email = data.profile.student_email || "No Email";
                    studentData.address = data.profile.student_address || "No Address";

                    const year = data.profile.student_year;
                    const block = data.profile.student_block;
                    const deptId = data.profile.department_id;

                    let suffix = "th";
                    if (year == 1) suffix = "st";
                    else if (year == 2) suffix = "nd";
                    else if (year == 3) suffix = "rd";

                    const programs = {
                        1: 'BS Civil Engineering',
                        2: 'BS Chemical Engineering',
                        3: 'BS Computer Engineering',
                        4: 'BS Electrical Engineering',
                        5: 'BS Electronics and Communications Engineering',
                        6: 'BS Mechanical Engineering',
                        7: 'BS Manufacturing Engineering',
                        8: 'Early Childhood Education',
                        9: 'Elementary Education',
                        10: 'Secondary Education',
                        11: 'Special Needs Education',
                        12: 'Social Work',
                        13: 'Mass Communication',
                        14: 'Psychology',
                    };

                    studentData.program = programs[deptId] || `Program ID: ${deptId}`;
                    studentData.yearBlock = `${year}${suffix} Year - Block ${block}`;

                } else {
                    studentData.name = "Profile Not Found";
                }

                if (data && data.attendance_summary) {
                    studentData.stats.present = data.attendance_summary.Present || 0;
                    studentData.stats.absent = data.attendance_summary.Absent || 0;
                    studentData.stats.late = data.attendance_summary.Late || 0;
                    studentData.stats.excused = data.attendance_summary.Excused || 0;
                }

                studentData.daily_attendance = data.daily_attendance || {};

                renderReport(studentData);
            })
            .catch(err => {
                console.error("API Error:", err);
                studentData.name = "Error Loading Profile";
                renderReport(studentData);
            });
    } else {
        studentData.name = "All Students Report";
        renderReport(studentData);
    }
}

function renderReport(data) {
    try {
        document.getElementById('displayName').innerText = data.name;
        document.getElementById('displayProgram').innerText = `${data.program} | ${data.yearBlock}`;
        document.getElementById('displayUID').innerText = data.uid;
        document.getElementById('displayContact').innerText = data.contact;
        document.getElementById('displayEmail').innerText = data.email;
        document.getElementById('displayAddress').innerText = data.address;
        document.getElementById('displayRange').innerText = data.dateRange;

        // Reset the counter to 0 everytime we generate a report
        let countPresent = 0;
        let countAbsent = 0;
        let countLate = 0;
        let countExcused = 0;

        // --- DYNAMIC CALENDAR GENERATOR ---
        const calendarContainer = document.getElementById('calendarContainer');
        if (calendarContainer) {
            calendarContainer.innerHTML = ''; // Clear out the old stuff

            data.months.forEach((m) => {
                const monthBox = document.createElement('div');
                monthBox.className = 'month-box';

                const title = document.createElement('h5');
                title.innerText = `${m.name} ${m.year}`;
                monthBox.appendChild(title);

                const daysHeader = document.createElement('div');
                daysHeader.className = 'calendar-header-days';
                daysHeader.innerHTML = '<span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>';
                monthBox.appendChild(daysHeader);

                const grid = document.createElement('div');
                grid.className = 'cal-grid';

                for (let i = 1; i <= m.days; i++) {
                    const day = document.createElement('div');
                    
                    const monthStr = String(m.monthNum).padStart(2, '0');
                    const dayStr = String(i).padStart(2, '0');
                    const dateKey = `${m.year}-${monthStr}-${dayStr}`;
                    
                    let status = "out-range"; 
                    if (data.daily_attendance && data.daily_attendance[dateKey]) {
                        status = data.daily_attendance[dateKey];

                        if (status === 'present') countPresent++;
                        else if (status === 'absent') countAbsent++;
                        else if (status === 'late') countLate++;
                        else if (status === 'excused') countExcused++;
                    }
                    
                    day.className = `day-box ${status}`;
                    day.innerText = i;
                    grid.appendChild(day);
                }

                monthBox.appendChild(grid);
                calendarContainer.appendChild(monthBox);
            });
        }

        // Apply the Database Stats
        document.getElementById('statPresent').innerText = `${countPresent} Days`;
        document.getElementById('statAbsent').innerText = `${countAbsent} Days`;
        document.getElementById('statLate').innerText = `${countLate} Days`;
        document.getElementById('statExcused').innerText = `${countExcused} Days`;
        
    } catch (error) {
        console.error("Crash Caught:", error);
        const container = document.getElementById('calendarContainer');
        if (container) {
            container.innerHTML = `<h3 style="color:red; text-align:center; width: 100%; margin-top: 40px;"> 🚨 JS Crash: ${error.message}</h3>`;
        }
    }
}

function loadStudentsForReport() {
    const studentDropdown = document.getElementById('student-name');
    if (!studentDropdown) return;

    studentDropdown.innerHTML = '<option value="" disabled selected hidden>Loading students...</option>';

    fetch('faculty/faculty_api/api_get_report_students.php')
        .then(response => response.json())
        .then(data => {
            studentDropdown.innerHTML = '<option value="" disabled selected hidden>Select student</option>';
            
            data.forEach(student => {
                const option = document.createElement('option');
                option.value = student.user_uid;
                option.textContent = `${student.last_name}, ${student.first_name} (${student.user_uid})`;
                studentDropdown.appendChild(option);
            });
        })
        .catch(err => console.error("Error loading students:", err));
}

/* ==========================================
   DASHBOARD LOGIC 
   ========================================== */
function initDashboard() {
    initDropdowns();
    renderDashboardCalendars();
    
    const yearDropdown = document.getElementById('academic-year');
    const semDropdown = document.getElementById('semester');
    const studentDropdown = document.getElementById('student-name');

    // 1. Lock it by default
    studentDropdown.disabled = true;
    studentDropdown.innerHTML = '<option value="" disabled selected hidden>Select Year & Semester first...</option>';

    // 2. Listen for changes on Year and Semester
    const checkFilters = () => {
        if (yearDropdown.value && semDropdown.value) {
            studentDropdown.disabled = false;
            loadStudentsForReport(); // Only fetch when both are selected!
        } else {
            studentDropdown.disabled = true;
            studentDropdown.innerHTML = '<option value="" disabled selected hidden>Select Year & Semester first...</option>';
        }
    };

    yearDropdown.addEventListener('change', checkFilters);
    semDropdown.addEventListener('change', checkFilters);
}

function initDropdowns() {
    const monthSels = [document.getElementById('select-month-left'), document.getElementById('select-month-right')];
    const yearSels = [document.getElementById('select-year-left'), document.getElementById('select-year-right')];
    monthSels.forEach(sel => months.forEach((m, i) => sel.add(new Option(m, i))));
    yearSels.forEach(sel => {
        const cy = new Date().getFullYear();
        for (let y = cy - 2; y <= cy + 2; y++) sel.add(new Option(y, y));
    });
}

function renderDashboardCalendars() {
    const leftDate = new Date(currentBaseDate.getFullYear(), currentBaseDate.getMonth(), 1);
    const rightDate = new Date(currentBaseDate.getFullYear(), currentBaseDate.getMonth() + 1, 1);
    document.getElementById('select-month-left').value = leftDate.getMonth();
    document.getElementById('select-year-left').value = leftDate.getFullYear();
    document.getElementById('select-month-right').value = rightDate.getMonth();
    document.getElementById('select-year-right').value = rightDate.getFullYear();
    drawDashboardMonth(leftDate, "days-left");
    drawDashboardMonth(rightDate, "days-right");
}

function drawDashboardMonth(date, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = "";

    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    let blanks = firstDay === 0 ? 6 : firstDay - 1; 
    for (let i = 0; i < blanks; i++) {
        grid.appendChild(document.createElement("div"));
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dayEl = document.createElement("div");
        dayEl.className = "day";
        dayEl.innerText = d;

        const thisDate = new Date(date.getFullYear(), date.getMonth(), d);
        const thisTime = thisDate.getTime();

        if (startSelection && thisTime === startSelection.getTime()) {
            dayEl.classList.add("selected");
        }
        if (endSelection && thisTime === endSelection.getTime()) {
            dayEl.classList.add("selected");
        }

        if (startSelection && endSelection) {
            const start = startSelection.getTime();
            const end = endSelection.getTime();
            
            if (thisTime > Math.min(start, end) && thisTime < Math.max(start, end)) {
                dayEl.classList.add("in-range");
            }
        }

        dayEl.onclick = () => {
            if (!startSelection || (startSelection && endSelection)) {
                startSelection = thisDate;
                endSelection = null;
            } else {
                endSelection = thisDate;
            }

            const fromInp = document.getElementById('display-from');
            const toInp = document.getElementById('display-to');

            const options = { month: 'long', day: 'numeric', year: 'numeric' };
            
            if (startSelection && endSelection) {
                const range = [startSelection, endSelection].sort((a, b) => a - b);
                fromInp.value = range[0].toLocaleDateString('en-US', options);
                toInp.value = range[1].toLocaleDateString('en-US', options);
            } else {
                fromInp.value = startSelection ? startSelection.toLocaleDateString('en-US', options) : "";
                toInp.value = "";
            }

            renderDashboardCalendars();
        };

        grid.appendChild(dayEl);
    }
}

function jumpDate() {
    const activeId = document.activeElement.id;
    
    if (activeId === 'select-month-right' || activeId === 'select-year-right') {
        const m = parseInt(document.getElementById('select-month-right').value);
        const y = parseInt(document.getElementById('select-year-right').value);
        
        currentBaseDate = new Date(y, m - 1, 1);
    } else {
        const m = parseInt(document.getElementById('select-month-left').value);
        const y = parseInt(document.getElementById('select-year-left').value);
        
        currentBaseDate = new Date(y, m, 1);
    }
    
    renderDashboardCalendars();
}

function changeMonth(step) {
    currentBaseDate.setMonth(currentBaseDate.getMonth() + step);
    renderDashboardCalendars();
}

function generateReport() {
    if (!startSelection || !endSelection) {
        alert("Please select a date range.");
        return;
    }

    const studentDropdown = document.getElementById('student-name');
    if (!studentDropdown || !studentDropdown.value) {
        alert("Please select a specific student to generate their report.");
        return;
    }

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const s = formatDate(startSelection);
    const e = formatDate(endSelection);
    const uid = studentDropdown.value;
    
    window.open(`viewREPORT.php?start=${s}&end=${e}&uid=${uid}`, '_blank');
}

function generateStars() {
    const field = document.getElementById('starField');
    if (!field) return;
    for (let i = 0; i < 45; i++) {
        let s = document.createElement('span');
        s.className = 'star';
        s.innerText = '★';
        s.style.left = Math.random() * 100 + '%';
        s.style.animationDelay = Math.random() * 8 + 's';
        s.style.fontSize = (Math.random() * 12 + 8) + 'px';
        field.appendChild(s);
    }
}