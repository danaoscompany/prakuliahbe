<?php
include 'db.php';
$sql = "";
$ids = json_decode($_POST["id"]);
foreach ($ids as $id) {
	$sql = "DELETE FROM users WHERE id='" . $id . "'";
	$c->query($sql);
}
echo $sql;