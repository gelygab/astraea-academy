<?php
session_start();
header('Content-Type: application/json');
include '../../db.php';

if (!isset($_SESSION['uid']) || !isset($_POST['subject_code'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized or missing data']);
    exit();
}

$faculty_uid = $_SESSION['uid'];
$subject_code = $_POST['subject_code'];

$stmt = $conn->prepare("SELECT teacher_id FROM teacher_id WHERE user_uid = ?");
$stmt->bind_param("s", $faculty_uid);
$stmt->execute();
$teacher_row = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$teacher_row) {
    echo json_encode(['success' => false, 'message' => 'Teacher profile not found']);
    exit();
}
$teacher_id = $teacher_row['teacher_id'];

$dept_query = "
    SELECT DISTINCT d.department_id, d.department_name, d.department_code 
    FROM schedule_id s
    JOIN department_id d ON s.department_id = d.department_id
    WHERE s.teacher_id = ? AND s.subject_code = ?
";
$stmt = $conn->prepare($dept_query);
$stmt->bind_param("is", $teacher_id, $subject_code);
$stmt->execute();
$depts_result = $stmt->get_result();
$depts = [];
while ($row = $depts_result->fetch_assoc()) {
    $depts[] = $row;
}
$stmt->close();

$sched_query = "
    SELECT schedule_id, department_id, student_year, student_block 
    FROM schedule_id 
    WHERE teacher_id = ? AND subject_code = ?
";
$stmt = $conn->prepare($sched_query);
$stmt->bind_param("is", $teacher_id, $subject_code);
$stmt->execute();
$sched_result = $stmt->get_result();
$schedules = [];
while ($row = $sched_result->fetch_assoc()) {
    $schedules[] = $row;
}
$stmt->close();

echo json_encode([
    'success' => true,
    'depts' => $depts,
    'schedules' => $schedules
]);
?>