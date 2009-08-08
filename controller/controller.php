<?php
$ajax = array();

if ($o_login != '' && $pass != '') {
   $whattodo = 'login';
}

$params['id_usuario'] = $_SESSION['id_usuario'];
$params['id_tipo_usuario'] = $_SESSION['id_tipo_usuario'];


switch ($whattodo) {

   case 'exit' :
      require './controller/exit.php';
   break;
   case 'login' :
      unset($_SESSION['working'][1]);
      require './controller/login.php';
   break;
   case 'get_main_menu_items' :
      unset ($_SESSION['working'][1]);
      require './controller/get_main_menu_items.php';
   break;
   case 'main_menu_items' ://testing
      unset ($_SESSION['working'][1]);
      require './controller/get_main_menu_items.php';
   break;
   case 'get_option_menu_items' :
      unset ($_SESSION['working'][1]);
      require './controller/get_option_menu_items.php';
   break;

   case 'new_user_form' :
      unset ($_SESSION['working'][1]);
      if ($_SESSION['id_tipo_usuario'] <3) {
         require './controller/new_user_form.php';
      } else {
         $ajax['html'] = "acesso negado!";
      }
   break;
   case 'new_user_submit' :
      unset ($_SESSION['working'][1]);
      require './controller/new_user_submit.php';
   break;
   case 'show_user_data' :
   case 'edit_user_form' :
      require './controller/edit_user_form.php';
   break;
   case 'edit_user_submit' :
      require './controller/edit_user_submit.php';
   break;
   case 'change_user_password_form' :
      unset ($_SESSION['working'][1]);
      require './controller/change_user_password_form.php';
   break;
   case 'change_user_password_submit' :
      require './controller/change_user_password_submit.php';
   break;
   case 'search_user_form' :
      unset ($_SESSION['working'][1]);
      require './controller/search_user_form.php';
   break;
   case 'user_list' :
      require './controller/user_list.php';
   break;
   //fim novos




   default:
      unset($_SESSION['working'][1]);
      //$_SESSION['whattodo'] = 'login';
      fetch_login_page ();
   break;

}
?>
