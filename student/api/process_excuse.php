<?php
session_start();
require_once '../../db.php';

header('Content-Type: application/json');

$user_id = intval($_GET['uid'] ?? $_SESSION['uid'] ?? 0);
if (!$user_id) {
    echo json_encode(['success' => false, 'message' => 'session_error']);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 1. Smartly map the incoming time_type to match your DB ENUM exactly
    $raw_time_type = strtolower($_POST['time_type'] ?? '');
    $time_type = 'medical_appointment'; // Default fallback
    if (strpos($raw_time_type, 'extracurricular') !== false || strpos($raw_time_type, 'activity') !== false) {
        $time_type = 'extracurricular_activity';
    } else if (strpos($raw_time_type, 'emergency') !== false) {
        $time_type = 'personal_emergency';
    } else {
        $time_type = 'medical_appointment';
    }

    $comment = $_POST['comment'] ?? ''; 
    // ENUM must be exact lowercase!
    $excuse_status = 'pending'; 
    $date_filed = date("Y-m-d"); 
    
    // 2. Grab dates and ensure number_of_days is an integer
    $start_date_raw = $_POST['start_date'] ?? '';
    $end_date_raw = $_POST['end_date'] ?? '';
    $return_on_raw = $_POST['return_on'] ?? ''; 
    $number_of_days = intval($_POST['number_of_days'] ?? 0); 

    // Format dates to MySQL standard
    $excuse_startdate = date("Y-m-d", strtotime($start_date_raw));
    $excuse_enddate = date("Y-m-d", strtotime($end_date_raw));
    $return_on = !empty($return_on_raw) ? date("Y-m-d", strtotime($return_on_raw)) : null;

    // 3. Handle attachment
    $supporting_document = null;
    if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = '../uploads/';
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

    $user_type = 'Student';
    
    // 4. Insert directly into appeals
    $sql = "INSERT INTO appeals (
                        user_uid,
                        user_type, 
                        time_type,
                        comment, 
                        start_date, 
                        end_date, 
                        number_of_days,
                        return_on,
                        attachment, 
                        status, 
                        date_filed,
                        schedule_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    // 5. Get the days requested
    $current_start = new DateTime($excuse_startdate);
    $current_end = new DateTime($excuse_enddate);
    $daysList = [];
    while ($current_start <= $current_end) {
        $daysList[] = $current_start->format('l');
        $current_start->modify('+1 day');
    }

    // 6. Fetch student year and block
    $student_query = "SELECT student_year, student_block FROM student_id WHERE user_uid = ? LIMIT 1";
    $stmt_student = $conn->prepare($student_query);
    $stmt_student->bind_param("i", $user_id);
    $stmt_student->execute();
    $student_data = $stmt_student->get_result()->fetch_assoc();

    $year = $student_data['student_year'] ?? '';
    $block = $student_data['student_block'] ?? '';

    // 7. Match schedule to year and block
    $schedule_user = [];
    $schedule_query = "SELECT * FROM schedule_id WHERE student_year = ? AND student_block = ?";
    $stmt_schedule = $conn->prepare($schedule_query);
    $stmt_schedule->bind_param("ii", $year, $block);
    $stmt_schedule->execute();
    $schedule_result = $stmt_schedule->get_result();

    if ($schedule_result->num_rows > 0) {
        while ($row = $schedule_result->fetch_assoc()) {
            $schedule_user[] = $row;
        }
    }

    $inserted_count = 0;
    $current_schedule_id = null;

    // UPDATED BIND STRING: i (int), s (string). Matches your DB column types perfectly!
    $stmt->bind_param("isssssissssi", 
            $user_id, $user_type, $time_type, $comment, 
            $excuse_startdate, $excuse_enddate, $number_of_days, 
            $return_on, $supporting_document, $excuse_status, 
            $date_filed, $current_schedule_id);

    foreach ($schedule_user as $schedule) {
        if (in_array($schedule['day_week'], $daysList)) {
            $current_schedule_id = $schedule['schedule_id'];

            if ($stmt->execute()) {
                $inserted_count++;
             }
        }   
    }
    
    if ($inserted_count > 0) {
        echo json_encode(['success' => true, 'message' => "Successfully filed excuse for $inserted_count subjects!"]);
    } else {
        echo json_encode(['success' => false, 'message' => "No matching schedules found for the selected dates."]);
    }
}
?>