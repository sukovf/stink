<?php

namespace App\Data;

use DateTime;
use Exception;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class DateConvertor
{
	public static function makeDateFromQueryParameter(?string $param): ?DateTime
	{
		if (empty($param)) {
			return null;
		}

		try {
			return new DateTime($param);
		} catch (Exception) {
			throw new BadRequestHttpException('Invalid date provided');
		}
	}
}