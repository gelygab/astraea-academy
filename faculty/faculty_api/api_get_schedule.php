<?php
session_start();
require_once '../../db.php';
header('Content-Type: application/json');

// 1. Verify Login
if (!isset($_SESSION['uid'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}
$user_uid = $_SESSION['uid'];

// 2. Get the internal teacher_id for the logged-in user
$stmt = $conn->prepare("SELECT teacher_id FROM teacher_id WHERE user_uid = ?");
$stmt->bind_param("s", $user_uid);
$stmt->execute();
$res = $stmt->get_result();
if ($row = $res->fetch_assoc()) {
    $teacher_id = $row['teacher_id'];
} else {
    echo json_encode(['success' => false, 'message' => 'Teacher not found']);
    exit;
}
$stmt->close();

// 3. Fetch all schedule slots for this teacher
$schedule_slots = [];
$subjects_map = [];

$sql = "SELECT * FROM schedule_id WHERE teacher_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $teacher_id);
$stmt->execute();
$res = $stmt->get_result();

while ($row = $res->fetch_assoc()) {
    // The JS grid needs exact "HH:MM" format (e.g., "18:00"). Database has "18:00:00"
    $start_time = substr($row['start_time'], 0, 5);
    $end_time = substr($row['end_time'], 0, 5);
    $section = "Yr " . $row['student_year'] . " Blk " . $row['student_block'];
    
    // Add block to the visual weekly grid
    $schedule_slots[] = [
        "subject_code" => $row['subject_code'],
        "day" => $row['day_week'],
        "start_time" => $start_time,
        "end_time" => $end_time,
        "room" => $row['room_number'],
        "section" => $section
    ];

    // Group subjects together for the "View Subject Details" card view
    if (!isset($subjects_map[$row['subject_code']])) {
        $subjects_map[$row['subject_code']] = [
            "subject_code" => $row['subject_code'],
            "description" => $row['subject_name'],
            "units" => 3, // Default fallback since DB doesn't have a units column
            "schedule_display" => $section . " - " . substr($row['day_week'], 0, 3) . " " . date("h:i A", strtotime($row['start_time'])) . "-" . date("h:i A", strtotime($row['end_time'])) . " " . $row['room_number']
        ];
    } else {
        // If the subject happens on multiple days, append it to the text!
        $subjects_map[$row['subject_code']]['schedule_display'] .= " / " . substr($row['day_week'], 0, 3) . " " . date("h:i A", strtotime($row['start_time'])) . "-" . date("h:i A", strtotime($row['end_time'])) . " " . $row['room_number'];
    }
}
$stmt->close();
$conn->close();

// Convert the map to a clean array
$subjects = array_values($subjects_map);

// 4. Send the perfect JSON payload back to the JavaScript
$response = [
    "success" => true,
    "data" => [
        "school_year" => "2025-2026",
        "semester" => "First",
        "available_years" => ["2025-2026"],
        "available_semesters" => ["First"],
        "subjects" => $subjects,
        "schedule_slots" => $schedule_slots
    ]
];

echo json_encode($response);
?>