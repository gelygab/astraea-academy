<?php
session_start();
require_once 'db.php';

if (!isset($_SESSION['uid'])) {
    header('Location: studentlogin.php');
    exit();
}
$user_uid = $_SESSION['uid'];?>

<!DOCTYPE html>
<html lang="en">
<head>
    <script>
        const CURRENT_USER_UID = "<?php echo $user_uid; ?>";
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard - Home</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <link rel="stylesheet" href="studentdashboardHOME.css">
    
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
                <a href="studentdashboardHOME.php" class="active"><span class="material-symbols-outlined">star</span><h2>Home</h2></a>
                <a href="studentdashboardSCHED.php"><span class="material-symbols-outlined">star</span><h2>View Schedule</h2></a>
                <a href="studentdashboardLEAVE.php"><span class="material-symbols-outlined">star</span><h2>Apply for Leave</h2></a>
                <a href="studentdashboardEXCUSE.php"><span class="material-symbols-outlined">star</span><h2>Request an Excuse</h2></a>
                <a href="studentdashboardAPPEALS.php"><span class="material-symbols-outlined">star</span><h2>View Pending Appeals</h2></a>

                <div class="below">
                    <h3>SETTINGS</h3>
                    <a href="studentlogin.html"><span class="material-symbols-outlined">star</span><h2>Log Out</h2></a>
                </div>
            </div>
        </aside>

        <main class="student-dashboard">
            <section class="card student-card">
                <div class="card-header">
                    <h3>Student Details</h3>
                    <div class="header-controls">
                        <div class="dropdown-pill" id="customDropdown">
                            <div class="selected-wrapper">
                                 <span class="selected-value" id="displayValue">Select</span>
                                 <span class="material-symbols-outlined dropdown-arrow">expand_more</span>
                            </div>
                             <ul class="dropdown-menu" id="dropdownMenu">
                                 <li data-value="daily">Daily</li>
                                 <li data-value="weekly">Weekly</li>
                                 <li data-value="monthly">Monthly</li>
                             </ul>
                        </div>
                        <button class="download-btn" onclick="downloadData()">
                            <span class="material-symbols-outlined">download</span> Download
                        </button>
                    </div>
                </div>

                <div class="student-info-flex">
                    <div class="pfp-circle"></div>
                    <div class="info-details"> 
                        <h2 id="studentName">Loading...</h2>
                        <div id="studentDetailsGrid" class="details-grid">
                            <p><strong>UID:</strong><br><span id="uid-val">...</span></p>
                            <p><strong>Contact:</strong><br><span id="contact-val">...</span></p>
                            <p><strong>Email:</strong><br><span id="email-val">...</span></p>
                            <p><strong>Address:</strong><br><span id="address-val">...</span></p>
                        </div>
                    </div>
                </div>

                <div id="attendanceGrid" class="attendance-grid"></div>
            </section>

            <div class="main-grid-layout">
                <div class="left-column">
                    <div class="left-column-1">
                        <section class="card-content">
                            <h2>Class Days</h2>
                            <p style="font-size: 0.75rem; opacity: 0.8;">Class days for Monthly</p>
                        </section>
                        <div class="right-column-data">
                            <div id="classDaysText"><h2>--</h2><p>Days</p></div>
                        </div>
                    </div>

                    <div class="left-column-2">
                        <section class="card-content">
                            <h2>Attendance Rate</h2>
                            <span class="tag">This Month</span>
                        </section>
                        <div class="right-column-data">
                            <div id="rateCardValue"><h2>--%</h2></div>
                        </div>
                    </div>

                    <div class="left-column-3">
                        <section class="card-content">
                            <h2>Monthly Rate</h2>
                            <span class="tag">Last 6 months</span>
                        </section>
                        <div class="right-column-data">
                            <div class="pie-chart-container">
                                <svg viewBox="-1 -1 2 2" id="pieSvg" style="transform: rotate(-90deg); overflow: visible;">
                                    </svg>
                                <div id="pieTooltip" class="pie-tooltip"></div>
                            </div>
                            <div id="pieLegend" class="legend-container"></div>
                        </div>
                    </div>
                </div>

                <div class="right-column">
                    <div class="right-column-1">
                        <section class="card summary-card">
                            <h2 id="summaryTitle">Summary</h2>
                            <div class="bar-chart" id="barChartContainer"></div>
                        </section>
                    </div>

                    <div class="right-column-2">
                        <section class="card extra-card">
                            <h2>Astraea Academy</h2>
                            <p style="color: #ffe4e1; font-size: 1.2rem; margin-top: 10px;">Ad astra, Per Sapientiam</p>
                        </section>
                    </div>
                </div>
            </div> </main>
    </div> 
    <script src="studentdashboardHOME.js"></script>
</body>
</html>