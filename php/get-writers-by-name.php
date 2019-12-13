<?php
include 'db.php';
$name = $_POST["name"];
$results = $c->query("SELECT * FROM admins WHERE first_name LIKE '%" . $name . "%' OR last_name='%" . $name . "%'");
$writers = [];
if ($results && $results->num_rows > 0) {
    while ($row = $results->fetch_assoc()) {
        array_push($writers, $row);
    }
}
echo json_encode($writers);