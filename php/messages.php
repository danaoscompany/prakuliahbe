<?php
function sendMessage($title, $body) {
$notification = array('title' =>$title , 'body' => $body, 'sound' => 'default', 'badge' => '1');
$data = array('to' => '/topics/all', 'notification' => $notification, 'priority'=>'high');
$json = json_encode($data);
$url = 'https://fcm.googleapis.com/fcm/send';
$server_key = 'AAAAQ0HaK2k:APA91bFS-FA9qbzC7AQ25VJS9W_9vaO5yLPd9XcbaNwaFCvpROH8J1Tu8QEDNKdS8joA49QSg0v6YsaZR2-fcE_yHm4smeqmIAPXQXdRmhzue4zg-768pNbDdj3X4Ewwz67yGKvkCua0';
$headers = array(
    'Content-Type:application/json',
    'Authorization:key='.$server_key
);
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
$result = curl_exec($ch);
if ($result === FALSE) {
    die('Oops! FCM Send Error: ' . curl_error($ch));
}
curl_close($ch);
}