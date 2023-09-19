<?php
   
    include_once('creds.php'); // (added to gitignore - see creds_example.php)
    echo (isset($k) && isset($_GET['sc'])) ? file_get_contents("https://www.tpd.zone/json-rpc/v2/vendors/runner_velocities/?sc={$_GET['sc']}&includes={$_GET['includes']}&source={$_GET['source']}&k={$k}") : [];