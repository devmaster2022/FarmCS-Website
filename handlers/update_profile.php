<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: ../login.html");
    exit();
}

// Database connection
require_once '../config/database.php';

// Validate input
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullName = $_POST['fullName'] ?? '';
    $state = $_POST['state'] ?? '';
    $district = $_POST['district'] ?? '';
    $phone = $_POST['phone'] ?? '';

    // Basic validation
    $errors = [];
    if (empty($fullName)) $errors[] = "Full Name is required";
    if (empty($state)) $errors[] = "State is required";
    if (empty($district)) $errors[] = "District is required";
    if (empty($phone) || !preg_match("/^[0-9]{10}$/", $phone)) $errors[] = "Invalid Phone Number";

    if (empty($errors)) {
        try {
            // Prepare SQL to update user profile
            $stmt = $conn->prepare("UPDATE users SET full_name = ?, state = ?, district = ?, phone = ? WHERE id = ?");
            $stmt->bind_param("ssssi", $fullName, $state, $district, $phone, $_SESSION['user_id']);
            
            if ($stmt->execute()) {
                // Redirect with success message
                $_SESSION['message'] = "Profile updated successfully!";
                header("Location: ../profile.php");
                exit();
            } else {
                throw new Exception("Profile update failed");
            }
        } catch (Exception $e) {
            $_SESSION['error'] = "Error: " . $e->getMessage();
            header("Location: ../profile.php");
            exit();
        }
    } else {
        // Store errors in session to display on profile page
        $_SESSION['errors'] = $errors;
        header("Location: ../profile.php");
        exit();
    }
} else {
    // If not a POST request, redirect
    header("Location: ../profile.php");
    exit();
}
?>
