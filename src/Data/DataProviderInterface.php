<?php

namespace App\Data;

use Symfony\Component\HttpFoundation\Request;

/**
 *
 */
interface DataProviderInterface
{
	/**
	 *
	 */
	public function getData(Request $request, int $limit = -1): DataResponse;
}