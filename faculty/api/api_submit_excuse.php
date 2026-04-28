<?php
session_start();
require_once '../../db.php';
header('Content-Type: application/json');

// 1. Verify user is logged in
if (!isset($_SESSION['uid'])) {
    echo json_encode(['success' => false, 'error' => 'Not logged in.']);
    exit;
}

$user_uid = $_SESSION['uid'];
$user_type = 'Teacher'; // Explicitly defining the user_type for the database

// 2. Map Frontend values to Database ENUM values
$frontend_type = $_POST['excuseType'] ?? '';
$type_mapping = [
    'absence'   => 'extracurricular_activity',
    'sick'      => 'medical_appointment',
    'emergency' => 'personal_emergency',
    'other'     => 'other_excuse'
];
$time_type = $type_mapping[$frontend_type] ?? 'other_excuse';


// 3. Format inputs
$start_date = date('Y-m-d', strtotime($_POST['startDate']));
$end_date = date('Y-m-d', strtotime($_POST['endDate']));
$return_on = date('Y-m-d', strtotime($_POST['returnOn']));
$date_filed = date('Y-m-d'); 
$number_of_days = (int) $_POST['numDays']; 
$comment = $_POST['comment'] ?? '';

// 4. Handle File Upload
$attachment = null;
if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = '../../uploads/appeals/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    $fileName = time() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "_", basename($_FILES['attachment']['name']));
    if (move_uploaded_file($_FILES['attachment']['tmp_name'], $uploadDir . $fileName)) {
        $attachment = $fileName; 
    }
}

// ==============================================================================
// 5. THE "DETECTIVE" LOGIC: Find affected schedule_ids based on Dates
// ==============================================================================

// A. Figure out exactly which Days of the Week they are missing
$begin = new DateTime($start_date);
$end = new DateTime($end_date);
$end->modify('+1 day'); // Include the end date in the math

$interval = DateInterval::createFromDateString('1 day');
$period = new DatePeriod($begin, $interval, $end);

$missed_days = [];
foreach ($period as $dt) {
    $missed_days[] = $dt->format('l'); // Returns 'Monday', 'Tuesday', etc.
}
$missed_days = array_unique($missed_days);

// --- NEW STEP: Translate user_uid (11111) to teacher_id (1) ---
$actual_teacher_id = null;
$teacher_sql = "SELECT teacher_id FROM teacher_id WHERE user_uid = ?";
$teacher_stmt = $conn->prepare($teacher_sql);

if ($teacher_stmt) {
    $teacher_stmt->bind_param("s", $user_uid);
    $teacher_stmt->execute();
    $teacher_result = $teacher_stmt->get_result();
    if ($t_row = $teacher_result->fetch_assoc()) {
        $actual_teacher_id = $t_row['teacher_id'];
    }
    $teacher_stmt->close();
}

// B. Scan the database for their classes using the actual teacher_id
$affected_schedules = [];

if ($actual_teacher_id !== null) {
    $sched_sql = "SELECT schedule_id, day_week FROM schedule_id WHERE teacher_id = ?";
    $sched_stmt = $conn->prepare($sched_sql);

    if ($sched_stmt) {
        $sched_stmt->bind_param("i", $actual_teacher_id); // 'i' for integer
        $sched_stmt->execute();
        $result = $sched_stmt->get_result();
        
        // C. Match the missed days to their actual classes
        while ($row = $result->fetch_assoc()) {
            if (in_array($row['day_week'], $missed_days)) {
                $affected_schedules[] = $row['schedule_id'];
            }
        }
        $sched_stmt->close();
    }
}

// ==============================================================================
// 6. Insert into Database (Multi-Insert Loop)
// ==============================================================================

$insert_sql = "INSERT INTO appeals (user_uid, user_type, time_type, date_filed, start_date, end_date, number_of_days, return_on, comment, attachment, status, schedule_id) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)";
$insert_stmt = $conn->prepare($insert_sql);

if ($insert_stmt === false) {
    echo json_encode(['success' => false, 'error' => 'Database Error: ' . $conn->error]);
    exit;
}

$all_success = true;

if (count($affected_schedules) > 0) {
    // They have classes on these days! Insert a row for EACH affected subject.
    foreach ($affected_schedules as $sched_id) {
        $insert_stmt->bind_param("ssssssisssi", $user_uid, $user_type, $time_type, $date_filed, $start_date, $end_date, $number_of_days, $return_on, $comment, $attachment, $sched_id);
        if (!$insert_stmt->execute()) {
            $all_success = false;
        }
    }
} else {
    // They have no classes on these days, but we still need to record the leave! (schedule_id = NULL)
    $null_sched = null;
    $insert_stmt->bind_param("ssssssisssi", $user_uid, $user_type, $time_type, $date_filed, $start_date, $end_date, $number_of_days, $return_on, $comment, $attachment, $null_sched);
    if (!$insert_stmt->execute()) {
        $all_success = false;
    }
}

$insert_stmt->close();
$conn->close();

if ($all_success) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to save one or more requests.']);
}
?>