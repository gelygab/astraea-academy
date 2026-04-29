<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Faculty Dashboard - My Records</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <link rel="stylesheet" href="facultydashboardRECORDS.css">
</head>
<body>
    <div class="background-container">
        <img src="../images/Flogin_bg.gif" alt="Background" class="background-image">
    </div>

    <div class="container">
        <?php include 'faculty_sidebar.php'; ?>

        <main class="appeals-dashboard">

            <div class="header-card">

                <div class="floating-stars">
                    <span class="material-symbols-outlined star-1">auto_awesome</span>
                    <span class="material-symbols-outlined star-2">star</span>
                    <span class="material-symbols-outlined star-3">auto_awesome</span>
                    <span class="material-symbols-outlined star-4">star_border</span>
                    <span class="material-symbols-outlined star-5">star</span>
                </div>

                <div class="header-content">
                  
                    <img src="../images/my records.png" alt="Records Icon" class="header-icon">
                    <div class="title-container">
                        <h1>My Records</h1>
                        <div class="header-underline"></div>
                    </div>
  
                </div>
            </div>

          <section id="appealDetailsSection" class="modal-overlay hidden" onclick="hideDetails()">
    <div class="summary-card modal-content" onclick="event.stopPropagation()">

        <div class="summary-header">
         <h2>Appeal Summary</h2>
        <span class="close-x" onclick="hideDetails()">&times;</span>
        </div>
        <div class="summary-body">
            <div class="summary-row">
                <span class="label">Faculty Name:</span>
                <span class="value" id="detName"></span>
            </div>
            <div class="summary-row">
                <span class="label">Faculty ID:</span>
                <span class="value" id="detId"></span>
            </div>
            <div class="summary-row">
                <span class="label">College:</span>
                <span class="value" id="detCollege"></span>
            </div>
            <div class="summary-row">
                <span class="label">Department:</span>
                <span class="value" id="detDept"></span>
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

        <div id="appealsGrid" class="appeals-grid"></div>

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

<script src="facultydashboardRECORDS.js"></script>
</body>
</html>
                            <div class="appeal-type-info">
                                <h4>Sick Leave</h4>
                                <p>Applied on: March 5, 2026</p>
                            </div>
                        </div>
                        <div class="status-badge pending">Pending</div>
                    </div>
                    <div class="appeal-details">
                        <div class="appeal-detail-row">
                            <span class="label">Faculty Name</span>
                            <span class="value">Santos, Maria</span>
                        </div>
                        <div class="appeal-detail-row">
                            <span class="label">Faculty ID</span>
                            <span class="value">55556</span>
                        </div>
                        <div class="appeal-detail-row">
                            <span class="label">College</span>
                            <span class="value">College of Education</span>
                        </div>
                        <div class="appeal-detail-row">
                            <span class="label">Department</span>
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
                            <span class="label">Faculty Name</span>
                            <span class="value">Reyes, Pedro</span>
                        </div>
                        <div class="appeal-detail-row">
                            <span class="label">Faculty ID</span>
                            <span class="value">55557</span>
                        </div>
                        <div class="appeal-detail-row">
                            <span class="label">College</span>
                            <span class="value">College of Humanities, Arts, and Social Sciences</span>
                        </div>
                        <div class="appeal-detail-row">
                            <span class="label">Department</span>
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
                            <span class="label">Faculty Name</span>
                            <span class="value">Garcia, Ana</span>
                        </div>
                        <div class="appeal-detail-row">
                            <span class="label">Faculty ID</span>
                            <span class="value">55558</span>
                        </div>
                        <div class="appeal-detail-row">
                            <span class="label">College</span>
                            <span class="value">College of Engineering</span>
                        </div>
                        <div class="appeal-detail-row">
                            <span class="label">Department</span>
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

    <script src="facultydashboardRECORDS.js"></script>
</body>
</html>