<?php
include 'db.php';
$token = $_POST["token"];
$c->query("UPDATE admins SET fcm_token='" . $token . "'");