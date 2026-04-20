<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Attendance Summary Report</title>
    <link rel="stylesheet" href="viewREPORT.css">
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
            <img src="images/attendance_summary_text.png" class="title-img" alt="Attendance Summary Report">
            <div class="header-logos">
                <img src="images/AA_Logo.png" class="school-logo">
                <img src="images/AA_School_2.png" class="school-building">
            </div>
        </div>

        <div class="student-details-section">
            <div class="user-icon">
                <img src="images/user_icon.png" id="studentImg">
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
                <img src="images/date_range_label.png" class="label-img" alt="Date Range">
                <span class="range-text" id="displayRange">Loading Dates...</span>
            </div>
        </div>

        <div class="stats-container">
            <div class="stat-card">
                <img src="images/present_symbol.png" class="stat-icon">
                <span class="stat-val" id="statPresent">0 Days</span>
                <span class="stat-label">Total Days Present</span>
            </div>
            <div class="stat-card">
                <img src="images/absent_symbol.png" class="stat-icon">
                <span class="stat-val" id="statAbsent">0 Days</span>
                <span class="stat-label">Total Days Absent</span>
            </div>
            <div class="stat-card">
                <img src="images/late_symbol.png" class="stat-icon">
                <span class="stat-val" id="statLate">0 Days</span>
                <span class="stat-label">Total Days Late</span>
            </div>
            <div class="stat-card">
                <img src="images/excused_symbol.png" class="stat-icon">
                <span class="stat-val" id="statExcused">0 Days</span>
                <span class="stat-label">Total Days Excused</span>
            </div>
        </div>

        <div class="calendar-section">
            <div class="calendar-months">
                <div class="month-box">
                    <h5 id="leftMonthName">Month</h5>
                    <div class="calendar-header-days">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                    <div id="month1Grid" class="cal-grid"></div>
                </div>
                <div class="month-box">
                    <h5 id="rightMonthName">Month</h5>
                    <div class="calendar-header-days">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                    <div id="month2Grid" class="cal-grid"></div>
                </div>
            </div>

            <div class="calendar-legend">
                <div class="leg-item"><div class="dot out-range"></div> Out of Range</div>
                <div class="leg-item"><div class="dot present"></div> Present</div>
                <div class="leg-item"><div class="dot late"></div> Late</div>
                <div class="leg-item"><div class="dot holiday"></div> Holiday</div>
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