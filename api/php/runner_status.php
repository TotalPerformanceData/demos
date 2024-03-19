<?php

include_once('creds.php'); // (added to gitignore - see creds_example.php)
header('Content-type: application/json');

if (isset($k)) {
    if (isset($_GET['sc'])) {
        echo file_get_contents($target . "/json-rpc/v2/race_data/runner_status/?sc={$_GET['sc']}&k={$k}");
    } else {
        echo file_get_contents($target . "/json-rpc/v2/courses/?k={$k}");
    }
} else {
    echo json_encode(['error' => 'Internal server error']);
}
