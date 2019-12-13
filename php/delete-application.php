<?php
include 'db.php';
$id = intval($_POST["id"]);
$c->query("DELETE FROM applications WHERE id=" . $id);