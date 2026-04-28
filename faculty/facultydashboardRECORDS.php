<?php
session_start();
include '../db.php';

if (!isset($_SESSION['user_uid'])) {
    header("Location: ../login.php");
    exit();
}

$user_uid = $_SESSION['user_uid'];

// ─────────────────────────────────────────────
// GET FACULTY'S teacher_id
// ─────────────────────────────────────────────
$t_stmt = mysqli_prepare($conn, "SELECT teacher_id FROM teacher_id WHERE user_uid = ?");
mysqli_stmt_bind_param($t_stmt, 's', $user_uid);
mysqli_stmt_execute($t_stmt);
$t_row = mysqli_fetch_assoc(mysqli_stmt_get_result($t_stmt));
mysqli_stmt_close($t_stmt);

$teacher_id = $t_row ? $t_row['teacher_id'] : null;

// ─────────────────────────────────────────────
// FETCH ALL FACULTY SCHEDULES
// ─────────────────────────────────────────────
$schedules = [];
if ($teacher_id) {
    $sched_stmt = mysqli_prepare($conn, "
        SELECT DISTINCT subject_name, subject_code, day_week, start_time, schedule_id
        FROM schedule_id
        WHERE teacher_id = ?
    ");
    mysqli_stmt_bind_param($sched_stmt, 'i', $teacher_id);
    mysqli_stmt_execute($sched_stmt);
    $sched_result = mysqli_stmt_get_result($sched_stmt);
    while ($row = mysqli_fetch_assoc($sched_result)) {
        $schedules[] = $row;
    }
    mysqli_stmt_close($sched_stmt);
}

// ─────────────────────────────────────────────
// FETCH APPEALS
// ─────────────────────────────────────────────
$sql = "
    SELECT
        a.*,
        t.first_name,
        t.last_name,
        t.teacher_id,
        d.department_name,
        d.department_code,
        c.college_name,
        c.college_code
    FROM appeals a
    INNER JOIN teacher_id t
        ON a.user_uid = t.user_uid
    INNER JOIN department_id d
        ON t.department_id = d.department_id
    INNER JOIN college_id c
        ON d.college_id = c.college_id
    WHERE a.user_uid = ?
    ORDER BY a.date_filed DESC
";

$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, 's', $user_uid);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$raw_appeals = [];
while ($row = mysqli_fetch_assoc($result)) {
    $raw_appeals[] = $row;
}
mysqli_stmt_close($stmt);
mysqli_close($conn);

// ─────────────────────────────────────────────
// DAY MAP
// ─────────────────────────────────────────────
$day_map = [
    'Monday'    => 1, 'Tuesday'  => 2, 'Wednesday' => 3,
    'Thursday'  => 4, 'Friday'   => 5, 'Saturday'  => 6, 'Sunday'   => 7,
    'Mon' => 1, 'Tue' => 2, 'Wed' => 3,
    'Thu' => 4, 'Fri' => 5, 'Sat' => 6, 'Sun' => 7,
];

// ─────────────────────────────────────────────
// EXPAND APPEALS PER AFFECTED SCHEDULE
// ─────────────────────────────────────────────
$appeals_list = [];

foreach ($raw_appeals as $appeal) {
    $appeal_days = [];
    try {
        $start     = new DateTime($appeal['start_date']);
        $end       = new DateTime($appeal['end_date']);
        $end->modify('+1 day');
        $interval  = new DateInterval('P1D');
        $daterange = new DatePeriod($start, $interval, $end);
        foreach ($daterange as $date) {
            $appeal_days[] = (int) $date->format('N');
        }
        $appeal_days = array_unique($appeal_days);
    } catch (Exception $e) {
        $appeal_days = [];
    }

    $affected_schedules = [];
    $seen_keys          = [];

    foreach ($schedules as $sched) {
        $day_name   = trim($sched['day_week']);
        $day_number = $day_map[$day_name] ?? null;

        if ($day_number !== null && in_array($day_number, $appeal_days)) {
            $unique_key = $sched['subject_name'] . '|' . $day_name . '|' . $sched['start_time'];
            if (!in_array($unique_key, $seen_keys)) {
                $seen_keys[]          = $unique_key;
                $affected_schedules[] = $sched;
            }
        }
    }

    if (!empty($affected_schedules)) {
        foreach ($affected_schedules as $sched) {
            $card              = $appeal;
            $card['affected_subject_name'] = $sched['subject_name'];
            $card['affected_subject_code'] = $sched['subject_code'];
            $card['affected_day_week']     = $sched['day_week'];
            $card['affected_start_time']   = date('g:i A', strtotime($sched['start_time']));
            $card['affected_schedule_id']  = $sched['schedule_id'];
            $appeals_list[] = $card;
        }
    } else {
        $card                          = $appeal;
        $card['affected_subject_name'] = null;
        $card['affected_subject_code'] = null;
        $card['affected_day_week']     = null;
        $card['affected_start_time']   = null;
        $card['affected_schedule_id']  = null;
        $appeals_list[] = $card;
    }
}
?>
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
                    <<div class="summary-body">
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
                            <span class="label">Status:</span>
                            <span class="status-badge" id="detStatusBadge"></span>
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
                        <div class="reason-section">
                            <span class="label">Reason:</span>
                            <div class="reason-box" id="detReason"></div>
                        </div>
                        <div class="summary-row" id="affectedSubjectRow">
                            <span class="label">Subject Affected:</span>
                            <span class="value" id="detAffectedSubject"></span>
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

    <script>
        const appealsDataFromDB = <?php echo json_encode($appeals_list); ?>;
    </script>
    <script src="facultydashboardRECORDS.js"></script>
</body>
</html>