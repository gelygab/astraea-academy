<?php
session_start();
require_once 'db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['uid'])) {
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$teacher_uid = $_SESSION['uid'];

// We use a JOIN to connect the schedule table to the teacher table!
$sql = "SELECT s.schedule_id, s.subject_name, s.department_id, s.student_year, s.student_block 
        FROM schedule_id s 
        JOIN teacher_id t ON s.teacher_id = t.teacher_id 
        WHERE t.user_uid = ?";

$stmt = $conn->prepare($sql);

// --- NEW SAFETY NET: If the query fails, print the exact database error! ---
if ($stmt === false) {
    echo json_encode(["error" => "Database Error: " . $conn->error]);
    exit;
}
// -------------------------------------------------------------------------

$stmt->bind_param("s", $teacher_uid);
$stmt->execute();
$result = $stmt->get_result();

$schedules = [];
while ($row = $result->fetch_assoc()) {
    $schedules[] = $row;
}

echo json_encode($schedules);
$stmt->close();
$conn->close();
?>