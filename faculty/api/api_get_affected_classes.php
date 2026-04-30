<?php
ob_start();
error_reporting(0);
ini_set('display_errors', 0);
session_start();
header('Content-Type: application/json');
include '../../db.php';

if (!isset($_SESSION['uid'])) {
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'Unauthorized.']);
    exit();
}

if (!isset($_POST['appeal_id'])) {
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'Missing appeal_id.']);
    exit();
}

$faculty_uid = $_SESSION['uid'];
$appeal_id   = (int)$_POST['appeal_id'];

// Get teacher_id
$stmt = $conn->prepare("SELECT teacher_id FROM teacher_id WHERE user_uid = ?");
$stmt->bind_param("s", $faculty_uid);
$stmt->execute();
$teacher_row = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$teacher_row) {
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'Teacher profile not found.']);
    exit();
}
$teacher_id = (int)$teacher_row['teacher_id'];

// Get appeal details
$stmt = $conn->prepare("
    SELECT a.start_date, a.end_date, a.user_uid,
           s.department_id, s.student_year, s.student_block
    FROM   appeals a
    INNER JOIN student_id s
        ON CONVERT(CAST(a.user_uid AS CHAR) USING utf8mb4) COLLATE utf8mb4_unicode_ci = s.user_uid
    WHERE  a.id = ?
");

if ($stmt === false) {
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'Query failed: ' . $conn->error]);
    exit();
}

$stmt->bind_param("i", $appeal_id);
$stmt->execute();
$appeal = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$appeal) {
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'Appeal not found.']);
    exit();
}

$start_date    = $appeal['start_date'];
$end_date      = $appeal['end_date'];
$dept_id       = (int)$appeal['department_id'];
$student_year  = (int)$appeal['student_year'];
$student_block = (int)$appeal['student_block'];

// Build list of affected days of week
$affected_days = [];
$current = strtotime($start_date);
$end     = strtotime($end_date);
while ($current <= $end) {
    $affected_days[] = date('l', $current);
    $current = strtotime('+1 day', $current);
}
$affected_days = array_unique($affected_days);

$day_abbr_map = [
    'Monday'    => ['M',  'Mon'],
    'Tuesday'   => ['T',  'Tue'],
    'Wednesday' => ['W',  'Wed'],
    'Thursday'  => ['Th', 'Thu'],
    'Friday'    => ['F',  'Fri'],
    'Saturday'  => ['S',  'Sat'],
    'Sunday'    => ['Su', 'Sun'],
];

// Fetch schedules
$stmt = $conn->prepare("
    SELECT sc.schedule_id, sc.subject_code, sc.subject_name,
           sc.day_week, sc.time_start, sc.time_end
    FROM   schedule_id sc
    WHERE  sc.teacher_id    = ?
      AND  sc.department_id = ?
      AND  sc.student_year  = ?
      AND  sc.student_block = ?
");

if ($stmt === false) {
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'Schedule query failed: ' . $conn->error]);
    exit();
}

$stmt->bind_param("iiii", $teacher_id, $dept_id, $student_year, $student_block);
$stmt->execute();
$all_schedules = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

// Day matching function
function dayMatches(string $schedule_day, array $affected_days, array $day_abbr_map): bool {
    if (in_array($schedule_day, $affected_days)) return true;
    foreach ($affected_days as $full_day) {
        $abbrs = $day_abbr_map[$full_day] ?? [];
        foreach ($abbrs as $abbr) {
            if (strpos($schedule_day, $abbr) !== false) {
                if ($abbr === 'T' && strpos($schedule_day, 'Th') !== false) {
                    if (!in_array('Thursday', $affected_days)) continue;
                }
                return true;
            }
        }
    }
    return false;
}

$affected_classes   = [];
$seen_subject_codes = [];

foreach ($all_schedules as $sc) {
    if (!dayMatches($sc['day_week'], $affected_days, $day_abbr_map)) continue;

    $affected_classes[] = [
        'subject_name' => $sc['subject_name'],
        'subject_code' => $sc['subject_code'],
        'day_of_week'  => $sc['day_week'],  
        'time_start'   => $sc['time_start'],
        'time_end'     => $sc['time_end'],
    ];

    $seen_subject_codes[$sc['subject_code']] = true;
}

usort($affected_classes, fn($a, $b) => strcmp($a['time_start'], $b['time_start']));

$affected_subject_count = count($seen_subject_codes);

ob_end_clean();
echo json_encode([
    'success'        => true,
    'affected_count' => $affected_subject_count,
    'classes'        => $affected_classes,
]);
?>