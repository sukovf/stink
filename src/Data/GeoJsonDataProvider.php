<?php

namespace App\Data;

use App\Entity\Report;
use DateTime;
use Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 *
 */
class GeoJsonDataProvider extends AbstractDataProvider
{
	/**
	 *
	 */
	public function getData(Request $request, int $limit = -1): Response
	{
		$from = $request->query->get('from');
		$to = $request->query->get('to');

		$queryBuilder = $this->entityManager->getRepository(Report::class)->createQueryBuilder('r')
			->orderBy('r.created', 'DESC');

		$queryParams = [];

		if (!empty($from)) {
			try {
				$from = new DateTime($from);
			} catch (Exception) {
				return new Response('Invalid start date', Response::HTTP_BAD_REQUEST);
			}

			$queryBuilder->andWhere('r.created >= :from');
			$queryParams['from'] = $from->format('Y-m-d H:i:s');
		}

		if (!empty($to)) {
			try {
				$to = new DateTime($to);
			} catch (Exception) {
				return new Response('Invalid end date', Response::HTTP_BAD_REQUEST);
			}

			$queryBuilder->andWhere('r.created <= :to');
			$queryParams['to'] = $to->format('Y-m-d H:i:s');
		}

		if (count($queryParams) > 0) {
			$queryBuilder->setParameters($queryParams);
		}

		$reports = $queryBuilder->getQuery()->getResult();

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