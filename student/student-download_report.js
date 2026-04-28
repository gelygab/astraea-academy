document.addEventListener("DOMContentLoaded", () => {
    // 1. Grab the UID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const studentUid = urlParams.get('uid');

    if (studentUid) {
        // 2. Fetch the REAL data from your existing API
        fetch(`/astraea-academy/faculty/api/api_get_full_record.php?uid=${studentUid}`)
            .then(response => response.json())
            .then(dbData => {
                console.log("Real DB Data received:", dbData);
                
                // Unpack the data
                const profile = Array.isArray(dbData) ? dbData[0].profile : dbData.profile;
                const stats = Array.isArray(dbData) ? dbData[0].attendance_summary : dbData.attendance_summary;
                
                if (profile) {
                    // --- PROFILE SECTION ---
                    document.getElementById("studentName").textContent = `${profile.first_name} ${profile.last_name}`;
                    document.getElementById("uid").textContent = studentUid;
                    document.getElementById("contact").textContent = profile.student_contact || "N/A";
                    document.getElementById("email").textContent = profile.student_email || "N/A";
                    document.getElementById("address").textContent = profile.student_address || "N/A";
                    
                    // Translate Department ID to Full Course Name
                    let programName = profile.department_id;
                    if (programName == 1) programName = "BS Civil Engineering";
                    if (programName == 2) programName = "BS Chemical Engineering";
                    if (programName == 3) programName = "BS Computer Engineering";
                    if (programName == 4) programName = "BS Electrical Engineering";
                    if (programName == 5) programName = "BS Electronics Engineering";
                    if (programName == 6) programName = "BS Mechanical Engineering";
                    if (programName == 7) programName = "BS Manufacturing Engineering";
                    
                    const courseEl = document.getElementById("course");
                    if (courseEl) courseEl.textContent = programName || "Unknown Course";
                    
                    // Add the 'st', 'nd', 'rd', 'th' suffix to the year
                    let yearNum = profile.student_year;
                    let yearStr = yearNum ? yearNum + "th" : "N/A";
                    if (yearNum == 1) yearStr = "1st";
                    if (yearNum == 2) yearStr = "2nd";
                    if (yearNum == 3) yearStr = "3rd";
                    
                    const yearBlockEl = document.getElementById("yearBlock");
                    if (yearBlockEl) yearBlockEl.textContent = `${yearStr} Year - Block ${profile.student_block || 'N/A'}`;
                }

                if (stats) {
                    // --- ATTENDANCE TABLE SECTION ---
                    const present = parseInt(stats.Present) || 0;
                    const absent = parseInt(stats.Absent) || 0;
                    
                    // 1. FIX THE SCHOOL DAYS ROW (Static Academic Calendar)
                    if(document.getElementById('school1')) document.getElementById('school1').textContent = 50;
                    if(document.getElementById('school2')) document.getElementById('school2').textContent = 63;
                    if(document.getElementById('school3')) document.getElementById('school3').textContent = 49;
                    if(document.getElementById('schoolTotal')) document.getElementById('schoolTotal').textContent = 162;

                    // 2. DYNAMIC PRESENT/ABSENT (Pulling real DB data)
                    if(document.getElementById('present1')) document.getElementById('present1').textContent = present;
                    if(document.getElementById('absent1')) document.getElementById('absent1').textContent = absent;

                    // Zero out 2nd and 3rd Sem present/absent since DB doesn't split them yet
                    for(let i = 2; i <= 3; i++) {
                        if(document.getElementById('present'+i)) document.getElementById('present'+i).textContent = 0;
                        if(document.getElementById('absent'+i)) document.getElementById('absent'+i).textContent = 0;
                    }

                    // Totals for Present/Absent
                    if(document.getElementById('presentTotal')) document.getElementById('presentTotal').textContent = present;
                    if(document.getElementById('absentTotal')) document.getElementById('absentTotal').textContent = absent;
                }   
            })
            .catch(error => {
                console.error("Failed to fetch database record:", error);
            });
    } else {
        alert("No student ID found in URL!");
    }
});