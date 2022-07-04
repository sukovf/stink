<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 * @ORM\Table(name="severity")
 */
class Severity
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
	 * @var string
	 * @ORM\Column(type="string", nullable=false)
	 */
	private string $color = '#FFFFFF';

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

	/**
	 * @return string
	 */
	public function getColor(): string
	{
		return $this->color;
	}
}