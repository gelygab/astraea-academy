<?php 
session_start();
require_once 'db.php';

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
        <img src="images/Slogin_bg.gif" alt="Background" class="background-image">
    </div>

    <div class="container">
        <aside>
            <div class="top">
                <div class="logo">
                    <img src="images/AA_Logo.png" alt="Logo">
                    <h1>Astraea Academy</h1>
                </div>
            </div>

            <div class="sidebar">
                <h3>MAIN MENU</h3>
                <a href="studentdashboardHOME.php"><span class="material-symbols-outlined">star</span><h2>Home</h2></a>
                <a href="studentdashboardSCHED.php"><span class="material-symbols-outlined">star</span><h2>View Schedule</h2></a>
                <a href="studentdashboardLEAVE.php"><span class="material-symbols-outlined">star</span><h2>Apply for Leave</h2></a>
                <a href="studentdashboardEXCUSE.php" class="active"><span class="material-symbols-outlined">star</span><h2>Request an Excuse</h2></a>
                <a href="studentdashboardAPPEALS.php"><span class="material-symbols-outlined">star</span><h2>View Appeal History</h2></a>

                <div class="below">
                <h3>SETTINGS</h3>
                <a href="studentlogin.php"><span class="material-symbols-outlined">star</span><h2>Log Out</h2></a>
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
