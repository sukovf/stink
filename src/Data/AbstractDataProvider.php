<?php

namespace App\Data;

use App\Entity\Report;
use DateInterval;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

abstract class AbstractDataProvider implements DataProviderInterface
{
	protected EntityManagerInterface $entityManager;

	public function __construct(EntityManagerInterface $entityManager)
	{
		$this->entityManager = $entityManager;
	}

	protected function getReports(Request $request, ?string &$from, ?string &$to, int $limit = -1): array
	{
		$from = $request->query->get('from');
		$to = $request->query->get('to');

		$repository = $this->entityManager->getRepository(Report::class);
		$queryBuilder = $repository->createQueryBuilder('r')
			->orderBy('r.created', 'DESC');

		$queryParams = [];

		if (!empty($from)) {
			try {
				$from = new DateTime($from);
			} catch (Exception) {
				throw new HttpException( Response::HTTP_BAD_REQUEST, 'Invalid start date');
			}

			$queryBuilder->andWhere('r.created >= :from');
			$queryParams['from'] = $from->format('Y-m-d H:i:s');
		}

		if (!empty($to)) {
			try {
				$to = new DateTime($to);
			} catch (Exception) {
				throw new HttpException( Response::HTTP_BAD_REQUEST, 'Invalid end date');
			}

			$queryBuilder->andWhere('r.created <= :to');
			$queryParams['to'] = $to->format('Y-m-d H:i:s');
		}

		// by default, we'll load all reports 24hrs back from the latest one
		if (empty($from) && empty($to)) {
			/** @var ?Report $latestReport */
			$latestReport = $repository->getLatestReport();

			if ($latestReport) {
				$queryBuilder->where('r.created >= DATE_SUB(:latestDate, 24, \'HOUR\')');
				$queryParams['latestDate'] = $latestReport->getCreated()->format('Y-m-d H:i:s');

				$latestReportCreated = clone($latestReport->getCreated());

				$from = $latestReportCreated->sub(DateInterval::createFromDateString('24 hour'))->format('d.m.Y H:i:s');
				$to = $latestReport->getCreated()->format('d.m.Y H:i:s');
			}
		}

		if (count($queryParams) > 0) {
			$queryBuilder->setParameters($queryParams);
		}

		if ($from instanceof DateTime) {
			$from = $from->format('d.m.Y H:i:s');
		}

		$from = preg_replace('/\s+0{2}:0{2}:0{2}$/', '', $from, 1);

		if ($to instanceof DateTime) {
			$to = $to->format('d.m.Y H:i:s');
		}

		$to = preg_replace('/\s+0{2}:0{2}:0{2}$/', '', $to, 1);

		return $queryBuilder->getQuery()->getResult();
	}
}