<?php
session_start();
require_once '../db.php';

if (!isset($_SESSION['uid'])) {
    header('Location: adminlogin.php');
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
    <title>Astraea Academy - Faculty Appeal History</title>
    <link rel="stylesheet" href="adminAPPEALFACULTY.css">

</head>
<body>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <img src="../images/AA_Logo.png" alt="Astraea Academy Logo" class="logo">
                <div class="logo-text">
                    <h2>Astraea Academy</h2>
                </div>
            </div>

            <nav class="sidebar-nav">
                <p class="nav-label">MAIN MENU</p>

                <a href="admindashboardHOME.php" class="nav-item">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span class="nav-text">Home</span>
                </a>

                <div class="nav-group ">
                    <button class="nav-item nav-toggle " onclick="toggleNavGroup(this)">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                        </svg>
                        <span class="nav-text">View Team Reports</span>
                        <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    <div class="nav-submenu">
                        <a href="adminSTUDENTREPORT.php" class="nav-subitem">
                            <svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span class="nav-text">Student</span>
                        </a>
                        <a href="adminFACULTYREPORT.php" class="nav-subitem ">
                            <svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span class="nav-text">Faculty</span>
                        </a>
                    </div>
                </div>

                <div class="nav-group open">
                    <button class="nav-item nav-toggle active" onclick="toggleNavGroup(this)">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span class="nav-text">View Appeal History</span>
                        <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    <div class="nav-submenu">
                        <a href="adminAPPEALSTUDENT.php" class="nav-subitem ">
                            <svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span class="nav-text">Student</span>
                        </a>
                        <a href="adminAPPEALFACULTY.php" class="nav-subitem active">
                            <svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span class="nav-text">Faculty</span>
                        </a>
                    </div>
                </div>
            </nav>

            <div class="sidebar-footer">
                <a href="#" class="nav-item logout">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span class="nav-text">Log Out</span>
                </a>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Page Header -->
            <div class="page-header">
                <h1>View Appeal History</h1>
                <p>Faculty Appeals</p>
            </div>

            <!-- Filters Section -->
            <div class="filters-section">
                <div class="filter-group">
                    <label for="appealType">Select Appeal Type</label>
                    <select id="appealType">
                        <option value="">All Types</option>
                        <option value="excuse">Excuse</option>
                        <option value="leave">Leave</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label for="appealStatus">Select Appeal Status</label>
                    <select id="appealStatus">
                        <label for="appealType">Select Appeal Type</label>
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label for="college">College</label>
                        <select id="college">
                            <option value="">All Colleges</option>
                            <option value="engineering">Engineering</option>
                            <option value="education">Education</option>
                            <option value="chass">Humanities, Arts, and Social Sciences</option>
                        </select>
                    </div>
                 <div class="filter-group">
                        <label for="department">Department</label>
                        <select id="department">
                            <option value="">All Departments</option>
                            <!-- Departments populated dynamically via JavaScript -->
                        </select>
                    </div>
                </div>

            <!-- Appeals Grid -->
            <div class="appeals-grid" id="appealsGrid">
                <!-- Appeal cards will be dynamically generated -->
            </div>
        </main>
    </div>

     <!-- Appeal Summary Modal -->
    <div class="modal" id="summaryModal">
        <div class="modal-content summary-modal">
            <div class="modal-header">
                <h2>Appeal Summary</h2>
                <button class="close-btn" onclick="closeModal('summaryModal')">&times;</button>
            </div>
            <div class="modal-body">
                <div class="appeal-detail-section">
                    <div class="detail-row">
                        <span class="detail-label">Faculty Name:</span>
                        <span class="detail-value" id="summaryName">-</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Faculty ID:</span>
                        <span class="detail-value" id="summaryID">-</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">College:</span>
                        <span class="detail-value" id="summaryCollege">-</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Department:</span>
                        <span class="detail-value" id="summaryDepartment">-</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Appeal Type:</span>
                        <span class="detail-value" id="summaryType">-</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value status-badge" id="summaryStatus">-</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Date Applied:</span>
                        <span class="detail-value" id="summaryDate">-</span>
                    </div>
                      <div class="detail-row">
                        <span class="detail-label">Start Date:</span>
                        <span class="detail-value" id="summaryStartDate">-</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">End Date:</span>
                        <span class="detail-value" id="summaryEndDate">-</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Number of Days:</span>
                        <span class="detail-value" id="summaryDays">-</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Return on:</span>
                        <span class="detail-value" id="summaryReturnDate">-</span>
                    </div>
                     <div class="attachment-detail-row">
                         <span class="detail-label">Attachment:</span>
                        <p class="detail-text" id="summaryAttachment">
                            <a href="#" target="blank" class="attachment-link">View Attachment</a>
                        </p>
                    </div>
                    <div class="detail-row full-width">
                        <span class="detail-label">Reason:</span>
                        <p class="detail-text" id="summaryReason">-</p>
                    </div>
                    <div class="detail-row-subject-affected">
                        <span class="detail-label">Subject Affected:</span>
                        <span class="detail-value" id="summarySubjectAffected">-</span>
                    </div>
                    <div class="detail-row-footer">
                        <span class="detail-label">Status Updated By:</span>
                        <span class="detail-text" id="summaryUpdatedBy">-</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Update Status Modal -->
    <div class="modal" id="updateStatusModal">
        <div class="modal-content status-modal">
            <div class="modal-header">
                <h2>Update Appeal Status</h2>
                <button class="close-btn" onclick="closeModal('updateStatusModal')">&times;</button>
            </div>
            <div class="modal-body">
                <div class="status-info">
                    <p>Updating status for appeal from <strong id="statusFacultyName">-</strong></p>
                    <p class="current-status">Current Status: <span id="statusCurrent">-</span></p>
                </div>
                
                
                     <!-- Conflict Warning Section (hidden by default) -->
                    <div id="statusConflictWarning" style="display: none; border: 1.5px solid #85262C; border-radius: 12px; padding: 15px; margin-bottom: 20px; background-color: #fff; box-shadow: 0 2px 10px rgba(133, 38, 44, 0.1);">
                    <div style="display: flex; align-items: center; gap: 10px; color: #b8252f; margin-bottom: 15px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        <strong style="font-size: 14px;">Warning: This leave overlaps with <span id="statusConflictCount">0</span> of your handled subjects.</strong>
                    </div>
                    
                    <div style="border: 2px solid #7a661a; border-radius: 8px; overflow: hidden;">
                        <div style="background: #F8F9FA; padding: 10px 15px; border-bottom: 1px solid #9a801a; display: flex; justify-content: space-between; font-weight: bold; font-size: 12px; color: #4A3628; text-transform: uppercase; letter-spacing: 0.5px;">
                            <span>Affected Classes</span>
                            <span>Time</span>
                        </div>
                        <div id="statusAffectedClassesList">
                            </div>
                    </div>
                </div>

                <div class="status-options">
                    <p class="options-label">Select New Status:</p>
                    <div class="status-buttons">
                        <button class="status-btn approve" onclick="updateStatus('approved')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            Approve
                        </button>
                        <button class="status-btn reject" onclick="updateStatus('rejected')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                            Reject
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="adminAPPEALFACULTY.js"></script>
</body>
</html>