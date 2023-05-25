<?php

namespace App\Data\GeoJson;

use App\Data\AbstractDataProvider;
use App\Data\DataResponse;
use Symfony\Component\HttpFoundation\Request;

class GeoJsonDataProvider extends AbstractDataProvider
{
	public function getData(Request $request, int $limit = -1): DataResponse
	{
		$reportsData = $this->getReports($request, $limit);

		return new DataResponse(
			Collection::makeFromReportsData($reportsData),
			'application/geo+json',
			$reportsData->getHumanizedFromDate(),
			$reportsData->getHumanizedToDate()
		);
	}
}