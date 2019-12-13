<?php
include 'db.php';
$partners = [];
$results = $c->query("SELECT * FROM partners");
if ($results && $results->num_rows > 0) {
    while ($row = $results->fetch_assoc()) {
        array_push($partners, $row);
    }
}
echo json_encode($partners);