<?php
session_start();
require_once '../../db.php';

header('Content-Type: application/json');

$user_id = $_GET['uid'] ?? $_SESSION['uid'] ?? '';
if (!$user_id) {
    echo json_encode(['success' => false, 'message' => 'session_error']);
    exit;
}

$subject_code = $_GET['subject_code'] ?? '';
if (empty($subject_code)) {
    echo json_encode(['success' => false, 'message' => 'no_subjects_found']);
    exit;
}

// FIX 1: Removed the math error! Just read the exact month sent by JS.
$sql_month = intval($_GET['month']); 
$year = intval($_GET['year']);

global $conn;
// 1. Fetch year and block from user uid
$yearblock_query = "SELECT student_year, student_block FROM student_id WHERE user_uid = ?";
$stmt_yearblock = $conn->prepare($yearblock_query);
$stmt_yearblock->bind_param("i", $user_id);
$stmt_yearblock->execute();
$yearblock_result = $stmt_yearblock->get_result();
$yearblock = $yearblock_result->fetch_assoc();

if (!$yearblock) {
    echo json_encode(['success' => false, 'message' => 'student_not_found']);
    exit;
}

// 2. Fetch schedules AND the day of the week they occur on
$schedule_query = "SELECT schedule_id, day_week FROM schedule_id WHERE student_year = ? AND student_block = ? AND subject_code = ?";
$stmt_schedule = $conn->prepare($schedule_query);
$stmt_schedule->bind_param("iis", $yearblock['student_year'], $yearblock['student_block'], $subject_code);
$stmt_schedule->execute();
$schedule_result = $stmt_schedule->get_result();

$schedules = []; // We will store [schedule_id => day_week]
if ($schedule_result->num_rows > 0) {
    while($row = $schedule_result->fetch_assoc()) {
        $schedules[$row['schedule_id']] = $row['day_week'];
    }
}

if (empty($schedules)) {
    echo json_encode(['success' => true, 'data' => ["subject_code" => $subject_code, "attendance_days" => []]]);
    exit;
}

$schedule_ids = array_keys($schedules);
$placeholders = implode(',', array_fill(0, count($schedule_ids), '?'));

// This map will prevent duplicates and hold our final calendar dots
$calendar_map = []; 

// 3. FIX 2: Query Appeals directly! (Pulls both pending and approved so students see their requests)
$appeals_query = "SELECT schedule_id, start_date, end_date, time_type, status FROM appeals WHERE user_uid = ? AND schedule_id IN ($placeholders)";
$stmt_appeals = $conn->prepare($appeals_query);
$params_appeals = 'i' . str_repeat('i', count($schedule_ids));
$stmt_appeals->bind_param($params_appeals, $user_id, ...$schedule_ids);
$stmt_appeals->execute();
$appeals_result = $stmt_appeals->get_result();

while ($app = $appeals_result->fetch_assoc()) {
    $start = new DateTime($app['start_date']);
    $end = new DateTime($app['end_date']);
    $day_week = $schedules[$app['schedule_id']];

    // Loop through every day in the leave range
    while ($start <= $end) {
        // Check if day matches the class schedule AND falls in the requested month/year
        if ($start->format('l') == $day_week && $start->format('n') == $sql_month && $start->format('Y') == $year) {
            
            // Map the exact text your JS expects for the Legend
            $displayStatus = '';
            if (in_array($app['time_type'], ['sick_leave', 'emergency_leave', 'leave_of_absence', 'other_leave'])) {
                $displayStatus = 'leave';
            } else {
                $displayStatus = 'excused';
            }


            // Plot it on our map
            $calendar_map[$start->format('Y-m-d')] = $displayStatus;
        }
        $start->modify('+1 day');
    }
}

// 4. Fetch Actual Attendance (to catch unexcused Absents)
$att_query = "SELECT date, attendance_status FROM attendance_id WHERE user_uid = ? AND MONTH(date) = ? AND YEAR(date) = ? AND schedule_id IN ($placeholders)";
$stmt_att = $conn->prepare($att_query);
$params_att = 'iii' . str_repeat('i', count($schedule_ids));
$stmt_att->bind_param($params_att, $user_id, $sql_month, $year, ...$schedule_ids);
$stmt_att->execute();
$att_result = $stmt_att->get_result();

while ($att = $att_result->fetch_assoc()) {
    $date = $att['date'];
    $status = strtolower($att['attendance_status']);
    
    // Only mark absent if there isn't already a Leave/Excused override from the appeals table
    if ($status == 'absent' && !isset($calendar_map[$date])) {
        $calendar_map[$date] = 'Absent';
    }
}

// 5. Format the map into the array the JavaScript expects
$attendance_days = [];
foreach ($calendar_map as $date => $status) {
    $attendance_days[] = [
        'status' => $status,
        'date' => $date
    ];
}

// 6. Send it back to the frontend!
$finalResponse = [
    "success" => true,
    "data" => [
        "subject_code" => $subject_code,
        "attendance_days" => $attendance_days
    ]
];

echo json_encode($finalResponse);
exit;
?>