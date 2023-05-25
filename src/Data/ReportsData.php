<?php

namespace App\Data;

use App\Entity\Report;
use DateTime;

class ReportsData
{
	/** @var Report[]  */
	private array $reports;

	private ?DateTime $fromDate;
	private ?DateTime $toDate;

	/**
	 * @param Report[] $reports
	 */
	public function __construct(array $reports, ?DateTime $fromDate, ?DateTime $toDate)
	{
		$this->reports = $reports;
		$this->fromDate = $fromDate;
		$this->toDate = $toDate;
	}

	/**
	 * @return Report[]
	 */
	public function getReports(): array
	{
		return $this->reports;
	}

	public function getHumanizedFromDate(): string
	{
		return $this->fromDate
			? $this->fromDate->format('d.m.Y H:i:s')
			: '';
	}

	public function getHumanizedToDate(): string
	{
		return $this->toDate
			? $this->toDate->format('d.m.Y H:i:s')
			: '';
	}
}