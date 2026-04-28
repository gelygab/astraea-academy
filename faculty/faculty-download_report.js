document.addEventListener("DOMContentLoaded", () => {
    // 1. Grab parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const period = urlParams.get('period') || 'monthly'; // default to monthly

    // 2. Fetch from your existing API
    fetch(`api/api_get_faculty_details.php`)
        .then(response => response.json())
        .then(data => {
            console.log("Real DB Data received:", data);

            // Unpack the data
            const faculty = data.common.faculty_details;
            const timeframeData = data.timeframes[period.toLowerCase()];

            if (faculty) {
                // --- PROFILE SECTION ---
                if (document.getElementById("facultyName")) document.getElementById("facultyName").textContent = faculty.name;
                if (document.getElementById("course")) document.getElementById("course").textContent = faculty.department || faculty.college;
                if (document.getElementById("uid")) document.getElementById("uid").textContent = faculty.uid;
                if (document.getElementById("email")) document.getElementById("email").textContent = faculty.email;
            }

            if (timeframeData) {
                // --- ATTENDANCE TABLE SECTION ---
                let present = 0;
                let absent = 0;

                // Extract real numbers from the API's summary array
                timeframeData.summary.forEach(item => {
                    const label = item.label.toLowerCase();
                    if (label.includes("attendance")) {
                        // Format is usually "Present / Total" (e.g., "48 / 50")
                        if (typeof item.value === 'string' && item.value.includes('/')) {
                            present = parseInt(item.value.split('/')[0]) || 0;
                        } else {
                            present = parseInt(item.value) || 0;
                        }
                    }
                    if (label.includes("absent")) {
                        absent = parseInt(item.value) || 0;
                    }
                });

                // 1. FIX THE SCHOOL DAYS ROW (Static Academic Calendar)
                if (document.getElementById('school1')) document.getElementById('school1').textContent = 50;
                if (document.getElementById('school2')) document.getElementById('school2').textContent = 63;
                if (document.getElementById('school3')) document.getElementById('school3').textContent = 49;
                if (document.getElementById('schoolTotal')) document.getElementById('schoolTotal').textContent = 162;

                // 2. DYNAMIC PRESENT/ABSENT (Pulling real DB data)
                if (document.getElementById('present1')) document.getElementById('present1').textContent = present;
                if (document.getElementById('absent1')) document.getElementById('absent1').textContent = absent;

                // Zero out 2nd and 3rd Sem present/absent since DB doesn't split them yet
                for (let i = 2; i <= 3; i++) {
                    if (document.getElementById(`present${i}`)) document.getElementById(`present${i}`).textContent = 0;
                    if (document.getElementById(`absent${i}`)) document.getElementById(`absent${i}`).textContent = 0;
                }

                // Fill the TOTAL column with real DB data
                if (document.getElementById('presentTotal')) document.getElementById('presentTotal').textContent = present;
                if (document.getElementById('absentTotal')) document.getElementById('absentTotal').textContent = absent;
            }
        })
        .catch(error => {
            console.error("Failed to fetch database record:", error);
        });
});