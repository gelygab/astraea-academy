<?php 
session_start();
require_once 'db.php';

$user_uid = $_POST['uid'];
$user_password = $_POST['password'];

$sql = "SELECT student_id, user_uid, password, is_first_login FROM student_id WHERE user_uid = ?";
$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param("s", $user_uid);

    $stmt->execute();

    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        if (password_verify($user_password, $row['password'])) {
           $_SESSION['userId'] = $row['student_id'];
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
            // Moves to their student dashboard
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

$conn->close();?>