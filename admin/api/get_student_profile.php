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



$finalResponse = null;

$finalResponse = [
    "success" => true,
    "students" => $studentsCount
];

echo json_encode($finalResponse);
exit;?>