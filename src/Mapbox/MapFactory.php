<?php

namespace App\Mapbox;

use Symfony\Component\Routing\RouterInterface;

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

	/** @var string */
	private string $heatmapDataURL;

	/**
	 *
	 */
	public function __construct(string $key, float $westernLimit, float $northernLimit, float $easternLimit, float $southernLimit, RouterInterface $router)
	{
		$this->token = $key;
		$this->westernLimit = $westernLimit;
		$this->northernLimit = $northernLimit;
		$this->easternLimit = $easternLimit;
		$this->southernLimit = $southernLimit;
		$this->heatmapDataURL = $router->generate('data');
	}

	/**
	 *
	 */
	public function create(): Map
	{
		return new Map($this->token, $this->westernLimit, $this->northernLimit, $this->easternLimit, $this->southernLimit, $this->heatmapDataURL);
	}
}