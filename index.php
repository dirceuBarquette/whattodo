<?php

session_name('template_whattodo');
session_start();

require_once './auxfiles/functions.php';
require_once './auxfiles/app.php';

mb_http_output("UTF-8");
ob_start("mb_output_handler");

$_GET = _utf8_decode($_GET);
$_POST = _utf8_decode($_POST);
$_GET = _no_sql_injection($_GET);
$_POST = _no_sql_injection($_POST);
if (count($_POST)) {
    extract($_POST);
}
if (count($_GET)) {
    extract($_GET);
}

if ($_SESSION['auth'] < 1 ) {
    $whattodo == '';
}

require_once './controller/controller.php';

if (count($ajax) > 0) {
   echo json_encode(_utf8_encode($ajax));
}

debug("Controller -> ".$whattodo,$ajax);



?>
