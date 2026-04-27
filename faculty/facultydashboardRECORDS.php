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
                  
                    <div class="icon-wrapper">
                        <svg fill="#ffff" width="60px" height="60px" viewBox="0 0 512 512" id="_x30_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <path d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M256,90  c37.02,0,67.031,35.468,67.031,79.219S293.02,248.438,256,248.438s-67.031-35.468-67.031-79.219S218.98,90,256,90z M369.46,402  H142.54c-11.378,0-20.602-9.224-20.602-20.602C121.938,328.159,181.959,285,256,285s134.062,43.159,134.062,96.398  C390.062,392.776,380.839,402,369.46,402z"/>
                        </svg>
                    </div>
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