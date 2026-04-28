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

// present and absent = attendance_id
// late = attendance_id (with computation?)
// excuse = appeals (with time_type = excuse && status = approved)

$studentId = $_GET['studentId'];
if (!$studentId) {
    echo json_encode(['success' => false, 'message' => 'student_not_found']);
    exit;
}

$subjects_query = "SELECT schedule_id.subject_code, 
                        schedule_id.subject_name, 
                        schedule_id.student_year,
                        schedule_id.student_block,
                        student_id.user_uid,
                            COUNT(DISTINCT CASE WHEN attendance_id.attendance_status = 'Present' THEN attendance_id.attendance_id ELSE NULL END) as present_count,
                            COUNT(DISTINCT CASE WHEN attendance_id.attendance_status = 'Absent' THEN attendance_id.attendance_id ELSE NULL END) as absent_count,
                            COUNT(DISTINCT CASE WHEN appeals.time_type IN  ('extracurricular_activity', 'medical_appointment', 'personal_emergency', 'other_excuse') AND appeals.status = 'approved' THEN appeals.id ELSE NULL END) as excuse_count
                    FROM schedule_id
                    LEFT JOIN student_id ON schedule_id.student_year = student_id.student_year AND schedule_id.student_block = student_id.student_block
                    LEFT JOIN attendance_id ON student_id.user_uid = attendance_id.user_uid
                    LEFT JOIN appeals ON student_id.user_uid = appeals.user_uid AND appeals.time_type IN ('extracurricular_activity', 'medical_appointment', 'personal_emergency', 'other_excuse') AND appeals.status = 'approved'
                    WHERE student_id.user_uid = ?
                    GROUP BY schedule_id.subject_code, 
                        schedule_id.subject_name, 
                        schedule_id.student_year,
                        schedule_id.student_block,
                        student_id.user_uid";
$stmt_subjects = $conn->prepare($subjects_query);
$stmt_subjects->bind_param("i", $studentId);
$stmt_subjects->execute();
$subjects_result = $stmt_subjects->get_result();
$subjects = [];

if ($subjects_result->num_rows > 0) {
    while ($row = $subjects_result->fetch_assoc()) {
        $subjects[] = [
            'studentId' => $row['user_uid'],
            'code' => $row['subject_code'],  
            'description' => $row['subject_name'],
            'present' => $row['present_count'],
            'absence' => $row['absent_count'],
            'excuse' => $row['excuse_count']
        ];
    }
}


$finalResponse = null;

$finalResponse = [
    "success" => true,
    "data" => $subjects
];

echo json_encode($finalResponse);
exit;

?>