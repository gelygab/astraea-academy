<?php
session_start();
// Connect to the database
require_once '../../db.php';

header('Content-Type: application/json');

$user_id = intval($_GET['uid'] ?? $_SESSION['uid']);
if (!isset($user_id)) {
    echo json_encode(['success' => false, 'message' => 'session_error']);
    exit;
};

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
   // 1. Grab the value directly from the frontend, it's already perfectly formatted!
    $time_type = $_POST['time_type'] ?? 'other_leave';

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

    $user_type = 'Student';
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

    // get the days from leave_startdate to leave_enddate 
    // then check if those days overlaps with the any of the days from the schedule_id of the student

    $current_start = new DateTime($leave_startdate);
    $current_end = new DateTime($leave_enddate);
    $daysList = [];
    while ($current_start <= $current_end) {
        $daysList[] = $current_start->format('l');
        $current_start->modify('+1 day');
    }

    // 6. Fetch student year, block, AND department
    $student_query = "SELECT student_year, student_block, department_id FROM student_id WHERE user_uid = ? LIMIT 1";
    $stmt_student = $conn->prepare($student_query);
    $stmt_student->bind_param("i", $user_id);
    $stmt_student->execute();
    $student_data = $stmt_student->get_result()->fetch_assoc();

    $year = $student_data['student_year'] ?? '';
    $block = $student_data['student_block'] ?? '';
    $dept_id = $student_data['department_id'] ?? '';

    // 7. Match schedule to year, block, AND department!
    $schedule_user = [];
    $schedule_query = "SELECT * FROM schedule_id WHERE student_year = ? AND student_block = ? AND department_id = ?";
    $stmt_schedule = $conn->prepare($schedule_query);
    $stmt_schedule->bind_param("sss", $year, $block, $dept_id);
    $stmt_schedule->execute();
    $schedule_result = $stmt_schedule->get_result();

    if ($schedule_result->num_rows > 0) {
        while ($row = $schedule_result->fetch_assoc()) {
            $schedule_user[] = $row;
        }
    }

    $inserted_count = 0;
    $current_schedule_id = null;
    $stmt->bind_param("issssssssssi", 
            $user_id, $user_type, $time_type, $comment, 
            $leave_startdate, $leave_enddate, $number_of_days, 
            $return_on, $supporting_document, $leave_status, 
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
        echo json_encode(['success' => true, 'message' => "Successfully filed leave for $inserted_count subjects."]);
    } else {
        echo json_encode(['success' => false, 'message' => "No matching schedules found for the selected dates."]);
    }
}
?>