<?php

switch ($action) {

   case 'login':
      $query1 = $query = "SELECT id,id_tipo,area FROM usuarios
      WHERE login='$str_login' AND senha='$str_senha' AND status=1";
      $query5 = $query4 = $query3 = $query2 = $query1;
      $return_type = 'select';
   break;

   case 'get_main_menu_items':
      $query1 = "SELECT id,label,whattodo FROM acl_main_menu_items a,usuario_has_main_menu_items u
      WHERE a.id=u.id_acl_mmi AND a.status=1 AND u.status=1 AND u.id_usu='$id_usuario'
      ORDER BY ord ASC";
      $query5 = $query4 = $query3 = $query2 = $query1;
      $return_type = 'select';
   break;
   case 'get_main_menu_items2':
      $query1 = "SELECT id,label,whattodo FROM acl_main_menu_items
      WHERE status=1 AND id IN ($rules)
      ORDER BY ord ASC";
      $query5 = $query4 = $query3 = $query2 = $query1;
      $return_type = 'select';
   break;
   case 'get_option_menu_items':
      $query1 = "SELECT id id_om,label,whattodo FROM acl_option_menu_items a,usuario_has_option_menu_items u
      WHERE a.id_acl_mmi=u.id_acl_mmi AND a.id=u.id_acl_omi AND u.id_usu='$id_usuario' AND a.id_acl_mmi='$id_mmi'
      AND a.status=1 AND u.status=1 ORDER BY ord ASC";
      $query5 = $query4 = $query3 = $query2 = $query1;
      $return_type = 'select';
   break;
   case 'get_option_menu_items2':
      $query1 = "SELECT id id_om,label,whattodo FROM acl_option_menu_items
      WHERE id_acl_mmi='$id_mmi' AND id IN ($rules)
      AND status=1  ORDER BY ord ASC";
      $query5 = $query4 = $query3 = $query2 = $query1;
      $return_type = 'select';
   break;
   case 'get_option_menu_sub_items':
      $query1 = "SELECT id id_subm,id_acl_mmi,label,whattodo,meta FROM option_menu_sub_items
      WHERE id_acl_omi='$id_om' AND status=1 ORDER BY ord ASC";
      $query5 = $query4 = $query3 = $query2 = $query1;
      $return_type = 'select';
   break;

   //quiz
   /*case 'new_quiz' :
      $query1 = "INSERT INTO questionarios SET id_usuario=$id_usuario,data='$data',
      titulo='$titulo',html='$html',config='$config',area='$area'";
      $return_type = 'insert';
      $query2 = $query1;
   break;*/

   case 'get_ajax_table' :
      $query1 = "SELECT * FROM $table $where";
      $query4 = $query3 = $query2 = $query1;
      $return_type = 'select';
   break;
   case 'get_list_option_menu_items' :
      $query1 = "SELECT id,label,id_acl_mmi,whattodo FROM acl_option_menu_items WHERE status=1";
      $query2 = $query1;
      $return_type = 'select';
   break;

   case 'user_list' :
      $query1 = "SELECT login FROM usuarios WHERE id<>1";
      $query2 = $query1;
      $return_type = 'select';
   break;
   case 'count_users' :
      $query1 = "SELECT COUNT('id') count_users FROM usuarios u WHERE status=1 AND id<>1 $id_t_usu $WHERE";
      $query2 = $query1;
      $return_type = 'select';
   break;
   case 'get_list_user_group':
      $query1 = "SELECT id,tipo FROM tipo_usuario WHERE status=1 AND id<>1 AND id>$id_tipo_usuario";
      $return_type = 'select';
      $query4 = $query3 = $query2 = $query1;
   break;
   case 'submit_usuarios_incluir' :
      $query1 = "INSERT INTO usuarios (id_tipo,login,area,senha) VALUES
      ($list_grupo_usu,'$login','$area','$senha')";
      $return_type = 'insert';
      $query2 = $query1;
   break;
   case 'submit_usuarios_incluir_acl_mm' :
      $query1 = "INSERT INTO usuario_has_main_menu_items (id_usu,id_tipo_usuario,id_acl_mmi) VALUES
      ($id_usu,$list_grupo_usu,$id_mmi)";
      $query2 = $query1;
      $return_type = 'insert';
   break;
   case 'submit_usuarios_incluir_acl_om' :
      $query1 = "INSERT INTO usuario_has_option_menu_items (id_usu,id_tipo_usuario,id_acl_mmi,id_acl_omi) VALUES
      ($id_usu,$list_grupo_usu,'$id_mmi','$id_acl_omi')";
      $query2 = $query1;
      $return_type = 'insert';
   break;
   case 'submit_usuarios_alterar' :
      $query1 = "UPDATE usuarios SET id_tipo=$list_grupo_usu,login='$login',area='$area'
      WHERE id=$id";
      $query5 = $query4 = $query3 = $query2 = $query1;
      $return_type = 'update';
   break;
   case 'submit_usuarios_buscar' :
      $query1 = "SELECT u.id id,u.login,u.email,tu.tipo tipo
      FROM usuarios u,tipo_usuario tu
      WHERE u.id_tipo=tu.id  AND u.id<>1 $WHERE
      ORDER BY $sidx $sord LIMIT $start , $limit";
      $query2 = "SELECT u.id id,u.login,u.email,tu.tipo tipo
      FROM usuarios u,tipo_usuario tu
      WHERE u.id_tipo=tu.id AND u.id_tipo>=$id_tipo_usuario $WHERE
      ORDER BY $sidx $sord LIMIT $start , $limit";
      $return_type = 'select';
   break;
   case 'get_data_user' :
      $query1 = "SELECT id idusu,login,area,id_tipo FROM usuarios WHERE id=$id";
      $query5 = $query4 = $query3 = $query2 = $query1;
      $return_type = 'select';
   break;
   case 'get_data_user_by_login' :
      $query1 = "SELECT id,login,area,id_tipo FROM usuarios WHERE login=$login";
      $query5 = $query4 = $query3 = $query2 = $query1;
      $return_type = 'select';
   break;
   case 'change_your_password' :
      $query1 = "SELECT senha FROM usuarios WHERE id=$id_usuario AND senha='$senha_default'";
      $query5 = $query4 = $query3 = $query2 = $query1;
      $return_type = 'select';
   break;
   case 'get_list_user_by_rule' :
      $query1 = "SELECT id,login,status FROM usuarios WHERE id<>1";
      $query3 = "SELECT id,login,status FROM usuarios WHERE id<>1 AND id=$id_usuario";
      $query2 = $query1;
      $query5 = $query4 = $query3;
      $return_type = 'select';
   break;
   case 'submit_usuarios_alterar_senha' :
      $query1 = "UPDATE usuarios SET senha='$nova_senha'
      WHERE id=$id_usu";
      $query5 = $query4 = $query3 = $query2 = $query1;
      $return_type = 'update';
   break;
   case 'get_list_usuarios' :
      $query1 = "SELECT u.id,t.tipo,login,area FROM usuarios u, tipo_usuario t
      WHERE u.id>1 AND u.id_tipo=t.id AND u.status='$status' $where_usuario $limit";
      $query2 = $query1;
      $query3 = "SELECT u.id,t.tipo,login,area FROM usuarios u, tipo_usuario t
      WHERE u.id>1 AND u.id_tipo=t.id AND u.id=$id_usuario AND u.status='$status' $where_usuario $limit";
      $query4 = $query3;
      $return_type = 'select';
   break;
   case 'get_count_usuarios' :
      $query1 = "SELECT COUNT(u.id) count_usuarios FROM usuarios u, tipo_usuario t
      WHERE u.id>1 AND u.id_tipo=t.id AND u.status='$status' $where_usuario";
      $query4 = $query3 = $query2 = $query1;
      $return_type = 'select';
   break;

}

?>
