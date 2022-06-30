<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="report")
 */
class Report
{
	/**
	 * @var int
	 * @ORM\Id
	 * @ORM\Column(type="integer")
	 * @ORM\GeneratedValue
	 */
	private int $id;

	/**
	 * @var string
	 * @ORM\Column(type="string", nullable=false)
	 */
	private string $reporterName;

	/**
	 * @var string
	 * @ORM\Column(type="string", nullable==false)
	 */
	private string $reporterSurname;
}