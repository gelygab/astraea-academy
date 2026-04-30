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

global $conn;
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

            $affected_subjects = [];
            $s_year = $row['student_year'];
            $s_block = $row['student_block'];

            $sql_sched = "SELECT subject_name, day_week, start_time 
              FROM schedule_id 
              WHERE student_year = ? AND student_block = ?"; 

            $stmt_sched = $conn->prepare($sql_sched);
            $stmt_sched->bind_param("ss", $s_year, $s_block);
            $stmt_sched->execute();
            $res_sched = $stmt_sched->get_result();

            $block_schedules = [];
            while($s = $res_sched->fetch_assoc()) {
                $block_schedules[] = $s;
            }

            $current = strtotime($row['start_date']);
            $last = strtotime($row['end_date']);

            // Check bawat araw sa range ng leave
            while($current <= $last) {
                $day_name = date('l', $current);
                foreach($block_schedules as $sched) {
                    // I-match ang day_week mula sa DB sa current day ng loop
                    if(strcasecmp(trim($sched['day_week']), trim($day_name)) == 0) {
                        $affected_subjects[] = [
                            'name' => $sched['subject_name'],
                            'time' => $day_name . " " . date("g:i A", strtotime($sched['start_time']))
                        ];
                    }
                }
                $current = strtotime('+1 day', $current);
            }

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
                'updated_by' => $teacher_name,
                'affected_subjects' => $affected_subjects
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