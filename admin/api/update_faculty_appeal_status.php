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

$body = json_decode(file_get_contents('php://input'), true);
$appealId = $body['id'];
if (!isset($appealId)) {
    echo json_encode(['success' => false, 'message' => 'no_appeal_uid_found']);
    exit;
}

$status = $body['status'];

global $conn;
$status_query = "UPDATE appeals SET status = ? WHERE id = ?";
$stmt_query = $conn->prepare($status_query);
$stmt_query->bind_param("si", $status, $appealId);
$stmt_query->execute();

echo json_encode (["success" => true]);
?>
