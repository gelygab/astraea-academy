<?php 
session_start();
date_default_timezone_set('Asia/Manila');
require_once '../../db.php';

header('Content-Type: application/json');

$user_id = intval($_GET['uid'] ?? $_SESSION['uid']);
if (!isset($user_id)) {
    echo json_encode(['success' => false, 'message' => 'session_error']);
    exit;
};

$appeals_query = "SELECT teacher_id.user_uid,
                    teacher_id.first_name,
                    teacher_id.last_name,
                    teacher_id.department_id,
                    college_id.college_code,
                    college_id.college_name,
                    department_id.department_code,
                    department_id.department_name,
                    appeals.time_type,
                    appeals.date_filed,
                    appeals.start_date,
                    appeals.end_date,
                    appeals.number_of_days,
                    appeals.return_on,
                    appeals.attachment,
                    appeals.status,
                    appeals.comment,
                    appeals.status_updated_by,
                    appeals.id
                FROM teacher_id
                LEFT JOIN department_id ON teacher_id.department_id = department_id.department_id
                LEFT JOIN college_id ON department_id.college_id = college_id.college_id
                LEFT JOIN appeals ON teacher_id.user_Uid = appeals.user_uid
                GROUP BY appeals.time_type, appeals.status, department_id.department_name, college_id.college_name";
$stmt_appeals = $conn->prepare($appeals_query);
$stmt_appeals->execute();
$appeals_result = $stmt_appeals->get_result();
$appealData = [];

if ($appeals_result->num_rows > 0) {
    while ($row = $appeals_result->fetch_assoc()) {
        if (!empty($row['date_filed'])) {
            
            $type = $row['time_type'];
            if (in_array($row['time_type'], ['sick_leave', 'emergency_leave', 'leave_of_absence', 'other_leave'], true)) {
                $type = 'leave';
            } else if (in_array($row['time_type'], ['extracurricular_activity', 'medical_appointment', 'personal_emergency', 'other_excuse'])) {
                $type = 'excuse';
            }

            $appealData[] = [
                'id' => $row['id'],
                'faculty_name' => $row['last_name'] . ', ' . $row['first_name'],
                'faculty_id' => $row['user_uid'],
                'college_code' => $row['college_code'],
                'college_name' => $row['college_name'],
                'department_code' => $row['department_code'],
                'department_name' => $row['department_name'],
                'type' => $type,
                'type_label' => $row['time_type'],
                'date_applied' => $row['date_filed'],
                'start_date' => $row['start_date'],
                'end_date' => $row['end_date'],
                'num_days' => $row['number_of_days'],
                'return_date' => $row['return_on'],
                'status' => $row['status'],
                'reason' => $row['comment'], 
                'attachment' => $row['attachment'], 
                'updated_by' => $row['status_updated_by'] 
            ];
        }
    }
}

$finalResponse = null;

$finalResponse = [
    "success" => true,
    "data" => $appealData
];

echo json_encode($finalResponse);
exit;

?>