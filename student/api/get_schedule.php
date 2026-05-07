<?php
session_start();
require_once '../../db.php';

header('Content-Type: application/json');

$user_id = $_GET['uid'] ?? $_SESSION['uid'];
if (!isset($user_id)) {
    echo json_encode(['success' => false, 'message' => 'session_error']);
    exit;
};

global $conn;
// Fetch year and block to navigate schedule table
$yearblock_query = "SELECT user_uid, student_year, student_block FROM student_id WHERE user_uid = ?";
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

// Fetch all available year from schedulet able
$available_year_query = "SELECT DISTINCT school_year FROM schedule_id";
$stmt_available_year = $conn->prepare($available_year_query);
$stmt_available_year->execute();
$available_year_result = $stmt_available_year->get_result();
$available_year = [];

if ($available_year_result->num_rows > 0) {
    while ($row = $available_year_result->fetch_assoc()) {
        $available_year[] = $row;
    }
}

// Fetch all available semester from schedulet able
$available_semester_query = "SELECT DISTINCT semester FROM schedule_id";
$stmt_available_semester = $conn->prepare($available_semester_query);
$stmt_available_semester->execute();
$available_semester_result = $stmt_available_semester->get_result();
$available_semester = [];

if ($available_semester_result->num_rows > 0) {
    while ($row = $available_semester_result->fetch_assoc()) {
        $available_semester[] = $row;
    }
}

// Fetch schedules depending on student year and block 
$schedule_query = "SELECT subject_code, subject_name, student_year, student_block, day_week, start_time, end_time, room_number, 
                    teacher_id.first_name, teacher_id.last_name FROM schedule_id 
                    INNER JOIN teacher_id ON schedule_id.teacher_id = teacher_id.teacher_id 
                    WHERE student_year = ? AND student_block = ?";
$stmt_schedule = $conn->prepare($schedule_query);
$stmt_schedule->bind_param("ii", $yearblock['student_year'], $yearblock['student_block']);
$stmt_schedule->execute();
$schedule_result = $stmt_schedule->get_result();
$subjects = [];
$schedule_slots = [];
$seen_subjects = [];

if ($schedule_result->num_rows > 0) {
    while ($row = $schedule_result->fetch_assoc()) {
        if (!in_array($row['subject_code'], $seen_subjects)) {
            $seen_subjects[] = $row['subject_code'];
            $subjects[] = [
            'subject_code' => $row['subject_code'],
            'description' => $row['subject_name'],
            'section' => $row['student_year'] . '-' . $row['student_block'],
            'days' => $row['day_week'],
            'time' => $row['start_time'] . '-' . $row['end_time'],
            'room' => $row['room_number']
            ]; 
        }
        if (in_array($row['subject_code'], $seen_subjects)) {
            $schedule_slots[] = [
                'subject_code' => $row['subject_code'],
                'description' => $row['subject_name'],
                'teacher' => $row['first_name'] . ' ' . $row['last_name'],
                'start_time' => substr($row['start_time'], 0, 5),
                'end_time' => substr($row['end_time'], 0, 5),
                'day' => $row['day_week'],
                'room' => $row['room_number']
            ];
        }
    };
    
    $finalResponse = [
        "success" => true,
        "data" => [
            "uid" => $yearblock['user_uid'],
            "available_years" => $available_year,
            "available_semesters" => $available_semester,
            "subjects" => $subjects,
            "schedule_slots" => $schedule_slots
        ]
    ];
} else {
    $finalResponse = ['success' => false, 'message' => 'database_error'];
    exit;
}

echo json_encode($finalResponse);
exit;
?>