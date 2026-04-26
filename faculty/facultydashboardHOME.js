document.addEventListener('DOMContentLoaded', () => {
    let cachedData = null;

    function setDynamicEl(id, val) {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = val;
            el.classList.remove('loading');
        }
    }

    async function fetchData() {
        try {
            // Reverted back to the live API instead of the static JSON file
            const response = await fetch('api/api_get_faculty_details.php');
            if (!response.ok) throw new Error("JSON file missing or server not running");
            cachedData = await response.json();

            const { common } = cachedData;

            // LOAD FACULTY PROFILE 
            setDynamicEl('facultyName', common.faculty_details.name);
            setDynamicEl('uid-val', common.faculty_details.uid);
            setDynamicEl('college-val', common.faculty_details.college);
            setDynamicEl('dept-val', common.faculty_details.department);
            setDynamicEl('email-val', common.faculty_details.email);

            // LOAD HANDLED SUBJECTS 
            const subjectList = document.getElementById('subject-list');
            if (subjectList) {
                subjectList.innerHTML = common.subjects.map(s => `
                    <li><span class="subject-code">[${s.code}]</span> <span>${s.name}</span></li>
                `).join('');
                subjectList.classList.remove('loading');
                setDynamicEl('subject-count', common.subjects.length);
            }

            // LOAD CURRENT CLASS STATS 
            if (common.current_class) {
                const cc = common.current_class;
                setDynamicEl('curr-class', cc.name);
                setDynamicEl('curr-enrolled', cc.enrolled);
                setDynamicEl('curr-present', cc.present);
                setDynamicEl('curr-pending', cc.pending === 0 ? "NONE" : cc.pending);

                setDynamicEl('live-class-badge', cc.code);
            }

            // INITIALIZE DEFAULT VIEW (This will now also draw the feed table!)
            updateDynamicSections('daily');

        } catch (error) {
            console.error("Dashboard Load Failed:", error);
            setDynamicEl('facultyName', "Connection Error");
        }
    }

    function updateDynamicSections(timeframe) {
        if (!cachedData || !cachedData.timeframes[timeframe]) return;

        // 1. DEFINE tfData FIRST!
        const tfData = cachedData.timeframes[timeframe];

        // --- UPDATE TOP SUMMARY BOXES ---
        const summaryContainer = document.getElementById('summaryBoxes');
        if (summaryContainer) {
            summaryContainer.innerHTML = tfData.summary.map(item => {
                const label = item.label.toLowerCase();
                let icon = "star";
                if (label.includes("attendance")) icon = "groups";
                else if (label.includes("late")) icon = "schedule";
                else if (label.includes("undertime")) icon = "hourglass_bottom";
                else if (label.includes("absent")) icon = "person_off";

                return `
                    <div class="pink-box">
                        <div class="icon-wrapper"><span class="material-symbols-outlined">${icon}</span></div>
                        <div class="box-text">
                            <strong>${item.value}</strong>
                            <p>${item.label}</p>
                        </div>
                    </div>`;
            }).join('');
            summaryContainer.classList.remove('loading');
        }

        // --- UPDATE ATTENDANCE RATE CARD & PIE ---
        const presentRate = tfData.rate;
        const absentRate = 100 - presentRate;

        // Header and basic stats
        setDynamicEl('periodLabel', tfData.period_label);
        const statsValue = tfData.summary[0].value;
        if (statsValue.includes('/')) {
            const parts = statsValue.split('/');
            setDynamicEl('present-val', `${parts[0].trim()} Days`);
            setDynamicEl('total-val', `${parts[1].trim()} Days`);
        }

        // Pie Chart Visuals 
        const pie = document.getElementById('attendancePie');
        if (pie) {
            pie.classList.remove('loading');
            pie.style.setProperty('--absent-percent', absentRate);
            pie.style.background = `conic-gradient(var(--lightpink) 0% ${absentRate}%, var(--purple) ${absentRate}% 100%)`;
            document.getElementById('absentPercent').textContent = absentRate + "%";
            document.getElementById('presentPercent').textContent = presentRate + "%";
        }

        const absentEl = document.getElementById('absentPercent');
        if (absentEl) {
            absentEl.textContent = absentRate + "%";
            absentEl.style.display = absentRate === 0 ? 'none' : 'block';
        }

        // Feedback Text 
        const feedbackTitle = 
             presentRate >= 90 ? "Excellent!" :
             presentRate >= 80 ? "Good Attendance!" :
             presentRate >= 70 ? "Room for Improvement" : "Low Attendance Alert";
             
        const feedbackDesc = 
             presentRate >= 90 ? `Outstanding! Your classes have maintained a high attendance rate of  ${presentRate}% for ${tfData.period_label.toLowerCase()}.` :
             presentRate >= 80 ? `Class attendance is stable at ${presentRate}% for ${tfData.period_label.toLowerCase()}. Keep monitoring for any sudden drops.` :
             presentRate >= 70 ? `Class attendance is dipping to ${presentRate}% for ${tfData.period_label.toLowerCase()}. You may want to check in with frequently absent students.` : 
             `Class attendance is currently at (${presentRate}%) for ${tfData.period_label.toLowerCase()}. Please review your records and remind students of the attendance policy.`;

        setDynamicEl('feedbackTitle', feedbackTitle);
        setDynamicEl('attendanceDescription', feedbackDesc);

        const feedbackContainer = document.querySelector('.attendance-feedback');
        if (feedbackContainer) feedbackContainer.classList.remove('loading');

        // --- UPDATE LIVE FEED TABLE (THE SMART SWITCH) ---
        // The Live Feed should ALWAYS show the ongoing class, regardless of the dropdown!
        let activeFeedArray = cachedData.common.feed_daily || [];

        const feedBody = document.getElementById('feed-body');
        if (feedBody) {
            // Check if there are actually records to show
            if (activeFeedArray.length > 0) {
                feedBody.innerHTML = activeFeedArray.map(f => `
                    <tr>
                        <td class="col-name">${f.name}</td>
                        <td class="col-time">${f.time}</td>
                        <td><span class="status-pill ${f.status === 'On-Time' ? 'On-Time' : 'Late'}">${f.status}</span></td>
                    </tr>
                `).join('');
            } else {
                feedBody.innerHTML = `<tr><td colspan="3" style="text-align: center; padding: 20px;">No attendance records found for this view.</td></tr>`;
            }
            feedBody.classList.remove('loading');
        }
    }

    // --- DROPDOWN MENU LOGIC ---
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

    window.onclick = () => { if (menu) menu.style.display = 'none'; };

    fetchData();
});