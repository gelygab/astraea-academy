<?php
require_once 'db.php';
header('Content-Type: application/json');

if (isset($_GET['uid'])) {
    $uid = $_GET['uid'];
    
    // Get the student's info from the database
    $sql = "SELECT * FROM student_id WHERE user_uid = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $uid);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        echo json_encode($row);
    } else {
        echo json_encode(["error" => "Student not found"]);
    }
    
    $stmt->close();
} else {
    echo json_encode(["error" => "No UID provided"]);
}
$conn->close();
?>