<?php 
session_start();
require_once 'db.php';

if (!isset($_SESSION['uid'])) {
    echo "session_error";
    exit();
}

$user_uid = $_SESSION['uid'];
$new_password = trim($_POST['new_password']);
$confirm_password = trim($_POST['confirm_password']);

if ($new_password !== $confirm_password) {
    echo "mismatch";
    exit();
} else {
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
}

$update_query = "UPDATE teacher_id 
                SET password = ?,
                is_first_login = 0 
                WHERE user_uid = ?";
$stmt_update = $conn->prepare($update_query);

if ($stmt_update) {
    $stmt_update->bind_param("ss", $hashed_password, $user_uid);
    if ($stmt_update->execute()) {
        echo "dashboard";
        exit();
    }
}
?>