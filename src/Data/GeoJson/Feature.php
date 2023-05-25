<?php

namespace App\Data\GeoJson;

use App\Entity\Report;
use JsonSerializable;

class Feature implements JsonSerializable
{
	const TYPE = 'Feature';
	const GEOMETRY_TYPE = 'Point';

	private int $size;
	private string $color;
	private float $longitude;
	private float $latitude;

	public static function makeFromReport(Report $report): self
	{
		$feature = new self;
		$feature->size = $report->getSeverity()->getId();
		$feature->color = $report->getSeverity()->getColor();
		$feature->longitude = $report->getLongitude();
		$feature->latitude = $report->getLatitude();

		return $feature;
	}

	/**
	 * @return array<string, mixed>
	 */
	public function jsonSerialize(): array
	{
		return [
			'type'			=> self::TYPE,
			'properties'	=> [
				'size'	=> $this->size,
				'color'	=> $this->color
			],
			'geometry'		=> [
				'type' 			=> self::GEOMETRY_TYPE,
				'coordinates'	=> [
					$this->longitude,
					$this->latitude,
					0.0
				]
			]
		];
	}
}