<?php
include 'db.php';
$title = $_POST["title"];
$categoryID = intval($_POST["category_id"]);
$content = $_POST["content"];
$writerID = intval($_POST["writer_id"]);
$imgPath = $_POST["img_path"];
if (!file_exists('../userdata/blog_images')) {
    mkdir('../userdata/blog_images', 0777, true);
}
move_uploaded_file($_FILES["file"]["tmp_name"], "../userdata/" . $imgPath);
$c->query("INSERT INTO articles (title, category_id, content, img_path, writer_id, date) VALUES ('" . $title . "', " . $categoryID . ", '" . $content . "', '" . $imgPath . "', " . $writerID . ", '" . date('Y:m:d H:i:s') . "')");