<?php

$ajax['page'] = $params['page'] = $page ? $page : 1;
$params['limit'] = $limit = $rows ? $rows : 5;
$params['sidx'] = $sidx;
$params['sord'] = $sord; //para depois

if ($usu != '') {
   $where[] = " AND login LIKE '%$usu%'";
   $ajax['login'] = $usu;
}
if ($email != '') {
   $where[] = " AND email LIKE '%$email%'";
   $ajax['email'] = $email;
}
if (count($where) > 0) {
   $params['WHERE'] = implode(' ',$where);
}

$arr0 = sql_model('count_users',$params);
extract ($arr0);
$count = $fields['count_users'][0];

if( $count > 0 ) {
    $total_pages = ceil($count/$limit);
} else {
    $total_pages = 0;
}
if ($page > $total_pages) $page = $total_pages;
$start = $limit * $page - $limit; // do not put $limit*($page - 1)
if ($start < 0) $start = 0;

$params['start'] = $start;

$ajax['total'] = $total_pages;
$ajax['records'] = $count;

if ($sidx) {
   $arr = sql_model('submit_usuarios_buscar',$params);
   extract($arr);
   if ($num_rows > 0) {
      foreach ($fields['id'] as $key => $val) {
         $ajax['rows'][$key]['id'] = $fields['id'][$key];
         $ajax['rows'][$key]['cell'] = array ($fields['id'][$key],$fields['login'][$key],$fields['email'][$key]
                                              ,$fields['tipo'][$key]);
      }
   }
}
$_SESSION['debug']['FIELDS'] = $fields;
?>