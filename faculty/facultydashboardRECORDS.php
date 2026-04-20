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
                <div class="header-content">
                    <img src="../images/Facultyicon_record.png" alt="Records Icon" class="header-icon">
                    <div class="title-container">
                        <h1>My Records</h1>
                        <div class="header-underline"></div>
                    </div>
                </div>
            </div>

            <section id="appealDetailsSection" class="details-section hidden">
                <div class="blueprint-card">
                    <div class="blueprint-header" id="modalHeader">
                        <h2 id="modalTitle">Emergency Leave</h2>
                    </div>
                    <div class="blueprint-body">
                        <div class="form-group">
                            <label>Time Type</label>
                            <input type="text" id="modalTimeType" class="gray-input" readonly>
                        </div>
                        
                        <div class="form-group">
                            <label>Date Filed</label>
                            <input type="text" id="modalDateFiled" class="gray-input" readonly>
                        </div>

                        <div class="form-row two-cols">
                            <div class="form-group">
                                <label>Start Date</label>
                                <input type="text" id="modalStartDate" class="gray-input" readonly>
                            </div>
                            <div class="form-group">
                                <label>End Date</label>
                                <input type="text" id="modalEndDate" class="gray-input" readonly>
                            </div>
                        </div>

                        <div class="form-row two-cols">
                            <div class="form-group">
                                <label>Number of Days</label>
                                <input type="text" id="modalNumDays" class="gray-input" readonly>
                            </div>
                            <div class="form-group">
                                <label>Return on</label>
                                <input type="text" id="modalReturnDate" class="gray-input" readonly>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Comment</label>
                            <textarea id="modalComment" class="gray-input" readonly></textarea>
                        </div>

                        <div class="form-group">
                            <label>Attachment</label>
                            <a id="modalAttachment" href="#" target="_blank" class="attachment-link">medical-cert.pdf</a>
                        </div>

                        <div class="blueprint-footer">
                            <span class="status-text">Status Updated By: <strong id="modalUpdatedBy">Admin</strong></span>
                            <div class="status-pill" id="modalStatus">Status: Approved</div>
                        </div>
                    </div>
                </div>
                <button onclick="hideDetails()" class="back-btn">← Back to Records</button>
            </section>

            <div id="appealsGrid" class="appeals-grid">
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