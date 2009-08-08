<?php

function fetch_login_page () {
   $arr = read_conf_file('./etc/login_page.conf');
   extract($arr);
   header("Location: $login_page");
}


function debug ($wtd, $vars) {
   if (!$_SESSION['debug_mode']) {
      $vars = read_conf_file('./etc/debug_mode.conf');
      extract ($vars);
      $_SESSION['debug_mode'] = $debug_mode;
   } else {
      $debug_mode = $_SESSION['debug_mode'];
   }
   if ($debug_mode == 'on') {
      require_once './auxfiles/FirePHP.class.php';
      switch ($mode) {
         default :
            $firephp = FirePHP::getInstance(true);
            $firephp->group($wtd);
            $firephp->log($vars);
            $firephp->groupEnd();
         break;
      }
   }
}

function read_conf_file ($file) {

   $arr_file = file ($file);
   foreach ($arr_file as $val) {
      $tmp = explode('=',$val);
      $arr_final[$tmp[0]] = trim($tmp[1]);
   }
   return $arr_final;
}
function sql_limits ($per_page=5,$page=1,$total) {
   $index = $total / $per_page;
   $to_floor = $total % $per_page;
   $pages = $to_floor > 0 ? floor($index) + 1 : $index;
   switch (true) {
      case ($page == 1) :
         $start = 0;
      break;
      case ($page == $pages) :
         $start = ($per_page * $page) - $per_page;
      break;
      default :
         $start = $per_page * ($page - 1) ;
   }
   $limit = " LIMIT $start,$per_page ";
   return $limit;
}
function make_connection ($base_file = 'mysql') {$_SESSION['debug']['base_file'] = $base_file;
   if (file_exists('./etc/'.$base_file.'.conf')) {
      $vars = read_conf_file('./etc/'.$base_file . '.conf');
      extract($vars);
   } else {
      extract($base_file);
   }
   switch ($sgbd) {
      case 'mysql' :
         $conn = mysql_pconnect($hostname,$username,$password,1);
         if ($conn) {
            $arr['connection'] = $conn;
            $arr['model'] = $sgbd;
            $arr['error']['select_db'] = mysql_select_db($db,$conn) ? 'ok':'não selecionou bd';
         } else {
            $arr['error']['connect'] = 'sem conexão com o BD!';
         }
      break;
      default :
         $arr['error']['model'] = 'modelo não está selecionado!';
   }
   return $arr;
}
function sql_model ($action = '', $params = array()) {
   $arr = array();
   extract($params);
   if (count($new_conn) > 0) {
      $con = make_connection($new_conn);
   } else {
      $con = make_connection();
   }
   extract($con);
   if ($connection) {
      extract($params);
      require('./model/'.$model.'_model.php');
      $var_sql = 'query'.$_SESSION['id_tipo_usuario'];
      $_SESSION['debug']['var_sql'] = $var_sql;
      $result = mysql_query($$var_sql,$connection);

      $arr['error']['mysql_err_no'] = mysql_errno($connection);
      $arr['error']['mysql_error'] = mysql_error($connection);
      $arr['query'] = $$var_sql;

      if ($arr['error']['mysql_err_no'] == 0) {
         switch ($return_type) {
            case 'select' :
               $arr['num_rows'] = mysql_num_rows($result);
               if ($arr['error']['mysql_err_no'] == 0) {
                  while ($row = mysql_fetch_array($result)) {
                     $i = 0;
                     while ($i < mysql_num_fields($result)) {
                        $meta = mysql_fetch_field($result,$i);
                        $arr_field_name[] = $field_name = $meta->name;
                        $arr['fields'][$field_name][] = $row[$field_name];
                        $i++;
                     }
                  }
                  /*//caso o retorno tenha apenas uma posicao
                  foreach ($arr_field_name as $name) {
                     if (count($arr['fields'][$name]) == 1) {
                        $tmp = $arr['fields'][$name][0];
                        unset_var_sess($arr['fields'][$name]);
                        $arr['fields'][$name] = $tmp;
                     }
                  }*/
               } else {
                  $arr['error']['pau geral'] = 'caramba!';
               }
            break;
            case 'delete' :
            case 'update' :
               $arr['affected_rows'] = mysql_affected_rows($connection);
            break;
            case 'insert' :
               $arr['affected_rows'] = mysql_affected_rows($connection);
               $arr['id'] = mysql_insert_id($connection);
            break;
         }
      }
      debug("SQL -> ".$action,$arr);
   } else {
      $arr['error']['make_connection'] = 'função make_connection falhou!';
   }

   return $arr;
}

function _no_sql_injection ($arr = array()) {
   if (count($arr) > 0) {
      foreach ($arr as $key => $val) {
         if (!is_array($val)) {
            $arr2[$key] = sql_quote ($val);
         } else {
            $arr2[$key] = _no_sql_injection($val);
         }
      }
   }
   return $arr2;
}
function sql_quote( $value )
{
   if (!get_magic_quotes_gpc()) {
      $value = addslashes( $value );
   }
   return $value;
}

function _utf8_decode ($arr) {
   foreach ($arr as $key => $val) {
      if (!is_array($val)) {
         $arr2[$key] = utf8_decode ($val);
      } else {
         $arr2[$key] = _utf8_decode($val);
      }
   }
   return $arr2;
}

function _utf8_encode ($arr) {
   foreach ($arr as $key => $val) {
      if (!is_array($val)) {
         $arr2[$key] = utf8_encode ($val);
      } else {
         $arr2[$key] = _utf8_encode($val);
      }
   }
   return $arr2;
}

function unset_var_sess ($arr) {
   if (count($arr) > 0) {
      foreach ($arr as $val) {
         if (is_array($val) && count($val) > 0) {
            unset_var_sess($val);
         } else {
            unset($val);
         }
      }
   }
}

function clear_session () {
   unset_var_sess($_SESSION);
   session_destroy();
}

?>
