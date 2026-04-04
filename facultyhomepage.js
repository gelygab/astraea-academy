document.addEventListener('DOMContentLoaded', () => {
    let cachedData = null;

    async function fetchData() {
        try {
            console.log("Fetching data for ID:", LOGGED_IN_TEACHER_ID);
            const response = await fetch(`FacultyHOMEPAGE_BACKEND.php?teacher_id=${LOGGED_IN_TEACHER_ID}`);
            cachedData = await response.json();
            
            const { common } = cachedData;

            // 1. Profile Info
            setEl('facultyName', common.faculty_details.name);
            setEl('uid-val', common.faculty_details.uid);
            setEl('college-val', common.faculty_details.college);
            setEl('dept-val', common.faculty_details.department);
            setEl('email-val', common.faculty_details.email);

            // 2. Class Stats 
            console.log("Current Class Name is:", common.current_class.name);
            setEl('curr-class', common.current_class.name);
            setEl('curr-enrolled', common.current_class.enrolled);
            setEl('curr-present', common.current_class.present);
            setEl('curr-pending', common.current_class.pending);
            setEl('feed-subject-tab', common.current_class.name);

            // 3. Subjects List
            const subjectList = document.getElementById('subject-list');
            if (subjectList) {
                subjectList.innerHTML = common.subjects.map(s => `
                    <li><span class="subject-code">[${s.code}]</span> <span>${s.name}</span></li>
                `).join('');
                setEl('subject-count', common.subjects.length);
            }

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

    function setEl(id, val) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = val;
    }

    fetchData();

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
});