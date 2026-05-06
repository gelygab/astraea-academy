<?php 
session_start();
date_default_timezone_set('Asia/Manila');
require_once '../../db.php';

header('Content-Type: application/json');

$user_id = $_GET['uid'] ?? $_SESSION['uid'];
if (!isset($user_id)) {
    echo json_encode(['success' => false, 'message' => 'session_error']);
    exit;
};

// Admin Profile 
global $conn;
$profile_query = "SELECT * FROM admin_id WHERE user_uid = ?";
$stmt_profile = $conn->prepare($profile_query);
$stmt_profile->bind_param("i", $user_id);
$stmt_profile->execute();
$profile_result = $stmt_profile->get_result();
$profile = $profile_result->fetch_assoc();

if (!$profile) {
    echo json_encode(['success' => false, 'message' => 'student_not_found']);
    exit;
}

// Pending Leave and Excuse Requests
$pending_query = "SELECT * FROM appeals WHERE user_type = 'Teacher' AND status = 'pending'";
$stmt_pending = $conn->prepare($pending_query);
$stmt_pending->execute();
$pending_result = $stmt_pending->get_result();
$leave_count = 0;
$excuse_count = 0;

if ($pending_result->num_rows > 0) {
    while ($row = $pending_result->fetch_assoc()) {
        if (in_array($row['time_type'], ['sick_leave', 'emergency_leave', 'leave_of_absence', 'other_leave'], true)) {
            $leave_count++;
        } 
        if (in_array($row['time_type'], ['extracurricular_activity', 'medical_appointment', 'personal_emergency', 'other_excuse'])) {
            $excuse_count++;
        }
    }
}

// Students Count
$students_query = "SELECT * FROM student_id";
$stmt_students = $conn->prepare($students_query);
$stmt_students->execute();
$students_result = $stmt_students->get_result();
$students_count = $students_result->num_rows;

// Faculty Count
$faculty_query = "SELECT * FROM teacher_id";
$stmt_faculty = $conn->prepare($faculty_query);
$stmt_faculty->execute();
$faculty_result = $stmt_faculty->get_result();
$faculty_count = $faculty_result->num_rows;

// College Count
$college_query = "SELECT * FROM college_id";
$stmt_college = $conn->prepare($college_query);
$stmt_college->execute();
$college_result = $stmt_college->get_result();
$college_count = $college_result->num_rows;

// Department Count 
$department_query = "SELECT * FROM department_id";
$stmt_department = $conn->prepare($department_query);
$stmt_department->execute();
$department_result = $stmt_department->get_result();
$department_count = $department_result->num_rows;

// Attendance Rate
// Present count per department ID
$present_query = "SELECT 
                    s.department_id, 
                    COUNT(DISTINCT a.user_uid) AS count 
                  FROM attendance_id a
                  JOIN student_id s ON a.user_uid = s.user_uid 
                  WHERE a.attendance_status = 'Present' 
                  AND a.user_type = 'Student'
                  GROUP BY s.department_id";
$stmt_present = $conn->prepare($present_query);
$stmt_present->execute();
$present_result = $stmt_present->get_result();
$present_count = [];

if ($present_result->num_rows > 0) {
    while ($row = $present_result->fetch_assoc()) {
        $present_count[] = $row;
    }
}

// Schedule count per department ID
$expected_query = "SELECT 
                    d.department_id, 
                    d.department_code, 
                    d.department_name, 
                    COUNT(s.user_uid) AS count
                FROM department_id d
                LEFT JOIN student_id s ON d.department_id = s.department_id
                GROUP BY d.department_id";
$stmt_expected = $conn->prepare($expected_query);
$stmt_expected->execute();
$expected_result = $stmt_expected->get_result();
$expected_count = [];

if ($expected_result->num_rows > 0) {
    while ($row = $expected_result->fetch_assoc()) {
        $expected_count[] = $row;
    }
}

$actual_result = [];
foreach ($present_count as $row) {
    $actual_result[$row['department_id']] = $row;
}

$matchedData = [];
foreach ($expected_count as $row2) {
    $dept_id = $row2['department_id'];
    
    // Kunin ang count mula sa actual result, default to 0 kung walang record
    $present = isset($actual_result[$dept_id]) ? $actual_result[$dept_id]['count'] : 0;
    
    // Iwasan ang Division by Zero
    $rate = ($row2['count'] > 0) ? ($present / $row2['count']) * 100 : 0;
    
    $matchedData[] = [
        'department_id' => $dept_id,
        'code' => $row2['department_code'],
        'name' => $row2['department_name'],
        'rate' => round($rate, 2) // Round para malinis tingnan
    ];
}
// $row2 contains department_id and count in expected_count
// $actual_result[$expected_present_result] contains matching row with the same department_id for that with dept_id and count as well

$colors = ['#D4A843', '#C49A3B', '#B48E33', '#E8C76A', '#F5D982',
        '#A67C52', '#8B6914', '#D4AF37', '#C5A028', '#B69121',
        '#A7821A', '#987313', '#CD853F', '#DAA520', '#B8860B'];

// Semester started April 7, 2026
$totalDays = 90;
$completedDays = 0;
$start_date = new DateTime('2026-04-07');
$current_date = new DateTime();
$interval = new DateInterval('P1D');
$period = new DatePeriod($start_date, $interval, $current_date);
foreach ($period as $date) {
    $currentDayName = $date->format('l');
    if ($currentDayName !== 'Sunday') {
        $completedDays++;
    }
}
$remainingDays = 90 - $completedDays;

$finalResponse = null;

$finalResponse = [
    "success" => true,
    "data" => [
        "name" => $profile['first_name'] . ' ' . $profile['last_name'],
        "uid" => $profile['user_uid'],
        "contactNumber" => $profile['admin_contact'],
        "email" => $profile['admin_email'],
        "address" => $profile['admin_address'],
        "totalStudents" => $students_count,
        "totalFaculty" => $faculty_count,
        "totalColleges" => $college_count,
        "totalDepartments" => $department_count,
        "leaveRequests" => $leave_count,
        "excuseRequests" => $excuse_count,
        "departments" => $matchedData,
        "colors" => $colors,
        "totalDays" => $totalDays,
        "completedDays" => $completedDays,
        "remainingDays" => $remainingDays
    ]
];

echo json_encode($finalResponse);
exit;

?>