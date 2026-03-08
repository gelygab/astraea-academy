<?php
// Connect to the database
require_once 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 1. Using a dummy student_id (1)
    $student_id = 1; 
    
    // 2. Map time_type and comment into the excuse_reason column (Max 40 chars)
    $time_type = $_POST['time_type'] ?? ''; 
    $comment = $_POST['comment'] ?? ''; 
    $full_reason = $time_type . " - " . $comment; 
    $excuse_reason = substr($full_reason, 0, 40); 
    
    $excuse_status = 'Pending'; 
    $date_filed = date("Y-m-d"); 
    
    // 3. Grab ONLY the Start and End dates (matching your SQL dump)
    $start_date_raw = $_POST['start_date'] ?? '';
    $end_date_raw = $_POST['end_date'] ?? '';

    // Format dates to MySQL standard
    $excuse_startdate = date("Y-m-d", strtotime($start_date_raw));
    $excuse_enddate = date("Y-m-d", strtotime($end_date_raw));
    
    // 4. Handle attachment
    $supporting_document = null;
    if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = 'uploads/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        $ext = pathinfo($_FILES['attachment']['name'], PATHINFO_EXTENSION);
        $short_name = 'ex_' . time() . '.' . $ext; 
        $target_file = $upload_dir . $short_name;
        
        if (move_uploaded_file($_FILES['attachment']['tmp_name'], $target_file)) {
            $supporting_document = $short_name;
        }
    }

    // 5. Insert directly into excuse_student
    $sql = "INSERT INTO excuse_student (student_id, excuse_reason, excuse_startdate, excuse_enddate, supporting_document, excuse_status, date_filed) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";
            
    if ($stmt = mysqli_prepare($conn, $sql)) {
        mysqli_stmt_bind_param($stmt, "issssss", $student_id, $excuse_reason, $excuse_startdate, $excuse_enddate, $supporting_document, $excuse_status, $date_filed);
        
        if (mysqli_stmt_execute($stmt)) {
            echo "Success! Excuse Application submitted to the database!";
        } else {
            echo "Database Error: " . mysqli_stmt_error($stmt); 
        }
        mysqli_stmt_close($stmt);
    } else {
        echo "Error preparing the database query: " . mysqli_error($conn);
    }
}
?>