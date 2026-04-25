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

// I need subject code subject description, present count, absent count, late count, excuse count 
// $subjects_query = "SELECT schedule.id_subject_code, schedule_id.subject_name, attendance_id.attendance_status, attendance_id.timestamp_in, attendance_id.timestamp_out ";

// present and absent = attendance_id
// late = attendance_id (with computation?)
// excuse = appeals (with time_type = excuse && status = approved)

$subjects_query = "SELECT schedule.id_subject_code, 
                        schedule_id.subject_name, 
                        schedule_id.student_year,
                        schedule_id.student_block,
                        student_id.user_uid,
                        student_id.student_id,
                        attendance_id.attendance_status,
                        appeals.time_type,
                        appeals.status
                    FROM schedule_id
                    LEFT JOIN attendance_id ON student_id.user_uid = attendance_id.user_uid
                    LEFT JOIN appeals ON student_uid.user_uid = appeals.user_uid AND appeals.time_type IN ('extracurricular_activity', 'medical_appointment', 'personal_emergency', 'other_excuse') AND appeals.status = 'approved'
                    WHERE student_id = ?";
$stmt_subjects = $conn->prepare($subjects_query);
$stmt_subjects->bind_param("");
$finalResponse = null;

$finalResponse = [
    "success" => true,
    "data" => $studentsCount
];?>