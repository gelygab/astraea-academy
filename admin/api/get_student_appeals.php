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

$year_filter = $_GET['year'] ?? null;
$block_filter = $_GET['block'] ?? null; 
$dept_filter = $_GET['department'] ?? null;

$appeals_query = "SELECT teacher_id.first_name AS teacher_fname,
                    teacher_id.last_name AS teacher_lname,
                    student_id.user_uid,
                    student_id.first_name AS student_fname, 
                    student_id.last_name AS student_lname,
                    student_id.student_year,
                    student_id.student_block,
                    student_id.department_id,
                    department_id.department_code,
                    department_id.department_name,
                    college_id.college_name,
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
                FROM student_id
                LEFT JOIN appeals ON student_id.user_uid = appeals.user_uid
                LEFT JOIN teacher_id ON appeals.status_updated_by = teacher_id.teacher_id
                LEFT JOIN department_id ON student_id.department_id = department_id.department_id
                LEFT JOIN college_id ON department_id.college_id = college_id.college_id
                -- GROUP BY appeals.id
                WHERE 1=1";

$params = [];
$types = "";

if ($dept_filter && $dept_filter !== 'All') {
    $appeals_query .= " AND department_id.department_name LIKE CONCAT('%', ?, '%')";
    $params[] = $dept_filter;
    $types .= "s";
}

if ($year_filter && $year_filter !== 'All') {
    $appeals_query .= " AND student_id.student_year = ?";
    $params[] = $year_filter;
    $types .= "s";
}

if ($block_filter && $block_filter !== 'All' && $block_filter !== 'All Blocks') {
    $appeals_query .= " AND student_id.student_block = ?";
    $params[] = $block_filter;
    $types .= "s";
}

$appeals_query .= " GROUP BY appeals.id";

$stmt_appeals = $conn->prepare($appeals_query);

if (!empty($params)) {
    $stmt_appeals->bind_param($types, ...$params);
}

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

            if (!empty($row['teacher_fname']) && !empty($row['teacher_lname'])) {
                $teacher_name = htmlspecialchars($row['teacher_fname'] . ' ' . $row['teacher_lname']);
            } else {
                $teacher_name = 'System';
            }

            $appealData[] = [
                'id' => $row['id'],
                'student_name' => $row['student_lname'] . ', ' . $row['student_fname'],
                'student_id' => $row['user_uid'],
                'department_code' => $row['department_code'],
                'department_name' => $row['department_name'],
                'year' => $row['student_year'],
                'block' => $row['student_block'],
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
                'updated_by' => $teacher_name 
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
// var_dump($appealData);

?>