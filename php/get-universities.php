<?php
include 'db.php';
$results = $c->query("SELECT * FROM universities");
$universities = [];
if ($results && $results->num_rows > 0) {
    while ($row = $results->fetch_assoc()) {
        array_push($universities, $row);
    }
}
echo json_encode($universities);