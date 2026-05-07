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

$department_query = "SELECT department_code, department_name FROM department_id";
$stmt_department = $conn->prepare($department_query);
$stmt_department->execute();
$department_result = $stmt_department->get_result();
$departments = [];

if ($department_result->num_rows > 0) {
    while ($row = $department_result->fetch_assoc()) {
        $departments[] = [
            'value' => $row['department_code'],
            'label' => $row['department_name']
        ];
    }
}

$finalResponse = null;
$finalResponse = [
    "success" => true,
    "data" => $departments
];

echo json_encode($finalResponse);
exit;
?>