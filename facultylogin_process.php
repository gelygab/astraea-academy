<?php 
session_start();
require_once 'db.php';

$user_uid = $_POST['uid'];
$user_password = $_POST['password'];

$user_query = "SELECT teacher_id, user_uid, password, is_first_login
                FROM teacher_id
                WHERE user_uid = ?";
$stmt_user = $conn->prepare($user_query);

if ($stmt_user) {
    $stmt_user->bind_param("s", $user_uid);
    $stmt_user->execute();
    $user_result = $stmt_user->get_result();

    if ($row = $user_result->fetch_assoc()) {
        if (password_verify($user_password, $row['password'])) {
            $_SESSION['userId'] = $row['teacher_id'];
            $_SESSION['uid'] = $row['user_uid'];
        } else {
            // Valid UID invalid password
            echo "invalid password";
            exit();
        }
        if ($row['is_first_login'] == 1) {
            // Moves to change password
            echo "first_login";
        } else {
            // Moves to their faculty dashboard
            echo "dashboard";
        }
        exit();
    } else {
        // Invalid UID and password
        echo "invalid uid and password";
        exit();
    }
    $stmt->close();
} else {
    $error_message = "Database error: " . $conn->error;
}
$conn->close();
?>