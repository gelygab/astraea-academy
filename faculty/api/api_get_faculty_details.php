<?php
session_start();
require_once '../../db.php';
header('Content-Type: application/json');

// 1. Check if user is logged in
if (!isset($_SESSION['uid'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

$user_uid = $_SESSION['uid'];

// Helper function to calculate real attendance stats!
function getAttendanceStats($conn, $teacher_id, $time_condition) {
    $sql = "SELECT 
                COUNT(*) as total_records,
                SUM(CASE WHEN a.attendance_status = 'Late' THEN 1 ELSE 0 END) as total_late,
                SUM(CASE WHEN a.attendance_status = 'Absent' THEN 1 ELSE 0 END) as total_absent,
                SUM(CASE WHEN a.attendance_status = 'Undertime' THEN 1 ELSE 0 END) as total_undertime,
                SUM(CASE WHEN a.attendance_status IN ('Present', 'On-Time', 'Late', 'Undertime') THEN 1 ELSE 0 END) as total_present
            FROM attendance_id a
            JOIN schedule_id s ON a.schedule_id = s.schedule_id
            JOIN student_id st ON a.user_uid = st.user_uid
            WHERE s.teacher_id = ? 
                AND st.student_year = s.student_year
                AND st.student_block = s.student_block
                AND st.department_id = s.department_id
                AND $time_condition";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();
    $res = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    
    $total = $res['total_records'] ?? 0;
    $present = $res['total_present'] ?? 0;
    $lates = $res['total_late'] ?? 0;
    $absents = $res['total_absent'] ?? 0;
    $undertime = $res['total_undertime'] ?? 0;
    
    $rate = ($total > 0) ? round(($present / $total) * 100) : 0;
    
    return [
        "total" => $total,
        "present" => $present,
        "lates" => $lates,
        "absents" => $absents,
        "undertime" => $undertime,
        "rate" => $rate
    ];
}

// 2. Grab real Faculty Data & internal Teacher ID
$sql_teacher = "SELECT t.teacher_id, t.first_name, t.last_name, t.user_uid, d.department_name, c.college_name 
        FROM teacher_id t
        LEFT JOIN department_id d ON t.department_id = d.department_id
        LEFT JOIN college_id c ON d.college_id = c.college_id
        WHERE t.user_uid = ?";

$stmt = $conn->prepare($sql_teacher);
$stmt->bind_param("s", $user_uid);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $internal_teacher_id = $row['teacher_id'];
    $name = $row['first_name'] . ' ' . $row['last_name'];
    $uid = $row['user_uid'];
    $dept = $row['department_name'] ?? 'N/A';
    $college = $row['college_name'] ?? 'N/A';
    $email = strtolower(str_replace(' ', '', $row['first_name'])) . '@astraea.edu';
    
    // 3. Grab REAL Subjects taught by this specific teacher
    $subjects_array = [];
    $sql_subjects = "SELECT DISTINCT subject_code, subject_name FROM schedule_id WHERE teacher_id = ?";
    $stmt_subj = $conn->prepare($sql_subjects);
    $stmt_subj->bind_param("i", $internal_teacher_id);
    $stmt_subj->execute();
    $res_subj = $stmt_subj->get_result();
    
    while ($s_row = $res_subj->fetch_assoc()) {
        $subjects_array[] = [
            "code" => $s_row['subject_code'],
            "name" => $s_row['subject_name']
        ];
    }
    $stmt_subj->close();

    // Fallbacks
    if (empty($subjects_array)) {
        $subjects_array[] = ["code" => "N/A", "name" => "No assigned subjects"];
    }

   // --- RUN REAL SQL MATH FOR TIMEFRAMES ---
    $daily = getAttendanceStats($conn, $internal_teacher_id, "a.date = CURDATE()");
    $weekly = getAttendanceStats($conn, $internal_teacher_id, "YEARWEEK(a.date, 1) = YEARWEEK(CURDATE(), 1)");
    $monthly = getAttendanceStats($conn, $internal_teacher_id, "YEAR(a.date) = YEAR(CURDATE()) AND MONTH(a.date) = MONTH(CURDATE())");

// --- REAL ON-GOING CLASS & PENDING EXCUSES MATH ---
    $ongoing_name = "No Class Right Now";
    $ongoing_code = "OFFLINE"; // Default text for the badge!
    $ongoing_enrolled = "--";
    $ongoing_present = "--";
    $pending_excuses = 0;
    $curr_sched_id = null;

    // 1. Get ALL Pending Excuses for ANY student in ANY of Ryan's classes
    $sql_pending = "SELECT COUNT(DISTINCT e.excuse_student_id) as pending_count 
                    FROM excuse_student e 
                    JOIN student_id st ON e.student_id = st.student_id 
                    JOIN schedule_id sch ON st.student_year = sch.student_year 
                        AND st.student_block = sch.student_block 
                        AND st.department_id = sch.department_id 
                    WHERE sch.teacher_id = ? AND e.excuse_status = 'Pending'";
    $stmt_pending = $conn->prepare($sql_pending);
    $stmt_pending->bind_param("i", $internal_teacher_id);
    $stmt_pending->execute();
    $pending_excuses = $stmt_pending->get_result()->fetch_assoc()['pending_count'] ?? 0;
    $stmt_pending->close();

    // 2. Find the class happening right this second (NOW INCLUDES subject_code)
    $sql_ongoing = "SELECT schedule_id, subject_name, subject_code, student_year, student_block, department_id 
                    FROM schedule_id 
                    WHERE teacher_id = ? 
                    AND day_week = DAYNAME(CURDATE()) 
                    AND CURTIME() BETWEEN start_time AND end_time 
                    LIMIT 1";
    $stmt_ongoing = $conn->prepare($sql_ongoing);
    $stmt_ongoing->bind_param("i", $internal_teacher_id);
    $stmt_ongoing->execute();
    $res_ongoing = $stmt_ongoing->get_result();

    if ($ongoing_row = $res_ongoing->fetch_assoc()) {
        $ongoing_name = $ongoing_row['subject_name'];
        $ongoing_code = $ongoing_row['subject_code']; // Grab the code for the badge!
        $curr_sched_id = $ongoing_row['schedule_id'];
        $s_year = $ongoing_row['student_year'];
        $s_block = $ongoing_row['student_block'];
        $s_dept = $ongoing_row['department_id'];

        // 3. Count Enrolled (matching Year, Block, Dept)
        $sql_enrolled = "SELECT COUNT(*) as enrolled FROM student_id WHERE student_year = ? AND student_block = ? AND department_id = ?";
        $stmt_e = $conn->prepare($sql_enrolled);
        $stmt_e->bind_param("iii", $s_year, $s_block, $s_dept);
        $stmt_e->execute();
        $ongoing_enrolled = $stmt_e->get_result()->fetch_assoc()['enrolled'] ?? 0;
        $stmt_e->close();

        // 4. Count Present Now
        $sql_pres = "SELECT COUNT(*) as present FROM attendance_id WHERE schedule_id = ? AND date = CURDATE() AND attendance_status IN ('Present', 'On-Time', 'Late', 'Undertime')";
        $stmt_p = $conn->prepare($sql_pres);
        $stmt_p->bind_param("i", $curr_sched_id);
        $stmt_p->execute();
        $ongoing_present = $stmt_p->get_result()->fetch_assoc()['present'] ?? 0;
        $stmt_p->close();
    }
    $stmt_ongoing->close();


    // --- LIVE FEED LOGIC ---

    // 5A. Grab the Feed for the ON-GOING CLASS ONLY (Daily View)
    $feed_daily = [];
    $active_schedule = $curr_sched_id ?? null; // Check if a class is actually happening right now

    if ($active_schedule) { 
        $sql_feed_daily = "SELECT s.first_name, s.last_name, DATE_FORMAT(a.timestamp_in, '%h:%i %p') as formatted_time, a.attendance_status
                           FROM attendance_id a
                           JOIN student_id s ON a.user_uid = s.user_uid
                           JOIN schedule_id sch ON a.schedule_id = sch.schedule_id
                           WHERE a.schedule_id = ? AND a.date = CURDATE()
                             AND s.student_year = sch.student_year
                             AND s.student_block = sch.student_block
                             AND s.department_id = sch.department_id
                           ORDER BY a.timestamp_in DESC LIMIT 5";
        $stmt_fd = $conn->prepare($sql_feed_daily);
        $stmt_fd->bind_param("i", $active_schedule);
        $stmt_fd->execute();
        $res_fd = $stmt_fd->get_result();
        
        while ($f_row = $res_fd->fetch_assoc()) {
            $status_label = ($f_row['attendance_status'] == 'Present') ? 'On-Time' : $f_row['attendance_status'];
            $display_time = ($f_row['attendance_status'] == 'Absent') ? '--:--' : ($f_row['formatted_time'] ?? '--:--');
            $feed_daily[] = [
                "name" => $f_row['first_name'] . ' ' . $f_row['last_name'],
                "time" => $display_time,
                "status" => $status_label
            ];
        }
        $stmt_fd->close();
    }

    // 5B. Grab the History Feed for ALL CLASSES (Weekly/Monthly View)
    $feed_all = [];
    $sql_feed_all = "SELECT s.first_name, s.last_name, DATE_FORMAT(a.timestamp_in, '%h:%i %p') as formatted_time, a.attendance_status
                     FROM attendance_id a
                     JOIN student_id s ON a.user_uid = s.user_uid
                     JOIN schedule_id sch ON a.schedule_id = sch.schedule_id
                     WHERE sch.teacher_id = ?
                       AND s.student_year = sch.student_year
                       AND s.student_block = sch.student_block
                       AND s.department_id = sch.department_id
                     ORDER BY a.date DESC, a.timestamp_in DESC LIMIT 5";
    $stmt_fa = $conn->prepare($sql_feed_all);
    $stmt_fa->bind_param("i", $internal_teacher_id);
    $stmt_fa->execute();
    $res_fa = $stmt_fa->get_result();
    
    while ($f_row = $res_fa->fetch_assoc()) {
        $status_label = ($f_row['attendance_status'] == 'Present') ? 'On-Time' : $f_row['attendance_status'];
        $display_time = ($f_row['attendance_status'] == 'Absent') ? '--:--' : ($f_row['formatted_time'] ?? '--:--');
        $feed_all[] = [
            "name" => $f_row['first_name'] . ' ' . $f_row['last_name'],
            "time" => $display_time,
            "status" => $status_label
        ];
    }
    $stmt_fa->close();


    // 5. Build the final JSON object with the EXACT labels from your updated JSON file
    $response = [
        "common" => [
            "faculty_details" => [
                "pfp" => "", 
                "name" => $name,
                "uid" => $uid,
                "college" => $college,
                "department" => $dept,
                "email" => $email
            ],
            "subjects" => $subjects_array,
            "current_class" => [
                "name" => $ongoing_name,
                "code" => $ongoing_code, // <--- Placed cleanly in the JSON here!
                "enrolled" => $ongoing_enrolled, 
                "present" => $ongoing_present, 
                "pending" => $pending_excuses
            ],
            "feed_daily" => $feed_daily,
            "feed_all" => $feed_all,
        ],
        "timeframes" => [
            "daily" => [
                "period_label" => "Today",
                "summary" => [
                    ["label" => "Total Attendance", "value" => "{$daily['present']} / {$daily['total']}"],
                    ["label" => "Late Today", "value" => "{$daily['lates']}"],
                    ["label" => "Undertime Today", "value" => "{$daily['undertime']}"], 
                    ["label" => "Absent Today", "value" => "{$daily['absents']}"]
                ],
                "rate" => $daily['rate'],
                "prev_rate" => 0
            ],
            "weekly" => [
                "period_label" => "This Week",
                "summary" => [
                    ["label" => "Avg. Daily Attendance", "value" => "{$weekly['present']} / {$weekly['total']}"],
                    ["label" => "Weekly Lates", "value" => "{$weekly['lates']}"],
                    ["label" => "Weekly Undertime", "value" => "{$weekly['undertime']}"],
                    ["label" => "Weekly Absents", "value" => "{$weekly['absents']}"]
                ],
                "rate" => $weekly['rate'],
                "prev_rate" => 0
            ],
            "monthly" => [
                "period_label" => "This Month",
                "summary" => [
                    ["label" => "Monthly Attendance", "value" => "{$monthly['present']} / {$monthly['total']}"],
                    ["label" => "Monthly Lates", "value" => "{$monthly['lates']}"],
                    ["label" => "Monthly Undertime", "value" => "{$monthly['undertime']}"],
                    ["label" => "Monthly Absents", "value" => "{$monthly['absents']}"]
                ],
                "rate" => $monthly['rate'],
                "prev_rate" => 0
            ]
        ]
    ];
    
    echo json_encode($response);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Faculty not found']);
}

$stmt->close();
$conn->close();
?>