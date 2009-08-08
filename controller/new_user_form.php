<?php
$arr = sql_model ('get_list_user_group',$params);
extract($arr);
$ajax['elem'] = array();
for ($i = 0;$i < $num_rows;$i++) {
   $ajax['elem'][$i]['id'] = $fields['id'][$i];
   $ajax['elem'][$i]['tipo'] = $fields['tipo'][$i];
}
$ajax['html'] = file_get_contents('./html/new_user_form.htm');
?>