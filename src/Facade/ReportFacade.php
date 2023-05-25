<?php

namespace App\Facade;

use App\Entity\Report;
use Doctrine\ORM\EntityManagerInterface;

class ReportFacade
{
	private EntityManagerInterface $em;

	public function __construct(EntityManagerInterface $em)
	{
		$this->em = $em;
	}

	public function save(Report $severity): void
	{
		$this->em->persist($severity);
		$this->em->flush();
	}
}