<?php
session_start();
require_once '../../db.php';
header('Content-Type: application/json');

$user_id = intval($_GET['uid'] ?? $_SESSION['uid']);
if (!isset($user_id)) {
    echo json_encode(['success' => false, 'message' => 'session_error']);
    exit;
};

$subject_code = $_GET['subject_code'];
if (!isset($subject_code)) {
    echo json_encode(['success' => false, 'message' => 'no_subjects_found']);
}
$month = $_GET['month']; // countings: 0 is january, 1 is febraury
$year = $_GET['year'];

// Fetch year and block from user uid
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

$finalResponse = null;

// Fetch schedules from student year and block
$schedule_query = "SELECT * FROM schedule_id WHERE student_year = ? AND student_block = ? AND subject_code = ?";
$stmt_schedule = $conn->prepare($schedule_query);
$stmt_schedule->bind_param("iis", $yearblock['student_year'], $yearblock['student_block'], $subject_code);
$stmt_schedule->execute();
$schedule_result = $stmt_schedule->get_result();
$schedule = [];

if ($schedule_result->num_rows > 0) {
    while($row = $schedule_result->fetch_assoc()) {
        $schedule[] = $row['schedule_id'];
    }
    if (empty($schedule)) {
        echo json_encode(['success' => false, 'message' => 'schedule_not_found']);
        exit;
    }
}

$placeholders = implode(',', array_fill(0, count($schedule), '?'));

// Fetch attendance records from schedule
$attendance_query = "SELECT * FROM attendance_id 
                    WHERE user_uid = ?  
                    AND MONTH(date) = ? 
                    AND YEAR(date) = ?
                    AND schedule_id IN ($placeholders)";
$stmt_attendance = $conn->prepare($attendance_query);
$params = 'iii' . str_repeat('i', count($schedule));
$stmt_attendance->bind_param($params, $user_id, $month, $year, ...$schedule);
$stmt_attendance->execute();
$attendance_result = $stmt_attendance->get_result();

if ($attendance_result->num_rows > 0) {
    $attendance_days = [];
    while ($row = $attendance_result->fetch_assoc()) {
        $attendance_days[] = [
            'status' => $row['attendance_status'],
            'date' => $row['date']
        ];
    }

    $finalResponse = [
        "success" => true,
        "data" => [
            "subject_code" => $subject_code,
            "attendance_days" => $attendance_days
        ]
    ];
} else {
    $finalResponse = [
        "success" => true,
        "data" => [
            "subject_code" => $subject_code,
            "attendance_days" => []
        ]
    ];
}

echo json_encode($finalResponse);
exit;

?>