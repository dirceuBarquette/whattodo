<?php
$params['login'] = $usu;
//$params['email'] = $email;
$params['area'] = $area;
$params['list_grupo_usu'] = $list_tipo_usu;
$params['senha'] = md5('12345');
$arr = sql_model ('submit_usuarios_incluir',$params);
extract($arr);
if ($affected_rows == 1) {
    $aff = 1;
    $params['id_usu'] = $id;

    $arr = sql_model ('get_list_main_menu_items',$params);
    extract($arr);
    for ($i = 0;$i < $num_rows;$i++) {
        $id_mm = $fields['id'][$i];
        $arr_id_mm[] = $fields['id'][$i];

        switch ($list_tipo_usu) {
            case 1 :$rules_mm = array(1,2,3,4,5);break;
            case 2 :$rules_mm = array(1,2,3,4,5);break;
            case 3 :$rules_mm = array(1,4);break;
            case 4 :$rules_mm = array(1,4);break;
            //case 5 :$rules_mm = array(1,6);break;
        }
        if (in_array($id_mm,$rules_mm)) {
            $params['id_mmi'] = $id_mm;
            $arr = sql_model ('submit_usuarios_incluir_acl_mm',$params);
        }
    }
    unset_var_sess($fields);
    $arr = sql_model ('get_list_option_menu_items',$params);
    /*extract($arr);
    for ($i = 0;$i < $num_rows;$i++) {
        $id_om = $fields['id'][$i];
        $params['id_mmi'] = $fields['id_acl_mmi'][$i];
        switch ($list_tipo_usu) {
            case 1 :$rules_om = array(1,2,3,4,5,6,7,8,9,10,11,12);break;
            case 2 :$rules_om = array(1,2,3,4,5,6,7,8,9,10,11,12);break;
            case 3 :$rules_om = array(7,8,12);break;
            case 4 :$rules_om = array(7,8,12);break;
            //case 5 :$rules_om = array(12,15);break;
        }
        if (in_array($id_om,$rules_om)) {
            $params['id_acl_omi'] = $id_om;
            $arr = sql_model ('submit_usuarios_incluir_acl_om',$params);
        }
    }*/
}
if ($affected_rows == 1) {
   $ajax['error'] = array(0,'msg'=>'Dados inseridos com sucesso!','id'=>$params['id']);
} else {
   $ajax['error'] = array('num'=>1,'msg'=>'Repita a opera&ccedil;&atilde;o!');
}
?>
