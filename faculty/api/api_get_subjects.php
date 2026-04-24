<?php
session_start();
require_once '../../db.php';
header('Content-Type: application/json');

// 1. Check Login
if (!isset($_SESSION['uid'])) {
    echo json_encode([]);
    exit;
}
$user_uid = $_SESSION['uid'];

// 2. Get Ryan's internal teacher_id
$stmt = $conn->prepare("SELECT teacher_id FROM teacher_id WHERE user_uid = ?");
$stmt->bind_param("s", $user_uid);
$stmt->execute();
$res = $stmt->get_result();
if ($row = $res->fetch_assoc()) {
    $teacher_id = $row['teacher_id'];
} else {
    echo json_encode([]);
    exit;
}
$stmt->close();

// 3. Get EVERY single detail about his classes (The Buffet)
$sql = "SELECT schedule_id, subject_name, department_id, student_year, student_block FROM schedule_id WHERE teacher_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $teacher_id);
$stmt->execute();
$result = $stmt->get_result();

$all_schedules = [];
while ($row = $result->fetch_assoc()) {
    $all_schedules[] = [
        "schedule_id" => $row['schedule_id'],
        "subject_name" => $row['subject_name'],
        "department_id" => $row['department_id'],
        "student_year" => $row['student_year'],
        "student_block" => $row['student_block']
    ];
}

// 4. Send the massive payload to the JavaScript
echo json_encode($all_schedules);

$stmt->close();
$conn->close();
?>