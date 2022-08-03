<?php

namespace App\Data;

use Symfony\Component\HttpFoundation\Request;

/**
 *
 */
class GeoJsonDataProvider extends AbstractDataProvider
{
	/**
	 *
	 */
	public function getData(Request $request, int $limit = -1): DataResponse
	{
		$reports = $this->getReports($request, $from, $to, $limit);

		$data = [
			'type' 		=> 'FeatureCollection',
			'crs'		=> [
				'type' 			=> 'name',
				'properties' 	=> [
					'name' => 'urn:ogc:def:crs:OGC:1.3:CRS84'
				]
			],
			'features'	=> []
		];

		foreach ($reports as $report) {
			$feature = [
				'type'			=> 'Feature',
				'properties'	=> [
					'size'	=> $report->getSeverity()->getId(),
					'color'	=> $report->getSeverity()->getColor()
				],
				'geometry'		=> [
					'type' 			=> 'Point',
					'coordinates'	=> [$report->getLongitude(), $report->getLatitude(), 0.0]
				]
			];

			$data['features'][] = $feature;
		}

		return new DataResponse(
			contentType: 'application/geo+json',
			data: $data,
			fromDate: strval($from),
			toDate: strval($to)
		);
	}
}