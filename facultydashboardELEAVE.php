<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Faculty Dashboard - File for Leave</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <link href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <link rel="stylesheet" href="facultydashboardLEAVE.css">
</head>
<body>
    <input type="file" id="pfpInput" style="display: none;" accept="image/*">
    <div class="background-container">
        <img src="images/Flogin_bg.gif" alt="Background" class="background-image">
    </div>

    <div class="container">
              <?php include 'faculty_sidebar.php'; ?>

        <div class="main-content">
  <div class="form-container">
    
    <div class="form-header">
      <h2>File for Leave</h2>
    </div>

    <div class="form-body">
      
      <div class="form-group full-width">
        <label for="time-type">Time Type</label>
        <select id="time-type" class="form-control" required>
          <option value="" disabled selected hidden> Select Leave Type</option>

          <option value="sick">Sick Leave</option>
          <option value="emergency">Emergency Leave</option>
          <option value="absence">Leave of Absence</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="start-date">Start Date</label>
          <input type="text" id="start-date" class="form-control" placeholder="Select Start Date">
        </div>
        <div class="form-group">
          <label for="end-date">End Date</label>
          <input type="text" id="end-date" class="form-control" placeholder="Select End Date">
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

<script src="facultydashboardLEAVE.js"></script>

</body>
</html>