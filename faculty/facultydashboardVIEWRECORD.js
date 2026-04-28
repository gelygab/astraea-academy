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

                // Unpack the different sections using the EXACT names from your console
                let profile = student.profile || student; 
                let stats = student.attendance_summary || {}; 
                let excuses = student.excuse_history || [];

                // --- PROFILE SECTION ---
                let programName = profile.department_id;
                if (programName == 1) programName = 'BSCE';
                if (programName == 2) programName = 'BSChE';
                if (programName == 3) programName = 'BSCpE';
                if (programName == 4) programName = 'BSEE';
                if (programName == 5) programName = 'BSECE';
                if (programName == 6) programName = 'BSME';
                if (programName == 7) programName = 'BSMFGE';
               
                let yearSuffix = "th";
                if (profile.student_year == '1' || profile.student_year == 1) yearSuffix = "st";
                if (profile.student_year == '2' || profile.student_year == 2) yearSuffix = "nd";
                if (profile.student_year == '3' || profile.student_year == 3) yearSuffix = "rd";
                
                let formattedYear = `${profile.student_year}${yearSuffix}`;

                document.getElementById('studentName').textContent = `${profile.first_name} ${profile.last_name}`;
                document.getElementById('studentProgram').textContent = `${formattedYear} Year - ${programName}`;
                document.getElementById('studentUidDisplay').textContent = profile.user_uid || studentUid;
                document.getElementById('studentContact').textContent = profile.student_contact || 'N/A';
                document.getElementById('studentEmail').textContent = profile.student_email || 'N/A';
                document.getElementById('studentAddress').textContent = profile.student_address || 'N/A';

                // --- STATS SECTION ---
                // Using the exact Capitalized names from your console output
                document.getElementById('statTotal').textContent = stats.Present || '0';
                document.getElementById('statLate').textContent = stats.Late || '0';
                document.getElementById('statUndertime').textContent = stats.Undertime || '0';
                document.getElementById('statAbsent').textContent = stats.Absent || '0';

                // --- EXCUSE HISTORY SECTION ---
                const excuseBody = document.getElementById('excuseBody');
                
                if (excuses.length > 0) {
                    excuseBody.innerHTML = ''; // Clear the "No excuses found" message
                    
                    excuses.forEach(excuse => {
                        const tr = document.createElement('tr');
                        
                        // Using the column names we saw in your PHP files earlier
                        tr.innerHTML = `
                            <td>${excuse.date_filed || excuse.start_date || 'N/A'}</td>
                            <td><span style="text-transform: capitalize;">${(excuse.time_type || excuse.category || 'N/A').replace('_', ' ')}</span></td>
                            <td><span style="text-transform: capitalize;">${excuse.status || 'Pending'}</span></td>
                            <td>${excuse.comment || excuse.remarks || 'None'}</td>
                        `;
                        excuseBody.appendChild(tr);
                    });
                }
          
            })
            .catch(error => console.error('Error fetching student record:', error));
    } else {
        document.getElementById('studentName').textContent = "Error: No Student Selected";
    }

// --- DOWNLOAD REPORT TRIGGER ---
    const downloadBtn = document.getElementById('downloadReportBtn');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            // Grab the specific student's UID from the URL
            const urlParams = new URLSearchParams(window.location.search);
            const studentUid = urlParams.get('uid');

            if (studentUid) {
                // Redirect to the PHP export file in the STUDENT folder
                window.location.href = `/astraea-academy/student/student-download_report.php?uid=${studentUid}`;
            } else {
                alert("Error: No student selected to download.");
            }
        });
    }
});