<?php 
session_start();
ini_set('display_errors', 0);
date_default_timezone_set('Asia/Manila');
require_once '../../db.php';

header('Content-Type: application/json');

$user_id = intval($_GET['uid'] ?? $_SESSION['uid']);
if (!isset($user_id)) {
    echo json_encode(['success' => false, 'message' => 'session_error']);
    exit;
};

$uid = $_GET['facultyId'];
if (!$uid) {
    echo json_encode(['success' => false, 'message' => 'faculty_not_found']);
    exit;
}

$profile_query = "SELECT teacher_id.user_uid,
                    teacher_id.first_name,
                    teacher_id.last_name,
                    teacher_id.department_id,
                    department_id.department_name,
                    college_id.college_name,
                    teacher_id.teacher_id,
                    schedule_id.schedule_id,
                    schedule_id.subject_code,
                    schedule_id.subject_name,
                        COUNT(DISTINCT CASE WHEN attendance_id.attendance_status = 'Present' THEN attendance_id.attendance_id END) as present_count,
                        COUNT(DISTINCT CASE WHEN attendance_id.attendance_status = 'Absent' THEN attendance_id.attendance_id END) as absence_count,
                        COUNT(DISTINCT CASE WHEN appeals.time_type IN ('extracurricular_activity', 'medical_appointment', 'personal_emergency', 'other_excuse') AND appeals.status = 'approved' THEN appeals.id END) as excuse_count
                FROM teacher_id
                LEFT JOIN schedule_id ON teacher_id.teacher_id = schedule_id.teacher_id
                LEFT JOIN attendance_id ON teacher_id.user_uid = attendance_id.user_uid AND attendance_id.schedule_id = schedule_id.schedule_id
                LEFT JOIN appeals ON appeals.user_uid = teacher_id.user_uid 
                    AND schedule_id.schedule_id = appeals.schedule_id
                LEFT JOIN department_id ON teacher_id.department_id = department_id.department_id
                LEFT JOIN college_id ON department_id.college_id = college_id.college_id
                WHERE teacher_id.user_uid = ?
                GROUP BY schedule_id.subject_code";
$stmt_profile = $conn->prepare($profile_query);
$stmt_profile->bind_param("i", $uid);
$stmt_profile->execute();
$profile_result = $stmt_profile->get_result();
$profile = null;
$subjects = [];

if ($profile_result->num_rows > 0) {
    while($row = $profile_result->fetch_assoc()) {
        $profile = [
            'firstName' => $row['first_name'],
            'lastName' => $row['last_name'],
            'college' => $row['college_name'],
            'department' => $row['department_name']
        ];

        $subjects[] = [
            'code' => $row['subject_code'],
            'description' => $row['subject_name'],
            'present' => (int)($row['present_count']),
            'late' => (int)$row['late_count'],
            'absence' => (int)$row['absence_count'],
            'excuse' => (int)$row['excuse_count'],
        ];
    }
}

$finalResponse = [
    "success" => true,
    "data" => array_merge($profile ?? [], ['subjects' => $subjects])
];

echo json_encode($finalResponse);
exit;
?>