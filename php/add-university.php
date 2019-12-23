<?php
include 'db.php';
$name = $_POST["name"];
$c->query("INSERT INTO universities (name) VALUES ('" . $name . "')");