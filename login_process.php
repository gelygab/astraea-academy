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

            if ($row['is_first_login'] == 1) {
                echo "first_login";
            } else {
                echo "dashboard";
            }
            exit();
        } else {
            echo "invalid";
            exit();
        }
    } else {
        echo "<script>alert('UID not found!'); window.location.href='studentlogin.php';</script>";
        exit();
    }

    $stmt->close();
} else {
    $error_message = "Database error: " . $conn->error;
}

$conn->close();?>