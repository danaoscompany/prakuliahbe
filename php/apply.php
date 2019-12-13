<?php
include 'db.php';
$userID = intval($_POST["user_id"]);
$jobID = intval($_POST["job_id"]);
$startWorkDate = $_POST["start_work_date"];
$endWorkDate = $_POST["end_work_date"];
$salaryPerMonth = intval($_POST["salary_per_month"]);
$salaryMonth = intval($_POST["salary_month"]);
$description = $_POST["description"];
$employerID = intval($c->query("SELECT * FROM jobs WHERE id=" . $jobID)->fetch_assoc()["employer_id"]);
$date = date('Y:m:d H:i:s');
$sql = "INSERT INTO applications (job_id, employer_id, user_id, start_work_date, end_work_date, salary_per_month, salary_month, description, date, status) VALUES (" . $jobID . ", " . $employerID . ", " . $userID . ", '" . $startWorkDate . "', '" . $endWorkDate . "', " . $salaryPerMonth . ", " . $salaryMonth . ", '" . $description . "', '" . $date . "', 1)";
$c->query($sql);
echo $sql;