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

$dept_filter = $_GET['department'] ?? null;
$coll_filter = $_GET['college'] ?? null;

$appeals_query = "SELECT admin_id.first_name AS admin_fname,
                    admin_id.last_name AS admin_lname,
                    teacher_id.teacher_id AS real_id,
                    teacher_id.user_uid,
                    teacher_id.first_name AS teacher_fname,
                    teacher_id.last_name AS teacher_lname,
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
                LEFT JOIN appeals ON teacher_id.user_Uid = appeals.user_uid
                LEFT JOIN admin_id ON appeals.status_updated_by = admin_id.admin_id
                LEFT JOIN department_id ON teacher_id.department_id = department_id.department_id
                LEFT JOIN college_id ON department_id.college_id = college_id.college_id
                WHERE 1=1";

$params = [];
$types = "";

if ($dept_filter && $dept_filter !== 'All') {
    $teacher_query .= " AND department_id.department_name LIKE CONCAT('%', ?, '%')";
    $params[] = $dept_filter;
    $types .= "s";
}

if ($coll_filter && $coll_filter !== 'All') {
    $teacher_query .= " AND college_id.college_name LIKE CONCAT('%', ?, '%')";
    $params[] = $coll_filter;
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

            $teacher_db_id = $row['real_id'];
            $affected_subjects = [];

            // Kunin lahat ng schedule ni teacher para i-manual filter sa PHP
            $sql_sched = "SELECT subject_name, day_week, start_time FROM schedule_id WHERE teacher_id = ?";
            $stmt_sched = $conn->prepare($sql_sched);
            $stmt_sched->bind_param("i", $teacher_db_id); // Siguraduhin na 's' or 'i' depende sa data type
            $stmt_sched->execute();
            $res_sched = $stmt_sched->get_result();
            $teacher_schedules = [];
            while($s = $res_sched->fetch_assoc()) {
                $teacher_schedules[] = $s;
            }

            // DEBUG LOG: Tingnan kung may nakuha talagang schedule sa DB
            error_log("DEBUG: Teacher $teacher_db_id has " . count($teacher_schedules) . " schedules in DB");

            $current = strtotime($row['start_date']);
            $last = strtotime($row['end_date']);

            while($current <= $last) {
                $day_name = date('l', $current);
                error_log("DEBUG: Checking day: $day_name"); // I-log ang araw na chine-check

                foreach($teacher_schedules as $sched) {
                    error_log("DEBUG: Comparing DB Day '" . $sched['day_week'] . "' with '" . $day_name . "'");
                    if(strcasecmp(trim($sched['day_week']), trim($day_name)) == 0) {
                        $affected_subjects[] = [
                            'name' => $sched['subject_name'],
                            'time' => $day_name . " " . date("g:i A", strtotime($sched['start_time']))
                        ];
                    }
                }
                $current = strtotime('+1 day', $current);
            }

            // I-remove ang duplicates kung sakaling multi-week ang leave
            $affected_subjects = array_map("unserialize", array_unique(array_map("serialize", $affected_subjects)));
            $type = $row['time_type'];
            if (in_array($row['time_type'], ['sick_leave', 'emergency_leave', 'leave_of_absence', 'other_leave'], true)) {
                $type = 'leave';
            } else if (in_array($row['time_type'], ['extracurricular_activity', 'medical_appointment', 'personal_emergency', 'other_excuse'])) {
                $type = 'excuse';
            }

            if (!empty($row['admin_fname']) && !empty($row['admin_lname'])) {
                $admin_name = htmlspecialchars($row['admin_fname'] . ' ' . $row['admin_lname']);
            } else {
                $admin_name = 'System';
            }

            $appealData[] = [
                'id' => $row['id'],
                'faculty_name' => $row['teacher_lname'] . ', ' . $row['teacher_fname'],
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
                'updated_by' => $admin_name,
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

?>