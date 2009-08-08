<?php

$fields = array();

$params['senha_default'] = md5('12345');
$arr = sql_model('change_your_password',$params);
extract($arr);
if ($num_rows == 1) {
   $cyp = $ajax['cyp'] = 1;
}
$rule[1] = array(1,2,5,11,12,13,15,16);
$rule[2] = array(1,2,5,11,12,13,15,16);
$rule[3] = array(1,2,12,15,16);
$rule[4] = array(1,2,12,15,16);

if ($cyp == 1) {
   $rule[$_SESSION['id_tipo_usuario']] = array(2);
}
$params['rules'] = implode(',',$rule[$_SESSION['id_tipo_usuario']]);
$params['id_mmi'] = $mm;
$arr = sql_model ('get_option_menu_items2',$params);
extract($arr);
$items = $fields;
$rows = $num_rows;
unset_var_sess($fields);

for ($i = 0;$i < $rows;$i++) {
   //$ajax['elem'][$i]['id_om'] = $params2['id_om'] = $items['id_om'][$i];
   $om[$i] = $items['id_om'][$i];
   $ajax['elem'][$i]['label'] = $items['label'][$i];
   $ajax['elem'][$i]['whattodo'] = $items['whattodo'][$i];


}
foreach ($om as $key => $val) {
   $fields = array();
   $num_rows = 0;
   $params2['id_om'] = $val;
   $arr2 = sql_model ('get_option_menu_sub_items',$params2);
   extract($arr2);
   for ($i = 0;$i < $num_rows;$i++) {
      $ajax['elem'][$key]['sub_items'][$i]['id'] = $fields['id_subm'][$i];
      $ajax['elem'][$key]['sub_items'][$i]['label'] = $fields['label'][$i];
      $ajax['elem'][$key]['sub_items'][$i]['whattodo'] = $fields['whattodo'][$i];
      $ajax['elem'][$key]['sub_items'][$i]['meta'] = $fields['meta'][$i];
   }
}
?>