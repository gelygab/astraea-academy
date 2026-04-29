<?php
session_start();
header('Content-Type: application/json');
include '../../db.php';

if (!isset($_POST['schedule_id'])) {
    echo json_encode(['success' => false, 'message' => 'Missing schedule ID']);
    exit();
}

$schedule_id = $_POST['schedule_id'];

// Fetch appeals and link them to the student's name/year/block
$query = "
    SELECT a.*, s.first_name, s.last_name, s.student_year, s.student_block 
    FROM appeals a
    JOIN student_id s ON a.user_uid = s.user_uid
    WHERE a.schedule_id = ?
";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $schedule_id);
$stmt->execute();
$result = $stmt->get_result();

$excuse = [];
$leave = [];

// Sort them into Excuse or Leave based on the type
while ($row = $result->fetch_assoc()) {
    $type = strtolower($row['time_type']);
    if (strpos($type, 'leave') !== false) {
        $leave[] = $row;
    } else {
        $excuse[] = $row;
    }
}
$stmt->close();

echo json_encode([
    'success' => true,
    'excuse' => $excuse,
    'leave' => $leave
]);
?>