<?php
    require_once realpath(__DIR__ . '/vendor/autoload.php');
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
    $servername = "db";
    $username = $_ENV['MYSQLUSERNAME'];
    $password = $_ENV['MYSQLPASSWORD'];
    $dbname = $_ENV['MYSQLDATABASE'];
    $server = $_ENV['MYSQLHOSTNAME'];
?>