<?php
include 'db.php';
$id = intval($_POST["id"]);
$c->query("UPDATE employers SET recommended=1 WHERE id=" . $id);