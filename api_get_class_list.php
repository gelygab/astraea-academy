<?php
require_once 'db.php';
header('Content-Type: application/json');

// Get the schedule ID sent from your frontend JS
$schedule_id = isset($_GET['schedule_id']) ? intval($_GET['schedule_id']) : 35; // Defaulting to 35 (Software Design) for testing

// This query finds all students belonging to this specific class schedule and counts their total 'Present' attendance
$sql = "SELECT s.user_uid, s.last_name, s.first_name, 
        (SELECT COUNT(*) FROM attendance_id a WHERE a.user_uid = s.user_uid AND a.schedule_id = sch.schedule_id AND a.attendance_status = 'Present') as total_attendance
        FROM student_id s
        JOIN schedule_id sch 
          ON s.student_year = sch.student_year 
          AND s.student_block = sch.student_block 
          AND s.department_id = sch.department_id
        WHERE sch.schedule_id = ?
        ORDER BY s.last_name ASC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $schedule_id);
$stmt->execute();
$result = $stmt->get_result();

$students = [];
while ($row = $result->fetch_assoc()) {
    $students[] = $row;
}

echo json_encode($students);
$stmt->close();
$conn->close();
?>