<?php
session_start();
include '../db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_uid'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized.']);
    exit();
}

$appeal_id = isset($_POST['appeal_id']) ? intval($_POST['appeal_id']) : 0;
$action    = isset($_POST['action'])    ? trim($_POST['action'])      : '';
$comment   = isset($_POST['comment'])   ? trim($_POST['comment'])     : '';
$actor_uid = $_SESSION['user_uid'];

if (!$appeal_id || !in_array($action, ['approve', 'reject', 'reeval'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid request parameters.']);
    exit();
}

$status_map = [
    'approve' => 'approved',
    'reject'  => 'rejected',
    'reeval'  => 'pending',
];
$new_status = $status_map[$action];

// Verify appeal exists
$check = mysqli_prepare($conn, "SELECT id, time_type, user_uid FROM appeals WHERE id = ?");
mysqli_stmt_bind_param($check, 'i', $appeal_id);
mysqli_stmt_execute($check);
$appeal = mysqli_fetch_assoc(mysqli_stmt_get_result($check));
mysqli_stmt_close($check);

if (!$appeal) {
    echo json_encode(['success' => false, 'message' => 'Appeal not found.']);
    exit();
}

// Update appeal 
$update = mysqli_prepare($conn, "
    UPDATE appeals
    SET status            = ?,
        comment           = ?,
        status_updated_by = ?
    WHERE id = ?
");

if (!$update) {
    echo json_encode(['success' => false, 'message' => 'DB error: ' . mysqli_error($conn)]);
    exit();
}

mysqli_stmt_bind_param($update, 'sssi', $new_status, $comment, $actor_uid, $appeal_id);
$ok = mysqli_stmt_execute($update);
mysqli_stmt_close($update);

if (!$ok) {
    echo json_encode(['success' => false, 'message' => 'Update failed: ' . mysqli_error($conn)]);
    exit();
}

echo json_encode([
    'success'    => true,
    'message'    => 'Appeal updated successfully.',
    'new_status' => $new_status,
]);

mysqli_close($conn);
?>