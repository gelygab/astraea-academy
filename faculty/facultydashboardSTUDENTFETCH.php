<?php

session_start();
include '../db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_uid'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized.']);
    exit();
}

$dept_id     = isset($_POST['dept_id'])     ? intval($_POST['dept_id'])     : 0;
$year        = isset($_POST['year'])        ? intval($_POST['year'])        : 0;
$block       = isset($_POST['block'])       ? intval($_POST['block'])       : 0;
$schedule_id = isset($_POST['schedule_id']) ? intval($_POST['schedule_id']) : 0;

if (!$dept_id || !$year || !$block) {
    echo json_encode(['success' => false, 'message' => 'Missing filter parameters.']);
    exit();
}

if ($schedule_id) {
    $meta_stmt = mysqli_prepare($conn, "
        SELECT subject_code, teacher_id
        FROM schedule_id
        WHERE schedule_id = ?
    ");
    mysqli_stmt_bind_param($meta_stmt, 'i', $schedule_id);
    mysqli_stmt_execute($meta_stmt);
    $meta_row = mysqli_fetch_assoc(mysqli_stmt_get_result($meta_stmt));
    mysqli_stmt_close($meta_stmt);

    if ($meta_row) {
        $sibling_stmt = mysqli_prepare($conn, "
            SELECT schedule_id
            FROM schedule_id
            WHERE subject_code   = ?
              AND teacher_id     = ?
              AND department_id  = ?
              AND student_year   = ?
              AND student_block  = ?
        ");
        mysqli_stmt_bind_param(
            $sibling_stmt, 'siiii',
            $meta_row['subject_code'],
            $meta_row['teacher_id'],
            $dept_id,
            $year,
            $block
        );
        mysqli_stmt_execute($sibling_stmt);
        $sibling_result = mysqli_stmt_get_result($sibling_stmt);
        $sibling_ids    = [];
        while ($r = mysqli_fetch_assoc($sibling_result)) {
            $sibling_ids[] = (int) $r['schedule_id'];
        }
        mysqli_stmt_close($sibling_stmt);
    }
}

if (!empty($sibling_ids)) {
    $placeholders = implode(',', array_fill(0, count($sibling_ids), '?'));
    $types        = str_repeat('i', count($sibling_ids));

    $sql = "
        SELECT
            a.id,
            a.user_uid,
            a.time_type,
            a.date_filed,
            a.start_date,
            a.end_date,
            a.number_of_days,
            a.return_on,
            a.comment,
            a.attachment,
            a.schedule_id,
            COALESCE(a.status, 'pending') AS status,
            CASE
                WHEN a.status IN ('approved', 'rejected') AND t.first_name IS NOT NULL
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
        WHERE s.user_type     = 'Student'
          AND s.department_id = ?
          AND s.student_year  = ?
          AND s.student_block = ?
          AND a.schedule_id   IN ($placeholders)
        ORDER BY a.date_filed DESC
    ";

    $stmt = mysqli_prepare($conn, $sql);
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'DB error: ' . mysqli_error($conn)]);
        exit();
    }

    $bind_types   = 'iii' . $types;
    $bind_values  = array_merge([$dept_id, $year, $block], $sibling_ids);

    $refs = [];
    foreach ($bind_values as $k => $v) {
        $refs[$k] = &$bind_values[$k];
    }
    array_unshift($refs, $stmt, $bind_types);
    call_user_func_array('mysqli_stmt_bind_param', $refs);

} elseif ($schedule_id) {
    $sql = "
        SELECT
            a.id,
            a.user_uid,
            a.time_type,
            a.date_filed,
            a.start_date,
            a.end_date,
            a.number_of_days,
            a.return_on,
            a.comment,
            a.attachment,
            a.schedule_id,
            COALESCE(a.status, 'pending') AS status,
            CASE
                WHEN a.status IN ('approved', 'rejected') AND t.first_name IS NOT NULL
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
        WHERE s.user_type     = 'Student'
          AND s.department_id = ?
          AND s.student_year  = ?
          AND s.student_block = ?
          AND a.schedule_id   = ?
        ORDER BY a.date_filed DESC
    ";
    $stmt = mysqli_prepare($conn, $sql);
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'DB error: ' . mysqli_error($conn)]);
        exit();
    }
    mysqli_stmt_bind_param($stmt, 'iiii', $dept_id, $year, $block, $schedule_id);

} else {
    $sql = "
        SELECT
            a.id,
            a.user_uid,
            a.time_type,
            a.date_filed,
            a.start_date,
            a.end_date,
            a.number_of_days,
            a.return_on,
            a.comment,
            a.attachment,
            a.schedule_id,
            COALESCE(a.status, 'pending') AS status,
            CASE
                WHEN a.status IN ('approved', 'rejected') AND t.first_name IS NOT NULL
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
        WHERE s.user_type     = 'Student'
          AND s.department_id = ?
          AND s.student_year  = ?
          AND s.student_block = ?
        ORDER BY a.date_filed DESC
    ";
    $stmt = mysqli_prepare($conn, $sql);
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'DB error: ' . mysqli_error($conn)]);
        exit();
    }
    mysqli_stmt_bind_param($stmt, 'iii', $dept_id, $year, $block);
}

mysqli_stmt_execute($stmt);
$result  = mysqli_stmt_get_result($stmt);
$appeals = [];

while ($row = mysqli_fetch_assoc($result)) {
    $appeals[] = $row;
}
mysqli_stmt_close($stmt);

echo json_encode(['success' => true, 'appeals' => $appeals, 'count' => count($appeals)]);
mysqli_close($conn);
?>