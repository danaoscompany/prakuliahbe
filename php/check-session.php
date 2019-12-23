<?php
session_id("prakuliah");
session_start();
if (isset($_SESSION["logged_in"]) && $_SESSION["logged_in"] == true) {
	echo 0;
} else {
	echo -1;
}
