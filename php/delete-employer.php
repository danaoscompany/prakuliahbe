<?php
include 'db.php';
$id = intval($_POST["id"]);
$c->query("DELETE FROM employers WHERE id=" . $id);
echo "DELETE FROM employers WHERE id=" . $id;