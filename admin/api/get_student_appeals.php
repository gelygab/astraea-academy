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

$appeals_query = "SELECT student_id.user_uid,
                    student_id.first_name, 
                    student_id.last_name,
                    student_id.student_year,
                    student_id.student_block,
                    student_id.department_id,
                    department_id.department_name,
                    appeals.time_type,
                    appeals.date_filed,
                    appeals.status,
                    appeals.comment
                FROM student_id
                LEFT JOIN department_id ON student_id.department_id = department_id.department_id
                LEFT JOIN appeals ON student_id.user_uid = appeals.user_uid
                GROUP BY appeals.time_type, appeals.status, department_id.department_name, student_id.student_year, student_id.student_block";
$stmt_appeals = $conn->prepare($appeals_query);
$stmt_appeals->execute();
$appeals_result = $stmt_appeals->get_result();
$appealData = [];

if ($appeals_result->num_rows > 0) {
    while ($row = $appeals_result->fetch_assoc()) {
        $appealData = [

        ];
    }
}

?>