<?php
include 'db.php';
$id = intval($_POST["id"]);
$title = $_POST["title"];
$categoryID = intval($_POST["category_id"]);
$content = $_POST["content"];
$writerID = intval($_POST["writer_id"]);
$imgPath = $_POST["img_path"];
$imgChanged = intval($_POST["img_changed"]);
if ($imgChanged == 1) {
    if (!file_exists('../userdata/blog_images')) {
        mkdir('../userdata/blog_images', 0777, true);
    }
    move_uploaded_file($_FILES["file"]["tmp_name"], "../userdata/" . $imgPath);
    $c->query("UPDATE articles SET img_path='" . $imgPath . "' WHERE id=" . $id);
}
$c->query("UPDATE articles SET title='" . $title . "', category_id=" . $categoryID . ", content='" . $content . "', writer_id=" . $writerID . " WHERE id=" . $id);