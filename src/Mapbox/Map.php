<?php

namespace App\Mapbox;

/**
 *
 */
class Map
{
	/** @var string */
	private string $token;

	/** @var float */
	private float $westernLimit;

	/** @var float */
	private float $northernLimit;

	/** @var float */
	private float $easternLimit;

	/** @var float */
	private float $southernLimit;

	/** @var string */
	private string $heatmapDataURL;

	/**
	 *
	 */
	public function __construct(string $key, float $westernLimit, float $northernLimit, float $easternLimit, float $southernLimit, string $heatmapDataURL)
	{
		$this->token = $key;
		$this->westernLimit = $westernLimit;
		$this->northernLimit = $northernLimit;
		$this->easternLimit = $easternLimit;
		$this->southernLimit = $southernLimit;
		$this->heatmapDataURL = $heatmapDataURL;
	}

	/**
	 *
	 */
	public function getToken(): string
	{
		return $this->token;
	}

	/**
	 *
	 */
	public function getWesternLimit(): float
	{
		return $this->westernLimit;
	}

	/**
	 *
	 */
	public function getNorthernLimit(): float
	{
		return $this->northernLimit;
	}

	/**
	 *
	 */
	public function getEasternLimit(): float
	{
		return $this->easternLimit;
	}

	/**
	 *
	 */
	public function getSouthernLimit(): float
	{
		return $this->southernLimit;
	}

	/**
	 *
	 */
	public function getHeatmapDataURL(): string
	{
		return $this->heatmapDataURL;
	}
}