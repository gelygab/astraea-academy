document.addEventListener('DOMContentLoaded', () => {
    
    // Get elements from the HTML
    const recordTypeSelect = document.getElementById('recordTypeSelect');
    const proceedStudentBtn = document.getElementById('proceedStudentBtn');
    const proceedMyBtn = document.getElementById('proceedMyBtn');

    // "Student Records" Proceed Button
    if (proceedStudentBtn) {
        proceedStudentBtn.addEventListener('click', () => {
            const selectedValue = recordTypeSelect.value;

            if (selectedValue === 'excuse') {
                // If they chose Excuse, send them to the Student Records page 
                window.location.href = 'facultydashboardSTUDENTRECORDS.html?tab=excuse';
                
            } else if (selectedValue === 'leave') {
                // If they chose Leave
                window.location.href = 'facultydashboardSTUDENTRECORDS.html?tab=leave';
                
            } else {
                // If they clicked proceed without choosing an option
                alert('Please select a request type first!');
            }
        });
    }

    // "My Records" Button
    if (proceedMyBtn) {
        proceedMyBtn.addEventListener('click', () => {
            // Send them straight to the My Records page
            window.location.href = 'facultydashboardRECORDS.html';
        });
    }

// This checks if we came from the Appeal History page
const urlParams = new URLSearchParams(window.location.search);
const requestedTab = urlParams.get('tab');

// If the URL says ?tab=leave, click the leave button automatically
if (requestedTab === 'leave') {
    const btnLeave = document.getElementById('btn-leave');
    if (btnLeave) {
        btnLeave.click(); 
    }
} 
// If the URL says ?tab=excuse, make sure excuse is active
else if (requestedTab === 'excuse') {
    const btnExcuse = document.getElementById('btn-excuse');
    if (btnExcuse) {
        btnExcuse.click();
    }
}

});