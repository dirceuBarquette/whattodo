<?php
$_SESSION['working'][1]['id'] = $ajax['id'] = $params['id'] = $id;
$arr0 = sql_model ('get_data_user',$params);
extract($arr0);
$ajax['usu'] = $fields['login'][0];
$ajax['area'] = $fields['area'][0];
$ajax['selected_index'] = $fields['id_tipo'][0];
unset_var_sess($fields);
$arr = sql_model ('get_list_user_group',$params);
extract($arr);
for ($i = 0;$i < $num_rows;$i++) {
   $ajax['elem'][$i]['id'] = $fields['id'][$i];
   $ajax['elem'][$i]['tipo'] = $fields['tipo'][$i];
}
if ($whattodo == 'edit_user_form') {
   $ajax['html'] = file_get_contents('./html/new_user_form.htm');
} else {
   $ajax['html'] = file_get_contents('./html/show_user_data.htm');
}
?>