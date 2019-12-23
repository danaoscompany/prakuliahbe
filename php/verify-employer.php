<?php
include 'db.php';
$id = intval($_POST["id"]);
$c->query("UPDATE employers SET verified=1 WHERE id=" . $id);