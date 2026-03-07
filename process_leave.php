<?php
// Connect to the database
require_once 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 1. Using a dummy student_id (1) until your login system is built
    $student_id = 1; 
    
    // 2. Map time_type and comment into the leave_reason column
    $time_type = $_POST['time_type'] ?? ''; 
    $comment = $_POST['comment'] ?? ''; 
    $full_reason = $time_type . " - " . $comment; 
    
    // Cut the string to exactly 40 characters so it fits your database without crashing
    $leave_reason = substr($full_reason, 0, 40); 
    
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

    // 5. Insert directly into the OFFICIAL leave_student table, including the new columns!
    $sql = "INSERT INTO leave_student (student_id, leave_reason, leave_startdate, leave_enddate, number_of_days, return_on, supporting_document, leave_status, date_filed) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
    if ($stmt = mysqli_prepare($conn, $sql)) {
        // "issssssss" means 1 integer (student_id) followed by 8 strings
        mysqli_stmt_bind_param($stmt, "issssssss", $student_id, $leave_reason, $leave_startdate, $leave_enddate, $number_of_days, $return_on, $supporting_document, $leave_status, $date_filed);
        
        if (mysqli_stmt_execute($stmt)) {
            echo "Success! Leave Application submitted to the official student database!";
        } else {
            echo "Database Error: " . mysqli_stmt_error($stmt); 
        }
        mysqli_stmt_close($stmt);
    } else {
        echo "Error preparing the database query.";
    }
}
?>