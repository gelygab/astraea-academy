<?php 
session_start();
require_once '../db.php';

global $conn;
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
            // Valid UID, invalid password -> Kick them back to login
            echo "invalid password";
            exit();
        }

        if ($row['is_first_login'] == 1) {
            // Moves to change password page
            echo "first_login";
        } else {
            // Moves safely into their faculty dashboard!
            echo "dashboard";
            exit();
        }
    } else {
        // Invalid UID and password -> Kick them back to login
        echo "invalid uid and password";
        exit();
    }
    
    // Fixed the variable name here!
    $stmt_user->close();
} else {
    // Database connection error -> Kick back to login
    $error_message = "Database error: " . $conn->error;
}
$conn->close();
?>