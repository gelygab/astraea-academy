<?php
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 0);
session_start();
header('Content-Type: application/json');
include '../../db.php';

// Check session for faculty uid
$faculty_uid = $_SESSION['uid'] ?? $_SESSION['user_uid'] ?? null;
if (!$faculty_uid) {
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'Unauthorized.']);
    exit();
}

// Get inputs from post
$start_date  = trim($_POST['start_date']  ?? '');
$end_date    = trim($_POST['end_date']    ?? '');
$student_uid = trim($_POST['student_uid'] ?? '');

if (!$start_date || !$end_date) {
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'Missing dates.']);
    exit();
}

// Get the teacher_id of the current user
$t_stmt = mysqli_prepare($conn, "SELECT teacher_id FROM teacher_id WHERE user_uid = ?");
if (!$t_stmt) {
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'DB error (teacher prepare): ' . mysqli_error($conn)]);
    exit();
}
mysqli_stmt_bind_param($t_stmt, 's', $faculty_uid);
mysqli_stmt_execute($t_stmt);
$t_row = mysqli_fetch_assoc(mysqli_stmt_get_result($t_stmt));
mysqli_stmt_close($t_stmt);

if (!$t_row) {
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'Faculty not found.']);
    exit();
}
$teacher_id = (int)$t_row['teacher_id'];

$day_map = [
    'Monday'    => 1, 'Mon' => 1, 'M'  => 1,
    'Tuesday'   => 2, 'Tue' => 2, 'Tu' => 2,
    'Wednesday' => 3, 'Wed' => 3, 'W'  => 3,
    'Thursday'  => 4, 'Thu' => 4, 'Th' => 4,
    'Friday'    => 5, 'Fri' => 5, 'F'  => 5,
    'Saturday'  => 6, 'Sat' => 6, 'Sa' => 6,
    'Sunday'    => 7, 'Sun' => 7, 'Su' => 7,
];

// Fetch student info to filter schedules
$s_row = null;
if ($student_uid) {
    $s_stmt = mysqli_prepare($conn, "
        SELECT department_id, student_year, student_block
        FROM student_id
        WHERE user_uid = ?
        LIMIT 1
    ");
    if ($s_stmt) {
        mysqli_stmt_bind_param($s_stmt, 's', $student_uid);
        mysqli_stmt_execute($s_stmt);
        $s_row = mysqli_fetch_assoc(mysqli_stmt_get_result($s_stmt));
        mysqli_stmt_close($s_stmt);
    }
}

// Fetch the schedules for this specific student/class
if ($s_row) {
    $sched_stmt = mysqli_prepare($conn, "
        SELECT DISTINCT subject_name, subject_code, day_week, start_time
        FROM schedule_id
        WHERE teacher_id    = ?
          AND department_id = ?
          AND student_year  = ?
          AND student_block = ?
    ");
    if (!$sched_stmt) {
        ob_end_clean();
        echo json_encode(['success' => false, 'message' => 'DB error (schedule scoped): ' . mysqli_error($conn)]);
        exit();
    }
    mysqli_stmt_bind_param(
        $sched_stmt, 'iiii',
        $teacher_id,
        $s_row['department_id'],
        $s_row['student_year'],
        $s_row['student_block']
    );
} else {
    // Fallback: all schedules for this teacher
    $sched_stmt = mysqli_prepare($conn, "
        SELECT DISTINCT subject_name, subject_code, day_week, start_time
        FROM schedule_id
        WHERE teacher_id = ?
    ");
    if (!$sched_stmt) {
        ob_end_clean();
        echo json_encode(['success' => false, 'message' => 'DB error (schedule fallback): ' . mysqli_error($conn)]);
        exit();
    }
    mysqli_stmt_bind_param($sched_stmt, 'i', $teacher_id);
}

mysqli_stmt_execute($sched_stmt);
$sched_result = mysqli_stmt_get_result($sched_stmt);
$schedules    = [];
while ($row = mysqli_fetch_assoc($sched_result)) {
    $schedules[] = $row;
}
mysqli_stmt_close($sched_stmt);

// Identify which days of the week are covered by the absence range
$appeal_day_numbers = [];
try {
    $start     = new DateTime($start_date);
    $end       = new DateTime($end_date);
    $end->modify('+1 day');
    $interval  = new DateInterval('P1D');
    $daterange = new DatePeriod($start, $interval, $end);

    foreach ($daterange as $date) {
        $appeal_day_numbers[] = (int)$date->format('N');
    }
    $appeal_day_numbers = array_unique($appeal_day_numbers);
} catch (Exception $e) {
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'Invalid dates: ' . $e->getMessage()]);
    exit();
}

// Filter the schedules that match the absence days
$affected  = [];
$seen_keys = [];

foreach ($schedules as $sched) {
    $day_name   = trim($sched['day_week']);
    $day_number = $day_map[$day_name] ?? null;

    if ($day_number === null || !in_array($day_number, $appeal_day_numbers)) continue;

    $time_raw       = $sched['start_time'] ?? '';
    $time_formatted = $time_raw ? date('g:i A', strtotime($time_raw)) : '—';
    $unique_key     = $sched['subject_name'] . '|' . $day_name . '|' . $time_raw;

    if (in_array($unique_key, $seen_keys)) continue;

    $seen_keys[] = $unique_key;
    $affected[]  = [
        'subject_name' => $sched['subject_name'],
        'subject_code' => $sched['subject_code'],
        'day_of_week'  => $day_name,
        'day_week'     => $day_name,
        'time_start'   => $time_raw,
        'time_end'     => $sched['end_time'] ?? '',
        'time'         => $time_formatted,
    ];
}

// Sort affected classes by time
usort($affected, fn($a, $b) => strcmp($a['time_start'] ?? '', $b['time_start'] ?? ''));

ob_end_clean();
echo json_encode([
    'success'        => true,
    'affected_count' => count($affected),
    'affected'       => $affected,   
    'classes'        => $affected,   
]);
?>