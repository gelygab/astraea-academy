<?php
// Connect to the database
require_once '../../db.php';
header('Content-Type: application/json');

// Check if JavaScript sent us a schedule_id
if (isset($_GET['schedule_id'])) {
    $schedule_id = $_GET['schedule_id'];
    
    // Find the exact program, year, and block for this class
    $sql = "SELECT department_id, student_year, student_block FROM schedule_id WHERE schedule_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $schedule_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    // Send the data back to JavaScript
    if ($row = $result->fetch_assoc()) {
        echo json_encode($row);
    } else {
        echo json_encode([]);
    }
    
    $stmt->close();
}
$conn->close();
?>