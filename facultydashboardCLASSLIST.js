document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. TABLE-BASED LOGIC (Search & Sort) ---
    const searchInput = document.getElementById("searchInput");
    const tableBody = document.querySelector("#studentTable tbody");

    // ONLY run this if the table exists (Prevents script crash on other pages)
    if (tableBody) {
        let tableRows = Array.from(tableBody.querySelectorAll("tr"));

        // Search Logic
        if (searchInput) {
            searchInput.addEventListener("keyup", function() {
                const filterValue = this.value.toLowerCase();
                tableRows.forEach(row => {
                    const nameCell = row.cells[1].textContent.toLowerCase();
                    row.style.display = nameCell.includes(filterValue) ? "" : "none";
                });
            });
        }

        // Sorting Logic
        const sortLinks = document.querySelectorAll(".sort-dropdown a");
        sortLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const criteria = link.textContent.trim();
                let rowsToSort = Array.from(tableBody.querySelectorAll("tr"));

                rowsToSort.sort((a, b) => {
                    const valA = a.cells;
                    const valB = b.cells;
                    switch (criteria) {
                        case "Student Name (A-Z)": return valA[1].textContent.localeCompare(valB[1].textContent);
                        case "Student Name (Z-A)": return valB[1].textContent.localeCompare(valA[1].textContent);
                        case "Attendance: Highest to Lowest": return parseInt(valB[2].textContent) - parseInt(valA[2].textContent);
                        case "Attendance: Lowest to Highest": return parseInt(valA[2].textContent) - parseInt(valB[2].textContent);
                        case "Student ID: Ascending": return valA[0].textContent.localeCompare(valB[0].textContent);
                        case "Student ID: Descending": return valB[0].textContent.localeCompare(valA[0].textContent);
                        default: return 0;
                    }
                });

                tableBody.innerHTML = "";
                rowsToSort.forEach(row => tableBody.appendChild(row));
                tableRows = Array.from(tableBody.querySelectorAll("tr"));
            });
        });
    }

    // --- 2. NAVIGATION ---
    const viewButtons = document.querySelectorAll(".btn-view");
    viewButtons.forEach(button => {
        button.addEventListener("click", () => {
            window.location.href = 'facultydashboardVIEWRECORD.html';
        });
    });

    // --- 3. PROFILE PICTURE UPLOAD ---
    const profileCircle = document.getElementById('profileCircle');
    const imageUpload = document.getElementById('imageUpload');
    const profileImg = document.getElementById('profileImg');

    if (profileCircle && imageUpload && profileImg) {
        profileCircle.addEventListener('click', () => imageUpload.click());

        imageUpload.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profileImg.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- 4. DOWNLOAD RECORD AS PDF ---
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            window.print();
        });
    }
});