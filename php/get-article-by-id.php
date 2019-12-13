<?php
include 'db.php';
mysqli_set_charset($c, "utf8");
$id = intval($_POST["id"]);
$items = [];
$sql = "SELECT * FROM articles WHERE id=" . $id;
$results = $c->query($sql);
if ($results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		$writers = $c->query("SELECT * FROM admins WHERE id=" . $row["writer_id"]);
		if ($writers && $writers->num_rows > 0) {
			$writer = $writers->fetch_assoc();
			$row["writer"] = $writer["first_name"] . " " . $writer["last_name"];
			$row["writer_profile_picture"] = $writer["profile_picture"];
		}
		$categories = $c->query("SELECT * FROM article_categories WHERE id=" . $row["category_id"]);
		if ($categories && $categories->num_rows > 0) {
			$category = $categories->fetch_assoc();
			$row["category"] = $category["name"];
		}
		array_push($items, $row);
	}
	echo json_encode($items);
} else {
	echo -1;
}