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
    $internal_teacher_id = $row['teacher_id']; // We need this to search the schedule table!
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

    // 4. Grab REAL Live Feed (Recent Attendance for this teacher's classes)
    $live_feed_array = [];
    $sql_feed = "SELECT s.first_name, s.last_name, DATE_FORMAT(a.timestamp_in, '%h:%i %p') as formatted_time, a.attendance_status
                 FROM attendance_id a
                 JOIN student_id s ON a.user_uid = s.user_uid
                 JOIN schedule_id sch ON a.schedule_id = sch.schedule_id
                 WHERE sch.teacher_id = ?
                 ORDER BY a.timestamp_in DESC LIMIT 5";
                 
    $stmt_feed = $conn->prepare($sql_feed);
    $stmt_feed->bind_param("i", $internal_teacher_id);
    $stmt_feed->execute();
    $res_feed = $stmt_feed->get_result();
    
    while ($f_row = $res_feed->fetch_assoc()) {
        $status_label = ($f_row['attendance_status'] == 'Present') ? 'On-Time' : 'Late';
        $live_feed_array[] = [
            "name" => $f_row['first_name'] . ' ' . $f_row['last_name'],
            "time" => $f_row['formatted_time'] ?? '--:--',
            "status" => $status_label
        ];
    }
    $stmt_feed->close();

    // Fallbacks just in case a teacher has no subjects or no attendance records yet
    if (empty($subjects_array)) {
        $subjects_array[] = ["code" => "N/A", "name" => "No assigned subjects"];
    }
    if (empty($live_feed_array)) {
        $live_feed_array[] = ["name" => "No recent records", "time" => "--", "status" => "Late"];
    }

    // 5. Build the final JSON object
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
            "subjects" => $subjects_array, // <--- NOW REAL DATA!
            "current_class" => [
                "name" => $subjects_array[0]['name'] . " (" . $subjects_array[0]['code'] . ")",
                "enrolled" => 40, // Needs an enrollment table in your DB to make real
                "present" => 38,  // Needs complex math to make real
                "pending" => 2
            ],
            "live_feed" => $live_feed_array // <--- NOW REAL DATA!
        ],
        // The charts/graphs remain hardcoded placeholders since they require massive math calculations.
        "timeframes" => [
            "daily" => [
                "summary" => [
                    ["label" => "Total Attendance", "value" => "38"],
                    ["label" => "Late Attendance", "value" => "5"],
                    ["label" => "Undertime Attendance", "value" => "1"],
                    ["label" => "Total Absent", "value" => "2"]
                ],
                "rate" => 95,
                "prev_rate" => 92
            ],
            "weekly" => [
                "summary" => [
                    ["label" => "Total Attendance", "value" => "180"],
                    ["label" => "Late Attendance", "value" => "12"],
                    ["label" => "Undertime Attendance", "value" => "3"],
                    ["label" => "Total Absent", "value" => "8"]
                ],
                "rate" => 94,
                "prev_rate" => 90
            ],
            "monthly" => [
                "summary" => [
                    ["label" => "Total Attendance", "value" => "750"],
                    ["label" => "Late Attendance", "value" => "45"],
                    ["label" => "Undertime Attendance", "value" => "10"],
                    ["label" => "Total Absent", "value" => "25"]
                ],
                "rate" => 96,
                "prev_rate" => 91
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