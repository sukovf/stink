<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 * @ORM\Table(name="stink_nature")
 */
class StinkNature
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
	private string $label;

	/**
	 * @return int
	 */
	public function getId(): int
	{
		return $this->id;
	}

	/**
	 * @return string
	 */
	public function getLabel(): string
	{
		return $this->label;
	}
}