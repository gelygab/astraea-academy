<?php
require_once '../../db.php';
header('Content-Type: application/json');

$user_uid = $_GET['uid'] ?? $_GET['user_uid'] ?? '11111';
$response = [];

// 1. Get Student Profile Details
$sql_profile = "SELECT first_name, last_name, student_contact, student_email, student_address, department_id, student_year, student_block FROM student_id WHERE user_uid = ?";
$stmt = $conn->prepare($sql_profile);

if (!$stmt) {
    die(json_encode(["error" => "SQL Error: " . $conn->error])); 
}

$stmt->bind_param("s", $user_uid);
$stmt->execute();
$response['profile'] = $stmt->get_result()->fetch_assoc();
$stmt->close();

// 2. Get Attendance Summaries (Total, Late, Undertime, Absent)
$sql_attendance = "SELECT attendance_status, COUNT(*) as count FROM attendance_id WHERE user_uid = ? GROUP BY attendance_status";
$stmt = $conn->prepare($sql_attendance);
$stmt->bind_param("s", $user_uid);
$stmt->execute();
$result = $stmt->get_result();
$attendance_stats = ['Present' => 0, 'Late' => 0, 'Undertime' => 0, 'Absent' => 0];
while($row = $result->fetch_assoc()) {
    $attendance_stats[$row['attendance_status']] = $row['count'];
}
$response['attendance_summary'] = $attendance_stats;
$stmt->close();

// 3. Get Excuse/Appeal History
$sql_history = "SELECT time_type, start_date, end_date, number_of_days, status FROM appeals WHERE user_uid = ? ORDER BY date_filed DESC";
$stmt = $conn->prepare($sql_history);
$stmt->bind_param("s", $user_uid);
$stmt->execute();
$result = $stmt->get_result();
$history = [];
while($row = $result->fetch_assoc()) {
    $history[] = $row;
}
$response['excuse_history'] = $history;
$stmt->close();

// 4. Get Daily Attendance for the Calendar
// (Assuming your table has a column named 'date' or something similar. We will find out!)
$sql_daily = "SELECT date, attendance_status FROM attendance_id WHERE user_uid = ?";
$stmt = $conn->prepare($sql_daily);
if ($stmt !== false) {
    $stmt->bind_param("s", $user_uid);
    $stmt->execute();
    $result = $stmt->get_result();
    $daily_records = [];
    while($row = $result->fetch_assoc()) {
        $daily_records[$row['date']] = strtolower($row['attendance_status']); 
    }
    $response['daily_attendance'] = $daily_records;
    $stmt->close();
}

echo json_encode($response);
$conn->close();
?>
