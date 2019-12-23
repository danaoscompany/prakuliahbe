<?php
include 'db.php';
$id = intval($_POST["id"]);
$c->query("UPDATE users SET verified=1 WHERE id=" . $id);