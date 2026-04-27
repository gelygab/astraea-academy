<?php 
session_start();
require_once '../db.php';

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
    <title>Student Dashboard - View Appeal History</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <link rel="stylesheet" href="studentdashboardAPPEALS.css">
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
                
                <a href="studentdashboardHOME.php">
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

                <a href="studentdashboardAPPEALS.php" class="active">
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

             <main class="appeals-dashboard">

            <div class="elegant-pink-header">
                
                <div class="floating-stars">
                    <span class="star-1">✦</span>
                    <span class="star-2">✧</span>
                    <span class="star-3">✦</span>
                    <span class="star-4">✧</span>
                    <span class="star-5">✦</span>
                </div>

                <h1>Student Appeal History</h1>
            </div>


  <section id="appealDetailsSection" class="modal-overlay hidden" onclick="hideDetails()">
    <div class="summary-card modal-content" onclick="event.stopPropagation()">
        <div class="summary-header">
            <h2>Appeal Summary</h2>
            <span class="close-x" onclick="hideDetails()">&times;</span>
        </div>
        <div class="summary-body">
            <div class="summary-row">
                <span class="label">Student Name:</span>
                <span class="value" id="detName"></span>
            </div>
            <div class="summary-row">
                <span class="label">Student ID:</span>
                <span class="value" id="detId"></span>
            </div>
            <div class="summary-row">
                <span class="label">College:</span>
                <span class="value" id="detCollege"></span>
            </div>
            <div class="summary-row">
                <span class="label">Program:</span>
                <span class="value" id="detDept"></span>
            </div>
            <div class="summary-row">
                <span class="label">Year:</span>
                <span class="value" id="detYear"></span>
            </div>
            <div class="summary-row">
                <span class="label">Block:</span>
                <span class="value" id="detBlock"></span>
            </div>
            
            <div class="summary-row">
                <span class="label">Appeal Type:</span>
                <span class="value" id="detType"></span>
            </div>
            <div class="summary-row">
                <span class="label">Date Applied:</span>
                <span class="value" id="detDate"></span>
            </div>
            <div class="summary-row">
                <span class="label">Start Date:</span>
                <span class="value" id="detStartDate"></span>
            </div>
            <div class="summary-row">
                <span class="label">End Date:</span>
                <span class="value" id="detEndDate"></span>
            </div>
            <div class="summary-row">
                <span class="label">Number of Days:</span>
                <span class="value" id="detNumDays"></span>
            </div>
            <div class="summary-row">
                <span class="label">Return on:</span>
                <span class="value" id="detReturn"></span>
            </div>
            <div class="summary-row" id="attachmentRow">
                <span class="label">Attachment:</span>
                <span class="value"><a href="#" id="detAttachment" class="attachment-link" target="_blank"></a></span>
            </div>
            <div class="summary-row">
                <span class="label">Status:</span>
                <span class="status-badge" id="detStatusBadge"></span>
            </div>
            <div class="reason-section">
                <span class="label">Reason:</span>
                <div class="reason-box" id="detReason"></div>
            </div>
        </div>
        <div class="summary-footer">
            <span class="updated-by">Status Updated By: <strong id="detUpdatedBy">Admin</strong></span>
        </div>
    </div>
</section>

            <div id="appealsGrid" class="appeals-grid">
                
                <div class="appeal-card pending">
                    <div class="appeal-header">
                        <div class="appeal-type">
                            <div class="appeal-type-icon leave">
                                <span class="material-symbols-outlined">description</span>
                            </div>
                            <div class="appeal-type-info">
                                <h4>Sick Leave</h4>
                                <p>Applied on: March 5, 2026</p>
                            </div>
                        </div>
                        <div class="status-badge pending">Pending</div>
                    </div>
                    <div class="appeal-details">
                        <div class="appeal-detail-row">
                            <span class="label">Student Name</span>
                            <span class="value">Santos, Maria</span>
                        </div>
                        <div class="appeal-detail-row">
                            <span class="label">Student ID</span>
                            <span class="value">55556</span>
                        </div>
                        <div class="appeal-detail-row">
                            <span class="label">College</span>
                            <span class="value">College of Education</span>
                        </div>
                        <div class="appeal-detail-row">
                            <span class="label">Program</span>
                            <span class="value">Elementary Education</span>
                        </div>
                    </div>
                    <div class="appeal-actions">
                        <button class="view-btn">View Appeal Summary</button>
                    </div>
                </div>

                <div class="appeal-card approved">
                    <div class="appeal-header">
                        <div class="appeal-type">
                            <div class="appeal-type-icon excuse">
                                <span class="material-symbols-outlined">schedule</span>
                            </div>
                            <div class="appeal-type-info">
                                <h4>Leave of Absence</h4>
                                <p>Applied on: February 22, 2026</p>
                            </div>
                        </div>
                        <div class="status-badge approved">Approved</div>
                    </div>
                    <div class="appeal-details">
                        <div class="appeal-detail-row">
                            <span class="label">Student Name</span>
                            <span class="value">Reyes, Pedro</span>
                        </div>
                        <div class="appeal-detail-row">
                            <span class="label">Student ID</span>
                            <span class="value">55557</span>
                        </div>
                        <div class="appeal-detail-row">
                            <span class="label">College</span>
                            <span class="value">College of Science</span>
                        </div>
                        <div class="appeal-detail-row">
                            <span class="label">Program</span>
                            <span class="value">Psychology</span>
                        </div>
                    </div>
                    <div class="appeal-actions">
                        <button class="view-btn">View Appeal Summary</button>
                    </div>
                </div>

                <div class="appeal-card rejected">
                    <div class="appeal-header">
                        <div class="appeal-type">
                            <div class="appeal-type-icon excuse">
                                <span class="material-symbols-outlined">schedule</span>
                            </div>
                            <div class="appeal-type-info">
                                <h4>Medical Appointment</h4>
                                <p>Applied on: March 8, 2026</p>
                            </div>
                        </div>
                        <div class="status-badge rejected">Rejected</div>
                    </div>
                    <div class="appeal-details">
                        <div class="appeal-detail-row">
                            <span class="label">Student Name</span>
                            <span class="value">Garcia, Ana</span>
                        </div>
                        <div class="appeal-detail-row">
                            <span class="label">Student ID</span>
                            <span class="value">55558</span>
                        </div>
                        <div class="appeal-detail-row">
                            <span class="label">College</span>
                            <span class="value">College of Engineering</span>
                        </div>
                        <div class="appeal-detail-row">
                            <span class="label">Program</span>
                            <span class="value">Computer Engineering</span>
                        </div>
                    </div>
                    <div class="appeal-actions">
                        <button class="view-btn">View Appeal Summary</button>
                    </div>
                </div>

            </div>

            <div id="loadingState" class="loading-state hidden">
                <span class="material-symbols-outlined spinning">sync</span>
                <p>Loading records...</p>
            </div>

            <div id="emptyState" class="empty-state hidden">
                <span class="material-symbols-outlined">inbox</span>
                <p>No appeals found</p>
            </div>
        </main>
    </div>

    <script src="studentdashboardAPPEALS.js"></script>
</body>
</html>