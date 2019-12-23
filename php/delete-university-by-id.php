<?php
include 'db.php';
$id = intval($_POST["id"]);
$c->query("DELETE FROM universities WHERE id=" . $id);