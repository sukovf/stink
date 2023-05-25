<?php

namespace App\Data\GeoJson;

use App\Data\AbstractCollection;
use App\Data\ReportsData;

class Collection extends AbstractCollection
{
	const TYPE = 'FeatureCollection';
	const PROPERTIES_NAME = 'urn:ogc:def:crs:OGC:1.3:CRS84';

	/** @var Feature[] */
	private array $features;

	public static function makeFromReportsData(ReportsData $data): self
	{
		$collection = new Collection();

		foreach ($data->getReports() as $report) {
			$collection->features[] = Feature::makeFromReport($report);
		}

		return $collection;
	}

	/**
	 * @return array<string, mixed>
	 */
	public function jsonSerialize(): array
	{
		return [
			'type' 		=> self::TYPE,
			'crs'		=> [
				'type' 			=> 'name',
				'properties' 	=> [
					'name' => self::PROPERTIES_NAME
				]
			],
			'features'	=> $this->features
		];
	}
}