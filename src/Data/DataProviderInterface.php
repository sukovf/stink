<?php

namespace App\Data;

use Symfony\Component\HttpFoundation\Response;

/**
 *
 */
interface DataProviderInterface
{
	/**
	 *
	 */
	public function getData(int $limit = -1): Response;
}