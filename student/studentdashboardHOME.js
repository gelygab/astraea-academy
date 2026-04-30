const API_CONFIG = {
    baseUrl: '../faculty/', // This tells it to step out of 'student' and into 'faculty'
   
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
        e.stopPropagation();
       
        const filterLabel = item.innerText;
        const filterType = item.getAttribute('data-value');
        const now = new Date();


        console.log("Switching to:", filterLabel);


        let expected = 0;
        if (filterType === 'daily') expected = Number(student.dailyCount || 0);
        else if (filterType === 'weekly') expected = Number(student.weeklyCount || 5);
        else expected = Number(student.monthlyCount || 0);


        // Update the Dashboard Labels
        try {
           
            const rateTag = document.querySelector('.right-column-1 .tag');
            if (rateTag) {
                if (filterType === 'daily') rateTag.innerText = "Today";
                else if (filterType === 'weekly') rateTag.innerText = "This Week";
                else rateTag.innerText = "This Month";
            }


           
            const classDaysDesc = document.querySelector('.right-column-2 p');
            if (classDaysDesc) {
                classDaysDesc.innerText = `Class days for ${filterLabel}`;
            }


            // Update the Summary Title
            const summaryTitle = document.getElementById('summaryTitle');
            if (summaryTitle) {
                summaryTitle.innerText = `${filterLabel} Summary`;
            }
        } catch (labelError) {
            console.error("Error updating text labels:", labelError);
        }


        // Update the Data and Charts
        updatePeachBoxes(student.attendanceLogs, filterType, now);


        const filteredLogs = student.attendanceLogs.filter(l => {
            const [year, month, day] = l.date.split('-').map(Number);
            const d = new Date(year, month - 1, day);
            if (filterType === 'daily') return d.toDateString() === now.toDateString();
            if (filterType === 'weekly') {
                const diff = (now - d) / (1000 * 60 * 60 * 24);
                return diff >= 0 && diff <= 7;
            }
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });


        const presentCount = filteredLogs.filter(l =>
            ["Present", "Late", "Undertime"].includes(l.status)
        ).length;


        const rate = expected > 0 ? Math.round((presentCount / expected) * 100) : 0;


        const rateDisplay = document.getElementById('rateCardValue');
        if (rateDisplay) rateDisplay.innerHTML = `<h2>${rate}%</h2>`;
       
        updateBarChart(filteredLogs);
        updateClassDays(expected);
       
        //Dropdown UI
        displayValue.innerText = filterLabel;
        menu.classList.remove('show');
    };
});


        document.onclick = () => menu.classList.remove('show');


        // --- DOWNLOAD TRIGGER  ---
        const downloadBtn = document.getElementById('downloadReportBtn');
        if (downloadBtn) {
            downloadBtn.onclick = (e) => {
                e.preventDefault(); // Stop any default button actions
               
                const displayValue = document.getElementById('displayValue');
                const selectedPeriod = displayValue ? displayValue.textContent.trim().toLowerCase() : 'monthly';


                // Grab the UID right off the page!
                const uidElement = document.getElementById('uid-val');
                const studentUid = uidElement ? uidElement.innerText.trim() : '';


                if (studentUid) {
                    console.log("Downloading report for:", selectedPeriod, "UID:", studentUid);
                    // Pass BOTH the uid and the period to the report file
                    window.location.href = `student-download_report.php?uid=${studentUid}&period=${selectedPeriod}`;
                } else {
                    alert("Error: Student UID not found on the page.");
                }
            };
        }


    } catch (error) {
        console.error("Initialization Error:", error);
    }
}


function updatePeachBoxes(logs, type, now) {
    const filtered = logs.filter(l => {
        const [year, month, day] = l.date.split('-').map(Number);
        const d = new Date(year, month - 1, day);


        if (type === 'daily') return d.toDateString() === now.toDateString();
        if (type === 'weekly') {
            const diff = (now - d) / (1000 * 60 * 60 * 24);
            return diff >= 0 && diff <= 7;
        }
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });


    const summaryData = [
        { label: "Total Attendance", status: "Present" },
        { label: "Late Attendance", status: "Late" },
        { label: "Undertime", status: "Undertime" },
        { label: "Total Absent", status: "Absent" }
    ];


    const summaryContainer = document.getElementById('attendanceGrid');
    if (summaryContainer) {
        summaryContainer.innerHTML = summaryData.map(item => {
            const count = filtered.filter(l =>
                l.status && l.status.trim().toLowerCase() === item.status.toLowerCase()
            ).length;


            const labelLower = item.label.toLowerCase();
            let icon = "star"; // Fallback
            if (labelLower.includes("attendance")) {
                icon = "groups";
            } else if (labelLower.includes("late")) {
                icon = "schedule";
            } else if (labelLower.includes("undertime")) {
                icon = "hourglass_bottom";
            } else if (labelLower.includes("absent")) {
                icon = "person_off";
            }


            const dayText = count === 1 ? 'Day' : 'Days';


            return `
                <div class="peach-box">
                    <div class="icon-wrapper">
                        <span class="material-symbols-outlined">${icon}</span>
                    </div>
                    <div class="box-text">
                        <strong>${count} ${dayText}</strong>
                        <p>${item.label}</p>
                    </div>
                </div>`;
        }).join('');
       
        summaryContainer.classList.remove('loading');
    }
}




function updateAttendanceRate(logs) {
    const presentCount = logs.filter(l => l.status === "Present" || l.status === "Late" || l.status === "Undertime").length;
    const rate = logs.length ? Math.round((presentCount / logs.length) * 100) : 0;
    const rateValue = document.getElementById('rateCardValue');
    if (rateValue) rateValue.innerHTML = `<h2>${rate}%</h2>`;
}


function updateSixMonthPie(student, now) {
    const svg = document.getElementById('pieSvg');
    const colors = [ '#c4536d', '#f4b6c2', '#ffe4e1', '#ff87a3', '#f57190', '#e85f7f'];
   
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
    const colors = ['#ed5b7d', '#ffa0b3', '#f4b6c2', '#bb435f'];


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



