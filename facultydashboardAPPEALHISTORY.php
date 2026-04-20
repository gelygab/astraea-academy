<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Faculty Dashboard - Student Records</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <link href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="facultydashboardAPPEALHISTORY.css">
</head>
<body>
    <input type="file" id="pfpInput" style="display: none;" accept="image/*">
    <div class="background-container">
        <img src="images/Flogin_bg.gif" alt="Background" class="background-image">
    </div>

    <div class="container">
      <?php include 'faculty_sidebar.php'; ?>

       <main class="appeal-history-main">
        <div class="page-banner">
            <h1>View Appeal History</h1>
        </div>

        <div class="cards-container">
            
            <div class="selection-card">
                <img src="images/student records.png" alt="Student Records Icon" class="card-icon" width="120">
                <h2>Student Records</h2>
                <p>View and manage excuse/leave requests submitted by your students.</p>
                
                <div class="card-expanded-content">
                    <div class="card-input-group">
                        <label for="student-type">Type</label>
                        <select id="recordTypeSelect">
                            <option value="" disabled selected>Select type</option>
                            <option value="excuse">Excuse Requests</option>
                            <option value="leave">Leave Requests</option>
                        </select>
 
                    </div>
                    <button id="proceedStudentBtn" class="proceed-btn">Proceed</button>
                </div>
            </div>

           <div class="selection-card">
            <img src="images/my records.png" alt="My Records Icon" class="card-icon" width="120">
            <h2>My Records</h2>
            <p>Track the status of your own leave and excuse applications filed with the administration.</p>
            
            <div class="card-expanded-content">
                <button id="proceedMyBtn" class="proceed-btn">View My Records</button>
            </div>
        </div>

    </div>
</main>

<script src="facultydashboardAPPEALHISTORY.js"></script>
</body>
</html>