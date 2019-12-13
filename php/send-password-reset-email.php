<?php
include 'db.php';
include 'mail.php';
include 'uuid.php';
include 'common.php';
$email = "danaoscompany@gmail.com";
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
sendEmail($email, 'Atur Ulang Kata Sandi', "
<table width='100%' border='0' cellspacing='0' cellpadding='0'>
    <tr>
        <td align='center'>
            <div style='font-size: 25px; color: black; font-family: Helvetica; margin-top: 20px;'>Atur ulang kata sandi Anda</div>
        </td>
    </tr>
</table>

<br/>

<table width='100%' border='0' cellspacing='0' cellpadding='0'>
    <tr>
        <td align='center'>
            <a href='https://" . HOST . "/prakuliah/reset-password.html?id=" . $resetID . "' style='background-image: linear-gradient(#4776E6, #8E54E9); width: 300px; padding-left: 20px; padding-right: 20px; padding-top: 15px; padding-bottom: 15px; border: 0; border-radius: 3px; color: white; font-size: 15px; text-decoration: none;'>Atur Ulang Kata Sandi</a>
        </td>
    </tr>
</table>

<br/>

<div style='color: #544053;'>
    Halo " . $name . ",
    <br/>
    <br/>Untuk mengatur ulang kata sandi Anda, klik tombol di atas. Untuk keamanan Anda, link akan kadaluarsa setelah 24 jam.
    <br/>
    <br/> Jika bukan Anda yang meminta untuk mengatur ulang kata sandi, mohon abaikan email ini. Seseorang mungkin salah ketika mengetik email mereka sendiri. Jangan khawatir, tidak ada orang yang bisa mengatur ulang kata sandi Anda tanpa akses ke email Anda.
    <br/>
    <br/>Semoga harimu menyenangkan,
    <br/>
    <br/> Tim Prakuliah.
</div>

<br/>
<br/>

<div style='width: 100%; height: 1px; background-color: black; margin-top: 20px;'></div>
<br/>

<table width='100%' border='0' cellspacing='0' cellpadding='0'>
    <tr>
        <td align='center'>
            <div onclick='window.location.href=\"https://prakuliah.com\"' style='color: #3498db; cursor: pointer; text-decoration: none;'>prakuliah.com   |    </div>
        </td>
        <td align='center'>
            <div onclick='window.location.href=\"http://" . HOST . "/prakuliah/privacy_policy.html\"' style='margin-left: 10px; color: #3498db; cursor: pointer; text-decoration: none;'>Kebijakan Privasi   |   </div>
        </td>
        <td align='center'>
            <div style='margin-left: 10px; color: #000000;'>© " . date('Y') . " Prakuliah.com</div>
        </td>
    </tr>
</table>
");