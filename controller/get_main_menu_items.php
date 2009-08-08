<?php
$params['senha_default'] = md5('12345');
$arr = sql_model('change_your_password',$params);
extract($arr);
if ($num_rows == 1) {
   $cyp = $ajax['cyp'] = 1;
}
$rule[1] = array(1,2,3);
$rule[2] = array(2,3);
if ($cyp == 1) {
   $rule[$_SESSION['id_tipo_usuario']] = array(1);
}
$params['rules'] = implode(',',$rule[$_SESSION['id_tipo_usuario']]);
$arr2 = sql_model ('get_main_menu_items2',$params);
extract($arr2);


for ($i = 0;$i < $num_rows;$i++) {
   $ajax['elem'][$i]['id'] = $fields['id'][$i];
   $ajax['elem'][$i]['label'] = $fields['label'][$i];
   $ajax['elem'][$i]['whattodo'] = $fields['whattodo'][$i];
}
?>
