// This will hold ALL of the teacher's schedules in memory
let allSchedules = [];

// A single "Dictionary" function to translate IDs perfectly
function getProgramName(id) {
    if (id === null || id === undefined) return 'Unknown'; // Safety net!
    const safeId = String(id).trim(); 
    if (safeId === '1') return 'BSCE';
    if (safeId === '2') return 'BSChE';
    if (safeId === '3') return 'BSCpE';
    if (safeId === '4') return 'BSEE';
    if (safeId === '5') return 'BSECE';
    if (safeId === '6') return 'BSME';
    if (safeId === '7') return 'BSMFGE';
    return safeId; 
}

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. page starts
    loadSubjects();

    const subjectDropdown = document.getElementById('subjectDropdown');
    const programDropdown = document.getElementById('programDropdown');
    const blockDropdown = document.getElementById('blockDropdown');
    const displayText = document.getElementById('displayText');

    // --- STEP 1: SUBJECT TRIGGER ---
    if (subjectDropdown) {
        subjectDropdown.addEventListener('change', function() {
            sessionStorage.setItem('savedSubject', this.value);
            sessionStorage.removeItem('savedProgram');
            sessionStorage.removeItem('savedBlock');
            const selectedSubject = this.value;
            
            // Find all schedules that teach this exact subject
            const matchingSchedules = allSchedules.filter(s => s.subject_name === selectedSubject);

            // Populate the Program dropdown
            const uniquePrograms = [...new Set(matchingSchedules.map(s => s.department_id))];
            programDropdown.innerHTML = '<option value="" disabled selected hidden>Select a program</option>';
            uniquePrograms.forEach(progId => {
                // Ignore empty database rows so we don't print blanks
                if(progId) {
                    programDropdown.innerHTML += `<option value="${progId}">${getProgramName(progId)}</option>`;
                }
            });

            // Empty the Block dropdown until they pick a program!
            blockDropdown.innerHTML = '<option value="" disabled selected hidden>Select a program first</option>';
            
            // Reset the banner and table
            displayText.textContent = `Please select a Program...`;
            document.querySelector("#studentTable tbody").innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px; font-style:italic; color:#555;">Awaiting selection...</td></tr>';
        });
    }

    // --- STEP 2: PROGRAM TRIGGER ---
    if (programDropdown) {
        programDropdown.addEventListener('change', function() {
            sessionStorage.setItem('savedProgram', this.value);
            sessionStorage.removeItem('savedBlock');
            const selectedSubject = subjectDropdown.value;
            const selectedProgram = this.value;

            // Find schedules for this exact Subject AND Program combo
            const matchingSchedules = allSchedules.filter(s => s.subject_name === selectedSubject && s.department_id == selectedProgram);

            // NOW populate the Block dropdown with ONLY the valid blocks for this specific program!
            const uniqueBlocks = [...new Set(matchingSchedules.map(s => s.student_block))];
            blockDropdown.innerHTML = '<option value="" disabled selected hidden>Select a block</option>';
            uniqueBlocks.forEach(block => {
                if(block) {
                    blockDropdown.innerHTML += `<option value="${block}">Block ${block}</option>`;
                }
            });

            displayText.textContent = `Please select a Block...`;
            document.querySelector("#studentTable tbody").innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px; font-style:italic; color:#555;">Please select a Block to view students.</td></tr>';
        });
    }

    // --- STEP 3: BLOCK TRIGGER (Load the Table!) ---
    if (blockDropdown) {
        blockDropdown.addEventListener('change', function() {
            sessionStorage.setItem('savedBlock', this.value);
            const subj = subjectDropdown.value;
            const prog = programDropdown.value;
            const blk = this.value;

            // Find the ONE exact schedule for this combo
            const schedule = allSchedules.find(s => s.subject_name === subj && s.department_id == prog && s.student_block == blk);

            if (schedule) {
                // Format the Banner
                const finalProgName = getProgramName(schedule.department_id);
                displayText.textContent = `${finalProgName} ${schedule.student_year}-${schedule.student_block} | Subject: ${schedule.subject_name}`;

                // Load the students into the table!
                loadClassList(schedule.schedule_id);
            }
        });
    }

    // --- TABLE SEARCH & SORT LOGIC ---
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("keyup", function() {
            const filterValue = this.value.toLowerCase();
            const currentRows = document.querySelectorAll("#studentTable tbody tr");
            currentRows.forEach(row => {
                if (row.cells.length === 1) return; 
                const nameCell = row.cells[1].textContent.toLowerCase();
                row.style.display = nameCell.includes(filterValue) ? "" : "none";
            });
        });
    }

    const sortLinks = document.querySelectorAll(".sort-dropdown a");
    sortLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const criteria = link.textContent.trim();
            const tableBody = document.querySelector("#studentTable tbody");
            if (!tableBody) return;

            let rowsToSort = Array.from(tableBody.querySelectorAll("tr"));
            if (rowsToSort.length === 0 || rowsToSort[0].cells.length === 1) return;

            rowsToSort.sort((a, b) => {
                const valA = a.cells;
                const valB = b.cells;
                switch (criteria) {
                    case "Student Name (A-Z)": return valA[1].textContent.localeCompare(valB[1].textContent);
                    case "Student Name (Z-A)": return valB[1].textContent.localeCompare(valA[1].textContent);
                    case "Attendance: Highest to Lowest": return parseInt(valB[2].textContent) - parseInt(valA[2].textContent);
                    case "Attendance: Lowest to Lowest": return parseInt(valA[2].textContent) - parseInt(valB[2].textContent);
                    case "Student ID: Ascending": return valA[0].textContent.localeCompare(valB[0].textContent);
                    case "Student ID: Descending": return valB[0].textContent.localeCompare(valA[0].textContent);
                    default: return 0;
                }
            });

            tableBody.innerHTML = "";
            rowsToSort.forEach(row => tableBody.appendChild(row));
        });
    });

    // --- OTHER UI LOGIC ---
    const profileCircle = document.getElementById('profileCircle');
    const imageUpload = document.getElementById('imageUpload');
    const profileImg = document.getElementById('profileImg');

    if (profileCircle && imageUpload && profileImg) {
        profileCircle.addEventListener('click', () => imageUpload.click());
        imageUpload.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => profileImg.src = e.target.result;
                reader.readAsDataURL(file);
            }
        });
    }
});

// --- SMART FUNCTIONS ---

function loadSubjects() {
    fetch('faculty/faculty_api/api_get_subjects.php')
        .then(response => response.json())
        .then(data => {
            allSchedules = data; 
            const subjectDropdown = document.getElementById('subjectDropdown'); 
            
            if (subjectDropdown) {
                subjectDropdown.innerHTML = '<option value="" disabled selected hidden>Select a subject</option>';

                const uniqueSubjects = [...new Set(data.map(item => item.subject_name))];

                uniqueSubjects.forEach(subjectName => {
                    const option = document.createElement('option');
                    option.value = subjectName; 
                    option.textContent = subjectName;
                    subjectDropdown.appendChild(option);
                });

                const prevPage = document.referrer.toLowerCase();
                if (!prevPage.includes('viewrecord') && !prevPage.includes('classlist')) {
                    sessionStorage.removeItem('savedSubject');
                    sessionStorage.removeItem('savedProgram');
                    sessionStorage.removeItem('savedBlock');
                }


                const savedSubject = sessionStorage.getItem('savedSubject');
                const savedProgram = sessionStorage.getItem('savedProgram');
                const savedBlock = sessionStorage.getItem('savedBlock');

                if (savedSubject) {
                    subjectDropdown.value = savedSubject;
                    subjectDropdown.dispatchEvent(new Event('change'));

                    if (savedProgram) {
                        const programDropdown = document.getElementById('programDropdown');
                        programDropdown.value = savedProgram;
                        programDropdown.dispatchEvent(new Event('change'));

                        if (savedBlock) {
                            const blockDropdown = document.getElementById('blockDropdown');
                            blockDropdown.value = savedBlock;
                            blockDropdown.dispatchEvent(new Event('change'));
                        }
                    }
                }
            }
        })
        .catch(error => console.error('Error fetching subjects:', error));
}

function loadClassList(scheduleId) {
    fetch(`faculty/faculty_api/api_get_class_list.php?schedule_id=${scheduleId}`)
        .then(response => response.json())
        .then(students => {
            const tableBody = document.querySelector("#studentTable tbody");
            if (!tableBody) return;

            tableBody.innerHTML = '';

            if (students.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px; font-style:italic; color:#555;">No students found for this block.</td></tr>';
                return;
            }

            students.forEach(student => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${student.user_uid}</td>
                    <td>${student.last_name}, ${student.first_name}</td>
                    <td>${student.total_attendance}</td>
                    <td class="action-cell" style>
                        <button class="btn-action btn-view" onclick="viewFullRecord('${student.user_uid}')">View Full Record</button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        })
        .catch(error => console.error('Error fetching class list:', error));
}

function viewFullRecord(studentUid) {
    window.location.href = `facultydashboardVIEWRECORD.php?uid=${studentUid}`;
}