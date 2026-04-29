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
    <title>Student Dashboard - Apply for Leave</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <link rel="stylesheet" href="studentdashboardLEAVE.css">
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

                <a href="studentdashboardSCHED.php">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span class="nav-text">View Schedule</span>
                </a>

                <a href="studentdashboardLEAVE.php" class="active">
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
                    <span class="nav-text">View Appeal History</span> 
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

        <main class="student-dashboard">
            <section class="form-card">
                
                <div class="form-header">
                    <h2>Apply for Leave</h2>
                </div>
                
                <form id="leaveForm" class="leave-form">
                    <!-- Time Type -->
                    <div class="form-group">
                        <label for="timeType">Time Type</label>
                        <div class="custom-select">
                            <select id="timeType" name="timeType">
                                <option value="sick_leave">Sick Leave</option>
                                <option value="emergency_leave">Emergency Leave</option>
                                <option value="leave_of_absence">Leave of Absence</option>
                                <option value="other_leave">Other</option>
                            </select>
                            <span class="material-symbols-outlined select-arrow">expand_more</span>
                        </div>
                    </div>

                    <!-- Date Row -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="startDate">Start Date</label>
                            <div class="date-input-wrapper">
                                <input type="text" id="startDate" name="startDate" class="date-input" placeholder="Feb 23, 2026" readonly>
                                <span class="material-symbols-outlined calendar-icon" onclick="openCalendar('startDate')">calendar_today</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="endDate">End Date</label>
                            <div class="date-input-wrapper">
                                <input type="text" id="endDate" name="endDate" class="date-input" placeholder="Feb 24, 2026" readonly>
                                <span class="material-symbols-outlined calendar-icon" onclick="openCalendar('endDate')">calendar_today</span>
                            </div>
                        </div>
                    </div>

                    <!-- Days Row -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="numDays">Number of Days</label>
                            <input type="text" id="numDays" name="numDays" class="readonly-input" value="1 day" readonly>
                        </div>
                        <div class="form-group">
                            <label for="returnDate">Return on</label>
                            <input type="text" id="returnDate" name="returnDate" class="readonly-input" value="Feb 25, 2026" readonly>
                        </div>
                    </div>

                    <!-- Comment -->
                    <div class="form-group">
                        <label for="comment">Comment</label>
                        <textarea id="comment" name="comment" rows="4" class="comment-textarea"></textarea>
                    </div>

                    <!-- Attachment -->
                    <div class="form-group">
                        <label for="attachment">Attachment</label>
                        <div class="upload-area" onclick="document.getElementById('attachment').click()">
                            <input type="file" id="attachment" name="attachment" hidden>
                            <span class="upload-text">Upload</span>
                        </div>
                    </div>

                    <!-- Buttons -->
                    <div class="form-buttons">
                        <button type="submit" class="submit-btn">Submit</button>
                        <button type="button" class="cancel-btn" onclick="cancelForm()">Cancel</button>
                    </div>
                </form>
            </section>
        </main>
    </div>

    <!-- Calendar Modal -->
    <div id="calendarModal" class="calendar-modal">
        <div class="calendar-container">
            <div class="calendar-header">
                <span class="material-symbols-outlined" onclick="changeMonth(-1)">chevron_left</span>
                <span id="calendarMonthYear" class="month-year"></span>
                <span class="material-symbols-outlined" onclick="changeMonth(1)">chevron_right</span>
            </div>
            <div class="calendar-weekdays">
                <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
            </div>
            <div id="calendarDays" class="calendar-days"></div>
        </div>
    </div>

    <script src="studentdashboardLEAVE.js"></script>
</body>
</html>
