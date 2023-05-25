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

	public function getId(): int
	{
		return $this->id;
	}

	public function setId(int $id): self
	{
		$this->id = $id;

		return $this;
	}

	public function getLabel(): string
	{
		return $this->label;
	}

	public function setLabel(string $label): self
	{
		$this->label = $label;

		return $this;
	}

	public function getColor(): string
	{
		return $this->color;
	}
}