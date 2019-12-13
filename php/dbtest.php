<?php
include 'db.php';
$results = $c->query("SELECT * FROM users");
echo "Total rows: " . $results->num_rows;