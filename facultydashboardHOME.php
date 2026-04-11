<<<<<<< HEAD
<!DOCTYPE html>
<html lang="en">
<head>
=======
<?php
session_start();
require_once 'db.php';
// Force login as Teacher 1 for this test

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
>>>>>>> d3ff2428b92856f108ec1c089886e9e8fa535d26
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Astraea Academy - Faculty Dashboard</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <link href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="facultydashboardHOME.css">
</head>
<body>
<<<<<<< HEAD
    <div class="background-container">
        <img src="images/Flogin_bg.gif" alt=             "Background" class="background-image">
    </div>

    <div class="container">
        <?php include 'faculty_sidebar.php'; ?> 
=======
    <input type="file" id="pfpInput" style="display: none;" accept="image/*">
    <div class="background-container">
        <img src="images/Flogin_bg.gif" alt="Background" class="background-image">
    </div>

    <div class="container">
        <aside>
            <div class="top">
                <div class="logo">
                    <img src="images/AA_Logo.png" alt="Logo">
                    <h3>Astraea Academy</h3>
                </div>
            </div>
            <div class="sidebar">
                <h3>MAIN MENU</h3>
                <a href="facultydashboardHOME.php" class="active"><span class="material-symbols-outlined">star</span><h2>Home</h2></a>
                <a href="facultydashboardCLASSLIST.php"><span class="material-symbols-outlined">star</span><h2>View Class List</h2></a>
                <a href="facultydashboardMANAGESCHED.php"><span class="material-symbols-outlined">star</span><h2>Manage Schedule</h2></a>
                <a href="facultydashboardEXCUSEANDLEAVE.php"><span class="material-symbols-outlined">star</span><h2>Excuse and Leave Request</h2></a>
                <a href="facultydashboardREPORTS.php"><span class="material-symbols-outlined">star</span><h2>Generate Reports</h2></a>
                <div class="below">
                    <h3>SETTINGS</h3>
                    <a href="facultylogout.php"><span class="material-symbols-outlined">star</span><h2>Log Out</h2></a>
                </div>
            </div>
        </aside>
>>>>>>> d3ff2428b92856f108ec1c089886e9e8fa535d26

        <main class="faculty-dashboard">
            <section class="card faculty-card">
                <div class="card-header">
<<<<<<< HEAD
                    <h2>Faculty Details</h2>
=======
                    <h3>Faculty Details</h3>
>>>>>>> d3ff2428b92856f108ec1c089886e9e8fa535d26
                    <div class="header-controls">
                        <div class="dropdown-pill" id="customDropdown">
                            <div class="selected-wrapper">
                                <span id="displayValue">Monthly</span>
                                <span class="material-symbols-outlined">expand_more</span>
                            </div>
                            <ul class="dropdown-menu" id="dropdownMenu">
<<<<<<< HEAD
                                <li>Daily</li>
                                <li>Weekly</li>
                                <li>Monthly</li>
                            </ul>
                        </div>
                        <button class="download-btn">
                            <span class="material-symbols-outlined">download</span> Download
                        </button>
                    </div> 
=======
                                <li data-value="daily">Daily</li>
                                <li data-value="weekly">Weekly</li>
                                <li data-value="monthly">Monthly</li>
                            </ul>
                        </div>
                        <button class="download-btn" onclick="downloadData()">
                            <span class="material-symbols-outlined">download</span> Download
                        </button>
                    </div>
>>>>>>> d3ff2428b92856f108ec1c089886e9e8fa535d26
                </div>

                <div class="faculty-info-flex">
                    <div class="pfp-circle"></div>
                    <div class="info-details">
<<<<<<< HEAD
                        <h2 id="facultyName" class="stylized-name">Loading...</h2>
                        <div class="details-grid">
=======
                        <h2 id="facultyName">Loading...</h2>
                        <div id="facultyDetailsGrid" class="details-grid">
>>>>>>> d3ff2428b92856f108ec1c089886e9e8fa535d26
                            <p><strong>UID:</strong><br><span id="uid-val">...</span></p>
                            <p><strong>College:</strong><br><span id="college-val">...</span></p>
                            <p><strong>Department:</strong><br><span id="dept-val">...</span></p>
                            <p><strong>Email:</strong><br><span id="email-val">...</span></p>
                        </div>
                    </div>
                </div>
<<<<<<< HEAD
            </section>

            <div id="summaryBoxes" class="attendance-grid external-summary-transparent">
                </div> 

            <div class="main-grid-layout">
                <div class="card icon-bar-card"> 
                    <div class="icon-item">
                        <img src="images/Facultyicon_class.png" alt="Class" class="stat-icon">
                        <p><strong id="curr-class">--</strong><br>On-Going Class</p>
                    </div>
                    <div class="icon-item">
                        <img src="images/Facultyicon_enrolled.png" alt="Enrolled" class="stat-icon">
                        <p><strong id="curr-enrolled">--</strong><br>Total Enrolled</p>
                    </div>
                    <div class="icon-item">
                        <img src="images/Facultyicon_present.png" alt="Present" class="stat-icon">
                        <p><strong id="curr-present">--</strong><br>Present Now</p>
                    </div>
                    <div class="icon-item">
                        <img src="images/Facultyicon_pending.png" alt="Pending" class="stat-icon">
=======

                <div id="summaryBoxes" class="attendance-grid">
                </div>
            </section>

            <div class="main-grid-layout">
                
                <div class="card icon-bar-card"> 
                    <div class="icon-item">
                        <span class="material-symbols-outlined">computer</span>
                        <p><strong id="curr-class">--</strong><br>On-Going Class</p>
                    </div>
                    <div class="icon-item">
                        <span class="material-symbols-outlined">groups</span>
                        <p><strong id="curr-enrolled">--</strong><br>Total Enrolled</p>
                    </div>
                    <div class="icon-item">
                        <span class="material-symbols-outlined">badge</span>
                        <p><strong id="curr-present">--</strong><br>Present Now</p>
                    </div>
                    <div class="icon-item">
                        <span class="material-symbols-outlined">description</span>
>>>>>>> d3ff2428b92856f108ec1c089886e9e8fa535d26
                        <p><strong id="curr-pending">--</strong><br>Pending Excuses</p>
                    </div>
                </div>

                <div class="card subjects-card">
<<<<<<< HEAD
                    <h2>Handled Subjects</h2>
                    <div class="white-box-container">
                        <ul id="subject-list"></ul>
                        <p class="subjects-tab">Total Subjects: <span id="subject-count">0</span></p>
                    </div>
                </div> 
                
                <div class="card feed-card">
                    <h2>Live Attendance Feed</h2>
                    <div class="white-table-container">
                        <div class="table-tab centered-tab">SOFTDES022</div>
=======
                    <h3>Handled Subjects</h3>
                    <div class="white-box-container">
                        <ul id="subject-list">
                        </ul>
                         <p class="subjects-tab">Total Subjects Handled: <span id="subject-count">0</span></p>
                    </div>
                </div>
                
                <div class="card feed-card">
                    <h3>Live Attendance Feed</h3>
                    <div class="white-table-container">
                        <div class="table-tab" id="feed-subject-tab">SOFTDES022</div>
>>>>>>> d3ff2428b92856f108ec1c089886e9e8fa535d26
        
                        <table id="feed-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Time In</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
<<<<<<< HEAD
                            <tbody id="feed-body"></tbody>
=======
                            <tbody id="feed-body">
                                </tbody>
>>>>>>> d3ff2428b92856f108ec1c089886e9e8fa535d26
                        </table>

                        <div class="feed-legend">
                            <span>Status:</span>
<<<<<<< HEAD
                            <div class="legend-item"><div class="legend-box late-box"></div> Late</div>
                            <div class="legend-item"><div class="legend-box ontime-box"></div> On-Time</div>
=======
                            <div class="legend-item">
                                <div class="legend-box late-box"></div> Late
                            </div>
                            <div class="legend-item">
                                <div class="legend-box ontime-box"></div> On-Time
                            </div>
>>>>>>> d3ff2428b92856f108ec1c089886e9e8fa535d26
                        </div>
                    </div>
                </div>

                <div class="card rate-card">
<<<<<<< HEAD
                    <h2>Attendance Rate</h2>
                    <div class="rate-content">
                        <div class="pie-chart" id="attendancePie">
                            <span class="pie-label-present">--%</span>
                        </div>
                        <p id="attendanceDescription">Loading attendance analytics...</p>
=======
                    <h3>Attendance Rate</h3>
                    <div class="rate-content">
                        <div class="pie-chart" id="attendancePie">
                            <span class="pie-label-present">85%</span>
                        </div>
                        <p id="attendanceDescription">Most students are attending classes regularly.</p>
>>>>>>> d3ff2428b92856f108ec1c089886e9e8fa535d26
                    </div> 
                    <div class="pie-legend">
                        <div class="legend-present">Present</div>
                        <div class="legend-absent">Absent</div>
                    </div>  
                </div> 
<<<<<<< HEAD
=======

>>>>>>> d3ff2428b92856f108ec1c089886e9e8fa535d26
            </div> 
        </main>
    </div>

    <script src="facultydashboardHOME.js"></script>
</body>
<<<<<<< HEAD
</html>
=======
</html>
>>>>>>> d3ff2428b92856f108ec1c089886e9e8fa535d26
