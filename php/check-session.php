<?php
session_id("prakuliah");
session_start();
if (isset($_SESSION["prakuliah_user_id"]) && $_SESSION["prakuliah_user_id"] != "") {
	echo 0;
} else {
	echo -1;
}