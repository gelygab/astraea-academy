<?php 
    $db_server = 'localhost';
    $db_user = 'root';
    $db_pass = '';
    $db_name = 'attendance_system';

    try {
        $conn = mysqli_connect($db_server, 
                            $db_user, 
                            $db_pass, 
                            $db_name);
        if (!$conn) {
            throw new mysqli_sql_exception("Connection failed");
        }
    }
    catch (mysqli_sql_exception $e) {
        $conn = null;
    }
?>