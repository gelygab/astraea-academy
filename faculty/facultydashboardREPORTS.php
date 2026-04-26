<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Faculty Dashboard - Generate Reports</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <link rel="stylesheet" href="facultydashboardREPORTS.css">
</head>
<body>
    <div class="background-container">
        <img src="images/Flogin_bg.gif" alt="Background" class="background-image">
    </div>
 
    <div class="container">
        <?php include 'faculty_sidebar.php'; ?>

        <main class="class-list-dashboard">
            <div class="card filter-card">
                <h2>Generate Report</h2>
                <div class="filter-controls">
                    <div class="filter-row-1">
                        <div class="input-group">
                            <label>Academic Year</label>
                            <select required>
                                <option value="" disabled selected hidden>Select year</option>
                                <option value="sy_2025-2026">SY 2025-2026</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Semester</label>
                            <select required>
                                <option value="" disabled selected hidden>Select semester</option>
                                <option value="first_Semester">First Semester</option>
                                <option value="second_Semester">Second Semester</option>
                            </select>
                        </div>
                    </div>
                    <div class="input-group full-width">
                        <label>Subject</label>
                        <select required>
                            <option value="" disabled selected hidden>Select a subject</option>
                            <option value="software_design">Software Design</option>
                            <option value="engineering_management">Engineering Management</option>
                        </select>
                    </div>
                    <div class="filter-row-2">
                        <div class="input-group">
                            <label>Program</label>
                            <select required>
                                <option value="" disabled selected hidden>Select program</option>
                                <option value="bscpe">BSCPE</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Block</label>
                            <select required>
                                <option value="" disabled selected hidden>Select block</option>
                                <option value="block_1">Block 1</option>
                                <option value="block_2">Block 2</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card date-picker-card">
                <div class="report-header">Date Range Picker</div>
                
                <div class="selection-preview">
                    <div class="date-input">
                        <label>From</label>
                        <input type="text" id="display-from" placeholder="MM/DD/YYYY" readonly>
                    </div>
                    <div class="date-input">
                        <label>To</label>
                        <input type="text" id="display-to" placeholder="MM/DD/YYYY" readonly>
                    </div>
                </div>

                <div class="dual-calendar-container">
                    <div class="cal-wrapper">
                        <div class="cal-nav">
                            <button type="button" class="nav-arrow" onclick="changeMonth(-1)">&lt;</button>
                            <div class="dropdowns">
                                <select id="select-month-left" onchange="jumpDate()"></select>
                                <select id="select-year-left" onchange="jumpDate()"></select>
                            </div>
                            <span></span>
                        </div>
                        <div class="weekdays">
                            <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
                        </div>
                        <div id="days-left" class="days-grid"></div>
                    </div>

                    <div class="v-line"></div>

                    <div class="cal-wrapper">
                        <div class="cal-nav">
                            <span></span>
                            <div class="dropdowns">
                                <select id="select-month-right" onchange="jumpDate()"></select>
                                <select id="select-year-right" onchange="jumpDate()"></select>
                            </div>
                            <button type="button" class="nav-arrow" onclick="changeMonth(1)">&gt;</button>
                        </div>
                        <div class="weekdays">
                            <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
                        </div>
                        <div id="days-right" class="days-grid"></div>
                    </div>
                </div>

                <div class="card-footer">
                    <button class="btn" onclick="generateReport()">Generate</button>
                </div>
            </div>
        </main>
    </div>

    <script src="facultydashboardREPORTS.js"></script>
</body>
</html>