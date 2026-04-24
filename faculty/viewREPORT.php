<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Attendance Summary Report</title>
    
    <link rel="stylesheet" href="viewREPORT.css">
    
    <style>
        <style>
        /* 1. Force the page to allow scrolling */
        html, body.report-body {
            height: auto !important;
            min-height: 100vh !important;
            overflow-y: auto !important;
        }

        /* 2. Force the white paper to stretch downwards with the content */
        .report-paper.document {
            height: auto !important;
            min-height: 100% !important;
            overflow: visible !important;
            padding-bottom: 60px !important; /* Gives room at the bottom */
            margin-bottom: 80px !important; /* Pushes the Download button down */
        }

        /* 3. Center and perfectly align the calendars */
        .calendar-section {
            height: auto !important;
            padding-bottom: 40px !important;
        }
        
        .calendar-months {
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: center !important; /* Centers the columns perfectly */
            gap: 40px !important; /* Nice wide gap between calendars */
            width: 100%;
        }
        
        .month-box {
            flex: 0 0 42% !important; /* Snug fit for 2 columns */
            box-sizing: border-box;
            margin-bottom: 20px;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important; /* Centers the calendar grid inside the box */
        }
    </style>
       
</head>

<body class="report-body">

    <div class="report-paper document">
        <div class="stars-container" id="starField"></div>

        <div class="report-header">
            <div class="shining-stars">
                <span class="big-star s1">★</span>
                <span class="big-star s2">★</span>
                <span class="big-star s3">★</span>
            </div>
            <img src="../images/attendance_summary_text.png" class="title-img" alt="Attendance Summary Report">
            <div class="header-logos">
                <img src="../images/AA_Logo.png" class="school-logo">
                <img src="../images/AA_School_2.png" class="school-building">
            </div>
        </div>

        <div class="student-details-section">
            <div class="user-icon">
                <img src="../images/user_icon.png" id="studentImg">
            </div>
            <div class="details">
                <h3 id="displayName">Loading Name...</h3>
                <p id="displayProgram">Loading Program...</p>
                <div class="info-grid">
                    <span>UID: <b id="displayUID">--</b></span>
                    <span>Contact: <b id="displayContact">--</b></span>
                    <span>Email: <b id="displayEmail">--</b></span>
                    <span>Address: <b id="displayAddress">--</b></span>
                </div>
            </div>
        </div>

        <div class="date-range-section">
            <div class="range-flex-container">
                <img src="../images/date_range_label.png" class="label-img" alt="Date Range">
                <span class="range-text" id="displayRange">Loading Dates...</span>
            </div>
        </div>

        <div class="stats-container">
            <div class="stat-card">
                <img src="../images/present_symbol.png" class="stat-icon">
                <span class="stat-val" id="statPresent">0 Days</span>
                <span class="stat-label">Total Days Present</span>
            </div>
            <div class="stat-card">
                <img src="../images/absent_symbol.png" class="stat-icon">
                <span class="stat-val" id="statAbsent">0 Days</span>
                <span class="stat-label">Total Days Absent</span>
            </div>
            <div class="stat-card">
                <img src="../images/late_symbol.png" class="stat-icon">
                <span class="stat-val" id="statLate">0 Days</span>
                <span class="stat-label">Total Days Late</span>
            </div>
            <div class="stat-card">
                <img src="../images/excused_symbol.png" class="stat-icon">
                <span class="stat-val" id="statExcused">0 Days</span>
                <span class="stat-label">Total Days Excused</span>
            </div>
        </div>

        <div class="calendar-section">
            <div class="calendar-months" id="calendarContainer">
</div>

            <div class="calendar-legend">
                <div class="leg-item"><div class="dot out-range"></div> Out of Range</div>
                <div class="leg-item"><div class="dot present"></div> Present</div>
                <div class="leg-item"><div class="dot late"></div> Late</div>
                <div class="leg-item"><div class="dot absent"></div> Absent</div>
                <div class="leg-item"><div class="dot excused"></div> Excused</div>
            </div>
        </div> 
    </div> <div class="footer-btn-container">
        <button class="download-btn" onclick="window.print()">
            Download PDF
        </button>
    </div>

    <script src="facultydashboardREPORTS.js"></script>
</body>
</html>