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

$college_query = "SELECT college_code, college_name FROM college_id";
$stmt_college = $conn->prepare($college_query);
$stmt_college->execute();
$college_result = $stmt_college->get_result();
$colleges = [];

if ($college_result->num_rows > 0) {
    while ($row = $college_result->fetch_assoc()) {
        $colleges[] = [
            'value' => $row['college_code'],
            'label' => $row['college_name']
        ];
    }
}

$finalResponse = null;
$finalResponse = [
    "success" => true,
    "data" => $colleges
];

echo json_encode($finalResponse);
exit;
?>