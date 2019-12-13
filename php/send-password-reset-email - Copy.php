<?php
include 'db.php';
include 'mail.php';
include 'uuid.php';
include 'common.php';
$email = $_GET["email"];
$results = $c->query("SELECT * FROM users WHERE email='" . $email . "'");
if (!$results || $results->num_rows <=0) {
	// Email not registered
	echo -1;
	return;
}
$row = $results->fetch_assoc();
$name = $row["first_name"] . " " . $row["last_name"];
$resetID = "" . time() . "-" . generateUUID();
$c->query("UPDATE users SET email_reset_id='" . $resetID . "' WHERE id=" . $row["id"]);
sendEmail('danaoscompany@gmail.com', 'Atur Ulang Kata Sandi', "
<div style='display: flex; width: 100%; align-items: center; flex-flow: column nowrap; margin-top: 20px; font-family: Helvetica; line-height: 25px;'>
	<div style='font-size: 25px; color: black; font-family: Helvetica;'>Atur ulang kata sandi Anda</div>
	<br/>
	<div onclick='window.location.href=\"http://" . HOST . "/prakuliah/reset-password.html?id=" . $resetID . "\"' style='display: flex; justify-content: center; align-items: center; background-image: linear-gradient(#4776E6, #8E54E9); padding-left: 20px; padding-right: 20px; height: 40px; border: 0; border-radius: 3px; color: white; font-size: 15px; cursor: pointer;'>
		Atur Ulang Kata Sandi
	</div>
	<div style='width: 100%; height: 1px; background-color: black; margin-top: 20px;'></div><br/>
	<div style='width: 100%; display: flex; align-items: left; flex-flow: column nowrap; color: #544053;'>
		Halo " . $name . ",<br/><br/>Untuk mengatur ulang kata sandi Anda, klik tombol di atas. Untuk keamanan Anda, link akan kadaluarsa setelah 24 jam.<br/><br/>
		Jika bukan Anda yang meminta untuk mengatur ulang kata sandi, mohon abaikan email ini. Seseorang mungkin salah ketika mengetik email mereka sendiri.
		Jangan khawatir, tidak ada orang yang bisa mengatur ulang kata sandi Anda tanpa akses ke email Anda.<br/><br/>Semoga harimu menyenangkan,<br/><br/>
		Tim Prakuliah.
	</div>
	<br/><br/>
	<div style='width: 100%; height: 1px; background-color: black; margin-top: 20px;'></div><br/>
	<div style='width: 100%; display: flex; justify-content: center; align-items: center; flex-flow: row nowrap;'>
		<div onclick='window.location.href=\"https://prakuliah.com\"' style='color: #3498db; cursor: pointer;'>prakuliah.com</div><div style='margin-left: 10px;'>|</div>
		<div onclick='window.location.href=\"http://" . HOST . "/prakuliah/privacy_policy.html\"' style='margin-left: 10px; color: #3498db; cursor: pointer;'>Kebijakan Privasi</div><div style='margin-left: 10px;'>|</div>
		<div style='margin-left: 10px; color: #000000;'>© " . date('Y') . " Prakuliah.com</div>
	</div>
</div>
");