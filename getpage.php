<?php
    header("Content-Type: text/plain");
    $prefix = $_REQUEST['prefix'];
    $page = $_REQUEST['page'];
    echo file_get_contents("https://www.ishtar-collective.net/$prefix/page/$page");
?>