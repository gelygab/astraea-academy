<?php
session_start();
// Connect to the database
require_once 'db.php';

header('Content-Type: application/json');

$user_id = intval($_GET['uid'] ?? $_SESSION['uid']);
if (!isset($user_id)) {
    echo json_encode(['success' => false, 'message' => 'session_error']);
    exit;
};

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 2. Map time_type and comment into the leave_reason column
    $time_type = $_POST['time_type'] ?? ''; 
    $comment = $_POST['comment'] ?? ''; 

    $leave_status = 'Pending'; 
    $date_filed = date("Y-m-d"); 

    // 3. Grab ALL the dates and the number of days!
    $start_date_raw = $_POST['start_date'] ?? '';
    $end_date_raw = $_POST['end_date'] ?? '';
    $return_on_raw = $_POST['return_on'] ?? ''; // Grab the return date
    $number_of_days = $_POST['number_of_days'] ?? ''; // Grab the number of days

    // Format dates to MySQL standard
    $leave_startdate = date("Y-m-d", strtotime($start_date_raw));
    $leave_enddate = date("Y-m-d", strtotime($end_date_raw));

    // Only format return_on if it's not empty, otherwise leave it null
    $return_on = !empty($return_on_raw) ? date("Y-m-d", strtotime($return_on_raw)) : null;

    // 4. Handle attachment with a short file name to fit in VARCHAR(30)
    $supporting_document = null;
    if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = 'uploads/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        $ext = pathinfo($_FILES['attachment']['name'], PATHINFO_EXTENSION);
        $short_name = time() . '.' . $ext; 
        $target_file = $upload_dir . $short_name;
        
        if (move_uploaded_file($_FILES['attachment']['tmp_name'], $target_file)) {
            $supporting_document = $short_name;
        }
    }

    $sql = "INSERT INTO appeals (
                        user_uid, 
                        time_type,
                        comment, 
                        start_date, 
                        end_date, 
                        number_of_days, 
                        return_on, 
                        attachment, 
                        status, 
                        date_filed) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isssssssss", $user_id, $time_type, $comment, $leave_startdate, $leave_enddate, $number_of_days, $return_on, $supporting_document, $leave_status, $date_filed);

    if ($stmt->execute()) {
        echo "Success! Leave Application submitted to the official student database!";
    } else {
        echo "Database Error: " . $stmt->error; 
    }
}
?>