document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. LIVE SEARCH FILTERING (Class List Page) ---
    const searchInput = document.getElementById("searchInput");
    const tableRows = document.querySelectorAll("#studentTable tbody tr");

    if (searchInput) {
        searchInput.addEventListener("keyup", function() {
            const filterValue = this.value.toLowerCase();

            tableRows.forEach(row => {
                // Target the 2nd column (index 1) which holds the Name
                const nameCell = row.cells[1].textContent.toLowerCase();
                
                if (nameCell.includes(filterValue)) {
                    row.style.display = ""; 
                } else {
                    row.style.display = "none"; 
                }
            });
        });
    }

    // --- 2. VIEW FULL RECORD NAVIGATION ---
    const viewButtons = document.querySelectorAll(".btn-view");
    viewButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Links to the new page we created
            window.location.href = 'facultydashboardVIEWRECORD.html';
        });
    });

    // --- 3. PROFILE PICTURE UPLOAD (View Record Page) ---
    const profileCircle = document.getElementById('profileCircle');
    const imageUpload = document.getElementById('imageUpload');
    const profileImg = document.getElementById('profileImg');

    if (profileCircle && imageUpload && profileImg) {
        // Clicking the circle triggers the hidden file input
        profileCircle.addEventListener('click', () => {
            imageUpload.click();
        });

        // Handle the file selection
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

    // --- 4. DOWNLOAD RECORD AS PDF (View Record Page) ---
    const downloadBtn = document.getElementById('downloadBtn');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            // Opens the browser print dialog (Save as PDF)
            window.print();
        });
    }

});