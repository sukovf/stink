<?php

namespace App\Facade;

use App\Entity\Severity;
use Doctrine\ORM\EntityManagerInterface;

class SeverityFacade
{
	private EntityManagerInterface $em;

	public function __construct(EntityManagerInterface $em)
	{
		$this->em = $em;
	}

	/**
	 * @return Severity[]
	 */
	public function getAll(): array
	{
		return $this->em->getRepository(Severity::class)
			->findAll();
	}
}