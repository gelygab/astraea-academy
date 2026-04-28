<?php
session_start();
include '../db.php';

if (!isset($_SESSION['user_uid'])) {
    header("Location: ../login.php");
    exit();
}

$faculty_uid = $_SESSION['user_uid'];

// ─────────────────────────────────────────────
// GET FACULTY'S teacher_id
// ─────────────────────────────────────────────
$teacher_stmt = mysqli_prepare($conn, "SELECT teacher_id FROM teacher_id WHERE user_uid = ?");
mysqli_stmt_bind_param($teacher_stmt, 's', $faculty_uid);
mysqli_stmt_execute($teacher_stmt);
$teacher_row = mysqli_fetch_assoc(mysqli_stmt_get_result($teacher_stmt));
mysqli_stmt_close($teacher_stmt);

if (!$teacher_row) {
    die("Error: Faculty record not found. Please contact the administrator.");
}
$teacher_id = $teacher_row['teacher_id'];

// ─────────────────────────────────────────────
// FETCH UNIQUE SUBJECTS HANDLED BY THIS FACULTY
// ─────────────────────────────────────────────
$subjects_stmt = mysqli_prepare($conn, "
    SELECT MIN(schedule_id) AS schedule_id,
           subject_name,
           subject_code
    FROM schedule_id
    WHERE teacher_id = ?
    GROUP BY subject_name, subject_code
    ORDER BY subject_name ASC
");
mysqli_stmt_bind_param($subjects_stmt, 'i', $teacher_id);
mysqli_stmt_execute($subjects_stmt);
$subjects_result = mysqli_stmt_get_result($subjects_stmt);
$subjects = [];
while ($row = mysqli_fetch_assoc($subjects_result)) {
    $subjects[] = $row;
}
mysqli_stmt_close($subjects_stmt);

// ─────────────────────────────────────────────
// FETCH DEPARTMENTS
// ─────────────────────────────────────────────
$dept_result = mysqli_query($conn, "SELECT department_id, department_name, department_code FROM department_id");
$departments = [];
while ($row = mysqli_fetch_assoc($dept_result)) {
    $departments[$row['department_id']] = $row;
}

// ─────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────
function formatTimeType($type) {
    $map = [
        'emergency_leave'          => 'Emergency Leave',
        'sick_leave'               => 'Sick Leave',
        'leave_of_absence'         => 'Leave of Absence',
        'other_leave'              => 'Other Leave',
        'extracurricular_activity' => 'Extracurricular Activity',
        'medical_appointment'      => 'Medical Appointment',
        'personal_emergency'       => 'Personal Emergency',
        'other_excuse'             => 'Other Excuse',
    ];
    return $map[$type] ?? ucwords(str_replace('_', ' ', $type));
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Faculty Dashboard - Student Records</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <link href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="facultydashboardSTUDENT.css">
</head>
<body>
<input type="file" id="pfpInput" style="display:none;" accept="image/*">
<div class="background-container">
    <img src="../images/Flogin_bg.gif" alt="Background" class="background-image">
</div>

<div class="container">
    <?php include 'faculty_sidebar.php'; ?>

    <main class="class-list-dashboard">

        <!-- ═══ HEADER BANNER ═══ -->
        <div class="master-header-card">
            <div class="floating-stars">
                <span class="material-symbols-outlined star-1">auto_awesome</span>
                <span class="material-symbols-outlined star-2">star</span>
                <span class="material-symbols-outlined star-3">auto_awesome</span>
                <span class="material-symbols-outlined star-4">star_border</span>
                <span class="material-symbols-outlined star-5">star</span>
            </div>
            <div class="header-content">
                <div class="icon-wrapper">
                    <img src="../images/student records.png" alt="Student Records" class="header-icon">
                </div>
                <div class="header-text-container">
                    <h1>Student Records</h1>
                    <div class="modern-toggle-switch">
                        <div class="toggle-slider" id="toggle-slider"></div>
                        <button id="btn-excuse" class="toggle-tab active">Excuse Requests</button>
                        <button id="btn-leave"  class="toggle-tab">Leave Requests</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- ═══ FILTER CARD ═══ -->
        <div class="card filter-card">
            <h2>Select Class</h2>
            <div class="filter-controls">

                <div class="input-group full-width">
                    <label>Subject</label>
                    <select id="subject-select" required>
                        <option value="" disabled selected hidden>Select a subject</option>
                        <?php foreach ($subjects as $s): ?>
                            <option
                                value="<?= $s['schedule_id'] ?>"
                                data-code="<?= htmlspecialchars($s['subject_code']) ?>">
                                <?= htmlspecialchars($s['subject_name']) ?> (<?= htmlspecialchars($s['subject_code']) ?>)
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="filter-row">
                    <div class="input-group">
                        <label>Program</label>
                        <select id="program-select" required disabled>
                            <option value="" disabled selected hidden>Select subject first</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Block</label>
                        <select id="block-select" required disabled>
                            <option value="" disabled selected hidden>Select program first</option>
                        </select>
                    </div>
                </div>

            </div>
        </div>

        <!-- Prompt before filter -->
        <div id="no-filter-msg" style="text-align:center; padding:30px; color:#888; font-family:'Inter',sans-serif;">
            <span class="material-symbols-outlined" style="font-size:3rem; display:block; margin-bottom:10px; color:#ccc;">filter_list</span>
            Please select a Subject, Program, and Block to view student records.
        </div>

        <!-- ═══ EXCUSE SECTION ═══ -->
        <div id="excuse-section" class="section-wrapper" style="display:none;">
            <div class="requests-container">
                <div class="tabs-header">
                    <div class="tab active" data-target="e-pending-tab">Pending <span class="badge" id="e-pending-count"></span></div>
                    <div class="tab" data-target="e-approved-tab">Approved</div>
                    <div class="tab" data-target="e-declined-tab">Declined</div>
                </div>
                <div class="main-white-box">

                    <!-- EXCUSE PENDING -->
                    <div id="e-pending-tab" class="tab-content">
                        <div class="tab-top-controls" id="e-pending-controls">
                            <input type="text" class="search-input e-search" placeholder="Search Name...">
                            <div class="sort-dropdown-container">
                                <button class="sort-btn">Sort <span>⇌</span></button>
                                <div class="sort-menu" style="display:none;">
                                    <a href="#" data-sort="newest" data-view="e-pending-view" data-type="card">Newest to Oldest</a>
                                    <a href="#" data-sort="oldest" data-view="e-pending-view" data-type="card">Oldest to Newest</a>
                                </div>
                            </div>
                        </div>
                        <h2 class="box-title" id="e-pending-title">Pending Requests</h2>
                        <div id="e-pending-view"></div>
                        <div id="e-pending-detail" style="display:none;">
                            <div class="detail-card-layout">
                                <div class="detail-top-actions"><button class="back-btn" id="e-pending-back-btn">Back</button></div>
                                <div class="detail-content-row">
                                    <div class="detail-left-col admin-style-details" id="e-pending-detail-info"></div>
                                    <div class="detail-right-col">
                                        <div class="comment-section">
                                            <label><strong>Comment:</strong></label>
                                            <textarea class="comment-area" id="e-pending-comment" placeholder="Add a comment..."></textarea>
                                        </div>
                                        <div class="detail-action-buttons right-aligned-buttons">
                                            <button class="action-btn decline-btn e-trigger-decline">Decline</button>
                                            <button class="action-btn approve-btn e-trigger-approve">Approve</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- EXCUSE APPROVED -->
                    <div id="e-approved-tab" class="tab-content" style="display:none;">
                        <div class="tab-top-controls" id="e-approved-controls">
                            <input type="text" class="search-input e-app-search" placeholder="Search Name...">
                            <div class="sort-dropdown-container">
                                <button class="sort-btn">Sort <span>⇌</span></button>
                                <div class="sort-menu" style="display:none;">
                                    <a href="#" data-sort="newest" data-view="e-approved-view" data-type="table">Newest to Oldest</a>
                                    <a href="#" data-sort="oldest" data-view="e-approved-view" data-type="table">Oldest to Newest</a>
                                </div>
                            </div>
                        </div>
                        <h2 class="box-title" id="e-approved-title">Approved Requests</h2>
                        <div id="e-approved-view"></div>
                        <div id="e-approved-detail" style="display:none;">
                            <div class="detail-card-layout">
                                <div class="detail-top-actions"><button class="back-btn" id="e-approved-back-btn">Back</button></div>
                                <div class="detail-content-row">
                                    <div class="detail-left-col admin-style-details" id="e-approved-detail-info"></div>
                                    <div class="detail-right-col">
                                        <div class="comment-section">
                                            <label><strong>Comment:</strong></label>
                                            <textarea readonly class="comment-area" id="e-approved-comment"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- EXCUSE DECLINED -->
                    <div id="e-declined-tab" class="tab-content" style="display:none;">
                        <div class="tab-top-controls" id="e-declined-controls">
                            <input type="text" class="search-input e-dec-search" placeholder="Search Name...">
                            <div class="sort-dropdown-container">
                                <button class="sort-btn">Sort <span>⇌</span></button>
                                <div class="sort-menu" style="display:none;">
                                    <a href="#" data-sort="newest" data-view="e-declined-view" data-type="table">Newest to Oldest</a>
                                    <a href="#" data-sort="oldest" data-view="e-declined-view" data-type="table">Oldest to Newest</a>
                                </div>
                            </div>
                        </div>
                        <h2 class="box-title" id="e-declined-title">Declined Requests</h2>
                        <div id="e-declined-view"></div>
                        <div id="e-declined-detail" style="display:none;">
                            <div class="detail-card-layout">
                                <div class="detail-top-actions"><button class="back-btn" id="e-declined-back-btn">Back</button></div>
                                <div class="detail-content-row">
                                    <div class="detail-left-col admin-style-details" id="e-declined-detail-info"></div>
                                    <div class="detail-right-col">
                                        <div class="comment-section">
                                            <label><strong>Comment:</strong></label>
                                            <textarea readonly class="comment-area" id="e-declined-comment"></textarea>
                                        </div>
                                        <div class="detail-action-buttons right-aligned-buttons">
                                            <button class="action-btn e-trigger-reeval" style="background-color:#B88B2D;">Edit Status</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ═══ LEAVE SECTION ═══ -->
        <div id="leave-section" class="section-wrapper" style="display:none;">
            <div class="requests-container">
                <div class="tabs-header">
                    <div class="tab active" data-target="l-pending-tab">Pending <span class="badge" id="l-pending-count"></span></div>
                    <div class="tab" data-target="l-approved-tab">Approved</div>
                    <div class="tab" data-target="l-declined-tab">Declined</div>
                </div>
                <div class="main-white-box">

                    <!-- LEAVE PENDING -->
                    <div id="l-pending-tab" class="tab-content">
                        <div class="tab-top-controls" id="l-pending-controls">
                            <input type="text" class="search-input l-search" placeholder="Search Name...">
                            <div class="sort-dropdown-container">
                                <button class="sort-btn">Sort <span>⇌</span></button>
                                <div class="sort-menu" style="display:none;">
                                    <a href="#" data-sort="newest" data-view="l-pending-view" data-type="card">Newest to Oldest</a>
                                    <a href="#" data-sort="oldest" data-view="l-pending-view" data-type="card">Oldest to Newest</a>
                                </div>
                            </div>
                        </div>
                        <h2 class="box-title" id="l-pending-title">Pending Requests</h2>
                        <div id="l-pending-view"></div>
                        <div id="l-pending-detail" style="display:none;">
                            <div class="detail-card-layout">
                                <div class="detail-top-actions"><button class="back-btn" id="l-pending-back-btn">Back</button></div>
                                <div class="detail-content-row">
                                    <div class="detail-left-col admin-style-details" id="l-pending-detail-info"></div>
                                    <div class="detail-right-col">
                                        <div class="comment-section">
                                            <label><strong>Comment:</strong></label>
                                            <textarea class="comment-area" id="l-pending-comment" placeholder="Add a comment..."></textarea>
                                        </div>
                                        <div class="detail-action-buttons right-aligned-buttons">
                                            <button class="action-btn decline-btn l-trigger-decline">Decline</button>
                                            <button class="action-btn approve-btn l-trigger-approve">Approve</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- LEAVE APPROVED -->
                    <div id="l-approved-tab" class="tab-content" style="display:none;">
                        <div class="tab-top-controls" id="l-approved-controls">
                            <input type="text" class="search-input l-app-search" placeholder="Search Name...">
                            <div class="sort-dropdown-container">
                                <button class="sort-btn">Sort <span>⇌</span></button>
                                <div class="sort-menu" style="display:none;">
                                    <a href="#" data-sort="newest" data-view="l-approved-view" data-type="table">Newest to Oldest</a>
                                    <a href="#" data-sort="oldest" data-view="l-approved-view" data-type="table">Oldest to Newest</a>
                                </div>
                            </div>
                        </div>
                        <h2 class="box-title" id="l-approved-title">Approved Requests</h2>
                        <div id="l-approved-view"></div>
                        <div id="l-approved-detail" style="display:none;">
                            <div class="detail-card-layout">
                                <div class="detail-top-actions"><button class="back-btn" id="l-approved-back-btn">Back</button></div>
                                <div class="detail-content-row">
                                    <div class="detail-left-col admin-style-details" id="l-approved-detail-info"></div>
                                    <div class="detail-right-col">
                                        <div class="comment-section">
                                            <label><strong>Comment:</strong></label>
                                            <textarea readonly class="comment-area" id="l-approved-comment"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- LEAVE DECLINED -->
                    <div id="l-declined-tab" class="tab-content" style="display:none;">
                        <div class="tab-top-controls" id="l-declined-controls">
                            <input type="text" class="search-input l-dec-search" placeholder="Search Name...">
                            <div class="sort-dropdown-container">
                                <button class="sort-btn">Sort <span>⇌</span></button>
                                <div class="sort-menu" style="display:none;">
                                    <a href="#" data-sort="newest" data-view="l-declined-view" data-type="table">Newest to Oldest</a>
                                    <a href="#" data-sort="oldest" data-view="l-declined-view" data-type="table">Oldest to Newest</a>
                                </div>
                            </div>
                        </div>
                        <h2 class="box-title" id="l-declined-title">Declined Requests</h2>
                        <div id="l-declined-view"></div>
                        <div id="l-declined-detail" style="display:none;">
                            <div class="detail-card-layout">
                                <div class="detail-top-actions"><button class="back-btn" id="l-declined-back-btn">Back</button></div>
                                <div class="detail-content-row">
                                    <div class="detail-left-col admin-style-details" id="l-declined-detail-info"></div>
                                    <div class="detail-right-col">
                                        <div class="comment-section">
                                            <label><strong>Comment:</strong></label>
                                            <textarea readonly class="comment-area" id="l-declined-comment"></textarea>
                                        </div>
                                        <div class="detail-action-buttons right-aligned-buttons">
                                            <button class="action-btn l-trigger-reeval" style="background-color:#B88B2D;">Edit Status</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </main>
</div>

<!-- MODALS -->
<div id="modal-overlay" class="modal-overlay"></div>
<div id="e-approve-modal" class="modal">
    <div class="modal-header" style="background-color:#2F8C2F;">Request Approved!</div>
    <div class="modal-body">
        <p><strong>Attendance record has been updated to Excused.</strong></p>
        <button class="modal-btn e-back-pending">Back to Pending Requests</button>
    </div>
</div>
<div id="l-approve-modal" class="modal">
    <div class="modal-header" style="background-color:#2F8C2F;">Leave Request Approved!</div>
    <div class="modal-body">
        <p><strong>Student will be marked as 'On Leave' for the specified dates.</strong></p>
        <button class="modal-btn l-back-pending">Back to Pending Requests</button>
    </div>
</div>
<div id="decline-success-modal" class="modal">
    <div class="modal-header" style="background-color:#9C2727;">Request Declined!</div>
    <div class="modal-body">
        <p><strong>The student will be marked as Absent.</strong></p>
        <button class="modal-btn reset-pending-btn">Back to Pending Requests</button>
    </div>
</div>
<div id="reeval-confirm-modal" class="modal">
    <div class="modal-header" style="background-color:#C19321;">Update Appeal Status</div>
    <div class="modal-body">
        <p><strong>Are you sure? This will move the record back to Pending.</strong></p>
        <div class="modal-action-row" style="justify-content:center; gap:15px;">
            <button id="cancel-reeval-btn" class="modal-btn" style="background-color:#9C2727;color:#fff;">Cancel</button>
            <button id="confirm-reeval-btn" class="modal-btn" style="background-color:#2F8C2F;color:#fff;">Confirm</button>
        </div>
    </div>
</div>
<div id="reeval-success-modal" class="modal">
    <div class="modal-header" style="background-color:#C19321;">Update Appeal Status</div>
    <div class="modal-body">
        <p><strong>Success! Request moved back to Pending.</strong></p>
        <button class="modal-btn reset-pending-btn" style="background-color:#E0E0E0;color:#333;">Back to Pending Requests</button>
    </div>
</div>
<div id="loading-indicator" style="display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2000;background:rgba(0,0,0,0.7);color:#fff;padding:20px 40px;border-radius:12px;font-size:16px;font-family:'Inter',sans-serif;">
    Processing...
</div>

<script>
    const departmentsData = <?= json_encode($departments) ?>;
</script>
<script src="facultydashboardSTUDENT.js"></script>
</body>
</html>