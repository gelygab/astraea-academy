// Calendar variables
let currentDate = new Date();
let selectedDate = null;
let activeInputField = null;

// Month names
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set default dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    document.getElementById('startDate').value = formatDate(today);
    document.getElementById('endDate').value = formatDate(tomorrow);
    document.getElementById('returnDate').value = formatDate(dayAfterTomorrow);
    
    // Calculate initial days
    calculateDays();
    
    // Add event listeners for date inputs
    document.getElementById('startDate').addEventListener('click', function() {
        openCalendar('startDate');
    });
    
    document.getElementById('endDate').addEventListener('click', function() {
        openCalendar('endDate');
    });
    
    // Form submission
    document.getElementById('leaveForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitForm();
    });
    
    // Close calendar when clicking outside
    document.getElementById('calendarModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeCalendar();
        }
    });
    
    // Handle date changes
    document.getElementById('startDate').addEventListener('change', calculateDays);
    document.getElementById('endDate').addEventListener('change', calculateDays);
});

// Format date to "Feb 23, 2026"
function formatDate(date) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Parse date from string
function parseDate(dateStr) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const parts = dateStr.split(' ');
    const month = monthNames.indexOf(parts[0]);
    const day = parseInt(parts[1].replace(',', ''));
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
}

// Calculate number of days and return date
function calculateDays() {
    const startDateStr = document.getElementById('startDate').value;
    const endDateStr = document.getElementById('endDate').value;
    
    if (startDateStr && endDateStr) {
        const startDate = parseDate(startDateStr);
        const endDate = parseDate(endDateStr);
        
        // Calculate difference in days
        const diffTime = endDate - startDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        if (diffDays > 0) {
            document.getElementById('numDays').value = diffDays === 1 ? '1 day' : `${diffDays} days`;
            
            // Calculate return date (day after end date)
            const returnDate = new Date(endDate);
            returnDate.setDate(returnDate.getDate() + 1);
            document.getElementById('returnDate').value = formatDate(returnDate);
        } else {
            document.getElementById('numDays').value = 'Invalid dates';
            document.getElementById('returnDate').value = '';
        }
    }
}

// Open calendar modal
function openCalendar(inputId) {
    activeInputField = inputId;
    const modal = document.getElementById('calendarModal');
    modal.classList.add('active');
    
    // Set current date from input if exists
    const inputValue = document.getElementById(inputId).value;
    if (inputValue) {
        currentDate = parseDate(inputValue);
    }
    
    renderCalendar();
}

// Close calendar modal
function closeCalendar() {
    const modal = document.getElementById('calendarModal');
    modal.classList.remove('active');
    activeInputField = null;
}

// Change month
function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar();
}

// Render calendar
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update header
    document.getElementById('calendarMonthYear').textContent = `${monthNames[month]} ${year}`;
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day other-month';
        dayDiv.textContent = daysInPrevMonth - i;
        calendarDays.appendChild(dayDiv);
    }
    
    // Current month days
    const today = new Date();
    const selectedDateValue = activeInputField ? document.getElementById(activeInputField).value : null;
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.textContent = day;
        
        // Check if today
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayDiv.classList.add('today');
        }
        
        // Check if selected
        if (selectedDateValue) {
            const selected = parseDate(selectedDateValue);
            if (day === selected.getDate() && month === selected.getMonth() && year === selected.getFullYear()) {
                dayDiv.classList.add('selected');
            }
        }
        
        dayDiv.addEventListener('click', function() {
            selectDate(year, month, day);
        });
        
        calendarDays.appendChild(dayDiv);
    }
    
    // Next month days
    const remainingCells = 42 - (firstDay + daysInMonth);
    for (let i = 1; i <= remainingCells; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day other-month';
        dayDiv.textContent = i;
        calendarDays.appendChild(dayDiv);
    }
}

// Select date from calendar
function selectDate(year, month, day) {
    const selectedDate = new Date(year, month, day);
    const formattedDate = formatDate(selectedDate);
    
    if (activeInputField) {
        document.getElementById(activeInputField).value = formattedDate;
        calculateDays();
    }
    
    closeCalendar();
}

// Cancel form
function cancelForm() {
    if (confirm('Are you sure you want to cancel?')) {
        window.location.href = 'studentdashboardHOME.html';
    }
}

// Submit form
function submitForm() {
    const timeType = document.getElementById('timeType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const numDays = document.getElementById('numDays').value;
    const returnDate = document.getElementById('returnDate').value;
    const comment = document.getElementById('comment').value;
    
    // Validate
    if (!startDate || !endDate) {
        alert('Please select both start and end dates.');
        return;
    }
    
    // Show success message (placeholder for backend integration)
    alert(`Leave Application Submitted!\n\nType: ${timeType}\nFrom: ${startDate}\nTo: ${endDate}\nDays: ${numDays}\nReturn: ${returnDate}`);
    
    // Reset form
    document.getElementById('leaveForm').reset();
    
    // Redirect to home
    window.location.href = 'studentdashboardHOME.html';
}

// Handle file upload display
document.getElementById('attachment').addEventListener('change', function() {
    const fileName = this.files[0] ? this.files[0].name : 'Upload';
    document.querySelector('.upload-text').textContent = fileName;
});
