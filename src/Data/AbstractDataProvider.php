<?php

namespace App\Data;

use App\Entity\Report;
use App\Repository\ReportRepository;
use DateInterval;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;

abstract class AbstractDataProvider implements DataProviderInterface
{
	protected EntityManagerInterface $entityManager;
	protected ReportRepository $reportRepository;
	protected LoggerInterface $logger;

	public function __construct(
		EntityManagerInterface $entityManager,
		ReportRepository $reportRepository,
		LoggerInterface $logger
	)
	{
		$this->entityManager = $entityManager;
		$this->reportRepository = $reportRepository;
		$this->logger = $logger;
	}

	protected function getReports(Request $request, int $limit = -1): ReportsData
	{
		$fromDateParam = $request->query->get('from');
		$toDateParam = $request->query->get('to');

		$fromDate = DateConvertor::makeDateFromQueryParameter($fromDateParam);
		$toDate = DateConvertor::makeDateFromQueryParameter($toDateParam);

		if (!$fromDate && !$toDate) {
			/** @var ?Report $latestReport */
			$latestReport = $this->reportRepository->getLatestReport();

			if ($latestReport) {
				$latestReportCreated = clone($latestReport->getCreated());

				$fromDate = $latestReportCreated->sub(DateInterval::createFromDateString('24 hour'));
				$toDate = $latestReport->getCreated();
			}
		}

		$reports = $this->reportRepository->getInRange($fromDate, $toDate, $limit);

		$this->logger->debug('Successfully fulfilled a Reports request.', [
			'from'			=> $fromDate ? $fromDate->format('Y-m-d H:i:s') : 'unspecified',
			'to'			=> $toDate ? $toDate->format('Y-m-d H:i:s') : 'unspecified',
			'reportCount'	=> count($reports)
		]);

		return new ReportsData(
			$reports,
			$fromDate,
			$toDate
		);
	}
}