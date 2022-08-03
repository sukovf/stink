<?php

namespace App\Repository;

use App\Entity\Report;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 *
 */
class ReportRepository extends ServiceEntityRepository
{
	/**
	 *
	 */
	public function __construct(ManagerRegistry $registry)
	{
		parent::__construct($registry, Report::class);
	}

	/**
	 *
	 */
	public function getLatestReport(): ?Report
	{
		$data = $this->createQueryBuilder('r')
			->orderBy('r.created', 'DESC')
			->setMaxResults(1)
			->getQuery()
			->getResult();

		if (!is_array($data) || count($data) !== 1) {
			return null;
		}

		return $data[0];
	}
}