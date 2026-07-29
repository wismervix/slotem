<?php

require 'vendor/autoload.php';

$app = require 'bootstrap/app.php';
$app->boot();

$router = $app->make('router');
$aliases = $router->getMiddleware();

var_dump($aliases['auth'] ?? null);
var_dump($aliases);
