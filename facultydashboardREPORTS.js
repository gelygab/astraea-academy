/* ==========================================
   DATA & STATE
   ========================================== */
let startSelection = null;
let endSelection = null;
let currentBaseDate = new Date();

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const studentData = {
    name: "Tricia Mae Zamora",
    program: "Computer Engineering",
    yearBlock: "2nd Year - Block 2",
    uid: "09999999",
    contact: "09568608426",
    email: "tricia.mae@email.com",
    address: "123 Hotdog Kanto Street Caloocan",
    dateRange: "No Range Selected",
    stats: { present: 20, absent: 3, late: 5, excused: 2 },
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

    if (start && end) {
        // Use '/' to ensure local time parsing
        const sDate = new Date(start.replace(/-/g, '/'));
        const eDate = new Date(end.replace(/-/g, '/'));
        
        studentData.dateRange = `${sDate.toLocaleDateString('en-US', {month:'short', day:'numeric'})} - ${eDate.toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}`;

        const generatedMonths = [];
        let runner = new Date(sDate.getFullYear(), sDate.getMonth(), 1);
        
        while (runner <= eDate) {
            generatedMonths.push({
                name: months[runner.getMonth()],
                year: runner.getFullYear(),
                days: new Date(runner.getFullYear(), runner.getMonth() + 1, 0).getDate(),
                gridId: generatedMonths.length === 0 ? "month1Grid" : "month2Grid"
            });
            runner.setMonth(runner.getMonth() + 1);
        }
        studentData.months = generatedMonths;
    }
    renderReport(studentData);
}

function renderReport(data) {
    document.getElementById('displayName').innerText = data.name;
    document.getElementById('displayProgram').innerText = `${data.program} | ${data.yearBlock}`;
    document.getElementById('displayUID').innerText = data.uid;
    document.getElementById('displayContact').innerText = data.contact;
    document.getElementById('displayEmail').innerText = data.email;
    document.getElementById('displayAddress').innerText = data.address;
    document.getElementById('displayRange').innerText = data.dateRange;

    // Stats
    document.getElementById('statPresent').innerText = `${data.stats.present} Days`;
    document.getElementById('statAbsent').innerText = `${data.stats.absent} Days`;
    document.getElementById('statLate').innerText = `${data.stats.late} Days`;
    document.getElementById('statExcused').innerText = `${data.stats.excused} Days`;

    data.months.forEach((m, index) => {
        const titleId = index === 0 ? 'leftMonthName' : 'rightMonthName';
        const titleEl = document.getElementById(titleId);
        if (titleEl) titleEl.innerText = `${m.name} ${m.year}`;

        const grid = document.getElementById(m.gridId);
        if (!grid) return;
        
        grid.innerHTML = '';
        const statuses = ['present', 'present', 'absent', 'late', 'excused', 'holiday', 'out-range'];
        
        for (let i = 1; i <= m.days; i++) {
            const day = document.createElement('div');
            day.className = `day-box ${statuses[Math.floor(Math.random() * statuses.length)]}`;
            day.innerText = i;
            grid.appendChild(day);
        }
    });
}

/* ==========================================
   DASHBOARD LOGIC 
   ========================================== */
function initDashboard() {
    initDropdowns();
    renderDashboardCalendars();
}

// ... initDropdowns, renderDashboardCalendars, jumpDate, changeMonth remain same ...
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

    // Handle Monday start offset
    let blanks = firstDay === 0 ? 6 : firstDay - 1; 
    for (let i = 0; i < blanks; i++) {
        grid.appendChild(document.createElement("div"));
    }

    // Loop through every day of the month
    for (let d = 1; d <= daysInMonth; d++) {
        const dayEl = document.createElement("div");
        dayEl.className = "day";
        dayEl.innerText = d;

        const thisDate = new Date(date.getFullYear(), date.getMonth(), d);
        const thisTime = thisDate.getTime();

        // APPLY VISUAL STATES
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

        // SELECTION LOGIC
        dayEl.onclick = () => {
            if (!startSelection || (startSelection && endSelection)) {
                // First click: Start a new selection
                startSelection = thisDate;
                endSelection = null;
            } else {
                // Second click: Complete the range
                endSelection = thisDate;
            }

            // Update the text inputs (From/To)
            const fromInp = document.getElementById('display-from');
            const toInp = document.getElementById('display-to');
            
            if (startSelection && endSelection) {
                const range = [startSelection, endSelection].sort((a, b) => a - b);
                fromInp.value = range[0].toLocaleDateString();
                toInp.value = range[1].toLocaleDateString();
            } else {
                fromInp.value = startSelection ? startSelection.toLocaleDateString() : "";
                toInp.value = "";
            }

            // Refresh both calendars to show the new highlight
            renderDashboardCalendars();
        };

        grid.appendChild(dayEl);
    }
}

function jumpDate() {
    const m = parseInt(document.getElementById('select-month-left').value);
    const y = parseInt(document.getElementById('select-year-left').value);
    currentBaseDate = new Date(y, m, 1);
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

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const s = formatDate(startSelection);
    const e = formatDate(endSelection);
    
    window.open(`viewREPORT.php?start=${s}&end=${e}`, '_blank');
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