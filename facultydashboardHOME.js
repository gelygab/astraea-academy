document.addEventListener('DOMContentLoaded', () => {
    let cachedData = null;

    async function fetchData() {
        try {
            const response = await fetch('faculty_data.json');
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

            // Load Current Class Stats (Icons)
            if (cachedData.common.current_class) {
                const cc = cachedData.common.current_class;
                setEl('curr-class', cc.name);
                setEl('curr-enrolled', `${cc.enrolled} STUDENTS`);
                setEl('curr-present', `${cc.present} PRESENT`);
                const pendingText = cc.pending === 0 ? "NONE" : cc.pending;
                setEl('curr-pending', pendingText);
            }

            // Load Live Feed Table & Legend
            const feedBody = document.getElementById('feed-body');
            const feedContainer = document.querySelector('.white-table-container');

            if (feedBody) {
                // Generate Rows
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

    // --- Logic (Dropdown, Summary, Pie) ---
    function updateDynamicSections(timeframe) {
        if (!cachedData || !cachedData.timeframes[timeframe]) return;
        const data = cachedData.timeframes[timeframe];

        // Summary Boxes
        const summaryContainer = document.getElementById('summaryBoxes');
        if (summaryContainer) {
            summaryContainer.innerHTML = data.summary.map(item => `
                <div class="pink-box">
                    <span class="material-symbols-outlined">star</span>
                    <div class="box-text">
                        <strong>${item.value}</strong>
                        <p>${item.label}</p>
                    </div>
                </div>
            `).join('');
        }

        // Pie Chart & Percentage Labels
        const pie = document.getElementById('attendancePie');
        if (pie) {
            const present = data.rate; 
            const absent = 100 - present;
            pie.style.background = `conic-gradient(#b0005d 0% ${present}%, #ffc4dd ${present}% 100%)`;
            
            const pLabel = document.querySelector('.pie-label-present');
            if (pLabel) pLabel.textContent = `${present}%`;
        }

        // Attendance Text Description
        const desc = document.getElementById('attendanceDescription');
        if (desc) {
            desc.innerHTML = `Attendance for this period is <strong>${data.rate}%</strong> compared to the previous period's <strong>${data.prev_rate}%</strong>.`;
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

    // Helper function to update text safely
    function setEl(id, val) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = val;
    }

    fetchData();
});