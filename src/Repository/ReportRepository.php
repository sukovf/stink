<?php

namespace App\Repository;

use App\Entity\Report;
use DateTime;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Report>
 * @method Report|null find($id, $lockMode = null, $lockVersion = null)
 * @method Report|null findOneBy(array $criteria, array $orderBy = null)
 * @method Report[]    findAll()
 * @method Report[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ReportRepository extends ServiceEntityRepository
{
	public function __construct(ManagerRegistry $registry)
	{
		parent::__construct($registry, Report::class);
	}

	public function getLatestReport(): ?Report
	{
		return $this->findOneBy([], ['created' => 'DESC']);
	}

	/**
	 * @return Report[] array
	 */
	public function getInRange(?DateTime $fromDate, ?DateTime $toDate, int $limit = -1): array
	{
		$qb = $this->createQueryBuilder('r')
			->orderBy('r.created', 'DESC');

		if ($fromDate) {
			$qb
				->andWhere('r.created >= :fromDate')
				->setParameter('fromDate', $fromDate);
		}

		if ($toDate) {
			$qb
				->andWhere('r.created <= :toDate')
				->setParameter('toDate', $toDate);
		}

		if ($limit >= 0) {
			$qb->setMaxResults($limit);
		}

		return $qb->getQuery()->getResult();
	}
}