<?php
session_id("prakuliah");
session_start();
unset($_SESSION["prakuliah_user_id"]);
session_destroy();