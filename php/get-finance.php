<?php
include 'db.php';
$userID = intval($_POST["user_id"]);
$start = intval($_POST["start"]);
$limit = intval($_POST["limit"]);
$results = $c->query("SELECT * FROM finance WHERE user_id=" . $userID . " ORDER BY id DESC LIMIT 1");
$endBalance = 0;
if ($results && $results->num_rows > 0) {
	$endBalance = intval($results->fetch_assoc()["end_balance"]);
}
$financeInfo = array(
	"end_balance" => $endBalance,
	"finances" => ""
);
$finances = [];
$results = $c->query("SELECT * FROM finance WHERE user_id=" . $userID . " ORDER BY id DESC LIMIT " . $start . "," . $limit);
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		array_push($finances, $row);
	}
}
$financeInfo["finances"] = $finances;
echo json_encode($financeInfo);
