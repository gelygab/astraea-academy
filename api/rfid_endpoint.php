<?php
// Set to Manila time so your Time In/Out is perfectly synced!
date_default_timezone_set('Asia/Manila');
require_once '../db.php';

global $conn;
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $scanned_uid = $_POST['uid'] ?? '';


    if (empty($scanned_uid)) {
        echo "Error: No card UID received.";
        exit;
    }


    // ==========================================
    // 1. IDENTIFY THE USER
    // ==========================================
    $user_uid = null;
    $user_type = null;
   
    // Variables for schedule matching
    $student_year = null;
    $student_block = null;
    $department_id = null;
    $teacher_pk = null; // The integer ID from the teacher_id table


    // Check Student Table First
    $stmt = $conn->prepare("SELECT user_uid, student_year, student_block, department_id FROM student_id WHERE user_uid = ?");
    $stmt->bind_param("s", $scanned_uid);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $user_uid = $row['user_uid'];
        $user_type = 'Student';
        $student_year = $row['student_year'];
        $student_block = $row['student_block'];
        $department_id = $row['department_id'];
    }
    $stmt->close();


    // Check Teacher Table if not a student
    if (!$user_uid) {
        $stmt = $conn->prepare("SELECT user_uid, teacher_id FROM teacher_id WHERE user_uid = ?");
        $stmt->bind_param("s", $scanned_uid);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            $user_uid = $row['user_uid'];
            $user_type = 'Teacher';
            $teacher_pk = $row['teacher_id'];
        }
        $stmt->close();
    }


    // Check Admin Table if not a student or teacher
    if (!$user_uid) {
        $stmt = $conn->prepare("SELECT user_uid FROM admin_id WHERE user_uid = ?");
        $stmt->bind_param("s", $scanned_uid);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            $user_uid = $row['user_uid'];
            $user_type = 'Admin';
        }
        $stmt->close();
    }


    if (!$user_uid) {
        echo "Error: Unknown Card -> " . $scanned_uid;
        exit;
    }


    // ==========================================
    // 2. THE "SMART GATE" SCHEDULE MATCHER
    // ==========================================
    $current_date = date('Y-m-d');
    $current_time = date('Y-m-d H:i:s');
    $current_day_string = date('l');
    $current_time_only = date('H:i:s');
   
    $active_schedule_id = null;
    $class_start_time = null;
    $class_end_time = null;


    if ($user_type === 'Student') {
        // Find a class happening right now (Allows tapping in 30 mins early)
        $sched_sql = "SELECT schedule_id, start_time, end_time FROM schedule_id
                      WHERE student_year = ? AND student_block = ? AND department_id = ?
                      AND day_week = ?
                      AND ? BETWEEN SUBTIME(start_time, '00:30:00') AND end_time
                      LIMIT 1";
        $sched_stmt = $conn->prepare($sched_sql);
        $sched_stmt->bind_param("iiiss", $student_year, $student_block, $department_id, $current_day_string, $current_time_only);
        $sched_stmt->execute();
        $sched_result = $sched_stmt->get_result();
        if ($s_row = $sched_result->fetch_assoc()) {
            $active_schedule_id = $s_row['schedule_id'];
            $class_start_time = $s_row['start_time'];
            $class_end_time = $s_row['end_time'];
        }
        $sched_stmt->close();
       
    } elseif ($user_type === 'Teacher') {
        // Find a class this exact teacher is scheduled to teach right now
        $sched_sql = "SELECT schedule_id, start_time, end_time FROM schedule_id
                      WHERE teacher_id = ? AND day_week = ?
                      AND ? BETWEEN SUBTIME(start_time, '00:30:00') AND end_time
                      LIMIT 1";
        $sched_stmt = $conn->prepare($sched_sql);
        $sched_stmt->bind_param("iss", $teacher_pk, $current_day_string, $current_time_only);
        $sched_stmt->execute();
        $sched_result = $sched_stmt->get_result();
        if ($s_row = $sched_result->fetch_assoc()) {
            $active_schedule_id = $s_row['schedule_id'];
            $class_start_time = $s_row['start_time'];
            $class_end_time = $s_row['end_time'];
        }
        $sched_stmt->close();
    }


    // ==========================================
    // 2.5 THE STRICT BOUNCER (NEW!)
    // ==========================================
    if ($active_schedule_id === null) {
        echo "Rejected: No scheduled class found at this time.";
        exit; // Kills the script immediately. No record is saved.
    }




    // ==========================================
    // 3. LATE / ABSENT GRACE PERIOD LOGIC
    // ==========================================
    $dynamic_status = 'Present';


    $tap_time = strtotime($current_time_only);
    $start = strtotime($class_start_time);
    $end = strtotime($class_end_time);
   
    // Rules configuration
    $late_threshold = 15 * 60;   // 15 minutes late
    $absent_threshold = 45 * 60; // 45 minutes late = Auto Absent

    if ($tap_time > ($start + $absent_threshold)) {
        $dynamic_status = 'Absent';
    } elseif ($tap_time > ($start + $late_threshold)) {
        $dynamic_status = 'Present'; // Late is still marked as present, counting late logic is done separately in APIs
    } else {
        $dynamic_status = 'Present';
    }
   
    // ==========================================
    // 4. CHECK FOR EXISTING TIME IN TODAY
    // ==========================================
    $check_sql = "SELECT attendance_id, timestamp_out, attendance_status FROM attendance_id WHERE user_uid = ? AND date = ? AND schedule_id = ? ORDER BY timestamp_in DESC LIMIT 1";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->bind_param("ssi", $user_uid, $current_date, $active_schedule_id);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();


    if ($check_result->num_rows > 0) {
        $row = $check_result->fetch_assoc();
       
        // --- TIME OUT LOGIC ---
        if ($row['timestamp_out'] === null) {
            $att_id = $row['attendance_id'];

            $current_tap_out = strtotime($current_time_only);
            $scheduled_end = strtotime($class_end_time);
            $new_status = $row['attendance_status'];

            if ($current_tap_out < $scheduled_end) {
                $new_status = 'Absent';
            }

            $update_sql = "UPDATE attendance_id SET timestamp_out = ?, attendance_status = ? WHERE attendance_id = ?";
            $update_stmt = $conn->prepare($update_sql);
            $update_stmt->bind_param("ssi", $current_time, $new_status, $att_id);
            if ($update_stmt->execute()) {
                echo "Success: $user_type Time OUT Logged!";
            } else {
                echo "Error saving Time Out.";
            }
            $update_stmt->close();
            exit;
        }
    }


    // --- TIME IN LOGIC ---
    $insert_sql = "INSERT INTO attendance_id (user_uid, user_type, timestamp_in, date, attendance_status, schedule_id) VALUES (?, ?, ?, ?, ?, ?)";
    $insert_stmt = $conn->prepare($insert_sql);
    $insert_stmt->bind_param("sssssi", $user_uid, $user_type, $current_time, $current_date, $dynamic_status, $active_schedule_id);
   
    if ($insert_stmt->execute()) {
        echo "Success: $user_type Time IN (Class ID: $active_schedule_id) Marked: $dynamic_status";
    } else {
        echo "Error saving Time In.";
    }
    $insert_stmt->close();

} else {
    echo "Endpoint active. Waiting for POST request from ESP32.";
}
?>

