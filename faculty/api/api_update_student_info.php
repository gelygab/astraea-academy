<?php
session_start();
require_once '../db.php;
header('Content-Type: application/json');

// 1. Make sure the teacher is logged in
if (!isset($_SESSION['uid'])) {
    echo json_encode(['success' => false, 'error' => 'Not logged in']);
    exit;
}

// 2. Grab the data sent from JavaScript
$uid = $_POST['uid'] ?? '';
$contact = $_POST['contact'] ?? '';
$email = $_POST['email'] ?? '';
$address = $_POST['address'] ?? '';

if (empty($uid)) {
    echo json_encode(['success' => false, 'error' => 'No student ID provided']);
    exit;
}

// ... your existing code at the top ...

    if (empty($uid)) {
        echo json_encode(['success' => false, 'error' => 'No student ID provided']);
        exit;
    }

    // --- STEP 3A: Get the student's EXISTING data first ---
    $sql_get = "SELECT student_contact, student_email, student_address FROM student_id WHERE user_uid = ?";
    $stmt_get = $conn->prepare($sql_get);
    $stmt_get->bind_param("s", $uid);
    $stmt_get->execute();
    $result = $stmt_get->get_result();
    $current_data = $result->fetch_assoc();
    $stmt_get->close();

    // --- STEP 3B: If the form box was left blank, keep the old data! ---
    // (We use === '' to check if the input was literally left empty)
    if ($contact === '') { 
        $contact = $current_data['student_contact']; 
    }
    if ($email === '') { 
        $email = $current_data['student_email']; 
    }
    if ($address === '') { 
        $address = $current_data['student_address']; 
    }

    // --- STEP 4: Now do the UPDATE with the safe data ---
    $sql = "UPDATE student_id SET student_contact = ?, student_email = ?, student_address = ? WHERE user_uid = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $conn->error]);
        exit;
    }

    $stmt->bind_param("ssss", $contact, $email, $address, $uid);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to update database.']);
    }

    $stmt->close();
    $conn->close();
?>