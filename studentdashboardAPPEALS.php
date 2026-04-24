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
                <a href="studentdashboardHOME.php"><span class="material-symbols-outlined">star</span><h2>Home</h2></a>
                <a href="studentdashboardSCHED.php"><span class="material-symbols-outlined">star</span><h2>View Schedule</h2></a>
                <a href="studentdashboardLEAVE.php"><span class="material-symbols-outlined">star</span><h2>Apply for Leave</h2></a>
                <a href="studentdashboardEXCUSE.php"><span class="material-symbols-outlined">star</span><h2>Request an Excuse</h2></a>
                <a href="studentdashboardAPPEALS.php" class="active"><span class="material-symbols-outlined">star</span><h2>View Appeal History</h2></a>

                <div class="below">
                    <h3>SETTINGS</h3>
                    <a href="studentlogin.php"><span class="material-symbols-outlined">star</span><h2>Log Out</h2></a>
                </div>
            </div>
        </aside>

        <main class="appeals-dashboard">
            <!-- Appeals Grid View -->
            <div id="appealsGrid" class="appeals-grid">
                <!-- Appeals will be dynamically loaded here -->
            </div>

            <!-- Appeal Detail Modal -->
            <div id="appealModal" class="appeal-modal hidden">
                <div class="modal-content">
                    <div class="modal-header" id="modalHeader">
                        <h2 id="modalTitle">Appeal Title</h2>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Time Type</label>
                            <input type="text" id="modalTimeType" readonly>
                        </div>
                        
                        <div class="form-group">
                            <label>Date Filed</label>
                            <input type="text" id="modalDateFiled" readonly>
                        </div>

                        <div class="form-row two-cols">
                            <div class="form-group">
                                <label>Start Date</label>
                                <input type="text" id="modalStartDate" readonly>
                            </div>
                            <div class="form-group">
                                <label>End Date</label>
                                <input type="text" id="modalEndDate" readonly>
                            </div>
                        </div>

                        <div class="form-row two-cols">
                            <div class="form-group">
                                <label>Number of Days</label>
                                <input type="text" id="modalNumDays" readonly>
                            </div>
                            <div class="form-group">
                                <label>Return on</label>
                                <input type="text" id="modalReturnDate" readonly>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Comment</label>
                            <textarea id="modalComment" readonly></textarea>
                        </div>

                        <div class="form-group">
                            <label>Attachment</label>
                            <a id="modalAttachment" href="#" target="_blank" class="attachment-link">medical-cert.pdf</a>
                        </div>

                        <div class="form-group">
                            <label>Status Updated By:</label>
                            <span id="modalUpdatedBy" class="updated-by-text">Ryan Justine Mondero</span>
                        </div>

                        <div class="status-badge" id="modalStatus">
                            Status: Approved
                        </div>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div id="loadingState" class="loading-state hidden">
                <span class="material-symbols-outlined spinning">sync</span>
                <p>Loading appeals...</p>
            </div>

            <!-- Empty State -->
            <div id="emptyState" class="empty-state hidden">
                <span class="material-symbols-outlined">inbox</span>
                <p>No appeals found</p>
            </div>
        </main>
    </div>

    <script src="studentdashboardAPPEALS.js"></script>
</body>
</html>