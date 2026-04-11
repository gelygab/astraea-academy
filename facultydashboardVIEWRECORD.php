<?php
session_start();
require_once 'db.php';

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
        <img src="images/Flogin_bg.gif" alt="Background" class="background-image">
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
                <a href="facultydashboardHOME.php"><span class="material-symbols-outlined">star</span><h2>Home</h2></a>
                <a href="facultydashboardCLASSLIST.php" class="active"><span class="material-symbols-outlined">star</span><h2>View Class List</h2></a>
                <a href="facultydashboardMANAGESCHED.php"><span class="material-symbols-outlined">star</span><h2>Manage Schedule</h2></a>
                <a href="facultydashboardEXCUSEANDLEAVE.php"><span class="material-symbols-outlined">star</span><h2>Excuse and Leave Request</h2></a>
                <a href="facultydashboardREPORTS.php"><span class="material-symbols-outlined">star</span><h2>Generate Reports</h2></a>
            </div>
            
            <div class="below">
                <h3>SETTINGS</h3>
                <a href="facultylogout.php"><span class="material-symbols-outlined">star</span><h2>Log Out</h2></a>
            </div>
        </aside>

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
                    <div class="profile-circle" id="profileCircle" style="cursor: pointer;" title="Click to upload photo">
                        <img src="images/default-avatar.png" id="profileImg" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
                        <input type="file" id="imageUpload" accept="image/*" hidden>
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