<?php

namespace App\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ReportRepository")
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
	 * @var StinkNature
	 * @ORM\ManyToOne(targetEntity="StinkNature")
	 * @ORM\JoinColumn(name="stink_nature_id", referencedColumnName="id", nullable=false)
	 */
	private StinkNature $stinkNature;

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

	public function __construct()
	{
		$this->created = new DateTime();
	}

	public function getId(): int
	{
		return $this->id;
	}

	public function setId(int $id): self
	{
		$this->id = $id;

		return $this;
	}

	public function getSeverity(): Severity
	{
		return $this->severity;
	}

	public function setSeverity(Severity $severity): self
	{
		$this->severity = $severity;

		return $this;
	}

	public function getStinkNature(): StinkNature
	{
		return $this->stinkNature;
	}

	public function setStinkNature(StinkNature $stinkNature): self
	{
		$this->stinkNature = $stinkNature;

		return $this;
	}

	public function getReporterName(): string
	{
		return $this->reporterName;
	}

	public function setReporterName(string $reporterName): self
	{
		$this->reporterName = $reporterName;

		return $this;
	}

	public function getReporterSurname(): string
	{
		return $this->reporterSurname;
	}

	public function setReporterSurname(string $reporterSurname): self
	{
		$this->reporterSurname = $reporterSurname;

		return $this;
	}

	public function getReporterEmail(): string
	{
		return $this->reporterEmail;
	}

	public function setReporterEmail(string $reporterEmail): self
	{
		$this->reporterEmail = $reporterEmail;

		return $this;
	}

	public function getLongitude(): float
	{
		return $this->longitude;
	}

	public function setLongitude(float $longitude): self
	{
		$this->longitude = $longitude;

		return $this;
	}

	public function getLatitude(): float
	{
		return $this->latitude;
	}

	public function setLatitude(float $latitude): self
	{
		$this->latitude = $latitude;

		return $this;
	}

	public function getCreated(): DateTime
	{
		return $this->created;
	}

	public function setCreated(DateTime $created): self
	{
		$this->created = $created;

		return $this;
	}

	public function getComment(): ?string
	{
		return $this->comment;
	}

	public function setComment(?string $comment): self
	{
		$this->comment = $comment;

		return $this;
	}
}