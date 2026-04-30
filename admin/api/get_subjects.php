<?php 
session_start();
date_default_timezone_set('Asia/Manila');
require_once '../../db.php';

header('Content-Type: application/json');

$user_id = intval($_GET['uid'] ?? $_SESSION['uid']);
if (!isset($user_id)) {
    echo json_encode(['success' => false, 'message' => 'session_error']);
    exit;
};

$studentId = $_GET['studentId'];
if (!$studentId) {
    echo json_encode(['success' => false, 'message' => 'student_not_found']);
    exit;
}

global $conn;
$profile_query = "SELECT
                    schedule_id.subject_code,
                    schedule_id.subject_name,
                    MAX(schedule_id.subject_name) AS subject_name,
                        COUNT(DISTINCT CASE WHEN attendance_id.attendance_status = 'Present' THEN attendance_id.attendance_id END) AS present_count,
                        COUNT(DISTINCT CASE WHEN attendance_id.attendance_status = 'Absent' THEN attendance_id.attendance_id END) AS absence_count,
                        COUNT(DISTINCT CASE 
                            WHEN attendance_id.attendance_status = 'Present' 
                            AND TIMESTAMPDIFF(MINUTE, schedule_id.start_time, attendance_id.timestamp_in) > 15 
                            THEN attendance_id.attendance_id END) as late_count,                        
                        COUNT(DISTINCT CASE WHEN appeals.time_type IN ('extracurricular_activity', 'medical_appointment', 'personal_emergency', 'other_excuse') AND appeals.status = 'approved' THEN appeals.id END) as excuse_count
                    FROM student_id
                    JOIN schedule_id ON student_id.student_year = schedule_id.student_year AND student_id.student_block = schedule_id.student_block AND student_id.department_id = schedule_id.department_id
                    LEFT JOIN attendance_id ON student_id.user_uid = attendance_id.user_uid AND schedule_id.schedule_id = attendance_id.schedule_id
                    LEFT JOIN appeals ON appeals.user_uid = student_id.user_uid AND schedule_id.schedule_id = appeals.schedule_id
                    WHERE student_id.user_uid = ?
                    GROUP BY schedule_id.subject_code";
$stmt_profile = $conn->prepare($profile_query);
$stmt_profile->bind_param("i", $studentId);
$stmt_profile->execute();
$profile_result = $stmt_profile->get_result();
$subjects_map = [];


if ($profile_result->num_rows > 0) {
    while ($row = $profile_result->fetch_assoc()) {
        if (!$row['subject_code']) continue;
        $code = trim(strtoupper($row['subject_code']));
        if (!isset($subjects_map[$code])) {

            $subjects_map[$code] = [
                'code' => $row['subject_code'],
                'description' => $row['subject_name'],
                'present' => 0,
                'late' => 0,
                'absence' => 0,
                'excuse' => 0
            ];
        }

        $subjects_map[$code]['present'] += (int)$row['present_count'];
        $subjects_map[$code]['late'] += (int)$row['late_count'];
        $subjects_map[$code]['absence'] += (int)$row['absence_count'];
        $subjects_map[$code]['excuse'] += (int)$row['excuse_count'];
    }
}

$subjects = array_values($subjects_map);

$finalResponse = [
    "success" => true,
    "data" => $subjects
];

echo json_encode($finalResponse);
exit;