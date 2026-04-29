<?php
session_start();
require_once '../db.php';


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
               
                <a href="studentdashboardHOME.php" class="active">
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


                <a href="studentdashboardLEAVE.php">
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
                    <span class="nav-text">View Pending Appeals</span>
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
            <section class="card student-card">
                <div class="card-header">
                    <div class="header-controls">
                        <div class="dropdown-pill" id="customDropdown">
                            <div class="selected-wrapper">
                                 <span class="selected-value" id="displayValue">Monthly</span>
                                 <span class="material-symbols-outlined dropdown-arrow">expand_more</span>
                            </div>
                             <ul class="dropdown-menu" id="dropdownMenu">
                                 <li data-value="daily">Daily</li>
                                 <li data-value="weekly">Weekly</li>
                                 <li data-value="monthly">Monthly</li>
                             </ul>
                        </div>
                        <button class="download-btn" id="downloadReportBtn">
                            <span class="material-symbols-outlined">download</span> Download
                        </button>
                    </div>
                </div>


                <div class="student-info-flex">
                    <div class="pfp-circle">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    </div>
                    <div class="info-details">
                        <h2 id="studentName" class="stylized-name loading">Loading...</h2>
                        <div id="studentDetailsGrid" class="details-grid">
                            <p><strong>UID:</strong><br><span id="uid-val">...</span></p>
                            <p><strong>Contact:</strong><br><span id="contact-val">...</span></p>
                            <p><strong>Email:</strong><br><span id="email-val">...</span></p>
                            <p><strong>Address:</strong><br><span id="address-val">...</span></p>
                        </div>
                    </div>
                </div>
            </section>


            <div id="attendanceGrid" class="attendance-grid" style="min-height: 100px;"></div>


            <div class="main-grid-layout">
                <div class="left-column">
                    <div class="left-column-1">
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


                    <div class="left-column-2">
                        <section class="card extra-card">
                            <h2>Astraea Academy</h2>
                            <p>Ad astra, Per Sapientiam</p>
                        </section>
                    </div>
                </div>


                <div class="right-column">
                    <div class="right-column-1">
                        <section class="card-content">
                            <h2>Attendance Rate</h2>
                            <span class="tag">This Month</span>
                        </section>
                        <div class="right-column-data">
                            <div id="rateCardValue"><h2>--%</h2></div>
                        </div>
                    </div>


                    <div class="right-column-2">
                        <section class="card-content">
                            <h2>Class Days</h2>
                            <p style="font-size: 0.75rem; opacity: 0.8;">Class days for Monthly</p>
                        </section>
                        <div class="right-column-data">
                            <div id="classDaysText"><h2>--</h2><p>Days</p></div>
                        </div>
                    </div>


                    <div class="right-column-3">
                        <section class="card summary-card">
                            <h2 id="summaryTitle">Summary</h2>
                            <div class="bar-chart" id="barChartContainer"></div>
                        </section>
                    </div>
                </div>
            </div> </main>
    </div>
    <script src="studentdashboardHOME.js"></script>
</body>
</html>



