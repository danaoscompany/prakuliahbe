<?php
include 'db.php';
$adminID = intval($_POST["admin_id"]);
$id = intval($_POST["id"]);
$results = $c->query("SELECT * FROM roles WHERE user_id=" . $adminID . " AND role='admin' AND role_id=6 AND enabled=1");
if ($results && $results->num_rows > 0) {
    $c->query("DELETE FROM users WHERE id=" . $id);
    echo 1;
} else {
    echo 0;
}