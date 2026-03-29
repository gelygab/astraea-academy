<?php
session_start();
require_once 'db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['student_id'])) {
    echo json_encode(['success' => false, 'message' => 'session_error']);
    exit();
}

$student_id = $_SESSION['student_id'];

// REMOVED: AND appeals.status = 'pending'
// This query now fetches all records for the student regardless of status
$sql = "SELECT appeals.*, teacher_id.first_name, teacher_id.last_name 
        FROM appeals 
        LEFT JOIN teacher_id ON appeals.status_updated_by = teacher_id.teacher_id 
        WHERE appeals.student_id = ?";
        
$stmt = $conn->prepare($sql);

if ($stmt) {
    // Only binding the student_id now
    $stmt->bind_param("i", $student_id);
    
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $appeals = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                // Determine teacher name or default to System
                if (!empty($row['first_name']) && !empty($row['last_name'])) {
                    $teacher_name = htmlspecialchars($row['first_name'] . ' ' . $row['last_name']);
                } else {
                    $teacher_name = 'System';
                }

                $appeals[] = [
                    'id' => isset($row['id']) ? $row['id'] : (isset($row['appeal_id']) ? $row['appeal_id'] : uniqid()), 
                    'appeal_type' => $row['time_type'],
                    'date_filed' => $row['date_filed'],
                    'start_date' => $row['start_date'],
                    'end_date' => $row['end_date'],
                    'num_days' => $row['number_of_days'],
                    'return_date' => $row['return_on'],
                    'comment' => $row['comment'],
                    'attachment_url' => !empty($row['attachment']) ? $row['attachment'] : null,
                    'attachment_name' => !empty($row['attachment']) ? $row['attachment'] : null,
                    'status' => $row['status'], // Pass the status (pending/approved/rejected) to JS
                    'updated_by' => $teacher_name
                ];
            }
        }
        
        echo json_encode(['success' => true, 'data' => $appeals]);
        
    } else {
        echo json_encode(['success' => false, 'message' => 'execution_error']);
    }
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'database_error']);
}

$conn->close();
?>