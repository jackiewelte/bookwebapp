<?php
    $content = $_GET["content"];
    $file = uniqid() . ".html";
    file_put_contents($file, $content);
    echo $file;
?>