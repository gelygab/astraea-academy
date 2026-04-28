<?php 
session_start();
require_once '../db.php';

if (!isset($_SESSION['uid'])) {
    header('Location: studentlogin.php');
    exit();
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
    <title>Student Dashboard - My Schedule</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <link rel="stylesheet" href="studentdashboardSCHED.css">
</head>
<body>
    <div class="background-container">
        <img src="../images/Slogin_bg.gif" alt="Background" class="background-image">
    </div>

    <div class="container">
        <aside>
            <div class="top">
                <div class="logo">
                    <img src="../images/AA_Logo.png" alt="Logo">
                    <h1>Astraea Academy</h1>
                </div>
            </div>

            <div class="sidebar-nav">
                <p class="nav-label">MAIN MENU</p>
                
                <a href="studentdashboardHOME.php">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span class="nav-text">Home</span>
                </a>

                <a href="studentdashboardSCHED.php" class="active">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span class="nav-text">View Schedule</span>
                </a>

                <a href="studentdashboardLEAVE.php">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <polyline points="16 11 18 13 22 9"></polyline>
                    </svg>
                    <span class="nav-text">Apply for Leave</span>
                </a>

                <a href="studentdashboardEXCUSE.php">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    <span class="nav-text">Request an Excuse</span>
                </a>

                <a href="studentdashboardAPPEALS.php">
                   <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span class="nav-text">View Pending Appeals</span> 
                </a>

                <div class="sidebar-footer">
                    <a href="studentlogout.php">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <span class="nav-text">Log Out</span>
                    </a>
                </div>
            </div>
        </aside>

        <main class="schedule-dashboard">
            <!-- Header Section with Filters -->
            <section class="schedule-header-card">
                <h2 class="page-title">My Schedule</h2>
                
                <div class="filters-row">
                    <div class="filter-group">
                        <label for="schoolYear">School Year</label>
                        <div class="custom-select">
                            <select id="schoolYear">
                                <option value="2025-2026">2025-2026</option>
                            </select>
                            <span class="material-symbols-outlined select-arrow">expand_more</span>
                        </div>
                    </div>
                    
                    <div class="filter-group">
                        <label for="semester">Semester</label>
                        <div class="custom-select">
                            <select id="semester">
                                <option value="First Semester">First Semester</option>
                            </select>
                            <span class="material-symbols-outlined select-arrow">expand_more</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Main Schedule View -->
            <section id="mainScheduleView" class="schedule-content">
                <div class="view-toggle">
                    <button id="viewSubjectDetailsBtn" class="view-details-btn" onclick="showSubjectDetailsView()">
                        View Subject Details
                    </button>
                </div>

                <!-- Subject List Table -->
                <div class="table-container">
                    <table id="subjectsTable" class="subjects-table">
                        <thead>
                            <tr>
                                <th>Subject Code</th>
                                <th>Description</th>
                                <th>Schedule</th>
                            </tr>
                        </thead>
                        <tbody id="subjectsTableBody">
                        </tbody>
                    </table>
                </div>

                <!-- Weekly Schedule Grid -->
                <div class="schedule-grid-container">
                    <div class="schedule-grid-wrapper">
                        <div class="schedule-grid" id="weeklyScheduleGrid">
                        </div>
                    </div>
                </div>
            </section>

            <!-- Subject Details View -->
            <section id="subjectDetailsView" class="subject-details-view hidden">
                <div class="view-toggle">
                    <button class="back-btn" onclick="showMainScheduleView()">
                        <span class="material-symbols-outlined">arrow_back</span>
                        Go back to Schedule
                    </button>
                </div>

                <div id="subjectCardsGrid" class="subject-cards-grid">
                </div>
            </section>

            <!-- Attendance Calendar Modal -->
            <div id="attendanceCalendarModal" class="attendance-modal hidden">
                <div class="attendance-modal-content">
                    <div class="attendance-modal-header">
                        <div class="legend-row">
                            <span class="legend-item"><span class="dot absent"></span> Absent</span>
                            <span class="legend-item"><span class="dot leave"></span> Leave</span>
                            <span class="legend-item"><span class="dot excused"></span> Excused</span>
                        </div>
                        <button class="close-modal-btn" onclick="closeAttendanceModal()">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    
                    <div class="attendance-calendar-container">
                        <div class="calendar-header-row">
                            <span class="material-symbols-outlined nav-arrow" onclick="changeAttendanceMonth(-1)">chevron_left</span>
                            <h3 id="attendanceMonthYear" class="calendar-title">March 2026</h3>
                            <span class="material-symbols-outlined nav-arrow" onclick="changeAttendanceMonth(1)">chevron_right</span>
                        </div>
                        
                        <div class="attendance-calendar-grid" id="attendanceCalendarGrid">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div id="loadingState" class="loading-state hidden">
                <span class="material-symbols-outlined spinning">sync</span>
                <p>Loading schedule...</p>
            </div>

            <!-- Empty State -->
            <div id="emptyState" class="empty-state hidden">
                <span class="material-symbols-outlined">event_busy</span>
                <p>No schedule found for selected period</p>
            </div>
        </main>
    </div>

    <script src="studentdashboardSCHED.js"></script>
</body>
</html>