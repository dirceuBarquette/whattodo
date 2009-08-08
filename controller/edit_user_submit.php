<?php
$params['id'] = $_SESSION['working'][1]['id'];
$params['login'] = $usu;
$params['area'] = $area;
$params['list_grupo_usu'] = $list_tipo_usu;
$arr = sql_model ('submit_usuarios_alterar',$params);
extract($arr);
if ($affected_rows == 1) {
   $ajax['error'] = array(0,'msg'=>'Dados inseridos com sucesso!','id'=>$params['id']);
} else {
   $ajax['error'] = array('num'=>1,'msg'=>'Repita a opera&ccedil;&atilde;o!');
}
?>