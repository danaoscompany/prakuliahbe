<?php
include 'db.php';
$results = $c->query("SELECT * FROM employees");
$employees = [];
if ($results && $results->num_rows > 0) {
    while ($row = $results->fetch_assoc()) {
        $users = $c->query("SELECT * FROM users WHERE id=" . $row["user_id"]);
        if ($users && $users->num_rows > 0) {
            $user = $users->fetch_assoc();
            $row["name"] = $user["first_name"] . " " . $user["last_name"];
        }
        $jobs = $c->query("SELECT * FROM jobs WHERE id=" . $row["job_id"]);
        if ($jobs && $jobs->num_rows > 0) {
            $job = $jobs->fetch_assoc();
            $row["job_title"] = $job["title"];
            $employers = $c->query("SELECT * FROM employers WHERE id=" . $job["employer_id"]);
            if ($employers && $employers->num_rows > 0) {
                $employer = $employers->fetch_assoc();
                $row["employer"] = $employer["full_name"];
            }
        }
        array_push($employees, $row);
    }
}
echo json_encode($employees);