<?php

namespace App\Data;

use Doctrine\ORM\EntityManagerInterface;

/**
 *
 */
abstract class AbstractDataProvider implements DataProviderInterface
{
	/** @var EntityManagerInterface */
	protected EntityManagerInterface $entityManager;

	/**
	 *
	 */
	public function __construct(EntityManagerInterface $entityManager)
	{
		$this->entityManager = $entityManager;
	}
}