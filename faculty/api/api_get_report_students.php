<?php
session_start();
require_once '../../db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['uid'])) {
    echo json_encode([]);
    exit;
}
$teacher_uid = $_SESSION['uid'];

// 1. Get the Teacher's Internal ID
$stmt = $conn->prepare("SELECT teacher_id FROM teacher_id WHERE user_uid = ?");
$stmt->bind_param("s", $teacher_uid);
$stmt->execute();
$res = $stmt->get_result();
$teacher_id = $res->fetch_assoc()['teacher_id'] ?? 0;
$stmt->close();

// 2. Get every unique student assigned to this teacher's schedules
$sql = "
    SELECT DISTINCT u.user_uid, u.first_name, u.last_name 
    FROM student_id u
    JOIN schedule_id s ON
        u.department_id = s.department_id AND
        u.student_year = s.student_year AND
        u.student_block = s.student_block
    WHERE s.teacher_id = ?
    ORDER BY u.last_name ASC
";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    die("DATABASE ERROR: " . $conn->error);
}

$stmt->bind_param("i", $teacher_id);
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