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
        <img src="images/Flogin_bg.gif" alt="Background" class="background-image">
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
                        <p><strong id="curr-pending">--</strong><br>Pending Excuses</p>
                    </div>
                </div>

                <div class="card subjects-card">
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
        
                        <table id="feed-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Time In</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="feed-body"></tbody>
                        </table>

                        <div class="feed-legend">
                            <span>Status:</span>
                            <div class="legend-item"><div class="legend-box late-box"></div> Late</div>
                            <div class="legend-item"><div class="legend-box ontime-box"></div> On-Time</div>
                        </div>
                    </div>
                </div>

                <div class="card rate-card">
                    <h2>Attendance Rate</h2>
                    <div class="rate-content">
                        <div class="pie-chart" id="attendancePie">
                            <span class="pie-label-present">--%</span>
                        </div>
                        <p id="attendanceDescription">Loading attendance analytics...</p>
                    </div> 
                    <div class="pie-legend">
                        <div class="legend-present">Present</div>
                        <div class="legend-absent">Absent</div>
                    </div>  
                </div> 
            </div> 
        </main>
    </div>

    <script src="facultydashboardHOME.js"></script>
</body>
</html>