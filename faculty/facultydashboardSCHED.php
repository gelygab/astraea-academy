<?php
session_start();
require_once '../db.php';

if (!isset($_SESSION['uid'])) {
    header('Location: facultylogin.php');
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
    <title>Faculty Dashboard - Manage Schedule</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <link rel="stylesheet" href="facultydashboardSCHED.css">
</head>
<body>
    <div class="background-container">
        <img src="../images/Flogin_bg.gif" alt="Background" class="background-image">
    </div>

    <div class="container">
        <?php include 'faculty_sidebar.php'; ?>

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
                                <option value="First">First Semester</option>
                                <option value="Second">Second Semester</option>
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
                            <h3 id="attendanceMonthYear" class="calendar-title">April 2026</h3>
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

    <script src="facultydashboardSCHED.js"></script>
</body>
</html>