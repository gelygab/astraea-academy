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
$attendance_query = "SELECT attendance_id.*, 
                        appeals.status AS appeal_status,
                        appeals.time_type
                    FROM attendance_id 
                    LEFT JOIN appeals ON attendance_id.user_uid = appeals.user_uid 
                        AND attendance_id.schedule_id = appeals.schedule_id
                        AND attendance_id.date BETWEEN appeals.start_date AND appeals.end_date
                        AND appeals.status = 'approved'
                    WHERE attendance_id.user_uid = ?  
                    AND MONTH(attendance_id.date) = ? 
                    AND YEAR(attendance_id.date) = ?
                    AND attendance_id.schedule_id IN ($placeholders)";
$stmt_attendance = $conn->prepare($attendance_query);
$params = 'iii' . str_repeat('i', count($schedule));
$sql_month = intval($month) + 1;
$stmt_attendance->bind_param($params, $user_id, $sql_month, $year, ...$schedule);
$stmt_attendance->execute();
$attendance_result = $stmt_attendance->get_result();

if ($attendance_result->num_rows > 0) {
    $attendance_days = [];
    while ($row = $attendance_result->fetch_assoc()) {
        
        $rawStatus = strtolower($row['attendance_status']);
        $displayStatus = $row['attendance_status']; 

        // Mapping para sa Legend
        if ($row['appeal_status'] == 'approved') {
            if ($row['time_type'] == 'sick_leave') {
                $displayStatus = 'Leave'; 
            } else {
                $displayStatus = 'Excused';
            }
        } else if ($rawStatus == 'absent') {
            $displayStatus = 'Absent';
        }

        $attendance_days[] = [
            'status' => $displayStatus,
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