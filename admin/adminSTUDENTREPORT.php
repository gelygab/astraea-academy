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
    <title>Astraea Academy - Student Report</title>
    <link rel="stylesheet" href="adminSTUDENTREPORT.css">
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


                <a href="admindashboardHOME.html" class="nav-item">
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
                        <a href="adminSTUDENTREPORT.html" class="nav-subitem active">
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
                <p>Student Reports</p>
            </div>


            <!-- VIEW 1: Main Student Report List -->
            <div id="mainReportView" class="view-container active main-report-container">
                <!-- Filters Section -->
                <div class="filters-section-dark">
                    <div class="filter-group-dark">
                        <label>School Year</label>
                        <select id="schoolYear">
                            <option value="2025-2026">2025-2026</option>
                        </select>
                    </div>
                    <div class="filter-group-dark">
                        <label>Semester</label>
                        <select id="semester">
                            <option value="first">First Semester</option>
                        </select>
                    </div>
                    <div class="filter-group-dark">
                        <label>Department</label>
                        <select id="department">
                            <option value="">All Departments</option>
                            <option value="civil">Civil Engineering</option>
                            <option value="chemical">Chemical Engineering</option>
                            <option value="computer">Computer Engineering</option>
                            <option value="electrical">Electrical Engineering</option>
                            <option value="electronics">Electronics Engineering</option>
                            <option value="mechanical">Mechanical Engineering</option>
                            <option value="manufacturing">Manufacturing Engineering</option>
                            <option value="early childhood">Early Childhood Education</option>
                            <option value="elementary education">Elementary Education</option>
                            <option value="secondary education">Secondary Education</option>
                            <option value="special needs">Special Needs Education</option>
                            <option value="physical education">Physical Education</option>
                            <option value="social work">Social Work</option>
                            <option value="mass communication">Mass Communication</option>
                            <option value="psychology">Psychology</option>
                        </select>
                    </div>
                    <div class="filter-group-dark">
                        <label>Year</label>
                        <select id="year">
                            <option value="">All Years</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                    </div>
                    <div class="filter-group-dark">
                        <label>Block</label>
                        <select id="block">
                            <option value="">All Blocks</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>
                </div>


                <!-- Stats Row - Dark Themed -->
                <div class="stats-row-dark">
                    <div class="stat-card-dark">
                        <svg class="stat-icon-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <span class="stat-number-gold" id="totalStudents"></span>
                        <span class="stat-label-light">Total Students</span>
                    </div>
                    <div class="stat-card-dark">
                        <svg class="stat-icon-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                            <line x1="18" y1="8" x2="23" y2="13"></line>
                            <line x1="23" y1="8" x2="18" y2="13"></line>
                        </svg>
                        <span class="stat-number-gold" id="totalAbsent"></span>
                        <span class="stat-label-light">Total Absent</span>
                    </div>
                    <div class="stat-card-dark">
                        <svg class="stat-icon-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                            <polyline points="17 6 23 6 23 12"></polyline>
                        </svg>
                        <span class="stat-number-gold" id="productivity"></span>
                        <span class="stat-label-light">Productivity</span>
                    </div>
                    <div class="stat-card-dark">
                        <svg class="stat-icon-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                            <polyline points="17 18 23 18 23 12"></polyline>
                        </svg>
                        <span class="stat-number-gold" id="absenteeism"></span>
                        <span class="stat-label-light">Absenteeism</span>
                    </div>
                </div>


                <!-- Students Grid with Horizontal Bar Charts -->
                <div class="students-grid-list" id="studentsGrid">
                    <!-- Student cards will be dynamically generated -->
                </div>
            </div>


            <!-- VIEW 2: Individual Student Record (View Record State) -->
            <div id="studentRecordView" class="view-container">
                <!--News -->

                <!-- Profile and Overview Row -->
                <div class="profile-overview-row">
                    <!-- Profile Card - Brown -->
                    <div class="profile-card-brown">
                        <div class="profile-avatar-brown">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <div class="profile-name-brown" id="profileLastName">AMORES,</div>
                        <div class="profile-name-first" id="profileFirstName">Princess Jasmine</div>
                        <div class="profile-college-info">
                            <div id="profileCollege">College of Engineering</div>
                            <div id="profileDepartment">Civil Engineering</div>
                        </div>
                    </div>


                    <!-- Attendance Overview - Brown Card with 4 Donuts -->
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
                      <button class="btn-back-link-team" onclick="backToStudentTeamRecords()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                            <path d="M19 12H5"></path>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Go back to Student Team Report
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
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody id="subjectTableBody">
                                <!-- Table rows will be dynamically generated -->
                            </tbody>
                        </table>
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
                    <button class="btn-back-link" onclick="backToStudentRecord()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                            <path d="M19 12H5"></path>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Go back to Student Report
                    </button>
                </div>


                <!-- Subject Header -->
                <div class="subject-header-brown">
                    <h2 id="calendarSubjectTitle">CET 0211 Differential Equations</h2>
                </div>


                <!-- Calendar Container -->
                <div class="calendar-container-white">
                    <!-- Month Navigation -->
                    <div class="calendar-nav-row">
                        <button class="calendar-nav-btn" onclick="changeMonth(-1)">&#8249;</button>
                        <span class="calendar-month-display" id="calendarMonthDisplay">March 2026</span>
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
                            <!-- Calendar days will be dynamically generated -->
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
                    <span class="detail-data" id="modalStudentName">-</span>
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
                    <span class="detail-title">Status:</span>
                    <span class="detail-data status-pill" id="modalStatus">-</span>
                </div>
            </div>
        </div>
    </div>


    <script src="adminSTUDENTREPORT.js"></script>
</body>
</html>



