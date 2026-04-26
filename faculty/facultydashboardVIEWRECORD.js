document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Get the UID from the URL (e.g., ?uid=2024-11025)
    const urlParams = new URLSearchParams(window.location.search);
    const studentUid = urlParams.get('uid');

    if (studentUid) {
        // 2. Fetch the specific student's data
        fetch(`api/api_get_full_record.php?uid=${studentUid}`)
            .then(response => response.json())
            .then(studentData=> {
                console.log("Database sent this:", studentData);

                let student = Array.isArray(studentData) ? studentData [0] : studentData;

                if (!student || student.error) {
                    alert("Student not found!");
                    return;
                }

                let profile = student.profile;

                // Translate Department ID to text (e.g., 3 -> BSCpE)
                let programName = profile.department_id;
                if (programName == 1) programName = 'BSCE';
                if (programName == 2) programName = 'BSChE';
                if (programName == 3) programName = 'BSCpE';
                if (programName == 4) programName = 'BSEE';
                if (programName == 5) programName = 'BSECE';
                if (programName == 6) programName = 'BSME';
                if (programName == 7) programName = 'BSMFGE';
               
                // --- NEW: Add the correct suffix to the Year ---
                let yearSuffix = "th";
                if (profile.student_year == '1' || profile.student_year == 1) yearSuffix = "st";
                if (profile.student_year == '2' || profile.student_year == 2) yearSuffix = "nd";
                if (profile.student_year == '3' || profile.student_year == 3) yearSuffix = "rd";
                
                let formattedYear = `${profile.student_year}${yearSuffix}`;
                // ----------------------------------------------

                // 3. Inject the data into the HTML!
                document.getElementById('studentName').textContent = `${profile.first_name} ${profile.last_name}`;
                
                // Use our new formattedYear here!
                document.getElementById('studentProgram').textContent = `${formattedYear} Year - ${programName}`;
                
                document.getElementById('studentUidDisplay').textContent = profile.user_uid || studentUid;
                document.getElementById('studentContact').textContent = profile.student_contact || 'N/A';
                document.getElementById('studentEmail').textContent = profile.student_email || 'N/A';
                document.getElementById('studentAddress').textContent = profile.student_address || 'N/A';
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