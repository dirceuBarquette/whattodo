<?php

$params['table'] = $table;
if ($param != '') {
   $params['where'] = "WHERE uf_id='$param'";
}

$arr = sql_model ('get_ajax_table',$params);
extract($arr);

$ajax['elem'] = array();
for ($i = 0;$i < $num_rows;$i++) {
   foreach($fields as $field => $val) {
      $ajax['elem'][$i][$field] = $fields[$field][$i];
   }
}

?>