<?php
include 'db.php';
$name = $_POST["name"];
$id = intval($_POST["id"]);
$values = json_decode($_POST["values"], true);
$sql = "UPDATE " . $name . " SET ";
for ($values as $value) {
	$sql .= ($value["name"] . "=");
	$type = $value["type"];
	if ($type == "int") {
		$sql .= intval($value["value"]);
	} else if ($type == "string") {
		$sql .= ("'" . $value["value"] . "'");
	}
	$sql .= ", ";
}
$sql = substr($sql, 0, strlen($sql)-2);
$c->query($sql);
