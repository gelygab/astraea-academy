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

$student_query = "SELECT student_id.user_uid,
                    student_id.user_type,
                    student_id.first_name,
                    student_id.last_name,
                    student_id.department_id,
                    student_id.student_year,
                    student_id.student_block,
                    department_id.department_name,
                        COUNT(DISTINCT CASE WHEN attendance_id.attendance_status = 'Absent' THEN attendance_id.attendance_id ELSE NULL END) AS absence_count,
                        COUNT(DISTINCT CASE WHEN appeals.time_type IN ('sick_leave', 'emergency_leave', 'leave_of_absence', 'other_leave') AND appeals.status = 'approved' THEN appeals.id ELSE NULL END) AS leave_count,
                        COUNT(DISTINCT CASE WHEN appeals.time_type IN ('extracurricular_activity', 'medical_appointment', 'personal_emergency', 'other_excuse') AND appeals.status = 'approved' THEN appeals.id ELSE NULL END) AS excuse_count
                    FROM student_id
                    LEFT JOIN department_id ON student_id.department_id = department_id.department_id
                    LEFT JOIN attendance_id ON student_id.user_uid = attendance_id.user_uid
                    LEFT JOIN appeals ON student_id.user_uid = appeals.user_uid
                    GROUP BY department_id.department_name, student_id.student_year, student_id.student_block";

$stmt_student = $conn->prepare($student_query);
$stmt_student->execute();
$student_result = $stmt_student->get_result();
$studentsCount = [];

if ($student_result->num_rows > 0) {
    while ($row = $student_result->fetch_assoc()) {
        $studentsCount[] = [
            'uid' => $row['user_uid'],
            'name' => $row['last_name'] . ', ' . $row['first_name'],
            'department' => $row['department_name'],
            'year' => $row['student_year'],
            'block' => $row['student_block'],
            'absence'=> $row['absence_count'],
            'leave' => $row['leave_count'],
            'excused' => $row['excuse_count']
        ];
    }
}

$finalResponse = null;

$finalResponse = [
    "success" => true,
    "students" => $studentsCount
];

echo json_encode($finalResponse);
exit;?>