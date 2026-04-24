<?php
session_start();
require_once 'db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['uid'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}
$user_uid = $_SESSION['uid'];

$subject_code = $_GET['subject_code'] ?? '';
$year = $_GET['year'] ?? date('Y');
$month = $_GET['month'] ?? date('m');

// 1. Get the subject description for the header
$subject_name = $subject_code; 
$sql_subj = "SELECT subject_name FROM schedule_id WHERE subject_code = ? LIMIT 1";
$stmt_subj = $conn->prepare($sql_subj);
$stmt_subj->bind_param("s", $subject_code);
$stmt_subj->execute();
$res_subj = $stmt_subj->get_result();
if ($row = $res_subj->fetch_assoc()) {
    $subject_name = $row['subject_name'];
}
$stmt_subj->close();

// 2. Fetch the Teacher's Appeals (Leaves and Excuses)
$attendance_days = [];
$sql_appeals = "SELECT time_type, start_date, end_date, status FROM appeals WHERE user_uid = ? AND user_type = 'Teacher'";
$stmt_app = $conn->prepare($sql_appeals);
$stmt_app->bind_param("s", $user_uid);
$stmt_app->execute();
$res_app = $stmt_app->get_result();

while ($row = $res_app->fetch_assoc()) {
    // Determine the color of the dot based on the time_type
    $type = $row['time_type'];
    if (in_array($type, ['sick_leave', 'emergency_leave', 'leave_of_absence', 'other_leave'])) {
        $dot_status = 'leave'; // Blue dot
    } else {
        $dot_status = 'excused'; // Yellow dot
    }

    // Loop through every day between the start_date and end_date of the appeal
    $start = new DateTime($row['start_date']);
    $end = new DateTime($row['end_date']);
    $end->modify('+1 day'); // Include the last day in the loop
    
    $period = new DatePeriod($start, new DateInterval('P1D'), $end);
    
    foreach ($period as $dt) {
        // Only grab dates that match the calendar's currently viewed month and year
        if ($dt->format('Y') == $year && $dt->format('n') == $month) {
            $attendance_days[] = [
                "date" => $dt->format('Y-m-d'),
                "status" => $dot_status
            ];
        }
    }
}
$stmt_app->close();
$conn->close();

// 3. Send data back to the calendar
echo json_encode([
    'success' => true,
    'data' => [
        'subject_code' => $subject_code,
        'subject_name' => $subject_name,
        'attendance_days' => $attendance_days
    ]
]);
?>