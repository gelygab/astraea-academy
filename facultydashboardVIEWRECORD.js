document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Get the UID from the URL (e.g., ?uid=2024-11025)
    const urlParams = new URLSearchParams(window.location.search);
    const studentUid = urlParams.get('uid');

    if (studentUid) {
        // 2. Fetch the specific student's data
        fetch(`faculty/faculty_api/api_get_student_record.php?uid=${studentUid}`)
            .then(response => response.json())
            .then(student => {
                if (student.error) {
                    alert("Student not found!");
                    return;
                }

                // Translate Department ID to text (e.g., 3 -> BSCpE)
                let programName = student.department_id;
                if (programName == 1) programName = 'BSCE';
                if (programName == 2) programName = 'BSChE';
                if (programName == 3) programName = 'BSCpE';
                if (programName == 4) programName = 'BSEE';
                if (programName == 5) programName = 'BSECE';
                if (programName == 6) programName = 'BSME';
                if (programName == 7) programName = 'BSMFGE';
               
                // --- NEW: Add the correct suffix to the Year ---
                let yearSuffix = "th";
                if (student.student_year == '1' || student.student_year == 1) yearSuffix = "st";
                if (student.student_year == '2' || student.student_year == 2) yearSuffix = "nd";
                if (student.student_year == '3' || student.student_year == 3) yearSuffix = "rd";
                
                let formattedYear = `${student.student_year}${yearSuffix}`;
                // ----------------------------------------------

                // 3. Inject the data into the HTML!
                document.getElementById('studentName').textContent = `${student.first_name} ${student.last_name}`;
                
                // Use our new formattedYear here!
                document.getElementById('studentProgram').textContent = `${formattedYear} Year - ${programName}`;
                
                document.getElementById('studentUidDisplay').textContent = student.user_uid;
                document.getElementById('studentContact').textContent = student.student_contact || 'N/A';
                document.getElementById('studentEmail').textContent = student.student_email || 'N/A';
                document.getElementById('studentAddress').textContent = student.student_address || 'N/A';
            })
            .catch(error => console.error('Error fetching student record:', error));
    } else {
        document.getElementById('studentName').textContent = "Error: No Student Selected";
    }

    // --- DOWNLOAD RECORD LOGIC ---
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            window.print();
        });
    }
});