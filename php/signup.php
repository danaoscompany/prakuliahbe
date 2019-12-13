<?php
include 'db.php';
$email = $_POST["email"];
$password = $_POST["password"];
$name = $_POST["name"];
$phone = $_POST["phone"];
$results = $c->query("SELECT * FROM users WHERE email='" . $email . "'");
if ($results && $results->num_rows > 0) {
    echo -1;
    return;
}
$c->query("INSERT INTO admins (id, email, password, name, phone, register_date) VALUES ('" . uniqid() . "', '" . $email . "', '" . $password . "', '" . $name . "', '" . $phone . "', " . round(microtime(true)*1000) . ")");
echo 0;