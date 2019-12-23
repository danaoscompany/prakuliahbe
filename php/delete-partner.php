<?php
include 'db.php';
$id = intval($_POST["id"]);
$sql = "DELETE FROM partners WHERE id=" . $id;
$c->query($sql);
echo 0;