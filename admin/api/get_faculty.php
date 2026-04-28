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

$teacher_query = "SELECT teacher_id.user_uid,
                    teacher_id.first_name,
                    teacher_id.last_name,
                    teacher_id.department_id,
                    department_id.department_name,
                    college_id.college_name,
                        (SELECT GROUP_CONCAT(CONCAT(time_type , '(', reason_count, ')') SEPARATOR ', ') 
                            FROM (
                                SELECT user_uid, time_type, COUNT(*) as reason_count 
                                FROM appeals 
                                WHERE status = 'rejected' 
                                GROUP BY user_uid, time_type) AS sub_appeals 
                            WHERE sub_appeals.user_uid = teacher_id.user_uid) AS absent_reasons_with_count,
                        COUNT(DISTINCT CASE WHEN attendance_id.attendance_status = 'Absent' THEN attendance_id.attendance_id ELSE NULL END) AS absence_count,
                        COUNT(DISTINCT CASE WHEN appeals.time_type IN ('sick_leave', 'emergency_leave', 'leave_of_absence', 'other_leave') AND appeals.status = 'approved' THEN appeals.id ELSE NULL END) AS leave_count,
                        COUNT(DISTINCT CASE WHEN appeals.time_type IN ('extracurricular_activity', 'medical_appointment', 'personal_emergency', 'other_excuse') AND appeals.status = 'approved' THEN appeals.id ELSE NULL END) AS excuse_count
                    FROM teacher_id
                    LEFT JOIN department_id ON teacher_id.department_id = department_id.department_id
                    LEFT JOIN college_id ON department_id.college_id = college_id.college_id
                    LEFT JOIN schedule_id ON teacher_id.teacher_id = schedule_id.teacher_id 
                    LEFT JOIN attendance_id ON teacher_id.user_uid = attendance_id.user_uid AND attendance_id.schedule_id = schedule_id.schedule_id
                    LEFT JOIN appeals ON teacher_id.user_uid = appeals.user_uid AND appeals.status = 'approved'
                    GROUP BY department_id.department_name, college_id.college_name";
$stmt_teacher = $conn->prepare($teacher_query);
$stmt_teacher->execute();
$teacher_result = $stmt_teacher->get_result();
$teachersCount = [];

if ($teacher_result->num_rows > 0) {
    while ($row = $teacher_result->fetch_assoc()) {
        $absentReasons = [];
        $absences = (int)$row['absence_count'];

        if($row['absent_reasons_with_count']) {
            $parts = explode(', ', $row['absent_reasons_with_count']);
            foreach ($parts as $part) {
                if (preg_match('/(.*)\((\d+)\)/', trim($part), $matches)) {
                    $absentReasons[] = [
                        'type' => $matches[1],
                        'count' => (int)$matches[2]
                    ];
                }
            }
        }

        $totalReasonsCount = array_sum(array_column($absentReasons, 'count'));
    
        if ($absences > $totalReasonsCount) {
            $absentReasons[] = [
                'type' => 'Unexplained / No Appeal',
                'count' => $absences - $totalReasonsCount
            ];
        }
        
        $teachersCount[] = [
            'uid' => $row['user_uid'],
            'name' => $row['last_name'] . ', ' . $row['first_name'],
            'collegeName' => $row['college_name'],
            'departmentName' => $row['department_name'],
            'absence' => $row['absence_count'],
            'leave' => $row['leave_count'],
            'excuse' => $row['excuse_count'],
            'absentReasons' => $absentReasons
        ];
    }
}

// var_dump($teachersCount);


// absent reasons include time_type: count
$finalResponse = null;

$finalResponse = [
    "success" => true,
    "faculty" => $teachersCount
];

echo json_encode($finalResponse);
exit;
?>