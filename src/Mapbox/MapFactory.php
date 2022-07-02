<?php

namespace App\Mapbox;

/**
 *
 */
class MapFactory
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

	/**
	 *
	 */
	public function __construct(string $key, float $westernLimit, float $northernLimit, float $easternLimit, float $southernLimit)
	{
		$this->token = $key;
		$this->westernLimit = $westernLimit;
		$this->northernLimit = $northernLimit;
		$this->easternLimit = $easternLimit;
		$this->southernLimit = $southernLimit;
	}

	/**
	 *
	 */
	public function create(): Map
	{
		return new Map($this->token, $this->westernLimit, $this->northernLimit, $this->easternLimit, $this->southernLimit);
	}
}