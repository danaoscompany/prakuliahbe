<?php
include 'db.php';
$id = intval($_POST["id"]);
$c->query("DELETE FROM job_categories WHERE id=" . $id);