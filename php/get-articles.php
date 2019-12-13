<?php
include 'db.php';
$items = [];
$results = $c->query("SELECT * FROM articles");
if ($results && $results->num_rows > 0) {
    while ($row = $results->fetch_assoc()) {
        $categories = $c->query("SELECT * FROM article_categories WHERE id=" . $row["id"]);
        if ($categories && $categories->num_rows > 0) {
            $row["category"] = $categories->fetch_assoc()["name"];
        }
        $admins = $c->query("SELECT * FROM admins WHERE id=" . $row["writer_id"]);
        if ($admins && $admins->num_rows > 0) {
            $admin = $admins->fetch_assoc();
            $row["writer"] = $admin["first_name"] . " " . $admin["last_name"];
        }
        array_push($items, $row);
    }
}
echo json_encode($items);
