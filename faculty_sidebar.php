<?php 
    $current_page = basename($_SERVER['PHP_SELF']); 
?>
<aside>
    <div class="top">
        <div class="logo">
            <img src="images/AA_Logo.png" alt="Logo">
            <h1>Astraea Academy</h1>
        </div>
    </div>

    <div class="sidebar">
        <h3>MAIN MENU</h3>
        
        <a href="facultydashboardHOME.php" class="<?= ($current_page == 'facultydashboardHOME.php') ? 'active' : '' ?>">
            <span class="material-symbols-outlined">star</span><h2>Home</h2>
        </a>

        <a href="facultydashboardCLASSLIST.php" class="<?= ($current_page == 'facultydashboardCLASSLIST.php') ? 'active' : '' ?>">
            <span class="material-symbols-outlined">star</span><h2>View Class List</h2>
        </a>

        <a href="facultydashboardSCHED.php" class="<?= ($current_page == 'facultydashboardSCHED.php') ? 'active' : '' ?>">
            <span class="material-symbols-outlined">star</span><h2>Manage Schedule</h2>
        </a>

        <a href="facultydashboardLEAVE.php" class="<?= ($current_page == 'facultydashboardELEAVE.php') ? 'active' : '' ?>">
            <span class="material-symbols-outlined">star</span><h2>File for Leave</h2>
        </a>

        <a href="facultydashboardEXCUSE.php" class="<?= ($current_page == 'facultydashboardEXCUSE.php') ? 'active' : '' ?>">
            <span class="material-symbols-outlined">star</span><h2>Request an Excuse</h2>
        </a>
        
   <div class="nav-dropdown">
    <?php 
        $is_appeal_section = ($current_page == 'facultydashboardSTUDENT.php' || 
                              $current_page == 'facultydashboardRECORDS.php' || 
                              $current_page == 'facultydashboardAPPEALHISTORY.php');
    ?>

    <a href="#" onclick="toggleSubmenu(event)" class="<?= $is_appeal_section ? 'active' : '' ?>" style="cursor: pointer;">
        <span class="material-symbols-outlined">star</span><h2>View Appeal History</h2>
    </a>
    
    <div id="appealSubmenu" class="submenu" style="display: none; flex-direction: column;">
        <a href="facultydashboardSTUDENT.php">
            <span class="material-symbols-outlined">star_border</span><h2>Student Records</h2>
        </a>
        <a href="facultydashboardRECORDS.php">
            <span class="material-symbols-outlined">star_border</span><h2>My Records</h2>
        </a>
    </div>
</div>
        <a href="facultydashboardREPORTS.php" class="<?= ($current_page == 'facultydashboardREPORTS.php') ? 'active' : '' ?>">
            <span class="material-symbols-outlined">star</span><h2>Generate Reports</h2>
        </a>
        
        <div class="below">
            <h3>SETTINGS</h3>
            <a href="facultylogout.php"><span class="material-symbols-outlined">star</span><h2>Log Out</h2></a>
        </div>
    </div>
</aside>

<script>
    function toggleSubmenu(event) {
        event.preventDefault(); 
        
        var menu = document.getElementById('appealSubmenu');
        
        // Toggles the dropdown up and down
        if (menu.style.display === 'none' || menu.style.display === '') {
            menu.style.setProperty('display', 'flex', 'important');
        } else {
            menu.style.setProperty('display', 'none', 'important');
        }
    }
</script>