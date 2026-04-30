<?php
session_start();
header('Content-Type: application/json');
require_once '../../db.php'; // Check your path!

if (!isset($_SESSION['uid'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$user_uid = $_SESSION['uid'];

// THE SQL MAGIC: GROUP BY squashes duplicate class rows into one single appeal card!
$sql = "
    SELECT 
        MIN(a.id) as id, 
        a.status, 
        a.time_type as appeal_type, 
        a.date_filed, 
        a.start_date, 
        a.end_date, 
        a.number_of_days as num_days, 
        a.return_on as return_date, 
        a.comment, 
        a.attachment as attachment_name, 
        a.status_updated_by as updated_by,
        t.first_name, 
        t.last_name, 
        t.teacher_id as faculty_id
    FROM appeals a
    LEFT JOIN teacher_id t ON a.user_uid = t.user_uid
    WHERE a.user_uid = ? AND a.user_type = 'Teacher'
    GROUP BY a.start_date, a.end_date, a.time_type, a.status, a.date_filed
    ORDER BY a.date_filed DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_uid);
$stmt->execute();
$result = $stmt->get_result();

$appeals = [];
while ($row = $result->fetch_assoc()) {
    // Format the data to match what your JavaScript expects
    $row['faculty_name'] = $row['last_name'] . ", " . $row['first_name'];
    
    // UI Placeholders for now since teacher_id doesn't strictly hold these text names
    $row['college'] = "College of Engineering"; 
    $row['department'] = "Faculty Department"; 

    // Set the attachment URL if a file exists
    // NEW CODE (Removed the ../)
    // NEW CODE: Pointing to the correct main uploads/appeals/ folder!
    if (!empty($row['attachment_name']) && $row['attachment_name'] !== 'null') {
        $row['attachment_url'] = "../uploads/appeals/" . $row['attachment_name']; 
    }

    $appeals[] = $row;
}

echo json_encode(['success' => true, 'data' => $appeals]);
$stmt->close();
?>