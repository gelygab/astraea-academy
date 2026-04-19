<?php
session_start();
require_once '../db.php';

if (!isset($_SESSION['uid'])) {
    header('Location: adminlogin.php');
}

$user_uid = $_SESSION['uid'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <script>
        const CURRENT_USER_UID = "<?php echo $user_uid; ?>";
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Astraea Academy - Admin Dashboard</title>
    <link rel="stylesheet" href="admindashboardHOME.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <aside class="sidebar collapsed">
            <div class="sidebar-header">
                <img src="../images/AA_Logo.png" alt="Astraea Academy Logo" class="logo">
                <div class="logo-text">
                    <h2>Astraea Academy</h2>
                </div>
            </div>

            <nav class="sidebar-nav">
                <p class="nav-label">MAIN MENU</p>

                <a href="admindashboardHOME.php" class="nav-item active">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span class="nav-text">Home</span>
                </a>

                <div class="nav-group">
                    <button class="nav-item nav-toggle" onclick="toggleNavGroup(this)">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                        </svg>
                        <span class="nav-text">View Team Reports</span>
                        <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    <div class="nav-submenu">
                        <a href="adminSTUDENTREPORT.html" class="nav-subitem">
                            <svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span class="nav-text">Student</span>
                        </a>
                        <a href="adminFACULTYREPORT.html" class="nav-subitem">
                            <svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span class="nav-text">Faculty</span>
                        </a>
                    </div>
                </div>

                <div class="nav-group">
                    <button class="nav-item nav-toggle" onclick="toggleNavGroup(this)">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span class="nav-text">View Appeal History</span>
                        <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    <div class="nav-submenu">
                        <a href="adminAPPEALSTUDENT.html" class="nav-subitem">
                            <svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span class="nav-text">Student</span>
                        </a>
                        <a href="adminAPPEALFACULTY.html" class="nav-subitem">
                            <svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span class="nav-text">Faculty</span>
                        </a>
                    </div>
                </div>
            </nav>

            <div class="sidebar-footer">
                <a href="adminlogout.php" class="nav-item logout">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span class="nav-text">Log Out</span>
                </a>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Profile Card -->
            <div class="profile-card">
                <div class="profile-avatar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                <div class="profile-info">
                    <h1 class="profile-name" id="adminName">Loading...</h1>
                    <div class="profile-details">
                        <div class="detail-item">
                            <span class="detail-label">UID</span>
                            <span class="detail-value" id="adminUid">--</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Contact Number</span>
                            <span class="detail-value" id="adminContact">--</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Email</span>
                            <span class="detail-value" id="adminEmail">--</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Address</span>
                            <span class="detail-value" id="adminAddress">--</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stats Row -->
            <div class="stats-row">
                <div class="stat-card">
                    <div class="stat-icon students">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <div class="stat-info">
                        <span class="stat-number" id="totalStudents">--</span>
                        <span class="stat-label">Students</span>
                        <span class="stat-sublabel">Total Enrollees</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon faculty">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <div class="stat-info">
                        <span class="stat-number" id="totalFaculty">--</span>
                        <span class="stat-label">Faculty</span>
                        <span class="stat-sublabel">Total Employees</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon colleges">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </div>
                    <div class="stat-info">
                        <span class="stat-number" id="totalColleges">--</span>
                        <span class="stat-label">Colleges</span>
                        <span class="stat-sublabel">Total Colleges</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon departments">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                    </div>
                    <div class="stat-info">
                        <span class="stat-number" id="totalDepartments">--</span>
                        <span class="stat-label">Departments</span>
                        <span class="stat-sublabel">Total Departments</span>
                    </div>
                </div>
            </div>

            <!-- Charts Row -->
            <div class="charts-row">
                <div class="chart-card attendance-chart">
                    <h3 class="chart-title">Attendance Rate</h3>
                    <span class="chart-subtitle">Department-wise attendance statistics</span>
                    <div class="chart-container">
                        <canvas id="attendancePieChart"></canvas>
                    </div>
                    <div class="chart-legend" id="attendanceLegend"></div>
                </div>

                <div class="requests-column">
                    <div class="request-card leave">
                        <div class="request-info">
                            <span class="request-label">Leave Requests</span>
                            <span class="request-sublabel">Pending Leave Appeals</span>
                        </div>
                        <span class="request-number" id="leaveRequests">--</span>
                    </div>

                    <div class="request-card excuse">
                        <div class="request-info">
                            <span class="request-label">Excuse Requests</span>
                            <span class="request-sublabel">Pending Excuse Appeals</span>
                        </div>
                        <span class="request-number" id="excuseRequests">--</span>
                    </div>

                    <div class="chart-card class-days">
                        <h3 class="chart-title">Class Days</h3>
                        <div class="chart-container">
                            <canvas id="classDaysChart"></canvas>
                        </div>
                        <div class="days-info">
                            <span class="days-number" id="totalDays">--</span>
                            <span class="days-label">Total Days</span>
                        </div>
                        <div class="days-tooltip" id="daysTooltip">
                            <span id="daysProgress">--/-- days</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script src="admindashboardHOME.js"></script>
</body>
</html>