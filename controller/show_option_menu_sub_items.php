<?php
$params['subm_id'] = $subm;
$arr = sql_model ('get_option_menu_sub_items',$params);
extract($arr);
for ($i = 0;$i < $num_rows;$i++) {
   $ajax['elem'][$i]['id'] = $fields['id'][$i];
   $ajax['elem'][$i]['label'] = $fields['label'][$i];
   $ajax['elem'][$i]['whattodo'] = $fields['whattodo'][$i];
}
?>