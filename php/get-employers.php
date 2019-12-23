<?php
include 'db.php';
$results = $c->query("SELECT * FROM employers");
$employers = [];
if ($results && $results->num_rows > 0) {
    while ($row = $results->fetch_assoc()) {
        $employer = array(
            "id" => $row["id"],
            "name" => $row["full_name"]
        );
        array_push($employers, $employer);
    }
}
echo json_encode($employers);