<?php
include 'db.php';
include 'common.php';
$resetID = $_POST["id"];
$password = $_POST["password"];
$lastAccess = gmdate('Y-m-d H:m:s');
$deviceName = gethostbyaddr(getIP());
$c->query("UPDATE users SET password='" . $password . "', last_access='" . $lastAccess . "', last_ip='" . getIP() . "', device_name='" . $deviceName . "' WHERE email_reset_id='" . $resetID . "'");
echo getCurrentTime();