<?php
include 'db.php';
$id = intval($_POST["id"]);
$c->query("UPDATE users SET recommended=1 WHERE id=" . $id);