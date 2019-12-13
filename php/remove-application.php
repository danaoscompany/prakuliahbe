<?php
include 'db.php';
$jobID = intval($_POST["job_id"]);
$userID = intval($_POST["user_id"]);
$c->query("UPDATE applications SET status=5 WHERE job_id=" . $jobID . " AND user_id=" . $userID . " ORDER BY id DESC LIMIT 1");