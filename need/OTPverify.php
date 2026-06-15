<?php

$url = "https://developer.bdapps.com/subscription/send";

$data = [
    "applicationId" => "APP_138374",
    "password" => "ba4527f88f6fa673b7d230606dd5ea8d",
    "subscriberId" => "tel:8801862636137",
    "action" => "0"
];

$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);

if (curl_error($ch)) {
    echo "Curl Error: " . curl_error($ch);
} else {
    echo "<pre>";
    echo $response;
    echo "</pre>";
}

curl_close($ch);
?>