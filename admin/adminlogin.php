<?php 
require_once '../db.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Astraea Academy - Admin Login</title>
    <link rel="stylesheet" href="adminlogin.css">
</head>
<body>
    <!-- Background -->
    <div class="background-container">
        <img src="../images/Alogin_bg.gif" alt="Background" class="background-image">
    </div>

    <!-- Pink Top Bar -->
    <div class="pink-bar"></div>

    <!-- Floating Logo -->
    <div class="floating-logo-container">
        <img src="../images/AA_Font.png" alt="Astraea Academy" class="floating-logo">
        <div class="floating-sparkles">
            <div class="f-spark f-spark-1">✦</div>
            <div class="f-spark f-spark-2">✧</div>
            <div class="f-spark f-spark-3">✦</div>
            <div class="f-spark f-spark-4">✧</div>
        </div>
    </div>

    <!-- Back Button -->
    <button class="back-btn" onclick="goBack()">
        <span class="back-arrow">←</span> Back
    </button>

    <!-- Main Login Container -->
    <div class="login-container">
        <!-- Login Card - Centered -->
        <div class="login-card" id="login-card">
            <div class="card-header">
                <div class="logo-circle">
                    <img src="../images/AA_Logo.png" alt="Astraea Academy Logo" class="card-logo">
                </div>
            </div>
            <div class="card-body">
                <h2 class="greeting">Admin Login</h2>
                <p class="instruction">Authorized Personnel Only</p>
                
                <form id="loginForm" class="login-form" action = "adminlogin_process.php" method="post">
                    <div class="form-group">
                        <label for="uid">Admin UID</label>
                        <input type="text" id="uid" name="uid" placeholder="Enter your Admin UID" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Password</label>
                        <div class="password-wrapper">
                            <input type="password" id="password" name="password" placeholder="Enter your password" required>
                            <button type="button" class="toggle-password" onclick="togglePassword()">
                                <span id="eye-icon">👁</span>
                            </button>
                        </div>
                    </div>
                    
    
                    
                    <button type="submit" class="login-btn">Log In</button>
                </form>
                
                </div>
            </div>
        </div>
    </div>

    <!-- Custom Cursor -->
    <div class="custom-cursor" id="cursor"></div>

    <script src="adminlogin.js"></script>
</body>
</html>
