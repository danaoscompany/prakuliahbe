<?php
include 'db.php';
$id = intval($_POST["id"]);
$title = $_POST["title"];
$content = $_POST["content"];
$c->query("UPDATE notifications SET title='" . $title . "', content='" . $content . "' WHERE id=" . $id);