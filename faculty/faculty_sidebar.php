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
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span class="nav-text">Home</span>
        </a>

        <a href="facultydashboardCLASSLIST.php" class="<?= ($current_page == 'facultydashboardCLASSLIST.php') ? 'active' : '' ?>">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span class="nav-text">View Classlist</span>
        </a>

        <a href="facultydashboardSCHED.php" class="<?= ($current_page == 'facultydashboardSCHED.php') ? 'active' : '' ?>">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span class="nav-text">Manage Schedule</span>
        </a>

        <a href="facultydashboardLEAVE.php" class="<?= ($current_page == 'facultydashboardLEAVE.php') ? 'active' : '' ?>">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <polyline points="16 11 18 13 22 9"></polyline>
            </svg>
            <span class="nav-text">Leave Requests</span>
        </a>

        <a href="facultydashboardEXCUSE.php" class="<?= ($current_page == 'facultydashboardEXCUSE.php') ? 'active' : '' ?>">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            <span class="nav-text">Request an Excuse</span>
        </a>
        
        <div class="nav-group <?= $is_appeal_section ? 'open' : '' ?>">
            <a href="javascript:void(0)" class="nav-link <?= $is_appeal_section ? 'active' : '' ?>" onclick="toggleNavGroup(this)" style="cursor: pointer;">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span class="nav-text">View Appeal History</span>
                <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </a>
            
            <div class="submenu">
                <a href="facultydashboardSTUDENT.php" class="<?= ($current_page == 'facultydashboardSTUDENT.php') ? 'active' : '' ?>">
                    <svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span class="nav-text">Student Records</span>
                </a>
                <a href="facultydashboardRECORDS.php" class="<?= ($current_page == 'facultydashboardRECORDS.php') ? 'active' : '' ?>">
                    <svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span class="nav-text">My Records</span>
                </a>
            </div>
        </div>

    </div> <div class="sidebar-footer">
        <a href="facultylogout.php" class="logout">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span class="nav-text">Log Out</span>
        </a>
    </div>
</aside>

<script>
    function toggleNavGroup(button) {
    const navGroup = button.parentElement;
    navGroup.classList.toggle('open');
}
</script>