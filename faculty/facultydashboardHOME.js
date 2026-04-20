document.addEventListener('DOMContentLoaded', () => {
    let cachedData = null;

    async function fetchData() {
        try {
            const response = await fetch('api/api_get_faculty_details.php');
            if (!response.ok) throw new Error("JSON file missing or server not running");
            cachedData = await response.json();

            const { common } = cachedData;

            // Load Faculty Info
            setEl('facultypfp', common.faculty_details.pfp);
            setEl('facultyName', common.faculty_details.name);
            setEl('uid-val', common.faculty_details.uid);
            setEl('college-val', common.faculty_details.college);
            setEl('dept-val', common.faculty_details.department);
            setEl('email-val', common.faculty_details.email);

            // Load Handled Subjects
            const subjectList = document.getElementById('subject-list');
            if (subjectList) {
                subjectList.innerHTML = common.subjects.map(s => `
                    <li><span class="subject-code">[${s.code}]</span> <span>${s.name}</span></li>
                `).join('');
                setEl('subject-count', common.subjects.length);
            }

            // Load Current Class Stats
            if (common.current_class) {
                const cc = common.current_class;
                setEl('curr-class', cc.name);
                setEl('curr-enrolled', `${cc.enrolled} STUDENTS`);
                setEl('curr-present', `${cc.present} PRESENT`);
                const pendingText = cc.pending === 0 ? "NONE" : cc.pending;
                setEl('curr-pending', pendingText);
            }

            // Load Live Feed Table
            const feedBody = document.getElementById('feed-body');
            const feedContainer = document.querySelector('.white-table-container');

            if (feedBody) {
                feedBody.innerHTML = common.live_feed.map(f => `
                    <tr>
                        <td class="col-name">${f.name}</td>
                        <td class="col-time">${f.time}</td>
                        <td class="col-status">
                            <span class="status-pill ${f.status === 'On-Time' ? 'On-Time' : 'Late'}">${f.status}</span>
                        </td>
                    </tr>
                `).join('');

                if (feedContainer && !document.querySelector('.feed-legend')) {
                    const legendDiv = document.createElement('div');
                    legendDiv.className = 'feed-legend';
                    legendDiv.innerHTML = `
                        <div class="legend-box ontime-box"></div><span>On-Time</span>
                        <div class="legend-box late-box"></div><span>Late</span>
                    `;
                    feedContainer.appendChild(legendDiv);
                }
            }

            // Initial View (Daily)
            updateDynamicSections('daily');

        } catch (error) {
            console.error("Dashboard Load Failed:", error);
            setEl('facultyName', "Connect Error: Check Console");
        }
    }

        function updateDynamicSections(timeframe) {
            if (!cachedData || !cachedData.timeframes[timeframe]) {
                console.error("Data not ready or timeframe invalid:", timeframe);
                return;
            }
    
        // --- Summary Boxes ---
            const tfData = cachedData.timeframes[timeframe];
            const summaryContainer = document.getElementById('summaryBoxes');

            if (summaryContainer) {
                summaryContainer.innerHTML = tfData.summary.map(item => {
                    const label = item.label.toLowerCase();
                    let iconName = "star"; // Default backup

                    // Logic to choose icon based on keywords
                    if (label.includes("attendance")) {
                        iconName = "groups";
                    } else if (label.includes("late")) {
                        iconName = "schedule";
                    } else if (label.includes("undertime")) {
                        iconName = "hourglass_bottom";
                    } else if (label.includes("absent")) {
                        iconName = "person_off";
                    }

                    return `
                        <div class="pink-box">
                            <div class="icon-wrapper">
                                <span class="material-symbols-outlined">${iconName}</span>
                            </div>
        
                            <div class="box-text">
                                <strong style="color: #000; font-size: 1.2rem;">${item.value}</strong>
                                <p style="color: rgba(8, 8, 8, 0.8); margin: 0;">${item.label}</p>
                            </div>
                        </div>
                    `;
                }).join('');
            }

        // ---Pie Chart ---
        const pie = document.getElementById('attendancePie');
        if (pie) {
            const present = tfData.rate; 
            pie.style.background = `conic-gradient(#b0005d 0% ${present}%, #ffc4dd ${present}% 100%)`;
            
            const pLabel = document.querySelector('.pie-label-present');
            if (pLabel) pLabel.textContent = `${present}%`;
        }

        // --- Attendance Text Description ---
        const desc = document.getElementById('attendanceDescription');
        if (desc) {
            desc.innerHTML = `Attendance for this period is <strong>${tfData.rate}%</strong> compared to the previous period's <strong>${tfData.prev_rate}%</strong>.`;
        }
    }

    // --- Dropdown Menu Logic ---
    const dropdown = document.getElementById('customDropdown');
    const menu = document.getElementById('dropdownMenu');
    const displayValue = document.getElementById('displayValue');

    if (dropdown && menu) {
        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
        });

        menu.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', (e) => {
                const choice = e.target.textContent.trim();
                if (displayValue) displayValue.textContent = choice;
                updateDynamicSections(choice.toLowerCase());
                menu.style.display = 'none';
            });
        });
    }

    window.onclick = () => {
        if (menu) menu.style.display = 'none';
    };

    function setEl(id, val) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = val;
    }

    fetchData();
});