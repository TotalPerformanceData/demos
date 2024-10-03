<?php

include_once ('creds.php'); // (added to gitignore - see creds_example.php)

$_SERVER['REMOTE_ADDR'] = $_SERVER['REMOTE_ADDR'] == "::1" ? $local_ip : $_SERVER['REMOTE_ADDR'];
header('Content-type: application/json');
if (isset($k) && isset($vk) && isset($_GET['sc'])) {
    $data = file_get_contents($target . "/json-rpc/v2/vendors/streaming_request/?mode={$_GET['mode']}&sc={$_GET['sc']}&ip={$_SERVER['REMOTE_ADDR']}&k={$k}");
    $d = json_decode($data, true);
    $d['vendorKey'] = "";
    echo json_encode($d);
} else {
    echo '[]';
}
