<?php
session_start();
require_once '../db.php';

if (!isset($_SESSION['uid'])) {
    header('Location: facultylogin.php');
}

$user_uid = $_SESSION['uid'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <script>
        const CURRENT_USER_UID = "<?php echo $user_uid; ?>";
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Astraea Academy - View Class List</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <link rel="stylesheet" href="facultydashboardCLASSLIST.css">
</head>
<body>
    <div class="background-container">
        <img src="../images/Flogin_bg.gif" alt="Background" class="background-image">
    </div>

    <div class="container">
        <?php include 'faculty_sidebar.php'; ?>

        <main class="class-list-dashboard">
            
            <div class="card filter-card">
                <h2>View Class List</h2>
                <div class="filter-controls">
                    <div class="input-group full-width">
                        <label>Subject</label>
                        <select id="subjectDropdown" required> 
                            <option value="" disabled selected hidden>Select a subject</option>
                            </select>
                    </div>
                    
                    <div class="filter-row">
                        <div class="input-group">
                            <label>Program</label>
                            <select id="programDropdown" required>
                                <option value="" disabled selected hidden>Select a program</option>
                                </select>
                        </div>
                        <div class="input-group">
                            <label>Block</label>
                            <select id="blockDropdown" required>
                                <option value="" disabled selected hidden>Select a block</option>
                                </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card" style="margin-bottom: 20px; padding: 15px; background-color: #5a102b; border-radius: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <p style="font-size: 14px; margin: 0 0 5px 0; text-align: left; font-weight: bold; color: white;">Displaying:</p>
                <h3 id="displayText" style="margin: 0; color: white; font-size: 24px; text-align: center;">Awaiting Selection...</h3>
            </div>

            <div class="card table-card">
                <div class="table-header-actions">
                    <div class="search-box">
                        <input type="text" id="searchInput" placeholder="Search Name...">
                    </div>

                    <div class="sort-container">
                        <button class="btn-sort">Sort ≡↓</button>
                        <div class="sort-dropdown">
                            <ul>
                                <li><a href="#">Student Name (A-Z)</a></li>
                                <li><a href="#">Student Name (Z-A)</a></li>
                                <li><a href="#">Attendance: Highest to Lowest</a></li>
                                <li><a href="#">Attendance: Lowest to Highest</a></li>
                                <li><a href="#">Student ID: Ascending</a></li>
                                <li><a href="#">Student ID: Descending</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="table-wrapper">
                    <table class="astraea-table" id="studentTable">
                        <thead>
                            <tr>
                                <th>UID</th>
                                <th>Last Name, First Name</th>
                                <th>Total Attendance</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="4" style="text-align:center; padding: 20px; font-style: italic; color: #555;">
                                    Please select a subject from the dropdown above to view the class list.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div> 
        </main>
    </div> 
    <script src="facultydashboardCLASSLIST.js"></script>
                
                <button type="submit" class="btn-save">Save Changes</button>
            </form>
        </div>
    </div>
</body>
</html>