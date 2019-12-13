<?php
include 'db.php';
$appVersion = intval($_POST["app_version"]);
$c->query("UPDATE configuration SET config1=" . $appVersion . " WHERE id='app-version'");