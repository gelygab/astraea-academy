<?php
session_start();
require_once '../db.php';

header("Content-Type: application/json; charset=UTF-8");

$user_id = $_GET['uid'] ?? $_SESSION['uid'];
if (!isset($user_id)) {
    echo json_encode(['success' => false, 'message' => 'session_error']);
    exit;
};
// 3. DATABASE QUERIES 

global $conn;
// Get teacher_id
$teacherid_query = "SELECT teacher_id FROM teacher_id WHERE user_uid = ?";
$stmt_teacherid = $conn->prepare($teacherid_query);
$stmt_teacherid->bind_param("s", $user_id);
$stmt_teacherid->execute();
$teacher_id = $stmt_teacherid->get_result()->fetch_assoc();

// A. Faculty Profile - Fetch teacher details from user uid
$profile_query = "SELECT t.*, d.department_name 
                    FROM teacher_id t 
                    LEFT JOIN department_id d 
                    ON t.department_id = d.department_id 
                    WHERE t.teacher_id = ?";
$stmt_profile = $conn->prepare($profile_query);
$stmt_profile->bind_param("i", $teacher_id['teacher_id']);
$stmt_profile->execute();
$faculty_result = $stmt_profile->get_result();
$faculty = $faculty_result->fetch_assoc();

// Check if user exists
if (!$faculty) {
    echo json_encode(['success' => false, 'message' => 'student_not_found']);
    exit;
}

// B. Total Enrolled
$enrolled_query = "SELECT COUNT(DISTINCT s.student_id) as total 
                    FROM student_id s 
                    JOIN schedule_id sch 
                    ON s.student_year = sch.student_year 
                    AND s.student_block = sch.student_block 
                    AND s.department_id = sch.department_id 
                    WHERE sch.teacher_id = ?";
$stmt_enrolled = $conn->prepare($enrolled_query);
$stmt_enrolled->bind_param("i", $teacher_id['teacher_id']);
$stmt_enrolled->execute();
$total_enrolled = (int)$stmt_enrolled->get_result()->fetch_assoc()['total'];

// C. Total Present Today (Counts everyone who tapped in)
$present_query = "SELECT COUNT(*) as total 
                  FROM attendance_id 
                  WHERE user_uid = ? 
                  AND date = CURDATE() 
                  AND timestamp_in IS NOT NULL";
$stmt = $conn->prepare($present_query);
$stmt->bind_param("s", $user_id);
$stmt->execute();
$total_present = (int)$stmt->get_result()->fetch_assoc()['total'];

// C2. Total Late Today 
$late_query = "SELECT COUNT(*) as total 
                    FROM attendance_id a 
                    JOIN schedule_id sch 
                    ON a.schedule_id = sch.schedule_id 
                    WHERE a.user_uid = ? 
                    AND a.date = CURDATE() 
                AND a.timestamp_in > ADDTIME(sch.start_time, '00:15:00')";
$stmt = $conn->prepare($late_query);
$stmt->bind_param("s", $user_id); 
$stmt->execute();
$total_late = (int)$stmt->get_result()->fetch_assoc()['total'];

// C3. Total Undertime Today (Checks if they left before end_time)
$undertime_query = "SELECT COUNT(*) as total 
                    FROM attendance_id 
                    WHERE user_uid = ? 
                    AND date = CURDATE() 
                    AND timestamp_out IS NOT NULL 
                    AND attendance_status = 'Absent'";
$stmt = $conn->prepare($undertime_query);
$stmt->bind_param("s", $user_id); 
$stmt->execute();
$total_undertime = (int)$stmt->get_result()->fetch_assoc()['total'];

$total_absent = max(0, $total_enrolled - $total_present);

// --- WEEKLY STATS ---
// 1. Weekly Present
$weeklypresent_query = "SELECT COUNT(*) as total 
                        FROM attendance_id a 
                        WHERE a.user_uid = ? 
                        AND YEARWEEK(a.date, 1) = YEARWEEK(CURDATE(), 1) 
                        AND a.timestamp_in IS NOT NULL";
$stmt = $conn->prepare($weeklypresent_query);
$stmt->bind_param("s", $user_id); $stmt->execute();
$weekly_present = (int)$stmt->get_result()->fetch_assoc()['total'];

// 2. Weekly Late
$weeklylate_query = "SELECT COUNT(*) as total 
                        FROM attendance_id a 
                        JOIN schedule_id sch 
                        ON a.schedule_id = sch.schedule_id 
                        WHERE a.user_uid = ? 
                        AND YEARWEEK(a.date, 1) = YEARWEEK(CURDATE(), 1) 
                        AND a.timestamp_in > ADDTIME(sch.start_time, '00:15:00')";
$stmt = $conn->prepare($weeklylate_query);
$stmt->bind_param("s", $user_id); $stmt->execute();
$weekly_late = (int)$stmt->get_result()->fetch_assoc()['total'];

// 3. Weekly Undertime
$weeklyundertime_query = "SELECT COUNT(*) as total 
                          FROM attendance_id a 
                          WHERE a.user_uid = ? 
                          AND YEARWEEK(a.date, 1) = YEARWEEK(CURDATE(), 1) 
                          AND a.timestamp_out IS NOT NULL 
                          AND a.attendance_status = 'Absent'";
$stmt = $conn->prepare($weeklyundertime_query);
$stmt->bind_param("s", $user_id); $stmt->execute();
$weekly_undertime = (int)$stmt->get_result()->fetch_assoc()['total'];

// --- MONTHLY STATS ---
// 1. Monthly Present
$monthlypresent_query = "SELECT COUNT(*) as total 
                         FROM attendance_id a 
                         WHERE a.user_uid = ? 
                         AND MONTH(a.date) = MONTH(CURDATE()) 
                         AND YEAR(a.date) = YEAR(CURDATE()) 
                         AND a.timestamp_in IS NOT NULL";
$stmt = $conn->prepare($monthlypresent_query);
$stmt->bind_param("s", $user_id); $stmt->execute();
$monthly_present = (int)$stmt->get_result()->fetch_assoc()['total'];

// 2. Monthly Late
$monthlylate_query = "SELECT COUNT(*) as total 
                      FROM attendance_id a 
                      JOIN schedule_id sch ON a.schedule_id = sch.schedule_id 
                      WHERE a.user_uid = ? 
                      AND MONTH(a.date) = MONTH(CURDATE()) 
                      AND YEAR(a.date) = YEAR(CURDATE()) 
                      AND a.timestamp_in > ADDTIME(sch.start_time, '00:15:00')";
$stmt = $conn->prepare($monthlylate_query);
$stmt->bind_param("s", $user_id); $stmt->execute();
$monthly_late = (int)$stmt->get_result()->fetch_assoc()['total'];

// 3. Monthly Undertime
$monthlyundertime_query ="SELECT COUNT(*) as total 
                           FROM attendance_id a 
                           WHERE a.user_uid = ? 
                           AND MONTH(a.date) = MONTH(CURDATE()) 
                           AND YEAR(a.date) = YEAR(CURDATE()) 
                           AND a.timestamp_out IS NOT NULL 
                           AND a.attendance_status = 'Absent'"; 
$stmt = $conn->prepare($monthlyundertime_query);
$stmt->bind_param("s", $user_id); $stmt->execute();
$monthly_undertime = (int)$stmt->get_result()->fetch_assoc()['total'];

// Expected calculations for Absents (Assumes 5 days/week and 20 days/month)
$weekly_expected = $total_enrolled * 5;
$monthly_expected = $total_enrolled * 20;

$weekly_rate = ($weekly_expected > 0) ? round(($weekly_present / $weekly_expected) * 100) : 0;
$monthly_rate = ($monthly_expected > 0) ? round(($monthly_present / $monthly_expected) * 100) : 0;

// D. Dynamic Ongoing Class (Checks current time and day against schedule)
$ongoingclass_query = "SELECT subject_code 
                        FROM schedule_id 
                        WHERE teacher_id = ? 
                        AND day_week = DAYNAME(CURDATE()) 
                        AND CURTIME() 
                        BETWEEN start_time 
                        AND end_time LIMIT 1";
$stmt = $conn->prepare($ongoingclass_query);
$stmt->bind_param("i", $teacher_id['teacher_id']);
$stmt->execute();
$class_res = $stmt->get_result()->fetch_assoc();
$ongoing_class_name = $class_res['subject_code'] ?? "No Ongoing Class";

// E. Attendance Rate Calculation
$attendance_rate = ($total_enrolled > 0) ? round(($total_present / $total_enrolled) * 100) : 0;

// F. Handled Subjects List
$handledsubjects_query = "SELECT DISTINCT subject_code, subject_name 
                            FROM schedule_id 
                            WHERE teacher_id = ?";
$stmt = $conn->prepare($handledsubjects_query);
$stmt->bind_param("i", $teacher_id['teacher_id']);
$stmt->execute();
$subjects_result = $stmt->get_result();
$formatted_subjects = [];
while($row = $subjects_result->fetch_assoc()) {
    $formatted_subjects[] = ["code" => $row['subject_code'], "name" => $row['subject_name']];
}

// G. Live Attendance Feed Query 
$live_query = "SELECT s.first_name, s.last_name, a.timestamp_in, a.attendance_status, sch.start_time 
                    FROM attendance_id a 
                    JOIN student_id s ON a.user_uid = s.user_uid 
                    JOIN schedule_id sch ON a.schedule_id = sch.schedule_id 
                    WHERE sch.teacher_id = ? AND a.date = CURDATE() 
                    ORDER BY a.timestamp_in DESC 
                    LIMIT 5";
$stmt = $conn->prepare($live_query);
$stmt->bind_param("i", $teacher_id['teacher_id']);
$stmt->execute();
$feed_result = $stmt->get_result();
$live_feed = [];

while($row = $feed_result->fetch_assoc()) {
    
    $student_time = strtotime($row['timestamp_in']);
    
    $class_start = $row['start_time']; 
    
    $cutoff_time = strtotime(date("Y-m-d") . " " . $class_start) + 900;

    if ($student_time > $cutoff_time) {
        $ui_status = "Late";
    } else {
        $ui_status = "On-Time";
    }

    $live_feed[] = [
        "name" => $row['first_name'] . " " . $row['last_name'],
        "time" => date("h:i A", strtotime($row['timestamp_in'])),
        "status" => $ui_status
    ];
}

// H. Pending Excuses Count
$pendingexcuse_query = "SELECT COUNT(*) as total 
                            FROM excuse_student 
                            WHERE approved_by = ? 
                            AND excuse_status = 'Pending'";
$stmt = $conn->prepare($pendingexcuse_query);
$stmt->bind_param("i", $teacher_id['teacher_id']);
$stmt->execute();
$pending_count = (int)$stmt->get_result()->fetch_assoc()['total'];

// 4. RESPONSE 
$response = [
    "common" => [
        "faculty_details" => [
            "name" => ($faculty['first_name'] ?? "Unknown") . " " . ($faculty['last_name'] ?? ""),
            "uid" => $faculty['user_uid'] ?? $faculty['teacher_id'] ?? "NO-ID-FOUND",
            "college" => "College of Engineering",
            "department" => $faculty['department_name'] ?? "Computer",
            "email" => $faculty['email'] ?? "faculty@astraea.edu"
        ],
        "subjects" => $formatted_subjects,
        "current_class" => [
            "name" => $ongoing_class_name,
            "enrolled" => $total_enrolled, 
            "present" => $total_present, 
            "pending" => ($pending_count > 0) ? $pending_count : "NONE"
        ],
        "live_feed" => $live_feed 
    ],
  "timeframes" => [
    "daily" => [
        "summary" => [
            ["value" => $total_present . " Students", "label" => "Total Attendance"],
            ["value" => $total_late . " Students", "label" => "Late Attendance"],
            ["value" => $total_undertime . " Students", "label" => "Undertime Attendance"],
            ["value" => $total_absent . " Students", "label" => "Total Absent"]
        ],
        "rate" => $attendance_rate
    ],
    "weekly" => [
        "summary" => [
            ["value" => $weekly_present . " Taps", "label" => "Total Attendance"],
            ["value" => $weekly_late . " Taps", "label" => "Late Attendance"],
            ["value" => $weekly_undertime . " Taps", "label" => "Undertime Attendance"],
            ["value" => max(0, $weekly_expected - $weekly_present) . " Taps", "label" => "Total Absent"]
        ],
        "rate" => ($weekly_expected > 0) ? round(($weekly_present / $weekly_expected) * 100) : 0
    ],
    "monthly" => [
        "summary" => [
            ["value" => $monthly_present . " Taps", "label" => "Total Attendance"],
            ["value" => $monthly_late . " Taps", "label" => "Late Attendance"],
            ["value" => $monthly_undertime . " Taps", "label" => "Undertime Attendance"],
            ["value" => max(0, $monthly_expected - $monthly_present) . " Taps", "label" => "Total Absent"]
        ],
        "rate" => ($monthly_expected > 0) ? round(($monthly_present / $monthly_expected) * 100) : 0
    ]
]
];

echo json_encode($response);
$conn->close();
?>