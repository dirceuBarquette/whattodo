<?php
$params['id'] = $_SESSION['working'][1]['id'] = $id;
$arr = sql_model ('get_data_user',$params);
extract($arr);

$ajax['login'] = $fields['login'][0];
$ajax['html'] = file_get_contents('./html/change_user_password_form.htm');

?>