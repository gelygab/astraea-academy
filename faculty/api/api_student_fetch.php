<?php
session_start();
header('Content-Type: application/json');
include '../../db.php';

if (!isset($_POST['schedule_id']) || !isset($_POST['dept_id']) || !isset($_POST['year']) || !isset($_POST['block'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required parameters.']);
    exit();
}

$schedule_id = (int)$_POST['schedule_id'];
$dept_id     = (int)$_POST['dept_id'];
$year        = (int)$_POST['year'];
$block       = (int)$_POST['block'];

$meta = $conn->prepare("SELECT subject_code, teacher_id FROM schedule_id WHERE schedule_id = ?");
$meta->bind_param('i', $schedule_id);
$meta->execute();
$meta_row = $meta->get_result()->fetch_assoc();
$meta->close();

if (!$meta_row) {
    echo json_encode(['success' => false, 'message' => 'Schedule not found.']);
    exit();
}

$subject_code = $meta_row['subject_code'];
$teacher_id   = $meta_row['teacher_id'];

$sibling_stmt = $conn->prepare(
    "SELECT schedule_id FROM schedule_id 
     WHERE subject_code = ? AND teacher_id = ? 
     AND department_id = ? AND student_year = ? AND student_block = ?"
);
$sibling_stmt->bind_param('siiii', $subject_code, $teacher_id, $dept_id, $year, $block);
$sibling_stmt->execute();
$sibling_result = $sibling_stmt->get_result();

$sibling_ids = [];
while ($row = $sibling_result->fetch_assoc()) {
    $sibling_ids[] = (int)$row['schedule_id'];
}
$sibling_stmt->close();

if (empty($sibling_ids)) {
    echo json_encode(['success' => true, 'excuse' => [], 'leave' => []]);
    exit();
}

$placeholders = implode(',', array_fill(0, count($sibling_ids), '?'));
$types        = str_repeat('i', count($sibling_ids));


$sql = "
    SELECT 
        a.*,
        COALESCE(a.status, 'pending') AS status,
        CASE 
            WHEN a.status IN ('approved','rejected') AND t.first_name IS NOT NULL
            THEN CONCAT(t.first_name, ' ', t.last_name)
            ELSE NULL 
        END AS status_updated_by,
        s.first_name, 
        s.last_name, 
        s.student_year, 
        s.student_block, 
        s.department_id
    FROM appeals a
    INNER JOIN student_id s 
        ON CONVERT(CAST(a.user_uid AS CHAR) USING utf8mb4) COLLATE utf8mb4_unicode_ci = s.user_uid
    LEFT JOIN teacher_id t 
        ON CONVERT(CAST(a.status_updated_by AS CHAR) USING utf8mb4) COLLATE utf8mb4_unicode_ci = t.user_uid
    WHERE s.user_type = 'Student'
      AND s.department_id = ?
      AND s.student_year  = ?
      AND s.student_block = ?
      AND a.schedule_id IN ($placeholders)
    ORDER BY a.date_filed DESC
";

$bind_types   = 'iii' . $types;
$bind_params  = array_merge([$dept_id, $year, $block], $sibling_ids);

$stmt = $conn->prepare($sql);
$stmt->bind_param($bind_types, ...$bind_params);
$stmt->execute();
$result = $stmt->get_result();

$excuse = [];
$leave  = [];

while ($row = $result->fetch_assoc()) {
    $type = strtolower($row['time_type'] ?? '');
    if (strpos($type, 'leave') !== false) {
        $leave[] = $row;
    } else {
        $excuse[] = $row;
    }
}
$stmt->close();

echo json_encode([
    'success' => true,
    'excuse'  => $excuse,
    'leave'   => $leave
]);
?>