<?php
include 'db.php';
$adminId = $_POST["id"];
$firstName = $_POST["first_name"];
$lastName = $_POST["last_name"];
$email = $_POST["email"];
$password = $_POST["password"];
$phone = $_POST["phone"];
$roles = json_decode($_POST["roles"], true);
for ($i=0; $i<count($roles); $i++) {
    $results = $c->query("SELECT * FROM roles WHERE user_id=" . intval($roles[$i]["user_id"]) . " AND role_id=" . intval($roles[$i]["role_id"]));
    if ($results && $results->num_rows > 0) {
        $c->query("UPDATE roles SET enabled=" . intval($roles[$i]["enabled"]) . " WHERE role_id=" . intval($roles[$i]["role_id"]) . " AND role='admin' AND user_id=" . intval($roles[$i]["user_id"]));
    } else {
        $sql = "INSERT INTO roles (user_id, role, role_id, enabled) VALUES (" . intval($roles[$i]["user_id"]) . ", 'admin', " . intval($roles[$i]["role_id"]) . ", " . intval($roles[$i]["enabled"]) . ")";
        $c->query($sql);
        echo $sql . "<br/>";
    }
}
$c->query("UPDATE admins SET email='" . $email . "', password='" . $password . "', first_name='" . $firstName . "', last_name='" . $lastName . "', phone='" . $phone . "' WHERE id='" . $adminId . "'");
echo 0;