<?php
session_start();
require_once '../db.php';
if (!isset($_SESSION['uid'])) {
    header('Location: facultylogin.php');
    exit;
}
$user_uid = $_SESSION['uid'];
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Faculty Dashboard - Request an Excuse</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <link href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="facultydashboardEXCUSE.css">
</head>
<body>
    <input type="file" id="pfpInput" style="display: none;" accept="image/*">
    <div class="background-container">
        <img src="../images/Flogin_bg.gif" alt="Background" class="background-image">
    </div>

    <div class="container">
      <?php include 'faculty_sidebar.php'; ?>

        <div class="main-content">
  <div class="form-container">
    
    <div class="form-header">
      <h2>Request an Excuse</h2>
    </div>

    <div class="form-body">
      
      <div class="form-group full-width">
        <label for="time-type">Time Type</label>
        <select id="time-type" class="form-control" required>
          <option value="" disabled selected hidden> Select Excuse Type</option>

          <option value="sick">Medical Appointment</option>
          <option value="emergency">Personal Emergency</option>
          <option value="absence">Extracurricular Activity</option>
          <option value="other">Other</option>
        </select>
      </div>

       <div class="form-row">
        <div class="form-group">
          <label for="start-date">Start Date</label>
          <div class="date-input-wrapper">
              <input type="text" id="start-date" class="form-control readonly" placeholder="Select Date" readonly onclick="openCalendar('start-date')">
              <span class="material-symbols-outlined calendar-icon" onclick="openCalendar('start-date')">calendar_today</span>
          </div>
        </div>
        <div class="form-group">
          <label for="end-date">End Date</label>
          <div class="date-input-wrapper">
              <input type="text" id="end-date" class="form-control readonly" placeholder="Select Date" readonly onclick="openCalendar('end-date')">
              <span class="material-symbols-outlined calendar-icon" onclick="openCalendar('end-date')">calendar_today</span>
          </div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="num-days">Number of Days</label>
          <input type="text" id="num-days" class="form-control readonly" readonly placeholder="0 days">
        </div>
        <div class="form-group">
          <label for="return-on">Return on</label>
          <input type="text" id="return-on" class="form-control readonly" readonly placeholder="Select dates">
        </div>
      </div>

      <div class="form-group full-width">
        <label for="comment">Comment</label>
        <textarea id="comment" class="form-control" rows="4" placeholder="Write a Comment..." style="font-size: 14px;" ></textarea>
      </div>

      <div class="form-group full-width">
        <label>Attachment</label>
        <div class="upload-container" id="upload-btn">
          <span class="upload-text">Upload</span>
          <input type="file" id="file-input" style="display: none;">
        </div>
      </div>

    </div>

    <div class="form-footer">
  <button type="button" class="btn-cancel" id="cancel-btn">Cancel</button>
  <button type="button" class="btn-submit" id="submit-btn">Submit</button>
</div>

  </div>
</div>

<script src="facultydashboardEXCUSE.js"></script>

<div id="calendarModal" class="modal">
    <div class="modal-content">
        <div class="calendar-header">
            <span class="material-symbols-outlined" onclick="changeMonth(-1)">chevron_left</span>
            <h3 id="calendarMonthYear"></h3>
            <span class="material-symbols-outlined" onclick="changeMonth(1)">chevron_right</span>
        </div>
        <div class="calendar-weekdays">
            <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
        </div>
        <div id="calendarDays" class="calendar-days"></div>
    </div>
</div>

</body>
</html>