// ==========================================
// Astraea Academy Admin Dashboard - Placeholder Version
// ==========================================

// Sidebar Navigation Toggle
function toggleNavGroup(button) {
    const navGroup = button.parentElement;
    navGroup.classList.toggle('open');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAttendanceChart();
    initClassDaysChart();
    loadDashboardData();
    initLogoutHandler();
});

// ==========================================
// Replace these with API calls in production
// ==========================================

const MOCK_ADMIN_PROFILE = {
    name: 'Alexandra Quero',
    uid: '09999999',
    contactNumber: '09568608426',
    email: 'heheheha@email.com',
    address: '123 Hotdog Kanto Street Caloocan'
};

const MOCK_DASHBOARD_STATS = {
    totalStudents: 10,
    totalFaculty: 5,
    totalColleges: 3,
    totalDepartments: 15,
    leaveRequests: 5,
    excuseRequests: 2
};

const MOCK_ATTENDANCE_DATA = {
    departments: [
        { code: 'CE', name: 'Civil Engineering', rate: 92 },
        { code: 'CHE', name: 'Chemical Engineering', rate: 88 },
        { code: 'CPE', name: 'Computer Engineering', rate: 95 },
        { code: 'EE', name: 'Electrical Engineering', rate: 87 },
        { code: 'ECE', name: 'Electronics Engineering', rate: 90 },
        { code: 'ME', name: 'Mechanical Engineering', rate: 85 },
        { code: 'MFGE', name: 'Manufacturing Engineering', rate: 83 },
        { code: 'ECED', name: 'Early Childhood Education', rate: 94 },
        { code: 'EED', name: 'Elementary Education', rate: 91 },
        { code: 'PED', name: 'Physical Education', rate: 89 },
        { code: 'SED', name: 'Secondary Education', rate: 86 },
        { code: 'SNED', name: 'Special Needs Education', rate: 93 },
        { code: 'SW', name: 'Social Work', rate: 84 },
        { code: 'MC', name: 'Mass Communications', rate: 96 },
        { code: 'PSY', name: 'Psychology', rate: 90 }
    ],
    colors: [
        '#D4A843', '#C49A3B', '#B48E33', '#E8C76A', '#F5D982',
        '#A67C52', '#8B6914', '#D4AF37', '#C5A028', '#B69121',
        '#A7821A', '#987313', '#CD853F', '#DAA520', '#B8860B'
    ]
};

const MOCK_CLASS_DAYS = {
    totalDays: 92,
    completedDays: 61,
    remainingDays: 31
};

// ==========================================
// CHART INITIALIZATION FUNCTIONS
// ==========================================

let attendanceChartInstance = null;
let classDaysChartInstance = null;

// Attendance Rate Pie Chart - Placeholder Version with Mock Data
function initAttendanceChart() {
    const ctx = document.getElementById('attendancePieChart');
    if (!ctx) return;

    const departments = MOCK_ATTENDANCE_DATA.departments;
    const colors = MOCK_ATTENDANCE_DATA.colors;

    const chartData = {
        labels: departments.map(d => d.code),
        datasets: [{
            data: departments.map(d => d.rate),
            backgroundColor: colors,
            borderColor: '#FFFFFF',
            borderWidth: 2,
            hoverOffset: 6
        }]
    };

    attendanceChartInstance = new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const dept = departments[context.dataIndex];
                            return `${dept.code} (${dept.name}): ${dept.rate}%`;
                        }
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 10,
                    cornerRadius: 6,
                    titleFont: { size: 13, weight: 'bold' },
                    bodyFont: { size: 12 }
                }
            }
        }
    });

    // Create custom legend
    createAttendanceLegend(departments, colors);
}

// Create custom legend for attendance chart
function createAttendanceLegend(departments, colors) {
    const legendContainer = document.getElementById('attendanceLegend');
    if (!legendContainer) return;

    legendContainer.innerHTML = '';
    departments.forEach((dept, index) => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `
            <span class="legend-color" style="background-color: ${colors[index]}"></span>
            <span>${dept.code}</span>
        `;
        legendContainer.appendChild(item);
    });
}

// Class Days Doughnut Chart - Placeholder Version with Mock Data
function initClassDaysChart() {
    const ctx = document.getElementById('classDaysChart');
    if (!ctx) return;

    const totalDays = MOCK_CLASS_DAYS.totalDays;
    const completedDays = MOCK_CLASS_DAYS.completedDays;
    const remainingDays = MOCK_CLASS_DAYS.remainingDays;

    // Plugin to draw text in center of doughnut
    const centerTextPlugin = {
        id: 'centerText',
        beforeDraw: function(chart) {
            const width = chart.width;
            const height = chart.height;
            const ctx = chart.ctx;
            
            ctx.restore();
            
            // Draw "92" - main number
            const fontSize = (height / 10).toFixed(2);
            ctx.font = `bold ${fontSize}px 'Segoe UI', sans-serif`;
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#6B4E3D';
            
            const text = totalDays.toString();
            const textX = Math.round((width - ctx.measureText(text).width) / 2);
            const textY = height / 2;
            
            ctx.fillText(text, textX, textY);
            
            // Draw "days" label below number
            const labelFontSize = (height / 16).toFixed(2);
            ctx.font = `${labelFontSize}px 'Segoe UI', sans-serif`;
            ctx.fillStyle = 'rgba(107, 78, 61, 0.6)';
            
            const labelText = 'days';
            const labelX = Math.round((width - ctx.measureText(labelText).width) / 2);
            const labelY = height / 2 + (height / 8);
            
            ctx.fillText(labelText, labelX, labelY);
            
            ctx.save();
        }
    };

    classDaysChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Remaining'],
            datasets: [{
                data: [completedDays, remainingDays],
                backgroundColor: ['#D4A843', 'rgba(212, 168, 67, 0.2)'],
                borderColor: ['#D4A843', 'rgba(212, 168, 67, 0.3)'],
                borderWidth: 2,
                cutout: '65%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        },
        plugins: [centerTextPlugin]
    });

    // Hide the external days info since it's now in the center
    const daysInfo = document.querySelector('.days-info');
    if (daysInfo) {
        daysInfo.style.display = 'none';
    }
}

// ==========================================
// DATA LOADING FUNCTIONS - Placeholder Version
// ==========================================

// Load dashboard data - Placeholder implementation with mock data
function loadDashboardData() {
    // Simulate loading realistic mock data
    updateProfileData(MOCK_ADMIN_PROFILE);
    updateStatsData(MOCK_DASHBOARD_STATS);
    updateClassDaysData(MOCK_CLASS_DAYS);
}

// Update profile section with mock data
function updateProfileData(profileData) {
    updateElement('adminName', profileData.name);
    updateElement('adminUid', profileData.uid);
    updateElement('adminContact', profileData.contactNumber);
    updateElement('adminEmail', profileData.email);
    updateElement('adminAddress', profileData.address);
}

// Update stats cards with mock data
function updateStatsData(statsData) {
    updateElement('totalStudents', statsData.totalStudents);
    updateElement('totalFaculty', statsData.totalFaculty);
    updateElement('totalColleges', statsData.totalColleges);
    updateElement('totalDepartments', statsData.totalDepartments);
    updateElement('leaveRequests', statsData.leaveRequests);
    updateElement('excuseRequests', statsData.excuseRequests);
}

// Update class days section with mock data
function updateClassDaysData(daysData) {
    updateElement('totalDays', daysData.totalDays);
    
    const daysProgress = document.getElementById('daysProgress');
    if (daysProgress) {
        daysProgress.textContent = `${daysData.completedDays}/${daysData.totalDays} days`;
    }
}

// Helper function to safely update element text
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value !== null && value !== undefined ? value : '--';
    }
}

// ==========================================
// EVENT HANDLERS
// ==========================================

// Initialize logout functionality
function initLogoutHandler() {
    const logoutBtn = document.querySelector('.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to log out?')) {
                // Placeholder: Replace with actual logout API call
                console.log('Logout clicked - implement API call');
                window.location.href = '/login';
            }
        });
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Format number with commas
function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '--';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Refresh dashboard data (useful for testing)
function refreshDashboardData() {
    // Re-initialize charts
    if (attendanceChartInstance) {
        attendanceChartInstance.destroy();
    }
    if (classDaysChartInstance) {
        classDaysChartInstance.destroy();
    }
    initAttendanceChart();
    initClassDaysChart();
    loadDashboardData();
}