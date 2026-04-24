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
$frontend_type = $_POST['leaveType'] ?? '';
$type_mapping = [
    'sick'      => 'sick_leave',
    'emergency' => 'emergency_leave',
    'absence'   => 'leave_of_absence',
    'other'     => 'other_leave'
];
$time_type = $type_mapping[$frontend_type] ?? 'other_leave';

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

// 5. Insert into Database (Now including user_type!)
$sql = "INSERT INTO appeals (user_uid, user_type, time_type, date_filed, start_date, end_date, number_of_days, return_on, comment, attachment, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')";
        
$stmt = $conn->prepare($sql);
if ($stmt === false) {
    echo json_encode(['success' => false, 'error' => 'Database Error: ' . $conn->error]);
    exit;
}

// Bind the parameters (s = string, i = integer)
$stmt->bind_param("ssssssisss", $user_uid, $user_type, $time_type, $date_filed, $start_date, $end_date, $number_of_days, $return_on, $comment, $attachment);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to save request.']);
}

$stmt->close();
$conn->close();
?>