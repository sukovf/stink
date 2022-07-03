<?php

namespace App\Entity;

use DateTime;
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
	 * @ORM\JoinColumn(name="severity_id", referencedColumnName="id", nullable=false)
	 */
	private Severity $severity;

	/**
	 * @var string
	 * @ORM\Column(type="string", nullable=false)
	 * @Assert\NotBlank(message="form.reporter_name")
	 */
	private string $reporterName;

	/**
	 * @var string
	 * @ORM\Column(type="string", nullable=false)
	 * @Assert\NotBlank(message="form.reporter_surname")
	 */
	private string $reporterSurname;

	/**
	 * @var string
	 * @ORM\Column(type="string", nullable=false)
	 * @Assert\NotBlank(message="form.reporter_email.blank")
	 * @Assert\Email(message="form.reporter_email.invalid")
	 */
	private string $reporterEmail;

	/**
	 * @var string|null
	 * @ORM\Column(type="string", length=2048, nullable=true)
	 */
	private ?string $comment;

	/**
	 * @var float
	 * @ORM\Column(type="float", nullable=false)
	 */
	private float $longitude = 0.0;

	/**
	 * @var float
	 * @ORM\Column(type="float", nullable=false)
	 */
	private float $latitude = 0.0;

	/**
	 * @var DateTime
	 * @ORM\Column(type="datetime", nullable=false)
	 */
	private DateTime $created;

	/**
	 *
	 */
	public function __construct()
	{
		$this->created = new DateTime();
	}

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
	public function getLongitude(): float
	{
		return $this->longitude;
	}

	/**
	 * @param float $longitude
	 */
	public function setLongitude(float $longitude): void
	{
		$this->longitude = $longitude;
	}

	/**
	 * @return float
	 */
	public function getLatitude(): float
	{
		return $this->latitude;
	}

	/**
	 * @param float $latitude
	 */
	public function setLatitude(float $latitude): void
	{
		$this->latitude = $latitude;
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
	 * @return string|null
	 */
	public function getComment(): ?string
	{
		return $this->comment;
	}

	/**
	 * @param string|null $comment
	 */
	public function setComment(?string $comment): void
	{
		$this->comment = $comment;
	}
}