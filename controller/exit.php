<?php
unset_var_sess($_SESSION);
unset($_SESSION['debug']);
session_destroy();
fetch_login_page();
?>