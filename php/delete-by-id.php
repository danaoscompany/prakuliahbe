<?php
include 'db.php';
mysqli_set_charset($c, "utf8");
$name = $_POST["name"];
$id = intval($_POST["id"]);
$sql = "DELETE FROM " . $name . " WHERE id=" . $id;
$c->query($sql);
echo $sql;
