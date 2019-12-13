<?php

function query($c, $tableName, $idName, $id) {
	$results = $c->query("SELECT * FROM " . $tableName . " WHERE " . $idName . "=" . $id);
	if ($results && $results->num_rows > 0) {
		return TRUE;
	} else {
		return FALSE;
	}
}

function queryString($c, $tableName, $idName, $id) {
	$results = $c->query("SELECT * FROM " . $tableName . " WHERE " . $idName . "='" . $id . "'");
	if ($results && $results->num_rows > 0) {
		return TRUE;
	} else {
		return FALSE;
	}
}