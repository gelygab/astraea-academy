<?php
session_start();
header('Content-Type: application/json');
include '../../db.php';

if (!isset($_SESSION['uid']) || !isset($_POST['appeal_id']) || !isset($_POST['status'])) {
    echo json_encode(['success' => false, 'message' => 'Missing data.']);
    exit();
}

$faculty_uid = $_SESSION['uid'];
$appeal_id   = (int)$_POST['appeal_id'];
$status      = $_POST['status']; 
$comment     = $_POST['comment'] ?? '';

$stmt = $conn->prepare("UPDATE appeals SET status = ?, status_updated_by = ?, comment = ? WHERE id = ?");
$stmt->bind_param("sssi", $status, $faculty_uid, $comment, $appeal_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Database update failed.']);
}
$stmt->close();
?>