<?php 
session_start();
date_default_timezone_set('Asia/Manila');
require_once '../../db.php';

header('Content-Type: application/json');

$user_id = intval($_GET['uid'] ?? $_SESSION['uid']);
if (!isset($user_id)) {
    echo json_encode(['success' => false, 'message' => 'session_error']);
    exit;
};

$studentId = $_GET['studentId'];
if (!$studentId) {
    echo json_encode(['success' => false, 'message' => 'student_not_found']);
    exit;
}

// Queues year and block of student id selected 
$yearblock_query = "SELECT student_year, student_block 
                        FROM student_id
                        WHERE user_uid = ?";
$stmt_yearblock = $conn->prepare($yearblock_query);
$stmt_yearblock->bind_param("i", $studentId);
$stmt_yearblock->execute();
$yearblock_result = $stmt_yearblock->get_result();
$yearblock = $yearblock_result->fetch_assoc();

if (!$yearblock) {
    echo json_encode(['success' => false, 'message' => 'student_not_found']);
    exit;
}

// Queues schedule student_id's from year and block
$schedule_query = "SELECT subject_code, subject_name FROM schedule_id WHERE student_year = ? AND student_block = ?";
$stmt_schedule = $conn->prepare($schedule_query);
$stmt_schedule->bind_param("ii", $yearblock['student_year'], $yearblock['student_block']);
$stmt_schedule->execute();
$schedule_result = $stmt_schedule->get_result();
$schedule = [];

if ($schedule_result->num_rows > 0) {
    while($row = $schedule_result->fetch_assoc()) {
        $schedule[] = $row;
    }
}

    if (empty($schedule)) {
        echo json_encode(['success' => false, 'message' => 'schedule_not_found']);
        exit;
    }



$attendance_query = "SELECT attendance_status FROM attendance_id
                        WHERE user_uid = ?
                        AND schedule_id = ?";
$stmt_attendance = $conn->prepare($attendance_query);
$attendance_days = [];
$stmt_attendance->bind_param("ii", $studentId, $schedule['subject_code']);
$stmt_attendance->execute();
$attendance_result = $stmt_attendance->get_result();
if ($attendance_result->num_rows > 0) {
    while ($row = $attendance_result->fetch_assoc()) {
        $attendance_days[] = $row;
    }
}

var_dump($schedule);
// $finalResponse = null;
// $finalResponse = [

// ]

// $finalResponse = null;

// $finalResponse = [
//     "success" => true,
//     "data" => $subjects
// ];
?>