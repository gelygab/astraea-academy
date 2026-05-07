// ==========================================
// Astraea Academy Admin Dashboard 
// ==========================================

const API_CONFIG = {
    baseUrl: 'api/',
    endpoints: {
        getAdminDashboard: 'get_admin_dashboard.php'
    }
}

// Sidebar Navigation Toggle
function toggleNavGroup(button) {
    const navGroup = button.parentElement;
    navGroup.classList.toggle('open');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    initLogoutHandler();
});

async function getAdminDashboard() {
    try {
        const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getAdminDashboard}?uid=${CURRENT_USER_UID}`
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        if(!response.ok) throw new Error ("Fetch failed");
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Fetching admin profile failed: ", error);
    }
};

// ==========================================
// CHART INITIALIZATION FUNCTIONS
// ==========================================

let attendanceChartInstance = null;
let classDaysChartInstance = null;

// Attendance Rate Pie Chart 
function initAttendanceChart(data) {
    const ctx = document.getElementById('attendancePieChart');
    if (!ctx) return;

    const departments = data.departments;
    const colors = data.colors;

    // Check kung lahat ba ay 0% para hindi magmukhang sira yung chart
    const totalRate = departments.reduce((sum, d) => sum + d.rate, 0);
    
    const chartData = {
        labels: departments.length > 0 ? departments.map(d => d.code) : ['No Data'],
        datasets: [{
            data: departments.length > 0 ? departments.map(d => d.rate) : [100], // Show a full gray circle if no data
            backgroundColor: departments.length > 0 ? colors : ['#E0E0E0'],
            borderColor: '#FFFFFF',
            borderWidth: 2
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

// Class Days Doughnut Chart 
function initClassDaysChart(data) {
    const ctx = document.getElementById('classDaysChart');
    if (!ctx) return;

    const totalDays = data.totalDays;
    const completedDays = data.completedDays;
    const remainingDays = data.remainingDays;

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
// DATA LOADING FUNCTIONS 
// ==========================================

// Load dashboard data -
async function loadDashboardData() {
    const result = await getAdminDashboard();
    updateProfileData(result.data);
    updateStatsData(result.data);
    updateClassDaysData(result.data);
    initAttendanceChart(result.data);
    initClassDaysChart(result.data)
}

// Update profile section 
function updateProfileData(data) {
    updateElement('adminName', data.name);
    updateElement('adminUid', data.uid);
    updateElement('adminContact', data.contactNumber);
    updateElement('adminEmail', data.email);
    updateElement('adminAddress', data.address);
}

// Update stats cards 
function updateStatsData(data) {
    updateElement('totalStudents', data.totalStudents);
    updateElement('totalFaculty', data.totalFaculty);
    updateElement('totalColleges', data.totalColleges);
    updateElement('totalDepartments', data.totalDepartments);
    updateElement('leaveRequests', data.leaveRequests);
    updateElement('excuseRequests', data.excuseRequests);
}

// Update class days section 
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
                console.log('Logout clicked - implement API call');
                window.location.href = 'adminlogout.php';
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