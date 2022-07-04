<?php

ini_set('log_errors', 1);
ini_set('error_log', 'php-error.log');
error_reporting(E_USER_ERROR & E_COMPILE_ERROR & E_CORE_ERROR & E_RECOVERABLE_ERROR & E_ERROR);

use App\Kernel;

require_once dirname(__DIR__).'/vendor/autoload_runtime.php';

return function (array $context) {
    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};
