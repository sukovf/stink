<?php

namespace App\Entity;

use DateTime;
use Doctrine\DBAL\Types\DateType;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

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
	 * @var Severity
	 * @ORM\ManyToOne(targetEntity="Severity")
	 * @ORM\JoinColumn(name="severity_id", referencedColumnName="id")
	 */
	private Severity $severity;

	/**
	 * @var string
	 * @ORM\Column(type="string", nullable=false)
	 * @Assert\NotBlank()
	 */
	private string $reporterName;

	/**
	 * @var string
	 * @ORM\Column(type="string", nullable=false)
	 * @Assert\NotBlank()
	 */
	private string $reporterSurname;

	/**
	 * @var string
	 * @ORM\Column(type="string", nullable=false)
	 * @Assert\Email()
	 * @Assert\NotBlank()
	 */
	private string $reporterEmail;

	/**
	 * @var float
	 * @ORM\Column(type="float", nullable=false)
	 */
	private float $long = 0.0;

	/**
	 * @var float
	 * @ORM\Column(type="float", nullable=false)
	 */
	private float $lat = 0.0;

	/**
	 * @var DateTime
	 * @ORM\Column(type="datetime", nullable=false)
	 */
	private DateTime $created;

	/**
	 * @var string
	 * @ORM\Column(type="string")
	 */
	private string $comment;

	/**
	 * @return int
	 */
	public function getId(): int
	{
		return $this->id;
	}

	/**
	 * @param int $id
	 */
	public function setId(int $id): void
	{
		$this->id = $id;
	}

	/**
	 * @return Severity
	 */
	public function getSeverity(): Severity
	{
		return $this->severity;
	}

	/**
	 * @param Severity $severity
	 */
	public function setSeverity(Severity $severity): void
	{
		$this->severity = $severity;
	}

	/**
	 * @return string
	 */
	public function getReporterName(): string
	{
		return $this->reporterName;
	}

	/**
	 * @param string $reporterName
	 */
	public function setReporterName(string $reporterName): void
	{
		$this->reporterName = $reporterName;
	}

	/**
	 * @return string
	 */
	public function getReporterSurname(): string
	{
		return $this->reporterSurname;
	}

	/**
	 * @param string $reporterSurname
	 */
	public function setReporterSurname(string $reporterSurname): void
	{
		$this->reporterSurname = $reporterSurname;
	}

	/**
	 * @return string
	 */
	public function getReporterEmail(): string
	{
		return $this->reporterEmail;
	}

	/**
	 * @param string $reporterEmail
	 */
	public function setReporterEmail(string $reporterEmail): void
	{
		$this->reporterEmail = $reporterEmail;
	}

	/**
	 * @return float
	 */
	public function getLong(): float
	{
		return $this->long;
	}

	/**
	 * @param float $long
	 */
	public function setLong(float $long): void
	{
		$this->long = $long;
	}

	/**
	 * @return float
	 */
	public function getLat(): float
	{
		return $this->lat;
	}

	/**
	 * @param float $lat
	 */
	public function setLat(float $lat): void
	{
		$this->lat = $lat;
	}

	/**
	 * @return DateTime
	 */
	public function getCreated(): DateTime
	{
		return $this->created;
	}

	/**
	 * @param DateTime $created
	 */
	public function setCreated(DateTime $created): void
	{
		$this->created = $created;
	}

	/**
	 * @return string
	 */
	public function getComment(): string
	{
		return $this->comment;
	}

	/**
	 * @param string $comment
	 */
	public function setComment(string $comment): void
	{
		$this->comment = $comment;
	}
}