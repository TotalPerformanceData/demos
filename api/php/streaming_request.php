<?php
   
    include_once('creds.php'); // (added to gitignore - see creds_example.php)

    $_SERVER['REMOTE_ADDR'] = $_SERVER['REMOTE_ADDR'] == "::1" ? $local_ip : $_SERVER['REMOTE_ADDR'];

    echo 
    (isset($k) && isset($vk) && isset($_GET['sc'])) 
    ? file_get_contents("https://www.tpd.zone/json-rpc/v2/vendors/streaming_request/?mode={$_GET['mode']}&sc={$_GET['sc']}&ip={$_SERVER['REMOTE_ADDR']}&k={$k}")
    : [];