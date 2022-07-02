<?php

namespace App\Data;

use App\Entity\Report;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 *
 */
class GeoJsonDataProvider extends AbstractDataProvider
{
	/**
	 *
	 */
	public function getData(int $limit = -1): Response
	{
		$reports = $this->entityManager->getRepository(Report::class)->findBy([], ['created' => 'DESC']);

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

		$response = new JsonResponse();
		$response->headers->set('Content-Type', 'application/geo+json');
		$response->setContent(json_encode($data));

		return $response;
	}
}