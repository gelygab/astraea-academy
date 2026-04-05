const API_CONFIG = {
    baseUrl: '',
    
    endpoints: {
        getStudentData: 'get_student_attendance.php'
    }
};


async function loadDashboard() {
    try {
        const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getStudentData}?uid=${CURRENT_USER_UID}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        if (!response.ok) throw new Error("Fetch failed");
        const data = await response.json();
        console.log(data);
        const student = data.students[0];

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyLogs = student.attendanceLogs.filter(log => {
            const [year, month, day] = log.date.split('-').map(Number);
            const d = new Date(year, month - 1, day);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });

        updateProfile(student);
        updateClassDays(student.monthlyCount);
        updateBarChart(monthlyLogs);
        updateAttendanceRate(monthlyLogs);
        updateSixMonthPie(student, now);
        console.log(monthlyLogs);
        updatePeachBoxes(student.attendanceLogs, 'monthly', now); // Initial Load

        const dropdown = document.getElementById('customDropdown');
        const menu = document.getElementById('dropdownMenu');
        const displayValue = document.getElementById('displayValue');

        dropdown.onclick = (e) => {
            e.stopPropagation();
            menu.classList.toggle('show');
        };

        document.querySelectorAll('#dropdownMenu li').forEach(item => {
            item.onclick = (e) => {
                e.stopPropagation(); // Prevent document click from firing
                const filterType = item.getAttribute('data-value');
                const now = new Date();

                let expected = 0;
                
                if (filterType === 'daily') {
                    expected = Number(student.dailyCount || 0);
                }
                
                if (filterType === 'weekly') {
                    expected = Number(student.weeklyCount || 5);
                }

                if (filterType === 'monthly') {
                    expected = Number(student.monthlyCount || 0);
                }
                
                updatePeachBoxes(student.attendanceLogs, filterType, now);

                const filteredLogs = student.attendanceLogs.filter(l => {
                    const [year, month, day] = l.date.split('-').map(Number);
                    const d = new Date(year, month - 1, day);
                    if (filterType === 'daily') return d.toDateString() === now.toDateString();
                    if (filterType === 'weekly') {
                        const diff = (now - d) / (1000 * 60 * 60 * 24); return diff >= 0 && diff <= 7;
                    }
                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                });

                const presentCount = Number(filteredLogs.filter(l => l.status !== "Absent").length);
                const rate = expected > 0 ? Math.round((presentCount / expected) * 100) : 0;

                const rateDisplay = document.getElementById('rateCardValue');
                if (rateDisplay) {
                    rateDisplay.innerHTML = `<h2>${rate}%</h2>`;
                }
                
                updateBarChart(filteredLogs);
                updateClassDays(expected);
                
                displayValue.innerText = item.innerText;
                menu.classList.remove('show');
            };
        });

        document.onclick = () => menu.classList.remove('show');

    } catch (error) {
        console.error("Initialization Error:", error);
    }
}

function updatePeachBoxes(logs, type, now) {
    const filtered = logs.filter(l => {
        const [year, month, day] = l.date.split('-').map(Number);
        const d = new Date(year, month - 1, day); // local time

        if (type === 'daily') return d.toDateString() === now.toDateString();
        if (type === 'weekly') {
            const diff = (now - d) / (1000 * 60 * 60 * 24);
            return diff >= 0 && diff <= 7;
        }
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const stats = [
        { label: "Total Attendance", status: "Present" },
        { label: "Late Attendance", status: "Late" },
        { label: "Undertime", status: "Undertime" },
        { label: "Total Absent", status: "Absent" }
    ];

    const grid = document.getElementById('attendanceGrid');
    if (grid) {
        grid.innerHTML = stats.map(s => {
            const count = filtered.filter(l => {
                if (!l.status) return false;
                return l.status.trim().toLowerCase() === s.status.toLowerCase();
            }).length;
            const dayText = count === 1 ? 'Day' : 'Days';

            return `
                <div class="peach-box">
                    <span class="material-symbols-outlined">star</span>
                    <div class="box-content">
                        <strong>${count} ${dayText}</strong>
                        <p>${s.label}</p>
                    </div>
                </div>`;
        }).join('');
    }

    console.log("Current Month being filtered:", now.getMonth());
    console.log("Records found after filter:", filtered.length);
}

function updateAttendanceRate(logs) {
    const presentCount = logs.filter(l => l.status === "Present" || l.status === "Late" || l.status === "Undertime").length;
    const rate = logs.length ? Math.round((presentCount / logs.length) * 100) : 0;
    const rateValue = document.getElementById('rateCardValue');
    if (rateValue) rateValue.innerHTML = `<h2>${rate}%</h2>`;
}

function updateSixMonthPie(student, now) {
    const svg = document.getElementById('pieSvg');
    const colors = ['#5dade2', '#e67e22', '#a6acaf', '#9b59b6', '#f1c40f', '#1abc9c'];
    
    let data = [];
    let totalPresent = 0;

    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(now.getMonth() - i);
        const count = student.attendanceLogs.filter(l => {
        const [year, month, day] = l.date.split('-').map(Number);
        const ld = new Date(year, month - 1, day); // local time
        return ld.getMonth() === d.getMonth() && ld.getFullYear() === d.getFullYear() && l.status === "Present";
    }).length;
        
        data.push({ 
            label: d.toLocaleString('default', { month: 'short' }), 
            value: count || 0, 
            color: colors[i] 
        });
        totalPresent += count;
    }

    let cumulativePercent = 0;

    function getCoordinatesForPercent(percent) {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    }

    svg.innerHTML = data.map(item => {
        if (item.value === 0 && data.length > 1) return ''; 

        const percent = item.value / (totalPresent || 1);
        const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
        cumulativePercent += percent;
        const [endX, endY] = getCoordinatesForPercent(cumulativePercent);

        const largeArcFlag = percent > 0.5 ? 1 : 0;

        const pathData = [
            `M 0 0`,
            `L ${startX} ${startY}`,
            `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
            `Z`
        ].join(' ');

        return `
            <path class="pie-wedge" 
                d="${pathData}" 
                fill="${item.color}"
                onmouseenter="showTooltip(event, '${item.label}: ${item.value} days')"
                onmousemove="moveTooltip(event)"
                onmouseleave="hideTooltip()"
            />
        `;
    }).join('');
};

window.showTooltip = (e, text) => {
    const tooltip = document.getElementById('pieTooltip');
    tooltip.innerText = text;
    tooltip.style.opacity = '1';
};

window.moveTooltip = (e) => {
    const tooltip = document.getElementById('pieTooltip');
    tooltip.style.left = `${e.offsetX + 15}px`;
    tooltip.style.top = `${e.offsetY - 25}px`;
};

window.hideTooltip = () => {
    document.getElementById('pieTooltip').style.opacity = '0';
};

window.showTooltip = (e, text) => {
    const tooltip = document.getElementById('pieTooltip');
    tooltip.innerText = text;
    tooltip.style.opacity = '1';
    tooltip.style.left = `${e.offsetX + 10}px`;
    tooltip.style.top = `${e.offsetY - 20}px`;
};

window.hideTooltip = () => {
    document.getElementById('pieTooltip').style.opacity = '0';
};

function updateBarChart(logs) {
    const stats = { Present: 0, Late: 0, Undertime: 0, Absent: 0 };
    logs.forEach(l => {
        if (stats.hasOwnProperty(l.status)) stats[l.status]++;
    });

    const max = Math.max(...Object.values(stats), 1);
    const colors = ['#3498db', '#82cc00', '#f39c12', '#e74c3c'];

    const container = document.getElementById('barChartContainer');
    if (!container) return;

    container.innerHTML = Object.keys(stats).map((key, i) => {
        const count = stats[key];
        const heightPercent = (count / max) * 100;
        
        return `
            <div class="bar-bg">
                <div class="bar-fill" style="height:${heightPercent}%; background:${colors[i]};">
                    ${heightPercent > 15 ? `
                        <span class="bar-number-inside">${count}</span>
                        <span class="bar-label-inside">${key}</span>
                    ` : ''}
                </div>
                ${heightPercent <= 15 ? `<span style="position:absolute; bottom:5px; width:100%; text-align:center; font-size:10px; color:white;">${count}</span>` : ''}
            </div>
        `;
    }).join('');
}

function updateProfile(s) {
    document.getElementById('studentName').innerText = s.name;
    document.getElementById('uid-val').innerText = s.uid;
    document.getElementById('contact-val').innerText = s.contact;
    document.getElementById('email-val').innerText = s.email;
    document.getElementById('address-val').innerText = s.address;
}

function updateClassDays(count) {
    const container = document.getElementById('classDaysText');
    if (container) {
        container.innerHTML = `<h2>${count}</h2><p>Days</p>`;
    }
}

document.addEventListener('DOMContentLoaded', loadDashboard);