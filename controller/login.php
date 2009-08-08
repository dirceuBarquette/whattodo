<?php
$params['str_login'] = $o_login;
$params['str_senha'] = md5($pass);
$arr = sql_model ('login',$params);
extract($arr);
if($num_rows == 1){
   $_SESSION['auth'] = 1;
   $_SESSION['id_tipo_usuario'] = $fields['id_tipo'][0];
   $_SESSION['id_usuario'] = $fields['id'][0];
   $_SESSION['area'] = $fields['area'][0];
   $_SESSION['login'] = $o_login;
   $html = file_get_contents('./html/main.htm');
   echo $html;
} else {
	//debug('arr->',$arr);
	fetch_login_page();
}
?>
