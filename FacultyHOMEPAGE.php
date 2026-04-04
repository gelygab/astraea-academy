<?php
session_start();
// Force login as Teacher 1 for this test
$_SESSION['teacher_id'] = 1; 
$current_teacher_id = $_SESSION['teacher_id'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Astraea Academy - Faculty Dashboard</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <link href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="facultyhomepage.css">
</head>
<body>
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
                <a href="#" class="active"><span class="material-symbols-outlined">star</span><h2>Home</h2></a>
                <a href="#"><span class="material-symbols-outlined">star</span><h2>View Class List</h2></a>
                <a href="#"><span class="material-symbols-outlined">star</span><h2>Manage Schedule</h2></a>
                <a href="#"><span class="material-symbols-outlined">star</span><h2>Excuse and Leave Request</h2></a>
                <a href="#"><span class="material-symbols-outlined">star</span><h2>Generate Reports</h2></a>
                <div class="below">
                    <h3>SETTINGS</h3>
                    <a href="#"><span class="material-symbols-outlined">star</span><h2>Log Out</h2></a>
                </div>
            </div>
        </aside>

        <main class="faculty-dashboard">
            <section class="card faculty-card">
                <div class="card-header">
                    <h3>Faculty Details</h3>
                    <div class="header-controls">
                        <div class="dropdown-pill" id="customDropdown">
                            <div class="selected-wrapper">
                                <span id="displayValue">Monthly</span>
                                <span class="material-symbols-outlined">expand_more</span>
                            </div>
                            <ul class="dropdown-menu" id="dropdownMenu">
                                 <li>Daily</li>
                                <li>Weekly</li>
                                <li>Monthly</li>
                            </ul>
                        </div>
                        <button class="download-btn">
                            <span class="material-symbols-outlined">download</span> Download
                        </button>
                    </div>
                </div>

                <div class="faculty-info-flex">
                    <div class="pfp-circle"></div>
                    <div class="info-details">
                        <h2 id="facultyName" class="stylized-name">Loading...</h2>
                        <div class="details-grid">
                            <p><strong>UID:</strong><br><span id="uid-val">...</span></p>
                            <p><strong>College:</strong><br><span id="college-val">...</span></p>
                            <p><strong>Department:</strong><br><span id="dept-val">...</span></p>
                            <p><strong>Email:</strong><br><span id="email-val">...</span></p>
                        </div>
                    </div>
                </div>

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
                        <p><strong id="curr-pending">--</strong><br>Pending Excuses</p>
                    </div>
                </div>

                <div class="card subjects-card">
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
        
                        <table id="feed-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Time In</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="feed-body">
                                </tbody>
                        </table>

                        <div class="feed-legend">
                            <span>Status:</span>
                            <div class="legend-item">
                                <div class="legend-box late-box"></div> Late
                            </div>
                            <div class="legend-item">
                                <div class="legend-box ontime-box"></div> On-Time
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card rate-card">
                    <h3>Attendance Rate</h3>
                    <div class="rate-content">
                        <div class="pie-chart" id="attendancePie">
                            <span class="pie-label-present">85%</span>
                        </div>
                        <p id="attendanceDescription">Most students are attending classes regularly.</p>
                    </div> 
                    <div class="pie-legend">
                        <div class="legend-present">Present</div>
                        <div class="legend-absent">Absent</div>
                    </div>  
                </div> 

            </div> 
        </main>
    </div>

   <script>

        const LOGGED_IN_TEACHER_ID = <?php echo isset($_SESSION['teacher_id']) ? $_SESSION['teacher_id'] : 1; ?>;
        console.log("Teacher ID loaded:", LOGGED_IN_TEACHER_ID);
    </script>

    <script src="facultyhomepage.js"></script>
</body>
</html>
