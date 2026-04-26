<?php
session_start();
require_once '../db.php';

if (!isset($_SESSION['uid'])) {
    header('Location: facultylogin.php');
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
    <title>Astraea Academy - View Student Record</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <link rel="stylesheet" href="facultydashboardCLASSLIST.css">
</head>
<body>
    <div class="background-container">
        <img src="../images/Flogin_bg.gif" alt="Background" class="background-image">
    </div>

    <div class="container">
        <?php include 'faculty_sidebar.php'; ?>

        <main class="class-list-dashboard">
            
            <div class="card filter-card">
                <h2>View Student Record</h2>
                </div>

            <div class="card profile-card">
                <div class="profile-header-actions">
                    <button class="btn-back" onclick="window.location.href='facultydashboardCLASSLIST.php'">◀ Back</button>
                    <div class="right-actions">
                        <select class="select-monthly">
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly" selected>Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        <button class="btn-download" id="downloadBtn">
                            <span class="material-symbols-outlined">file_download</span> Download
                        </button>
                    </div>
                </div>

                <div class="profile-main-info">
                    <div class="profile-circle">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.0">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <div class="info-text">
                        <h1 id="studentName">Loading Name...</h1>
                        <p class="subtitle" id="studentProgram">Loading Program Info...</p>
                        <div class="contact-grid">
                            <p><strong>UID:</strong> <span id="studentUidDisplay">Loading...</span></p>
                            <p><strong>Contact Number:</strong> <span id="studentContact">Loading...</span></p>
                            <p><strong>Email:</strong> <span id="studentEmail">Loading...</span></p>
                            <p><strong>Address:</strong> <span id="studentAddress">Loading...</span></p>
                        </div>
                    </div>
                </div>

                <div class="stats-container">
                    <div class="stat-box">
                        <span class="material-symbols-outlined">star</span>
                        <div class="stat-text"><strong id="statTotal">0</strong><br>Total Attendance</div>
                    </div>
                    <div class="stat-box">
                        <span class="material-symbols-outlined">star</span>
                        <div class="stat-text"><strong id="statLate">0</strong><br>Late Attendance</div>
                    </div>
                    <div class="stat-box">
                        <span class="material-symbols-outlined">star</span>
                        <div class="stat-text"><strong id="statUndertime">0</strong><br>Undertime Attendance</div>
                    </div>
                    <div class="stat-box">
                        <span class="material-symbols-outlined">star</span>
                        <div class="stat-text"><strong id="statAbsent">0</strong><br>Total Absent</div>
                    </div>
                </div>
            </div>

            <div class="card history-card">
                <h2>Excuse History</h2>
                <div class="white-wrapper">
                    <table class="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Reason/Category</th>
                                <th>Status</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody id="excuseBody">
                            <tr>
                                <td colspan="4" style="text-align:center;">No excuses found.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main> 
    </div> 
    
    <script src="facultydashboardVIEWRECORD.js"></script> 
</body>
</html>