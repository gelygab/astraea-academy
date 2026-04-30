<?php 
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();
date_default_timezone_set('Asia/Manila');
require_once '../../db.php';

header('Content-Type: application/json');

$user_id = intval($_GET['uid'] ?? $_SESSION['uid']);
if (!isset($user_id)) {
    echo json_encode(['success' => false, 'message' => 'session_error']);
    exit;
};

$studentId = $_GET['studentId'];
if (!$studentId) {
    echo json_encode(['success' => false, 'message' => 'student_not_found']);
    exit;
}

$subjectCode = $_GET['subjectCode'];
if (!$subjectCode) {
    echo json_encode(['success' => false, 'message' => 'subject_not_found']);
    exit;
}

$month = $_GET['month'];
if (!$month) {
    echo json_encode(['success' => false, 'message' => 'month_not_found']);
    exit;
}

$year = $_GET['year'];
if (!$year) {
    echo json_encode(['success' => false, 'message' => 'year_not_found']);
    exit;
}

global $conn;

$student_info_query = "SELECT student_year, student_block, department_id FROM student_id WHERE user_uid = ?";
$stmt_info = $conn->prepare($student_info_query);
$stmt_info->bind_param("i", $studentId);
$stmt_info->execute();
$info = $stmt_info->get_result()->fetch_assoc();

if (!$info) {
    echo json_encode(['success' => false, 'message' => 'student_record_not_found']);
    exit;
}

$schedule_query = "SELECT schedule_id, day_week FROM schedule_id 
                   WHERE student_year = ? 
                   AND student_block = ? 
                   AND department_id = ? 
                   AND subject_code = ?";
$stmt_schedule = $conn->prepare($schedule_query);
$stmt_schedule->bind_param("ssis", $info['student_year'], $info['student_block'], $info['department_id'], $subjectCode);
$stmt_schedule->execute();

$schedule_result = $stmt_schedule->get_result();
$schedules = [];

while ($row = $schedule_result->fetch_assoc()) {
    $schedules[$row['schedule_id']] = $row['day_week'];
}

if (empty($schedules)) {
    echo json_encode(['success' => true, 'data' => ["subject_code" => $subjectCode, "attendance_days" => []]]);
    exit;
}


$schedule_ids = array_keys($schedules);
$placeholders = implode(',', array_fill(0, count($schedule_ids), '?'));

$calendar_map = [];

$appeals_query = "SELECT schedule_id, start_date, end_date, time_type, status, date_filed, comment, status_updated_by
                        FROM appeals
                        WHERE user_uid = ?
                        AND status = 'approved'
                        AND schedule_id IN ($placeholders)";
$stmt_appeals = $conn->prepare($appeals_query);
$params_appeals = 'i' . str_repeat('i', count($schedule_ids));
$stmt_appeals->bind_param($params_appeals, $studentId, ...$schedule_ids);
$stmt_appeals->execute();
$appeals_result = $stmt_appeals->get_result();

while ($app = $appeals_result->fetch_assoc()) {
    // SECURITY CHECK: Approved lang ba dapat? Dagdagan sa SQL: WHERE status = 'approved'
    
    $start = new DateTime($app['start_date']);
    $end = new DateTime($app['end_date']);
    $day_week_db = $schedules[$app['schedule_id']];

    while ($start <= $end) {
        if (trim($start->format('l')) == trim($day_week_db) && 
            $start->format('n') == $month && 
            $start->format('Y') == $year) {
                
                $type = $app['time_type'];
                $leave_types = ['sick_leave', 'emergency_leave', 'leave_of_absence', 'other_leave'];

                $displayStatus = in_array($type, $leave_types) ? 'leave' : 'excused';

                $dateKey = $start->format('Y-m-d');
                $calendar_map[$dateKey] = [
                    'status' => $displayStatus,
                    'appealType' => $type,
                    'dateApplied' => $app['date_filed'],
                    'reason' => $app['comment'],
                    'updatedBy' => $app['status_updated_by']
                ];
        }
        $start->modify('+1 day');
    }
}

$att_query = "SELECT date, attendance_status FROM attendance_id WHERE user_uid = ? AND MONTH(date) = ? AND YEAR(date) = ? AND schedule_id IN ($placeholders)";
$stmt_att = $conn->prepare($att_query);
$params_att = 'iii' . str_repeat('i', count($schedule_ids));
$stmt_att->bind_param($params_att, $studentId, $month, $year, ...$schedule_ids);
$stmt_att->execute();
$att_result = $stmt_att->get_result();

if ($att_result->num_rows >0) {
    while ($att = $att_result->fetch_assoc()) {
        $date = $att['date'];
        $status = strtolower($att['attendance_status']);

        if ($status == 'absent' && !isset($calendar_map[$date])) {
            $calendar_map[$date] = [
                'status' => 'absent', // Lowercase 'a'
                'appealType' => null,
                'dateApplied' => null,
                'reason' => null,
                'updatedBy' => null
            ];
        }
    }
}


$attendance_days = [];
foreach ($calendar_map as $date => $data) {
    $attendance_days[] = [
        'status' => $data['status'],
        'date' => $date,
        'appealType' => $data['appealType'] ?? null,
        'dateApplied' => $data['dateApplied'] ?? null,
        'reason' => $data['reason'] ?? null,
        'updatedBy' => $data['updatedBy'] ?? null
    ];
}

$finalResponse = [
    "success" => true,
    "data" => [
        "subject_code" => $subjectCode,
        "attendance_days" => $attendance_days
    ]
];

echo json_encode($finalResponse);
exit;

?>