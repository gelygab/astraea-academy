<?php

include '../db.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_uid'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized.']);
    exit();
}

$faculty_uid = $_SESSION['user_uid'];
$start_date  = isset($_POST['start_date']) ? trim($_POST['start_date']) : '';
$end_date    = isset($_POST['end_date'])   ? trim($_POST['end_date'])   : '';
$student_uid = isset($_POST['student_uid']) ? trim($_POST['student_uid']) : '';

if (!$start_date || !$end_date) {
    echo json_encode(['success' => false, 'message' => 'Missing dates.']);
    exit();
}

$t_stmt = mysqli_prepare($conn, "SELECT teacher_id FROM teacher_id WHERE user_uid = ?");
mysqli_stmt_bind_param($t_stmt, 's', $faculty_uid);
mysqli_stmt_execute($t_stmt);
$t_row = mysqli_fetch_assoc(mysqli_stmt_get_result($t_stmt));
mysqli_stmt_close($t_stmt);

if (!$t_row) {
    echo json_encode(['success' => false, 'message' => 'Faculty not found.']);
    exit();
}
$teacher_id = $t_row['teacher_id'];

$day_map = [
    'Monday'    => 1,
    'Tuesday'   => 2,
    'Wednesday' => 3,
    'Thursday'  => 4,
    'Friday'    => 5,
    'Saturday'  => 6,
    'Sunday'    => 7,
    'Mon' => 1, 'Tue' => 2, 'Wed' => 3,
    'Thu' => 4, 'Fri' => 5, 'Sat' => 6, 'Sun' => 7,
];

if ($student_uid) {
    $s_stmt = mysqli_prepare($conn, "
        SELECT department_id, student_year, student_block
        FROM student_id
        WHERE user_uid = ?
    ");
    mysqli_stmt_bind_param($s_stmt, 's', $student_uid);
    mysqli_stmt_execute($s_stmt);
    $s_row = mysqli_fetch_assoc(mysqli_stmt_get_result($s_stmt));
    mysqli_stmt_close($s_stmt);

    if (!$s_row) {
        $student_uid = '';
    }
}

if ($student_uid && isset($s_row) && $s_row) {
    $sched_stmt = mysqli_prepare($conn, "
        SELECT DISTINCT subject_name, subject_code, day_week, start_time
        FROM schedule_id
        WHERE teacher_id    = ?
          AND department_id = ?
          AND student_year  = ?
          AND student_block = ?
    ");
    mysqli_stmt_bind_param(
        $sched_stmt, 'iiii',
        $teacher_id,
        $s_row['department_id'],
        $s_row['student_year'],
        $s_row['student_block']
    );
} else {
    $sched_stmt = mysqli_prepare($conn, "
        SELECT DISTINCT subject_name, subject_code, day_week, start_time
        FROM schedule_id
        WHERE teacher_id = ?
    ");
    mysqli_stmt_bind_param($sched_stmt, 'i', $teacher_id);
}

mysqli_stmt_execute($sched_stmt);
$sched_result = mysqli_stmt_get_result($sched_stmt);
$schedules    = [];
while ($row = mysqli_fetch_assoc($sched_result)) {
    $schedules[] = $row;
}
mysqli_stmt_close($sched_stmt);

$appeal_day_numbers = [];
try {
    $start     = new DateTime($start_date);
    $end       = new DateTime($end_date);
    $end->modify('+1 day'); 
    $interval  = new DateInterval('P1D');
    $daterange = new DatePeriod($start, $interval, $end);

    foreach ($daterange as $date) {
        $appeal_day_numbers[] = (int) $date->format('N');
    }
    $appeal_day_numbers = array_unique($appeal_day_numbers);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Invalid dates: ' . $e->getMessage()]);
    exit();
}

$affected  = [];
$seen_keys = [];

foreach ($schedules as $sched) {
    $day_name   = trim($sched['day_week']);
    $day_number = $day_map[$day_name] ?? null;

    if ($day_number !== null && in_array($day_number, $appeal_day_numbers)) {
        $time_formatted = date('g:i A', strtotime($sched['start_time']));
        $unique_key = $sched['subject_name'] . '|' . $day_name . '|' . $sched['start_time'];

        if (!in_array($unique_key, $seen_keys)) {
            $seen_keys[] = $unique_key;
            $affected[]  = [
                'subject_name' => $sched['subject_name'],
                'subject_code' => $sched['subject_code'],
                'day_week'     => $day_name,
                'time'         => $time_formatted,
            ];
        }
    }
}

echo json_encode([
    'success'  => true,
    'affected' => $affected,
    'count'    => count($affected),
]);

mysqli_close($conn);
?>