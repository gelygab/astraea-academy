// list of multiple students
const students = [
    {
        id: 0,
        name: "Tricia Mae Zamora",
        uid: "09999999",
        contact: "09568608426",
        email: "tricia@astraea.edu",
        address: "123 Hotdog Kanto Street Caloocan",
        attendance: [
            { label: "Total Attendance", days: 20 },
            { label: "Late Attendance", days: 12 },
            { label: "Undertime Attendance", days: 5 },
            { label: "Total Absent", days: 3 }
        ],
        stats: { Attendance: 90, Late: 60, Undertime: 40, Absent: 25 }
    },
    {
        id: 1,
        name: "Rebecca Armstrong",
        uid: "08888888",
        contact: "09123456789",
        email: "rebecca@astraea.edu",
        address: "456 Burger Ave, Quezon City",
        attendance: [
            { label: "Total Attendance", days: 18 },
            { label: "Late Attendance", days: 2 },
            { label: "Undertime Attendance", days: 1 },
            { label: "Total Absent", days: 0 }
        ],
        stats: { Attendance: 100, Late: 10, Undertime: 5, Absent: 0 }
    }
];

// Download data function
function downloadData() {
    const studentName = document.getElementById('studentName').innerText;
    alert("Preparing download for: " + studentName);
}

// Period select change handler
document.addEventListener('DOMContentLoaded', function() {
    const periodSelect = document.getElementById('periodSelect');
    if (periodSelect) {
        periodSelect.addEventListener('change', (e) => {
            console.log("Selected period: " + e.target.value);
            // Update the class days text based on selection
            const classDaysText = document.querySelector('.class-days p');
            if (classDaysText) {
                classDaysText.textContent = `Class days for ${e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)}`;
            }
        });
    }
});

// Render the dashboard based on a specific student index
function renderDashboard(studentIndex) {
    const studentData = students[studentIndex];

    document.getElementById('studentName').innerText = studentData.name;
    document.getElementById('summaryTitle').innerText = `Summary - ${studentData.name}`;

    // Update Details Grid
    const detailsGrid = document.getElementById('studentDetailsGrid');
    detailsGrid.innerHTML = `
        <p><strong>UID:</strong><br>${studentData.uid}</p>
        <p><strong>Contact:</strong><br>${studentData.contact}</p>
        <p><strong>Email:</strong><br>${studentData.email}</p>
        <p><strong>Address:</strong><br>${studentData.address}</p>
    `;

    // Update Peach Cards
    const attendanceGrid = document.getElementById('attendanceGrid');
    attendanceGrid.innerHTML = studentData.attendance.map(item => `
        <div class="peach-box">
            <span class="material-symbols-outlined">star</span>
            <div class="box-content">
                <strong>${item.days} Days</strong>
                <p>${item.label}</p>
            </div>
        </div>
    `).join('');

    // Update Bar Chart
    const chart = document.getElementById('barChartContainer');
    const colors = ['#3498db', '#82cc00', '#f39c12', '#e74c3c'];
    const keys = ['Attendance', 'Late', 'Undertime', 'Absent'];

    chart.innerHTML = keys.map((key, index) => `
        <div class="bar-bg">
            <div class="bar-fill" style="height: ${studentData.stats[key]}%; background: ${colors[index]};">
                <span class="bar-label">${key}</span>
            </div>
        </div>
    `).join('');
}

// Default load first student
window.onload = () => renderDashboard(0);
