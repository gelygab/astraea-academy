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
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Astraea Academy - Faculty Report</title>
    <link rel="stylesheet" href="adminFACULTYREPORT.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

</head>
<body>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <img src="../images/AA_Logo.png" alt="Astraea Academy Logo" class="logo">
                <div class="logo-text">
                    <h2>Astraea Academy</h2>
                </div>
            </div>

            <nav class="sidebar-nav">
                <p class="nav-label">MAIN MENU</p>

                <a href="admindashboardHOME.php" class="nav-item">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span class="nav-text">Home</span>
                </a>

                <div class="nav-group open">
                    <button class="nav-item nav-toggle active" onclick="toggleNavGroup(this)">
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
                        <a href="adminSTUDENTREPORT.php" class="nav-subitem">
                            <svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span class="nav-text">Student</span>
                        </a>
                        <a href="adminFACULTYREPORT.php" class="nav-subitem active">
                            <svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span class="nav-text">Faculty</span>
                        </a>
                    </div>
                </div>

                <div class="nav-group ">
                    <button class="nav-item nav-toggle " onclick="toggleNavGroup(this)">
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
                        <a href="adminAPPEALSTUDENT.php" class="nav-subitem ">
                            <svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span class="nav-text">Student</span>
                        </a>
                        <a href="adminAPPEALFACULTY.php" class="nav-subitem ">
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
                <a href="#" class="nav-item logout">
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
                 <!-- Page Header -->
            <div class="page-header">
                <h1>View Team Reports</h1>
                <p>Faculty Reports</p>
            </div>

            <!-- VIEW 1: Main Faculty Report List -->
            <div id="mainReportView" class="view-container active">
                <!-- Filters Section -->
                <div class="filters-section">
                    <div class="filter-group">
                        <label for="schoolYear">School Year</label>
                        <select id="schoolYear">
                            <option value="2025-2026">2025-2026</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="semester">Semester</label>
                        <select id="semester">
                            <option value="first">First Semester</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="college">College</label>
                        <select id="college">
                            <option value="">All Colleges</option>
                            <option value="engineering">Engineering</option>
                            <option value="education">Education</option>
                            <option value="chass">Humanities, Arts, and Social Sciences</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="department">Department</label>
                        <select id="department">
                            <option value="">All Departments</option>
                            <!-- Departments populated dynamically via JavaScript -->
                        </select>
                    </div>
                </div>

                <!-- Stats Row - Dynamic -->
                <div class="stats-row">
                    <div class="stat-card">
                         <svg class="stat-icon-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <span class="stat-number" id="totalEmployees">0</span>
                        <span class="stat-label">TOTAL EMPLOYEES</span>
                    </div>
                    <div class="stat-card">
                        <svg class="stat-icon-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                            <line x1="18" y1="8" x2="23" y2="13"></line>
                            <line x1="23" y1="8" x2="18" y2="13"></line>
                        </svg>
                        <span class="stat-number" id="totalAbsent">0</span>
                        <span class="stat-label">TOTAL ABSENT</span>
                    </div>
                    <div class="stat-card">
                        <svg class="stat-icon-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                            <polyline points="17 6 23 6 23 12"></polyline>
                        </svg>
                        <span class="stat-number" id="productivity">0.0%</span>
                        <span class="stat-label">PRODUCTIVITY</span>
                    </div>
                    <div class="stat-card">
                        <svg class="stat-icon-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                            <polyline points="17 18 23 18 23 12"></polyline>
                        </svg>
                        <span class="stat-number" id="absenteeism">0.0%</span>
                        <span class="stat-label">ABSENTEEISM</span>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="charts-section">
                    <div class="chart-card">
                        <h3 class="chart-title">Attendance by Department</h3>
                        <div class="chart-container">
                            <canvas id="departmentChart"></canvas>
                        </div>
                    </div>
                    <div class="chart-card">
                        <h3 class="chart-title">Absenteeism by Reason</h3>
                        <div class="chart-container">
                            <canvas id="reasonChart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Faculty Grid -->
                <div class="faculty-grid" id="facultyGrid">
                    <!-- Faculty cards dynamically generated -->
                </div>
            </div>

            <!-- VIEW 2: Individual Faculty Record -->
            <div id="facultyRecordView" class="view-container">
              
                <!-- Profile and Overview Row -->
                <div class="profile-overview-row">
                    <!-- Profile Card -->
                    <div class="profile-card-brown">
                        <div class="profile-avatar-brown">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <div class="profile-name-brown" id="profileLastName">-</div>
                        <div class="profile-name-first" id="profileFirstName">-</div>
                        <div class="profile-college-info">
                            <div id="profileCollege">-</div>
                            <div id="profileDepartment">-</div>
                        </div>
                    </div>

                    <!-- Attendance Overview -->
                     <div class="attendance-overview-card">
                        <h3>Attendance Overview</h3>
                        <div class="overview-charts-row">
                            <div class="overview-chart-box">
                                <div class="donut-chart-container">
                                    <canvas id="presentChart"></canvas>
                                    <div class="donut-center-text">
                                        <span class="donut-percentage" id="presentPercentage">85%</span>
                                    </div>
                                </div>
                                <span class="overview-chart-label">Present</span>
                            </div>
                            <div class="overview-chart-box">
                                <div class="donut-chart-container">
                                    <canvas id="lateChart"></canvas>
                                    <div class="donut-center-text">
                                        <span class="donut-percentage" id="latePercentage">10%</span>
                                    </div>
                                </div>
                                <span class="overview-chart-label">Late</span>
                            </div>
                            <div class="overview-chart-box">
                                <div class="donut-chart-container">
                                    <canvas id="absenceChart"></canvas>
                                    <div class="donut-center-text">
                                        <span class="donut-percentage" id="absencePercentage">3%</span>
                                    </div>
                                </div>
                                <span class="overview-chart-label">Absence</span>
                            </div>
                            <div class="overview-chart-box">
                                <div class="donut-chart-container">
                                    <canvas id="excuseChart"></canvas>
                                    <div class="donut-center-text">
                                        <span class="donut-percentage" id="excusePercentage">2%</span>
                                    </div>
                                </div>
                                <span class="overview-chart-label">Excuse</span>
                            </div>
                        </div>
                    </div>
                </div>


                <!-- Subject Attendance Table -->
                <div class="subject-attendance-section">
                    <h3 class="section-title">Subject Attendance</h3>
                    <button class="btn-back-link-team" onclick="backToFacultyTeamRecords()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                            <path d="M19 12H5"></path>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Go back to Faculty Team Report
                    </button>
                    <div class="subject-table-wrapper">
                        <table class="subject-table-beige">
                            <thead>
                                <tr>
                                    <th>Subject Code</th>
                                    <th>Description</th>
                                    <th>Present</th>
                                    <th>Absence</th>
                                    <th>Late</th>
                                    <th>Excuse</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody id="subjectTableBody">
                                <!-- Table rows dynamically generated -->
                            </tbody>
                        </table>
                        <div class="table-footer-brown">
                            Total Subjects Handled: <span id="totalSubjects">0</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- VIEW 3: Calendar View -->
            <div id="calendarView" class="view-container calendar-view-container">
                <!-- Header with Back Button -->
                <div class="calendar-header-bar">
                    <div class="calendar-legend-row">
                        <div class="legend-pill">
                            <span class="legend-circle absent"></span>
                            <span>Absent</span>
                        </div>
                        <div class="legend-pill">
                            <span class="legend-circle leave"></span>
                            <span>Leave</span>
                        </div>
                        <div class="legend-pill">
                            <span class="legend-circle excused"></span>
                            <span>Excused</span>
                        </div>
                    </div>
                    <button class="btn-back-link" onclick="backToFacultyRecord()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                            <path d="M19 12H5"></path>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Go back to Faculty Report
                    </button>
                </div>

                <!-- Subject Header -->
                <div class="subject-header-brown">
                    <h2 id="calendarSubjectTitle">-</h2>
                </div>

                <!-- Calendar Container -->
                <div class="calendar-container-white">
                    <!-- Month Navigation -->
                    <div class="calendar-nav-row">
                        <button class="calendar-nav-btn" onclick="changeMonth(-1)">&#8249;</button>
                        <span class="calendar-month-display" id="calendarMonthDisplay">-</span>
                        <button class="calendar-nav-btn" onclick="changeMonth(1)">&#8250;</button>
                    </div>

                    <!-- Calendar Grid -->
                    <div class="calendar-grid-white">
                        <div class="calendar-weekdays-row">
                            <span>Sun</span>
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                        </div>
                        <div class="calendar-days-grid" id="calendarDaysGrid">
                            <!-- Calendar days dynamically generated -->
                        </div>
                    </div>
                </div>
            </div>

        </main>
    </div>

    <!-- Attendance Details Modal -->
    <div class="modal-overlay" id="attendanceModal" onclick="closeAttendanceModal(event)">
        <div class="modal-box" onclick="event.stopPropagation()">
            <div class="modal-header-row">
                <h3>Attendance Details</h3>
                <button class="modal-close-btn" onclick="closeAttendanceModal()">&times;</button>
            </div>
            <div class="modal-body-content">
                <div class="detail-line">
                    <span class="detail-title">Name:</span>
                    <span class="detail-data" id="modalFacultyName">-</span>
                </div>
                <div class="detail-line">
                    <span class="detail-title">Date:</span>
                    <span class="detail-data" id="modalDate">-</span>
                </div>
                <div class="detail-line">
                    <span class="detail-title">ID Number:</span>
                    <span class="detail-data" id="modalID">-</span>
                </div>
                <div class="detail-line">
                   <span class="detail-title">Appeal Type:</span>
                    <span class="detail-data" id="modalAppealType">-</span>
                </div>
                <div class="detail-line">
                   <span class="detail-title">Date Applied:</span>
                    <span class="detail-data" id="modalDateApplied">-</span>
                </div>
                <div class="detail-line">
                    <span class="detail-title">Reason:</span>
                    <span class="detail-data" id="modalReason">-</span>
                </div>
                <div class="detail-line">
                    <span class="detail-title">Status Updated By:</span>
                    <span class="detail-data" id="modalStatusUpdatedBy">-</span>
                </div>
            </div>
        </div>
    </div>

    <script src="adminFACULTYREPORT.js"></script>
</body>
</html>