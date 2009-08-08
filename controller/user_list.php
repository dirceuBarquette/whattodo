<?php

$params['where_usuario'] = $search_text ? " AND login LIKE '%".$search_text."%'" : '';
$params['status'] = $status || 1;

$arr = sql_model ('get_count_usuarios',$params);
extract($arr);
$ajax['total'] = $total = $fields['count_usuarios'][0];

unset($fields);

$params['limit'] = sql_limits($per_page,$page,$total);//$por_pagina ? ' LIMIT 0,'.$por_pagina : ' LIMIT 0,10 ';
$arr = sql_model ('get_list_usuarios',$params);
extract($arr);


$ajax['elem'] = array();
for ($i = 0;$i < $num_rows;$i++) {
   $ajax['elem'][$i]['id_usu'] = $fields['id'][$i];
   $ajax['elem'][$i]['login'] = $fields['login'][$i];
   $ajax['elem'][$i]['area'] = $fields['area'][$i];
   $ajax['elem'][$i]['tipo'] = $fields['tipo'][$i];
}

?>