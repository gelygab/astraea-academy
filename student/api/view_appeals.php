<?php
session_start();
require_once '../../db.php';

header('Content-Type: application/json');

$user_id = $_GET['uid'] ?? $_SESSION['uid'];
if (!isset($user_id)) {
    echo json_encode(['success' => false, 'message' => 'session_error']);
    exit;
};

// REMOVED: AND appeals.status = 'pending'
// This query now fetches all records for the student regardless of status
$sql = "SELECT appeals.*, 
            teacher_id.first_name AS teacher_fname, 
            teacher_id.last_name AS teacher_lname, 
            student_id.first_name AS student_fname, 
            student_id.last_name AS student_lname, 
            student_id.user_uid,
            student_id.student_year,
            student_id.student_block,
            department_id.department_name,
            college_id.college_name,
            schedule_id.subject_name
        FROM appeals 
        LEFT JOIN teacher_id ON appeals.status_updated_by = teacher_id.teacher_id
        LEFT JOIN student_id ON appeals.user_uid = student_id.user_uid
        LEFT JOIN department_id ON student_id.department_id = department_id.department_id
        LEFT JOIN college_id ON department_id.department_id = college_id.college_id
        LEFT JOIN schedule_id ON appeals.schedule_id = schedule_id.schedule_id
        WHERE appeals.user_uid = ?";
global $conn;
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$data = [];

$finalResponse = null;

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Determine teacher name or default to System
        if (!empty($row['teacher_fname']) && !empty($row['teacher_lname'])) {
            $teacher_name = htmlspecialchars($row['teacher_fname'] . ' ' . $row['teacher_lname']);
        } else {
            $teacher_name = 'System';
        }
        $data[] = [
                'student_name' => $row['student_lname'] . ', ' . $row['student_fname'],
                'subject_name' => $row['subject_name'] ?? 'General Leave',
                'year' => $row['student_year'],
                'block' => $row['student_block'],
                'student_id' => $row['user_uid'],
                'college' => $row['college_name'],
                'program' => $row['department_name'],
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
    $finalResponse = [
        "success" => true,
        "data" => $data
    ];
} else {
    $finalResponse = ['success' => false, 'message' => 'no_appeals_found'];
}
echo json_encode($finalResponse);
exit;
?>