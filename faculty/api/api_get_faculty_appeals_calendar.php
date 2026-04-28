<?php
session_start();
require_once '../../db.php'; 
header('Content-Type: application/json');

$uid = $_GET['uid'] ?? '';
$subject_code = $_GET['subject_code'] ?? '';

if (!$uid || !$subject_code) {
    echo json_encode(['success' => false, 'message' => 'Missing parameters']);
    exit;
}

// 1. Translate user_uid to teacher_id
$actual_teacher_id = null;
$t_sql = "SELECT teacher_id FROM teacher_id WHERE user_uid = ?";
$t_stmt = $conn->prepare($t_sql);
if ($t_stmt) {
    $t_stmt->bind_param("s", $uid);
    $t_stmt->execute();
    $t_res = $t_stmt->get_result();
    if ($t_row = $t_res->fetch_assoc()) {
        $actual_teacher_id = $t_row['teacher_id'];
    }
    $t_stmt->close();
}

// 2. Find which Days of the Week this specific subject is taught
$valid_days = [];
if ($actual_teacher_id !== null) {
    $d_sql = "SELECT day_week FROM schedule_id WHERE teacher_id = ? AND subject_code = ?";
    $d_stmt = $conn->prepare($d_sql);
    if ($d_stmt) {
        $d_stmt->bind_param("is", $actual_teacher_id, $subject_code);
        $d_stmt->execute();
        $d_res = $d_stmt->get_result();
        while ($d_row = $d_res->fetch_assoc()) {
            $valid_days[] = $d_row['day_week']; 
        }
        $d_stmt->close();
    }
}

$attendance_days = [];

// ==========================================
// 3. SEARCH 1: Appeals Table (Leaves & Excuses)
// ==========================================
$sql_appeals = "SELECT a.start_date, a.end_date, a.time_type, a.status 
                FROM appeals a
                JOIN schedule_id s ON a.schedule_id = s.schedule_id
                WHERE a.user_uid = ? 
                AND s.subject_code = ?";

$stmt_appeals = $conn->prepare($sql_appeals);
if ($stmt_appeals) {
    $stmt_appeals->bind_param("ss", $uid, $subject_code);
    $stmt_appeals->execute();
    $result_appeals = $stmt_appeals->get_result();

    while ($row = $result_appeals->fetch_assoc()) {
        $type = $row['time_type'];
        $calendar_status = 'leave'; 
        
        $excuse_types = ['medical_appointment', 'personal_emergency', 'extracurricular_activity', 'other_excuse'];
        if (in_array($type, $excuse_types)) {
            $calendar_status = 'excused';
        }

        $begin = new DateTime($row['start_date']);
        $end = new DateTime($row['end_date']);
        $end->modify('+1 day'); 

        $interval = DateInterval::createFromDateString('1 day');
        $period = new DatePeriod($begin, $interval, $end);

        foreach ($period as $dt) {
            $day_name = $dt->format('l'); 
            if (in_array($day_name, $valid_days)) {
                $attendance_days[] = [
                    'date' => $dt->format('Y-m-d'),
                    'status' => $calendar_status
                ];
            }
        }
    }
    $stmt_appeals->close();
}

// ==========================================
// 4. SEARCH 2: Attendance Table (Absences)
// ==========================================
$sql_absent = "SELECT date, attendance_status 
               FROM attendance_id 
               WHERE user_uid = ? AND user_type = 'Teacher'";

$stmt_absent = $conn->prepare($sql_absent);
if ($stmt_absent) {
    $stmt_absent->bind_param("s", $uid);
    $stmt_absent->execute();
    $result_absent = $stmt_absent->get_result();

    while ($row = $result_absent->fetch_assoc()) {
        // Only look for Absences
        if (strtolower($row['attendance_status']) === 'absent') {
            $dt = new DateTime($row['date']);
            $day_name = $dt->format('l');
            
            // If the absence falls on a day this subject is taught, add the pink dot!
            if (in_array($day_name, $valid_days)) {
                $attendance_days[] = [
                    'date' => $dt->format('Y-m-d'),
                    'status' => 'absent' // This maps to the pink dot class in your CSS
                ];
            }
        }
    }
    $stmt_absent->close();
}

// 5. Send it all back to the Calendar!
echo json_encode([
    'success' => true,
    'data' => [
        'subject_code' => $subject_code,
        'attendance_days' => $attendance_days
    ]
]);

$conn->close();
?>