<?php
session_start();
date_default_timezone_set('Asia/Manila');
require_once '../db.php';

header('Content-Type: application/json');

$user_id = $_GET['uid'] ?? $_SESSION['uid'];
if (!isset($user_id)) {
    echo json_encode(['success' => false, 'message' => 'session_error']);
    exit;
};

global $conn;
// Fetch student year and block ids for navigating schedule
$yearblock_query = "SELECT first_name, last_name, user_uid, student_contact, student_email, student_address, student_year, student_block FROM student_id WHERE user_uid = ?";
$stmt_yearblock = $conn->prepare($yearblock_query);
$stmt_yearblock->bind_param("i", $user_id);
$stmt_yearblock->execute();
$yearblock_result = $stmt_yearblock->get_result();
$yearblock = $yearblock_result->fetch_assoc();

if (!$yearblock) {
    echo json_encode(['success' => false, 'message' => 'student_not_found']);
    exit;
}

$monthYear = date('F Y');

// Fetch schedule id through year and block ids
$schedule_query = "SELECT * FROM schedule_id WHERE student_year = ? AND student_block = ?";
$stmt_schedule = $conn->prepare($schedule_query);
$stmt_schedule->bind_param("ii", $yearblock['student_year'], $yearblock['student_block']);
$stmt_schedule->execute();
$schedule_result = $stmt_schedule->get_result();

// Fetch attendance logs for each schedule id/subject
$attendance_query = "SELECT * FROM attendance_id WHERE user_uid = ? AND schedule_id = ?";
$stmt_attendance = $conn->prepare($attendance_query);

$finalResponse = null;

if ($schedule_result->num_rows > 0) {
    $attendanceLogs = [];
    $uniqueDays = [];
    $totalPresent = 0;
    $totalLate = 0;
    $totalUndertime = 0;
    $totalAbsent = 0;
    
    while ($row = $schedule_result->fetch_assoc()) {
        if (!in_array($row['day_week'], $uniqueDays)) {
            $uniqueDays[] = $row['day_week'];
        }    

        $stmt_attendance->bind_param("ii", $user_id, $row['schedule_id']);
        $stmt_attendance->execute();
        $attendance_result = $stmt_attendance->get_result();
        while ($attendance = $attendance_result->fetch_assoc()) {
            $logEntry = calculateAttendanceStatus($row, $attendance);
            $attendanceLogs[] = $logEntry;

            if ($logEntry['status'] === "Absent") {
                $totalAbsent++;
            } else if ($logEntry['status'] === "Late") {
                $totalLate++;
                $totalPresent++;
            } else if ($logEntry['status'] === "Undertime") {
                $totalUndertime++;
                $totalPresent++;
            } else {
                $totalPresent++;
            }
        }
        
    }

    $monthlyCount = 0;
    $startDate = new DateTime('first day of this month');
    $endDate = new DateTime('last day of this month');
    $endDate->modify('+1 day');
    
    $weeklyCount = 0;
    $startWeek = new DateTime('monday this week');
    $endWeek = new DateTime('sunday this week');
    $endWeek->modify('+1 day');
    
    $interval = new DateInterval('P1D');
    $period = new DatePeriod($startDate, $interval, $endDate);

    $weeklyPeriod = new DatePeriod($startWeek, $interval, $endWeek);

    foreach ($period as $date) {
        $currentDayName = $date->format('l');
        if (in_array($currentDayName, $uniqueDays)) {
            $monthlyCount++;
        }
    }

    foreach ($weeklyPeriod as $date) {
        $dayName = $date->format('l');
        if (in_array($dayName, $uniqueDays)) {
            $weeklyCount++;
        }
    }
    
    $expectedDaily = in_array(date('l'), $uniqueDays) ? 1 : 0;
    $totalClasses = $schedule_result->num_rows;
    $attendancePercentage = ($monthlyCount > 0) ? round((($totalPresent + $totalLate + $totalUndertime) / $monthlyCount) * 100) : 0;    
    $finalResponse = [
        "success" => true,
        "students" => [
            [
                "name" => $yearblock['first_name'] . ' ' . $yearblock['last_name'],
                "uid" => $yearblock['user_uid'],
                "contact" => $yearblock['student_contact'],
                "email" => $yearblock['student_email'],
                "address" => $yearblock['student_address'],
                "attendanceLogs" => $attendanceLogs,
                "overallStats" => [
                    "Absent" => $totalAbsent,
                    "Late" => $totalLate,
                    "Undertime" => $totalUndertime,
                    "Present" => $totalPresent,
                    "Attendance" => $attendancePercentage . "%"
                ],
                "monthlyCount" => $monthlyCount,
                "weeklyCount" => $weeklyCount,
                "dailyCount" => $expectedDaily
            ]
        ]
    ];

} else {
    $finalResponse = ['success' => false, 'message' => 'database_error'];
}

echo json_encode($finalResponse);
exit;

// Compare schedule id (what should be) to attendance id (what is) for attendance status
function calculateAttendanceStatus($schedule_row, $attendance_row) {
    $response = [];
    
    $logDate = $attendance_row ? $attendance_row['date'] : date('Y-m-d');
    $response["date"] = date('Y-m-d', strtotime($logDate));

    // Status: Absent
    if (!$attendance_row) {
        $response["status"] = "Absent";
        return $response;
    } 

    if (!empty($attendance_row['attendance_status'])) {
        $response["status"] = $attendance_row['attendance_status'];
        return $response;
    }
    
    $s_time = date("H:i:s", strtotime($schedule_row['start_time']));
    $e_time = date("H:i:s", strtotime($schedule_row['end_time']));
    $t_in = date("H:i:s", strtotime($attendance_row['timestamp_in']));
    $t_out = date("H:i:s", strtotime($attendance_row['timestamp_out']));

    $start_time = strtotime($s_time);
    $end_time = strtotime($e_time);
    $timestamp_in = strtotime($t_in);
    $timestamp_out = strtotime($t_out);

    // Status: Late
    if ($timestamp_in > ($start_time + 900)) {
        $response["status"] = "Late";
    } 
    // Status: Undertime
    else if ($timestamp_out < $end_time) {
        $response["status"] = "Undertime";
    } 
    // Status: Present
    else {
        $response["status"] = "Present";
    }

    return $response;

}?>