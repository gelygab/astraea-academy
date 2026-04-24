<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Astraea Academy - Faculty Dashboard</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <link href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="facultydashboardHOME.css">
</head>
<body>
    <div class="background-container">
        <img src="../images/Flogin_bg.gif" alt="Background" class="background-image">
    </div>

    <div class="container">
        <?php include 'faculty_sidebar.php'; ?>

        <main class="faculty-dashboard">
            <section class="card faculty-card">
                <div class="card-header">
                    <h2>Faculty Details</h2>
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
                    <div class="pfp-circle loading"></div>
                    <div class="info-details">
                        <h2 id="facultyName" class="stylized-name loading">Loading Faculty...</h2>
                        <div class="details-grid">
                            <p><strong>UID:</strong><br><span id="uid-val" class="loading">---------</span></p>
                            <p><strong>College:</strong><br><span id="college-val" class="loading">------------------</span></p>
                            <p><strong>Department:</strong><br><span id="dept-val" class="loading">------------------</span></p>
                            <p><strong>Email:</strong><br><span id="email-val" class="loading">--------------------------</span></p>
                        </div>
                    </div>
                </div>
            </section>

            <div id="summaryBoxes" class="attendance-grid external-summary-transparent loading" style="min-height: 100px;">
                </div> 

            <div class="main-grid-layout">
                <div class="card icon-bar-card"> 
                    <div class="icon-item">
                        <img src="../images/Facultyicon_class.png" alt="Class" class="stat-icon">
                        <p><strong id="curr-class">--</strong><br>On-Going Class</p>
                    </div>
                    <div class="icon-item">
                        <img src="../images/Facultyicon_enrolled.png" alt="Enrolled" class="stat-icon">
                        <p><strong id="curr-enrolled">--</strong><br>Total Enrolled</p>
                    </div>
                    <div class="icon-item">
                        <img src="../images/Facultyicon_present.png" alt="Present" class="stat-icon">
                        <p><strong id="curr-present">--</strong><br>Present Now</p>
                    </div>
                    <div class="icon-item">
                        <img src="../images/Facultyicon_pending.png" alt="Pending" class="stat-icon">
                        <p><strong id="curr-pending">--</strong><br>Pending Excuses</p>
                        <img src="images/Facultyicon_class.png" alt="Class" class="stat-icon">
                        <p><strong id="curr-class" class="loading">--</strong><br>On-Going Class</p>
                    </div>
                    <div class="icon-item">
                        <img src="images/Facultyicon_enrolled.png" alt="Enrolled" class="stat-icon">
                        <p><strong id="curr-enrolled" class="loading">--</strong><br>Total Enrolled</p>
                    </div>
                    <div class="icon-item">
                        <img src="images/Facultyicon_present.png" alt="Present" class="stat-icon">
                        <p><strong id="curr-present" class="loading">--</strong><br>Present Now</p>
                    </div>
                    <div class="icon-item">
                        <img src="images/Facultyicon_pending.png" alt="Pending" class="stat-icon">
                        <p><strong id="curr-pending" class="loading">--</strong><br>Pending Excuses</p>
                    </div>
                </div>

                <div class="card subjects-card">
                    <h2>Handled Subjects</h2>
                    <div class="white-box-container">
                        <ul id="subject-list" class="loading">
                            <li>Loading...</li>
                            <li>Loading...</li>
                        </ul>
                        <p class="subjects-tab">Total Subjects: <span id="subject-count" class="loading">0</span></p>
                    </div>
                </div> 
                
                <div class="card feed-card">
                    <h2>Live Attendance Feed</h2>
                    <div class="white-table-container">
                        <div class="table-tab centered-tab">SOFTDES022</div>
                        <table id="feed-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Time In</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="feed-body" class="loading">
                                </tbody>
                        </table>

                        <div class="feed-legend">
                            <span>Status:</span>
                            <div class="legend-item"><div class="legend-box late-box"></div> Late</div>
                            <div class="legend-item"><div class="legend-box ontime-box"></div> On-Time</div>
                        </div>
                    </div>
                </div>

                <div class="card rate-card">
                    <h2 class="card-title">Attendance Rate</h2>
                    <div class="rate-layout">
                        <div class="rate-stats">
                            <h3 id="periodLabel" class="period-subtitle loading">Loading...</h3>
                            <div class="stats-divider"></div>
                            <div class="stats-text">
                                <p>Present Days: <strong id="present-val" class="loading">--</strong></p>
                                <p>Total Days: <strong id="total-val" class="loading">--</strong></p>
                            </div>
                            <div class="rate-pills">
                                <span class="pill-outline">Present</span>
                                <span class="pill-solid">Absent</span>
                            </div>
                        </div>

                        <div class="pie-container">
                            <div class="pie-chart loading" id="attendancePie" style="background: #ccc;">
                                <span class="pie-label-absent" id="absentPercent">--</span>
                                <span class="pie-label-present" id="presentPercent">--</span>
                            </div>
                        </div>
                    </div>

                    <div class="attendance-feedback loading">
                        <h3 id="feedbackTitle">Analyzing Records...</h3>
                        <p id="attendanceDescription">Please wait while we fetch your attendance data.</p>
                    </div>
                </div>

            </div> 
        </main>
    </div>

    <script src="facultydashboardHOME.js"></script>
</body>
</html>