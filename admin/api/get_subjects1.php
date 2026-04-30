

// ======================================
// |            OLD VERSION             |             
// ======================================

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

// present and absent = attendance_id
// late = attendance_id (with computation?)
// excuse = appeals (with time_type = excuse && status = approved)

$studentId = $_GET['studentId'];
if (!$studentId) {
    echo json_encode(['success' => false, 'message' => 'student_not_found']);
    exit;
}

$totalDays = 90;

// get the list of approved excuse appeals
// loop thru the subjects to see which day matches
// that becomes the new excuse count 

global $conn;
$excuse_query = "SELECT appeals.user_uid,
                    appeals.status, 
                    appeals.time_type, 
                    appeals.start_date, 
                    appeals.end_date
                FROM appeals
                WHERE appeals.status = 'approved' AND appeals.time_type IN ('extracurricular_activity', 'medical_appointment', 'personal_emergency', 'other_excuse')";
$stmt_excuse = $conn->prepare($excuse_query);
$stmt_excuse->execute();
$excuse_result = $stmt_excuse->get_result();
$excuse = [];

if ($excuse_result->num_rows > 0) {
    while ($row = $excuse_result->fetch_assoc()) {
        $excuse[] = $row;
    }
}

$subjects_query = "SELECT schedule_id.subject_code, 
                        schedule_id.subject_name, 
                        schedule_id.schedule_id,
                        student_id.user_uid,
                            SUM(CASE WHEN attendance_id.attendance_status = 'Present' THEN 1 ELSE 0 END) as present_count,
                            SUM(CASE WHEN attendance_id.attendance_status = 'Absent' AND appeals.status IS NULL OR appeals.status != 'approved' THEN 1 ELSE 0 END) as absent_count,
                            SUM(CASE WHEN attendance_id.attendance_status = 'Absent' AND appeals.status = 'approved' THEN 1 ELSE 0 END) as excuse_count
                    FROM schedule_id
                    LEFT JOIN student_id ON schedule_id.student_year = student_id.student_year AND schedule_id.student_block = student_id.student_block
                    LEFT JOIN attendance_id ON student_id.user_uid = attendance_id.user_uid AND attendance_id.schedule_id = schedule_id.schedule_id
                    LEFT JOIN appeals ON appeals.user_uid = attendance_id.user_uid
                        AND attendance_id.schedule_id = appeals.schedule_id 
                        AND attendance_id.date BETWEEN appeals.start_date AND appeals.end_date
                    WHERE student_id.user_uid = ?
                    GROUP BY schedule_id.subject_code, 
                        schedule_id.subject_name, 
                        schedule_id.student_year,
                        schedule_id.student_block,
                        student_id.user_uid,
                        schedule_id.schedule_id";
$stmt_subjects = $conn->prepare($subjects_query);
$stmt_subjects->bind_param("i", $studentId);
$stmt_subjects->execute();
$subjects_result = $stmt_subjects->get_result();
$subjects = [];

if ($subjects_result->num_rows > 0) {
    while ($row = $subjects_result->fetch_assoc()) {
        $subjects[] = [
            'studentId' => $row['user_uid'],
            'code' => $row['subject_code'],  
            'description' => $row['subject_name'],
            'present' => (int)$row['present_count'],
            'absence' => (int)$row['absent_count'],
            'excuse' => (int)$row['excuse_count']
        ];
    }
}


$finalResponse = null;

$finalResponse = [
    "success" => true,
    "data" => $subjects
];

echo json_encode($finalResponse);
exit;

?>
?>

