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
                    <div class="pfp-circle loading">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    </div>
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
                        <svg class="stat-icon" viewBox="0 0 513 513" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <style type="text/css">
                                .st0 { fill: currentColor; }
                            </style>
                            <path class="st0" d="M81.44,116.972c23.206,0,42.007-18.817,42.007-42.008c0-23.215-18.801-42.016-42.007-42.016
                                c-23.216,0-42.016,18.801-42.016,42.016C39.424,98.155,58.224,116.972,81.44,116.972z"/>
                            <path class="st0" d="M224.166,245.037c0-0.856-0.142-1.673-0.251-2.498l62.748-45.541c3.942-2.867,4.83-8.411,1.963-12.362
                                c-1.664-2.285-4.342-3.652-7.17-3.652c-1.877,0-3.667,0.589-5.191,1.689l-62.874,45.636c-2.341-1.068-4.909-1.704-7.65-1.704
                                h-34.178l-8.294-47.222c-4.555-23.811-14.112-42.51-34.468-42.51h-86.3C22.146,136.873,0,159.019,0,179.383v141.203
                                c0,10.178,8.246,18.432,18.424,18.432c5.011,0,0,0,12.864,0l7.005,120.424c0,10.83,8.788,19.61,19.618,19.61
                                c8.12,0,28.398,0,39.228,0c10.83,0,19.61-8.78,19.61-19.61l9.204-238.53h0.463l5.27,23.269c1.744,11.097,11.293,19.28,22.524,19.28
                                h51.534C215.92,263.461,224.166,255.215,224.166,245.037z M68.026,218.861v-67.123h24.126v67.123l-12.817,15.118L68.026,218.861z"/>
                            <polygon class="st0" points="190.326,47.47 190.326,200.869 214.452,200.869 214.452,71.595 487.874,71.595 487.874,302.131 
                                214.452,302.131 214.452,273.113 190.326,273.113 190.326,326.256 512,326.256 512,47.47 "/>
                            <path class="st0" d="M311.81,388.597c0-18.801-15.235-34.029-34.028-34.029c-18.801,0-34.036,15.228-34.036,34.029
                                c0,18.785,15.235,34.028,34.036,34.028C296.574,422.625,311.81,407.381,311.81,388.597z"/>
                            <path class="st0" d="M277.781,440.853c-24.259,0-44.866,15.919-52.782,38.199h105.565
                                C322.648,456.771,302.04,440.853,277.781,440.853z"/>
                            <path class="st0" d="M458.573,388.597c0-18.801-15.235-34.029-34.028-34.029c-18.801,0-34.036,15.228-34.036,34.029
                                c0,18.785,15.235,34.028,34.036,34.028C443.338,422.625,458.573,407.381,458.573,388.597z"/>
                            <path class="st0" d="M424.545,440.853c-24.259,0-44.866,15.919-52.783,38.199h105.565
                                C469.411,456.771,448.804,440.853,424.545,440.853z"/>
                        </svg>
                        <p><strong id="curr-class" class="loading">--</strong><br>On-Going Class</p>
                    </div>
                    <div class="icon-item">
                        <svg class="stat-icon" viewBox="0 0 347 347"fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M254.557,221.867l-43.444-9.656v-6.656h61.111V77.778c0-19.672-14.683-35.978-33.661-38.539
                            c-2.106-16.656-14.194-30.539-30.833-34.7C195.679,1.522,183.268,0,170.857,0h-4.889c-7.15,0-14.389,0.517-21.506,1.522
                            c-41.183,5.889-72.239,41.7-72.239,83.306v120.728h61.111v6.656l-43.444,9.65c-33.3,7.406-56.556,36.389-56.556,70.506v52.078
                            h277.778v-52.078C311.112,258.25,287.857,229.267,254.557,221.867z M221.339,225.867l8.556,1.9l6.262,12.516
                            c1.789,3.583,2.733,7.589,2.733,11.589c0,14.283-11.622,25.906-25.906,25.906h-4.806c-10.3,0-19.744-4.511-26.222-12.078
                            C201.906,261.75,217.6,245.889,221.339,225.867z M210.479,223.45c-3.222,18.211-19.133,32.106-38.256,32.106
                            c-19.123,0-35.033-13.894-38.256-32.106l10.478-2.328v-16.15c8.467,3.9,17.856,6.139,27.778,6.139s19.311-2.239,27.778-6.139
                            v16.15L210.479,223.45z M83.334,194.444V84.828c0-36.106,26.956-67.194,62.694-72.3c6.6-0.939,13.311-1.417,19.939-1.417h4.889
                            c11.506,0,23.011,1.417,34.183,4.206c13.383,3.35,22.739,15.328,22.739,29.128V50h5.556c15.317,0,27.778,12.461,27.778,27.778
                            v116.667h-44.939c13.894-12.228,22.717-30.083,22.717-50V83.333h-11.111v1.811c-7.467,2.822-27.644,9.3-55.556,9.3
                            c-27.912,0-48.089-6.478-55.556-9.3v-1.811h-11.111v61.111c0,19.917,8.822,37.772,22.717,50H83.334z M116.668,144.445V96.967
                            c10.189,3.45,29.694,8.589,55.556,8.589s45.367-5.139,55.556-8.589v47.478c0,30.633-24.922,55.556-55.556,55.556
                            C141.59,200.001,116.668,175.079,116.668,144.445z M108.29,240.289l6.261-12.522l8.556-1.9
                            c3.744,20.028,19.433,35.883,39.383,39.833c-6.478,7.567-15.922,12.078-26.222,12.078h-4.806
                            c-14.283,0-25.906-11.622-25.906-25.906C105.557,247.872,106.501,243.867,108.29,240.289z M300.003,333.333h-0.002h-44.444
                            v-22.222h-11.111v22.222H100.001v-22.222H88.89v22.222H44.445v-40.967c0-28.861,19.678-53.394,47.85-59.65l8.278-1.839
                            l-2.222,4.45c-2.556,5.111-3.906,10.833-3.906,16.544c0,20.411,16.606,37.017,37.017,37.017h4.806
                            c14.333,0,27.394-6.617,35.956-17.606c8.561,10.989,21.622,17.606,35.956,17.606h4.806c20.411,0,37.017-16.606,37.017-37.017
                            c0-5.711-1.35-11.433-3.906-16.55l-2.222-4.444l8.278,1.839c28.172,6.256,47.85,30.789,47.85,59.65V333.333z"/>
                        </svg>
                        <p><strong id="curr-enrolled" class="loading">--</strong><br>Total Enrolled</p>
                    </div>
                    <div class="icon-item">
                        <svg class="stat-icon" viewBox="0 0 32 32"fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M28 5.25h-24c-1.518 0.002-2.748 1.232-2.75 2.75v16c0.002 1.518 1.232 2.748 2.75 2.75h24c1.518-0.002 2.748-1.232 
                            2.75-2.75v-16c-0.002-1.518-1.232-2.748-2.75-2.75h-0zM4 6.75h24c0.69 0.001 1.249 0.56 1.25 1.25v1.25h-26.5v-1.25c0.001-0.69 
                            0.56-1.249 1.25-1.25h0zM28 25.25h-24c-0.69-0.001-1.249-0.56-1.25-1.25v-13.25h26.5v13.25c-0.001 0.69-0.56 1.249-1.25 1.25h-0zM9.645 
                            17.628c1.455 0 2.635-1.18 2.635-2.635s-1.18-2.635-2.635-2.635c-1.455 0-2.635 1.18-2.635 2.635v0c0.001 1.455 1.18 2.633 2.635 2.635h0zM9.645 
                            13.858c0.627 0 1.135 0.508 1.135 1.135s-0.508 1.135-1.135 1.135c-0.627 0-1.135-0.508-1.135-1.135 0 0 0 0 0 0v0c0.001-0.627 0.508-1.134 
                            1.135-1.135h0zM9.645 18.811c-2.15 0.009-3.947 1.51-4.41 3.52l-0.006 0.031c-0.011 0.048-0.017 0.103-0.017 0.16 0 0.414 0.336 0.75 0.75 0.75 
                            0.357 0 0.656-0.25 0.731-0.585l0.001-0.005c0.309-1.366 1.512-2.371 2.951-2.371s2.642 1.005 2.947 2.351l0.004 0.020c0.077 0.338 0.375 0.587 
                            0.732 0.587 0.414 0 0.75-0.336 0.75-0.75 0-0.056-0.006-0.11-0.018-0.163l0.001 0.005c-0.469-2.041-2.265-3.541-4.414-3.551h-0.001zM26 13.25h-8c-0.414 
                            0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h8c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0zM26 17.25h-8c-0.414 0-0.75 0.336-0.75 0.75s0.336 
                            0.75 0.75 0.75v0h8c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0zM26 21.25h-8c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h8c0.414 0 
                            0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0z"></path>
                        </svg>
                        <p><strong id="curr-present" class="loading">--</strong><br>Present Now</p>
                    </div>
                    <div class="icon-item">
                        <svg class="stat-icon" viewBox="0 0 1024 1024"fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M182.99 146.2h585.14v402.29h73.14V73.06H109.84v877.71H512v-73.14H182.99z" fill="#fff" /><path d="M256.13 219.34h438.86v73.14H256.13zM256.13 
                            365.63h365.71v73.14H256.13zM256.13 511.91h219.43v73.14H256.13zM731.55 585.06c-100.99 0-182.86 81.87-182.86 182.86s81.87 182.86 182.86 182.86c100.99 0 182.86-81.87 
                            182.86-182.86s-81.86-182.86-182.86-182.86z m0 292.57c-60.5 0-109.71-49.22-109.71-109.71 0-60.5 49.22-109.71 109.71-109.71 60.5 0 109.71 49.22 109.71 109.71 0.01 
                            60.49-49.21 109.71-109.71 109.71z" fill="#fff" /><path d="M758.99 692.08h-54.86v87.27l69.39 68.76 38.61-38.96-53.14-52.66z" fill="#fff" />
                        </svg>
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