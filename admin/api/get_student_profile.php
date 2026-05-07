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

$studentId = isset($_GET['uid']) ? $_GET['studentId'] : null;
if (!$studentId) {
    echo json_encode(['success' => false, 'message' => 'student_not_found']);
    exit;
}

$profile_query = "SELECT student_id.user_uid,
                    student_id.first_name, 
                    student_id.last_name, 
                    student_id.department_id,
                    department_id.department_name,
                    college_id.college_name
                FROM student_id
                LEFT JOIN department_id ON student_id.department_id = department_id.department_id
                LEFT JOIN college_id ON department_id.college_id = college_id.college_id
                WHERE student_id.user_uid = ?";
$stmt_profile = $conn->prepare($profile_query);
$stmt_profile->bind_param("i", $studentId);
$stmt_profile->execute();
$profile_result = $stmt_profile->get_result();
$profile = $profile_result->fetch_assoc();

$finalResponse = ([
    "success" => true,
    "data" => $profile
]);

echo json_encode($finalResponse);
exit;

?>