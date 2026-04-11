<<<<<<< HEAD
=======
const API_CONFIG = {
    baseUrl: '',

    endpoints: {
        getFacultyData: 'get_faculty_dashboard.php'
    }
}

>>>>>>> d3ff2428b92856f108ec1c089886e9e8fa535d26
document.addEventListener('DOMContentLoaded', () => {
    let cachedData = null;

    async function fetchData() {
        try {
<<<<<<< HEAD
            const response = await fetch('faculty_data.json');
            if (!response.ok) throw new Error("JSON file missing or server not running");
            cachedData = await response.json();

            const { common } = cachedData;

            // Load Faculty Info
            setEl('facultypfp', common.faculty_details.pfp);
=======
            const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getFacultyData}?uid=${CURRENT_USER_UID}`;
            console.log("Fetching data for ID:", CURRENT_USER_UID);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) throw new Error("Fetch failed");
            
            cachedData = await response.json();
            console.log(cachedData);
            
            const { common } = cachedData;

            // 1. Profile Info
>>>>>>> d3ff2428b92856f108ec1c089886e9e8fa535d26
            setEl('facultyName', common.faculty_details.name);
            setEl('uid-val', common.faculty_details.uid);
            setEl('college-val', common.faculty_details.college);
            setEl('dept-val', common.faculty_details.department);
            setEl('email-val', common.faculty_details.email);

<<<<<<< HEAD
            // Load Handled Subjects
=======
            // 2. Class Stats 
            console.log("Current Class Name is:", common.current_class.name);
            setEl('curr-class', common.current_class.name);
            setEl('curr-enrolled', common.current_class.enrolled);
            setEl('curr-present', common.current_class.present);
            setEl('curr-pending', common.current_class.pending);
            setEl('feed-subject-tab', common.current_class.name);

            // 3. Subjects List
>>>>>>> d3ff2428b92856f108ec1c089886e9e8fa535d26
            const subjectList = document.getElementById('subject-list');
            if (subjectList) {
                subjectList.innerHTML = common.subjects.map(s => `
                    <li><span class="subject-code">[${s.code}]</span> <span>${s.name}</span></li>
                `).join('');
                setEl('subject-count', common.subjects.length);
            }

<<<<<<< HEAD
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

=======
            // 4. THE LIVE FEED 
            const feedBody = document.getElementById('feed-body');
            if (feedBody && common.live_feed) {
                console.log("Injecting students into table...");
                feedBody.innerHTML = common.live_feed.map(student => `
                    <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                        <td style="padding: 15px; color: #5a1832; font-weight: 600;">${student.name}</td>
                        <td style="padding: 15px; color: #5a1832; text-align: center;">${student.time}</td>
                        <td style="padding: 15px; text-align: right;">
                            <span style="background: #5a1832; color: white; padding: 5px 15px; border-radius: 20px; font-size: 11px; font-weight: bold;">
                                ${student.status}
                            </span>
                        </td>
                    </tr>
                `).join('');
            }

            // 5. Summary Boxes and Pie Chart
            updateDynamicSections('daily');

        } catch (error) {
            console.error("Critical Error:", error);
        }
    }

    function updateDynamicSections(timeframe) {
        if (!cachedData || !cachedData.timeframes[timeframe]) return;
        const data = cachedData.timeframes[timeframe];

        setEl('summaryBoxes', data.summary.map(item => `
            <div class="pink-box">
                <span class="material-symbols-outlined">star</span>
                <div class="box-text">
                    <strong>${item.value}</strong>
                    <p>${item.label}</p>
                </div>
            </div>
        `).join(''));

        const pie = document.getElementById('attendancePie');
        if (pie) {
            pie.style.background = `conic-gradient(#b0005d 0% ${data.rate}%, #ed3481 ${data.rate}% 100%)`;
            const pLabel = document.querySelector('.pie-label-present');
            if (pLabel) pLabel.textContent = `${data.rate}%`;
        }
    }

>>>>>>> d3ff2428b92856f108ec1c089886e9e8fa535d26
    function setEl(id, val) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = val;
    }

    fetchData();
<<<<<<< HEAD
=======

    // DROPDOWN
    const dropdown = document.getElementById('customDropdown');
    const displayValue = document.getElementById('displayValue');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (dropdown && displayValue && dropdownMenu) {
        displayValue.parentElement.addEventListener('click', () => {
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });

        dropdownMenu.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', (e) => {
                const selectedText = e.target.innerText; // "Daily", "Weekly", "Monthly"
                displayValue.innerText = selectedText;   
                dropdownMenu.style.display = 'none';    
                
                updateDynamicSections(selectedText.toLowerCase()); 
            });
        });

        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdownMenu.style.display = 'none';
            }
        });
    }

    // DOWNLOAD BUTTON
const downloadBtn = document.querySelector('.download-btn');

if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        const facultyName = document.getElementById('facultyName').innerText;
        const currentClass = document.getElementById('curr-class').innerText;
        const rows = document.querySelectorAll('#feed-body tr');
        
        let studentData = "STUDENT NAME          | TIME IN    | STATUS\n";
        studentData += "--------------------------------------------------\n";

        rows.forEach(row => {
            const name = row.cells[0].innerText.padEnd(20);
            const time = row.cells[1].innerText.padEnd(10);
            const status = row.cells[2].innerText;
            studentData += `${name} | ${time} | ${status}\n`;
        });

        const reportContent = `
ASTRAEA ACADEMY - ATTENDANCE REPORT
Generated on: ${new Date().toLocaleString()}
--------------------------------------------------
Faculty: ${facultyName}
Subject: ${currentClass}

${studentData}
--------------------------------------------------
END OF REPORT
        `;

        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Attendance_Report_${currentClass}.txt`;
        a.click();
    });
}

// PFP CLICK: Profile picture is not supported in the current database schema...
const pfpCircle = document.querySelector('.pfp-circle');
const pfpInput = document.getElementById('pfpInput');

if (pfpCircle && pfpInput) {
    pfpCircle.title = "Change or Add Profile Picture"; 

    pfpCircle.onclick = function() {
        pfpInput.click();
    };

    pfpInput.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                pfpCircle.style.backgroundImage = `url('${event.target.result}')`;
                pfpCircle.style.backgroundSize = 'cover';
                pfpCircle.style.backgroundPosition = 'center';
            };
            reader.readAsDataURL(file);
        }
    };
}
>>>>>>> d3ff2428b92856f108ec1c089886e9e8fa535d26
});