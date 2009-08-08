<?php
$params['id_usu'] = $_SESSION['working'][1]['id'];
$params['nova_senha'] = md5($nova_senha);
if ($nova_senha != '12345') {
   $arr = sql_model('submit_usuarios_alterar_senha',$params);
   extract($arr);
   if ($affected_rows == 1) {
      $ajax['error'] = array(0,'msg'=>'Dados inseridos com sucesso!','id'=>$params['id_usu']);
   } else {
      $ajax['error'] = array('num'=>1,'msg'=>'Repita a opera&ccedil;&atilde;o!');
   }
} else {
   $ajax['error'] = array('num'=>2,'msg'=>'Esta senha n&atile;o &eacute; permitida. Por favor, cadastre outra senha!');
}
?>