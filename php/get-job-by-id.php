<?php
include 'db.php';
mysqli_set_charset($c, "utf8");
$id = intval($_POST["id"]);
$items = [];
$sql = "SELECT * FROM jobs WHERE id=" . $id;
$results = $c->query($sql);
if ($results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		$employerInfo = $c->query("SELECT * FROM employers WHERE id=" . $row["employer_id"]);
		if ($employerInfo && $employerInfo->num_rows > 0) {
			$row["employer"] = $employerInfo->fetch_assoc()["full_name"];
		}
		array_push($items, $row);
	}
	echo json_encode($items);
} else {
	echo -1;
}