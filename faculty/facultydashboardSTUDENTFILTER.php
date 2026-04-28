<?php

session_start();
include '../db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_uid'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized.']);
    exit();
}

$subject_code = isset($_POST['subject_code']) ? trim($_POST['subject_code']) : '';
$teacher_uid  = $_SESSION['user_uid'];

if (!$subject_code) {
    echo json_encode(['success' => false, 'message' => 'Missing subject_code.']);
    exit();
}

$t_stmt = mysqli_prepare($conn, "SELECT teacher_id FROM teacher_id WHERE user_uid = ?");
mysqli_stmt_bind_param($t_stmt, 's', $teacher_uid);
mysqli_stmt_execute($t_stmt);
$t_row = mysqli_fetch_assoc(mysqli_stmt_get_result($t_stmt));
mysqli_stmt_close($t_stmt);

if (!$t_row) {
    echo json_encode(['success' => false, 'message' => 'Teacher not found.']);
    exit();
}

$teacher_id = $t_row['teacher_id'];

$sql = "
    SELECT MIN(s.schedule_id) AS schedule_id,
           s.student_year,
           s.student_block,
           s.department_id,
           d.department_name,
           d.department_code
    FROM schedule_id s
    INNER JOIN department_id d ON s.department_id = d.department_id
    WHERE s.teacher_id   = ?
      AND s.subject_code = ?
    GROUP BY s.department_id, s.student_year, s.student_block
    ORDER BY d.department_name ASC, s.student_year ASC, s.student_block ASC
";

$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'DB error: ' . mysqli_error($conn)]);
    exit();
}

mysqli_stmt_bind_param($stmt, 'is', $teacher_id, $subject_code);
mysqli_stmt_execute($stmt);
$result    = mysqli_stmt_get_result($stmt);
$schedules = [];

while ($row = mysqli_fetch_assoc($result)) {
    $schedules[] = $row;
}
mysqli_stmt_close($stmt);

$depts = [];
foreach ($schedules as $sc) {
    if (!isset($depts[$sc['department_id']])) {
        $depts[$sc['department_id']] = [
            'department_id'   => $sc['department_id'],
            'department_name' => $sc['department_name'],
            'department_code' => $sc['department_code'],
        ];
    }
}

echo json_encode([
    'success'   => true,
    'schedules' => $schedules,
    'depts'     => array_values($depts),
]);

mysqli_close($conn);
?>