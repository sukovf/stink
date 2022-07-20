<?php

namespace App\Data;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 *
 */
interface DataProviderInterface
{
	/**
	 *
	 */
	public function getData(Request $request, int $limit = -1): Response;
}